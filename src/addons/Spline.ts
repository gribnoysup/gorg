import { Vector2 } from '../types';
import {
  distance,
  subtract,
  divideScalar,
  multiplyScalar,
  add,
  unit,
  rotate,
} from '../core/VecMath';

type SplineSegment = [Vector2, Vector2, Vector2, Vector2];

function lerp(n0: number, n1: number, t: number): number {
  return (1 - t) * n0 + t * n1;
}

function floatFix(n: number, correct = 8): number {
  return Number(n.toFixed(correct));
}

function decimals(n: number): number {
  return (n.toString().split('.')[1] || '').length;
}

function clamp(min: number, max: number, n: number): number {
  return Math.min(max, Math.max(min, n));
}

/**
 * Keeps track of arc lenght samples for a spline of any kind and allows to
 * quickly search for a corresponding `t` value based on provided distance
 */
class SampledArcLength {
  private _t: number[] = [0];
  private _arcLength: number[] = [0];

  /**
   * Stores arc length sample for the corresponding t value
   */
  addSample(t: number, arcLength: number): void {
    this._t.push(t);
    this._arcLength.push(arcLength);
  }

  /**
   * Search through the arc length samples to find indexes of the range in which
   * provided value is included
   */
  private findClosestArcLengthIndex(
    value: number,
    array: number[] = this._arcLength,
    start = 0,
    end = array.length
  ): [number, number] {
    if (start > end) return [-1, -1];

    const middle = ~~((start + end) / 2);
    const next = middle + 1;

    if (value >= array[middle] && value < array[next]) {
      return [middle, next];
    }

    if (value > array[middle]) {
      return this.findClosestArcLengthIndex(value, array, middle + 1, end);
    }

    if (value < array[middle]) {
      return this.findClosestArcLengthIndex(value, array, start, middle - 1);
    }

    return [-1, -1];
  }

  /**
   * Brings the provided value in range of distances of the arc length samples.
   * Allows for a circular search inside the samples
   */
  normalizeDistance(d: number): number {
    return d % this._arcLength[this._arcLength.length - 1];
  }

  /**
   * Returns lerp'ed `t` value that is trying to be as close to the provided
   * distance as possible (as resolution of the samples allows)
   */
  t(d: number): number {
    d = this.normalizeDistance(d);

    const [a, b] = this.findClosestArcLengthIndex(d);

    // Should never happen in theory as we are normalizing provided distance
    if (a === -1) {
      return -1;
    }

    // Get the start end closest arc length values
    const al = this._arcLength[a];
    const bl = this._arcLength[b];

    // ... and calculate the t for the following lerp
    const t = (d - al) / (bl - al);

    // Get the t values that correspond to the closest arc length samples
    const at = this._t[a];
    const bt = this._t[b];

    // ... and lerp between them based on the calculated t
    return lerp(at, bt, t);
  }
}

export enum Alpha {
  Uniform = 0,
  Centripetal = 0.5,
  Chordal = 1,
}

export class CatmullRomSpline {
  private length!: number;
  private sampledArcLength!: SampledArcLength;

  constructor(
    private points: Vector2[],
    private closed: boolean = false,
    private tension: number = 0,
    private alpha: Alpha = Alpha.Centripetal
  ) {
    this.setLength();

    if (closed && length === 2) {
      throw new RangeError('Need at least 3 points for closed spline, got 2');
    }

    this.calcSampledArcLength();
  }

  /**
   * Calculate and update spline segments length
   */
  private setLength() {
    // When spline is closed, we always add additional segment at the very end
    // of the spline to close off the spline
    this.length = this.closed ? this.points.length : this.points.length - 1;
  }

  /**
   * Calculate integrated arc length and store the samples for the future use.
   * Using sampled arc length allows for a fast way to find points at the spline
   * based on speed of movement / distance instead of `t` value.
   */
  private calcSampledArcLength(avgSamplePerSection = 10) {
    this.sampledArcLength = new SampledArcLength();

    const length = this.length;
    const samples = avgSamplePerSection * length;

    /**
     * Spline can consist of the segments with a very different length, if we
     * sample all of them with the same `t` step, we might get very precise
     * samples for one segments and too rough sampling for others.
     *
     * To have a unified sample distribution we will roughly weight evey segment
     * based on the distance between segment start and end and will use this
     * information to adjust the step for every segment based on its weight.
     */
    const segmentStep = (() => {
      let totalDistance = 0;
      let distanceBySegment = [];
      for (let i = 1; i <= length; i++) {
        let dist = distance(this.getPoint(i), this.getPoint(i - 1));
        totalDistance += dist;
        distanceBySegment.push(dist);
      }

      return distanceBySegment.map(
        (dist) => 1 / Math.floor(samples * (dist / totalDistance))
      );
    })();

    let step = segmentStep[0];
    let t = step;
    let prevPoint = this.getPoint(0);
    let arcLength = 0;

    // Integrate the arc length in segment steps until we run out of spline
    // length
    while (true) {
      const [segment] = this.normalizeT(t);
      const currPoint = this.getPoint(t);

      this.sampledArcLength.addSample(
        t,
        (arcLength += distance(prevPoint, currPoint))
      );

      if (t >= length) {
        break;
      }

      step = segmentStep[segment];
      t = clamp(0, length, floatFix(t + step, decimals(step)));
      prevPoint = currPoint;
    }
  }

  /**
   * Catmull-Rom spline segments require 4 points for interpolation. This method
   * does the heavy lifting of selecting the segment points, substituting edge
   * points that are missing, or getting the points form the beginning of the
   * spline when spline is closed (cyclic)
   *
   * @todo this method can be memoised
   */
  private getControlPointsForSegment(i: number): SplineSegment {
    const { points, closed, length } = this;

    if (i < 0 || i >= length) {
      throw new RangeError(`Segment ${i} is out of range`);
    }

    const p0 = points[i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2];

    // For open spline:
    if (!closed) {
      //  - if p0 is missing, we are at the starting segment of the spline
      //  - if p3 is missing, we are at the ending segment of the spline
      //
      // Let's substitute those with appropriate* alternative points just so we
      // can draw a line
      //
      // * - this is just copy pasted from linked article code
      return [
        p0 || subtract(multiplyScalar(p1, 2), p2),
        p1,
        p2,
        p3 || subtract(multiplyScalar(p2, 2), p1),
      ];
    }

    // In case of closed spline:
    if (i === 0) {
      // - if we are at the first segment, p0 is the last point in the spline
      return [points[length - 1], p1, p2, p3];
    } else if (i === length - 2) {
      // - if we are at the penultimate segment, p3 is first point in the spline
      return [p0, p1, p2, points[0]];
    } else if (i === length - 1) {
      // - if we are at the last segment, p2 and p3 are first and second spline
      //   points respectively
      return [p0, p1, points[0], points[1]];
    } else {
      return [p0, p1, p2, p3];
    }
  }

  /**
   * Normalize t value to the segment and t for the segment.
   */
  private normalizeT(t: number): [number, number] {
    const { length } = this;

    /**
     * We want to normalize the value as follows:
     *
     * segments: 3
     *
     *   input: 0 ------- 1 --- 2 --- 3 - 3.1 --- 4
     * segment: 0 ------- 1 --- 2 --- 2 - 0   --- 1
     *       t: 0 - 0.5 - 0 --- 0 --- 1 - 0.1 --- 0
     *
     * To achieve that we will shortcircuit if we are at the very end of the
     * spline
     */
    if (t === length) {
      return [length - 1, 1];
    }

    // ... otherwise we will use the remainder to navigate the segment in the
    // circular manner
    let _segment = ~~t % length;
    let _t = t - ~~t;

    return [_segment, _t];
  }

  /**
   *
   * @see https://qroph.github.io/2018/07/30/smooth-paths-using-catmull-rom-splines.html
   */
  private getSegmentConstants([p0, p1, p2, p3]: SplineSegment): SplineSegment {
    const { alpha, tension } = this;

    const t01 = distance(p0, p1) ** alpha;
    const t12 = distance(p1, p2) ** alpha;
    const t23 = distance(p2, p3) ** alpha;

    const m1 = multiplyScalar(
      add(
        subtract(p2, p1),
        multiplyScalar(
          subtract(
            divideScalar(subtract(p1, p0), t01),
            divideScalar(subtract(p2, p0), t01 + t12)
          ),
          t12
        )
      ),
      1 - tension
    );

    const m2 = multiplyScalar(
      add(
        subtract(p2, p1),
        multiplyScalar(
          subtract(
            divideScalar(subtract(p3, p2), t23),
            divideScalar(subtract(p3, p1), t12 + t23)
          ),
          t12
        )
      ),
      1 - tension
    );

    const a = add(multiplyScalar(subtract(p1, p2), 2), m1, m2);
    const b = subtract(multiplyScalar(subtract(p1, p2), -3), m1, m1, m2);
    const c = m1;
    const d = p1;

    return [a, b, c, d];
  }

  getPoint(t: number): Vector2 {
    const [i, _t] = this.normalizeT(t);
    const segment = this.getControlPointsForSegment(i);

    // Points in t = 0 and t = 1 are always equal to segment control points p1
    // and p2, we can short-circuit here to avoid unnecessary calculations
    if (_t === 0) {
      return segment[1];
    }

    if (_t === 1) {
      return segment[2];
    }

    const [a, b, c, d] = this.getSegmentConstants(segment);

    return add(
      multiplyScalar(a, _t ** 3),
      multiplyScalar(b, _t ** 2),
      multiplyScalar(c, _t),
      d
    );
  }

  getTangent(t: number): Vector2 {
    const [i, _t] = this.normalizeT(t);
    const segment = this.getControlPointsForSegment(i);
    const [a, b, c] = this.getSegmentConstants(segment);

    return unit(
      add(multiplyScalar(a, 3 * _t ** 2), multiplyScalar(b, 2 * _t), c)
    );
  }

  getNormal(t: number): Vector2 {
    return rotate(this.getTangent(t), Math.PI / 2);
  }

  getTForDistance(d: number): number {
    return this.sampledArcLength.t(d);
  }

  getPointForDistance(d: number): Vector2 {
    return this.getPoint(this.getTForDistance(d));
  }
}

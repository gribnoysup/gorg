import {
  add,
  angleToVector,
  angleDegToVector,
  rotate,
  rotateDeg,
  angle,
} from './VecMath';

/**
 * Component that keeps GameObject position, rotation
 * and scale in the Scene
 */
export class TransformComponent implements ITransformComponent {
  position: Vector2;
  rotation: Vector2;
  scale: Vector2;

  constructor({
    position = [0, 0],
    rotation = angleToVector(0),
    scale = [1, 1],
  }: Partial<ITransformComponent> = {}) {
    this.position = position;
    this.rotation = rotation;
    this.scale = scale;
  }

  moveTo(vec: Vector2) {
    this.position = vec;
  }

  moveBy(vec: Vector2) {
    this.position = add(this.position, vec);
  }

  rotateTo(angle: number) {
    this.rotation = angleToVector(angle);
  }

  rotateToVector(angleVector: Vector2) {
    this.rotation = angleVector;
  }

  rotateToDeg(angle: number) {
    this.rotation = angleDegToVector(angle);
  }

  rotateBy(angle: number) {
    this.rotation = rotate(this.rotation, angle);
  }

  rotateByDeg(angle: number) {
    this.rotation = rotateDeg(this.rotation, angle);
  }

  scaleTo(vec: Vector2) {
    this.scale = vec;
  }

  scaleBy(vec: Vector2) {
    this.scale = add(this.scale, vec);
  }

  adjustRendererContext(renderer: ICanvas2DRenderer) {
    const { position, rotation, scale } = this;

    renderer.context.translate(...position);
    renderer.context.rotate(angle(rotation));
    renderer.context.scale(...scale);
  }
}

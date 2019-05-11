import { Vector2d } from '../types';

export function add([x1, y1]: Vector2d, [x2, y2]: Vector2d): Vector2d {
  return [x1 + x2, y1 + y2];
}

export function addScalar([x, y]: Vector2d, n: number): Vector2d {
  return [x + n, y + y];
}

export function subtract([x1, y1]: Vector2d, [x2, y2]: Vector2d): Vector2d {
  return [x1 - x2, y1 - y2];
}

export function subtractScalar([x, y]: Vector2d, n: number): Vector2d {
  return [x - n, y - n];
}

export function multiply([x1, y1]: Vector2d, [x2, y2]: Vector2d): Vector2d {
  return [x1 * x2, y1 * y2];
}

export function multiplyScalar([x, y]: Vector2d, n: number): Vector2d {
  return [x * n, y * n];
}

export function divide([x1, y1]: Vector2d, [x2, y2]: Vector2d): Vector2d {
  return [x1 / x2, y1 / y2];
}

export function divideScalar([x, y]: Vector2d, n: number): Vector2d {
  return [x / n, y / n];
}

export function dot([x1, y1]: Vector2d, [x2, y2]: Vector2d): number {
  return x1 * x2 + y1 * y2;
}

export function cross([x1, y1]: Vector2d, [x2, y2]: Vector2d): number {
  return x1 * y2 - y1 * x2;
}

export function squaredLength([x, y]: Vector2d): number {
  return x * x + y * y;
}

export function length(vec: Vector2d): number {
  return Math.sqrt(squaredLength(vec));
}

export function unit(vec: Vector2d): Vector2d {
  return divideScalar(vec, length(vec));
}

export function rad2Deg(radians: number) {
  return (radians * 180) / Math.PI;
}

export function deg2Rad(degrees: number) {
  return (degrees * Math.PI) / 180;
}

export function rotate([x, y]: Vector2d, angle: number): Vector2d {
  return [
    x * Math.cos(angle) - y * Math.sin(angle),
    x * Math.sin(angle) + y * Math.cos(angle),
  ];
}

export function rotateDeg(vec: Vector2d, angle: number): Vector2d {
  return rotate(vec, deg2Rad(angle));
}

export function angle([x, y]: Vector2d): number {
  return Math.atan2(y, x);
}

export function angleDeg(vec: Vector2d): number {
  return rad2Deg(angle(vec));
}

export function angleToVector(angle: number): Vector2d {
  return [Math.cos(angle), Math.sin(angle)];
}

export function angleDegToVector(angle: number): Vector2d {
  return angleToVector(deg2Rad(angle));
}

export { Vector2d } from '../types';

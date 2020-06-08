import { Vector2 } from '../types';

export function add(...vectors: Vector2[]): Vector2 {
  return vectors
    .slice(1)
    .reduce(([x0, y0], [x1, y1]) => [x0 + x1, y0 + y1], vectors[0]);
}

export function addScalar([x, y]: Vector2, n: number): Vector2 {
  return [x + n, y + y];
}

export function subtract(...vectors: Vector2[]): Vector2 {
  return vectors
    .slice(1)
    .reduce(([x0, y0], [x1, y1]) => [x0 - x1, y0 - y1], vectors[0]);
}

export function subtractScalar([x, y]: Vector2, n: number): Vector2 {
  return [x - n, y - n];
}

export function multiply(...vectors: Vector2[]): Vector2 {
  return vectors
    .slice(1)
    .reduce(([x0, y0], [x1, y1]) => [x0 * x1, y0 * y1], vectors[0]);
}

export function multiplyScalar([x, y]: Vector2, n: number): Vector2 {
  return [x * n, y * n];
}

export function divide(...vectors: Vector2[]): Vector2 {
  return vectors
    .slice(1)
    .reduce(([x0, y0], [x1, y1]) => [x0 / x1, y0 / y1], vectors[0]);
}

export function divideScalar([x, y]: Vector2, n: number): Vector2 {
  return [x / n, y / n];
}

export function powScalar([x, y]: Vector2, n: number): Vector2 {
  return [x ** n, y ** n];
}

export function dot([x0, y1]: Vector2, [x1, y2]: Vector2): number {
  return x0 * x1 + y1 * y2;
}

export function cross([x0, y1]: Vector2, [x1, y2]: Vector2): number {
  return x0 * y2 - y1 * x1;
}

export function squaredLength([x, y]: Vector2): number {
  return x ** 2 + y ** 2;
}

export function length(vec: Vector2): number {
  return Math.sqrt(squaredLength(vec));
}

export const magnitude = length;

export function distance(vec0: Vector2, vec1: Vector2): number {
  return length(subtract(vec1, vec0));
}

export function unit(vec: Vector2): Vector2 {
  const len = length(vec);
  return len > 0 ? divideScalar(vec, len) : vec;
}

export const normalize = unit;

export function rad2Deg(radians: number) {
  return (radians * 180) / Math.PI;
}

export function deg2Rad(degrees: number) {
  return (degrees * Math.PI) / 180;
}

export function rotate([x, y]: Vector2, angle: number): Vector2 {
  return [
    x * Math.cos(angle) - y * Math.sin(angle),
    x * Math.sin(angle) + y * Math.cos(angle),
  ];
}

export function rotateDeg(vec: Vector2, angle: number): Vector2 {
  return rotate(vec, deg2Rad(angle));
}

export function angle([x, y]: Vector2): number {
  return Math.atan2(y, x);
}

export function angleDeg(vec: Vector2): number {
  return rad2Deg(angle(vec));
}

export function angleToVector(angle: number): Vector2 {
  return [Math.cos(angle), Math.sin(angle)];
}

export function angleDegToVector(angle: number): Vector2 {
  return angleToVector(deg2Rad(angle));
}

export function lerp(v0: Vector2, v1: Vector2, t: number): Vector2 {
  return add(multiplyScalar(v0, 1 - t), multiplyScalar(v1, t));
}

export const mix = lerp;

export { Vector2 } from '../types';

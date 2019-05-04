import { Vector2d, IStateComponent, ITransformComponent } from './types.js';
import {
  add,
  angleToVector,
  angleDegToVector,
  rotate,
  rotateDeg,
} from './vector2d.js';

/**
 * Key value storage component for GameObject to share
 * state across components
 */
export class StateComponent extends Map implements IStateComponent<any, any> {}

/**
 * Component that keeps GameObject position, rotation
 * and scale in the Scene
 */
export class TransformComponent implements ITransformComponent {
  position: Vector2d;
  rotation: Vector2d;
  scale: Vector2d;

  constructor({
    position = [0, 0],
    rotation = angleToVector(0),
    scale = [1, 1],
  }: Partial<ITransformComponent> = {}) {
    this.position = position;
    this.rotation = rotation;
    this.scale = scale;
  }

  moveTo(vec: Vector2d) {
    this.position = vec;
  }

  moveBy(vec: Vector2d) {
    this.position = add(this.position, vec);
  }

  rotateTo(angle: number) {
    this.rotation = angleToVector(angle);
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

  scaleTo(vec: Vector2d) {
    this.scale = vec;
  }

  scaleBy(vec: Vector2d) {
    this.scale = add(this.scale, vec);
  }
}

export { IUpdateComponent, IRenderComponent } from './types.js';

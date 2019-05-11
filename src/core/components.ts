import { Vector2d, ITransformComponent, ICanvas2DRenderer } from '../types';

import {
  add,
  angleToVector,
  angleDegToVector,
  rotate,
  rotateDeg,
  angle,
} from './Vector2d';

const StateComponent = Map;

/**
 * Key value storage component for GameObject to share
 * state across components
 */
export { StateComponent };

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

  adjustRendererContext(renderer: ICanvas2DRenderer) {
    const { position, rotation, scale } = this;

    renderer.context.translate(...position);
    renderer.context.rotate(angle(rotation));
    renderer.context.scale(...scale);
  }
}

export { IUpdateComponent, IRenderComponent } from '../types';

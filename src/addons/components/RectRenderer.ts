import {
  IRenderComponent,
  IScene,
  IWorld,
  IGameObject,
  IOrthographicCamera,
  CanvasFillStrokeStyles,
} from '../../core/types.js';

import { angle } from '../../core/vector2d.js';

export class RectRenderer implements IRenderComponent {
  width: number;
  height: number;
  fillStyle: CanvasFillStrokeStyles;
  strokeStyle: CanvasFillStrokeStyles;
  lineWidth: number;

  constructor(
    width: number,
    height: number,
    fillStyle: CanvasFillStrokeStyles = null,
    strokeStyle: CanvasFillStrokeStyles = null,
    lineWidth: number
  ) {
    this.width = width;
    this.height = height;
    this.fillStyle = fillStyle;
    this.strokeStyle = strokeStyle;
    this.lineWidth = lineWidth;
  }

  render(
    world: IWorld,
    scene: IScene,
    gameObject: IGameObject,
    camera: IOrthographicCamera,
    remainder: number
  ) {
    const { renderer } = world;
    const { position, rotation, scale } = gameObject.components.transform;

    const centerX = this.width / 2;
    const centerY = this.height / 2;

    renderer.context.strokeStyle = this.strokeStyle;

    renderer.context.translate(...position);
    renderer.context.rotate(angle(rotation));
    renderer.context.scale(...scale);

    if (this.fillStyle) {
      renderer.context.fillStyle = this.fillStyle;
      renderer.context.fillRect(-centerX, -centerY, this.width, this.height);
    }

    if (this.strokeStyle) {
      renderer.context.lineWidth = this.lineWidth;
      renderer.context.strokeStyle = this.strokeStyle;
      renderer.context.strokeRect(-centerX, -centerY, this.width, this.height);
    }
  }
}

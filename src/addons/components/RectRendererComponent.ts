import {
  IRenderComponent,
  IWorld,
  CanvasFillStrokeStyles,
} from '../../core/types';

export class RectRendererComponent implements IRenderComponent {
  width: number;
  height: number;
  fillStyle: CanvasFillStrokeStyles | null;
  strokeStyle: CanvasFillStrokeStyles | null;
  lineWidth: number;

  constructor(
    width: number,
    height: number,
    fillStyle: CanvasFillStrokeStyles | null = null,
    strokeStyle: CanvasFillStrokeStyles | null = null,
    lineWidth: number = 1
  ) {
    this.width = width;
    this.height = height;
    this.fillStyle = fillStyle;
    this.strokeStyle = strokeStyle;
    this.lineWidth = lineWidth;
  }

  render(world: IWorld) {
    const { renderer } = world;

    const centerX = this.width / 2;
    const centerY = this.height / 2;

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

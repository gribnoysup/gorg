export class RectangleRenderComponent implements IRenderComponent {
  width: number;
  height: number;
  fillStyle: CanvasFillStrokeStyles['fillStyle'] | null;
  strokeStyle: CanvasFillStrokeStyles['strokeStyle'] | null;
  lineWidth: number;

  constructor(
    width: number,
    height: number,
    fillStyle: CanvasFillStrokeStyles['fillStyle'] | null = null,
    strokeStyle: CanvasFillStrokeStyles['strokeStyle'] | null = null,
    lineWidth: number = 1
  ) {
    this.width = width;
    this.height = height;
    this.fillStyle = fillStyle;
    this.strokeStyle = strokeStyle;
    this.lineWidth = lineWidth;
  }

  render(world: IWorld) {
    const {
      renderer: { context: ctx },
    } = world;

    const centerX = this.width / 2;
    const centerY = this.height / 2;

    if (this.fillStyle) {
      ctx.fillStyle = this.fillStyle;
      ctx.fillRect(-centerX, -centerY, this.width, this.height);
    }

    if (this.strokeStyle) {
      ctx.lineWidth = this.lineWidth;
      ctx.strokeStyle = this.strokeStyle;
      ctx.strokeRect(-centerX, -centerY, this.width, this.height);
    }
  }
}

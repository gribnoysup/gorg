import { multiply } from 'core/VecMath';
import { Sprite } from '../../Sprite';

export const Pivot = {
  Center: [-0.5, -0.5],
  TopLeft: [0, 0],
  TopRight: [0, -1],
  BottomRight: [-1, -1],
  BottomLeft: [-1, 0],
} as const;

type SpriteRenderOptions = {
  sprite: Sprite;
  drawingWidth?: number;
  drawingHeight?: number;
  animationFrames?: number[];
  animationSpeed?: number;
  startFrame?: number;
  pivot: keyof typeof Pivot;
};

export class SpriteRenderComponent implements IRenderComponent {
  sprite: Sprite;
  animationFrames: number[];
  currentFrame: number;
  framesPassed: number;
  animationSpeed: number;
  pivot: keyof typeof Pivot;
  width?: number;
  height?: number;

  constructor({
    sprite,
    drawingWidth,
    drawingHeight,
    animationFrames = [],
    animationSpeed = Infinity,
    startFrame = animationFrames[0] || 0,
    pivot = 'Center',
  }: SpriteRenderOptions) {
    this.sprite = sprite;
    this.width = drawingWidth;
    this.height = drawingHeight;
    this.pivot = pivot;
    this.animationFrames = animationFrames;
    this.currentFrame = startFrame;
    this.framesPassed = 0;
    this.animationSpeed = animationSpeed;
  }

  render(world: IWorld) {
    const { sprite, animationFrames, animationSpeed } = this;

    if (animationFrames.length > 1 && this.framesPassed >= animationSpeed) {
      this.currentFrame = (this.currentFrame + 1) % animationFrames.length;
      this.framesPassed = 0;
    }

    const { renderer } = world;
    const { image, rect } = sprite.getSpriteFragment(
      animationFrames[this.currentFrame]
    );

    const width = this.width || rect.w;
    const height = this.height || rect.h;

    const [startX, startY] = multiply(
      [width, height],
      Pivot[this.pivot] as Vector2
    );

    renderer.context.drawImage(
      image,
      rect.x,
      rect.y,
      rect.w,
      rect.h,
      startX,
      startY,
      width,
      height
    );

    this.framesPassed++;
  }
}

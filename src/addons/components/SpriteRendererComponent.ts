import { IRenderComponent, IWorld } from '../../types';

import { Sprite } from '../Sprite';

export class SpriteRendererComponent implements IRenderComponent {
  sprite: Sprite;
  animationFrames: number[];
  currentFrame: number;
  framesPassed: number;
  animationSpeed: number;
  width?: number;
  height?: number;

  constructor(
    sprite: Sprite,
    drawingWidth?: number,
    drawingHeight?: number,
    animationFrames: number[] = [],
    animationSpeed: number = Infinity,
    startFrame: number = animationFrames[0] || 0
  ) {
    this.sprite = sprite;
    this.width = drawingWidth;
    this.height = drawingHeight;
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

    const width = this.width || sprite.spriteWidth;
    const height = this.height || sprite.spriteHeight;

    const centerX = width / 2;
    const centerY = height / 2;

    renderer.context.drawImage(
      image,
      rect.x,
      rect.y,
      rect.w,
      rect.h,
      -centerX,
      -centerY,
      width,
      height
    );

    this.framesPassed++;
  }
}

export enum SpriteMode {
  Sprite = 0,
  SpriteSheet = 1,
}

export type SpriteFragment = {
  image: CanvasImageSource;
  rect: Rectangle;
};

export class Sprite {
  mode: SpriteMode;
  image: HTMLImageElement;
  spriteWidth: number;
  spriteHeight: number;
  ready: boolean;
  onReadyCallback?: (sprite: Sprite) => void;

  constructor(
    source: string,
    mode: SpriteMode = SpriteMode.Sprite,
    width?: number,
    height?: number,
    spriteWidth?: number,
    spriteHeight?: number,
    onReadyCallback?: (sprite: Sprite) => void
  ) {
    this.ready = false;
    this.image = new Image(width, height);
    this.image.onload = () => {
      this.onReady();
    };
    this.image.src = source;
    this.mode = mode;
    this.spriteWidth = spriteWidth || width || NaN;
    this.spriteHeight = spriteHeight || height || NaN;
    this.onReadyCallback = onReadyCallback;
  }

  private onReady() {
    this.ready = true;
    if (typeof this.onReadyCallback === 'function') {
      this.onReadyCallback(this);
    }
  }

  getSpriteFragment(index: number = 0): SpriteFragment {
    const { image, spriteWidth, spriteHeight, mode } = this;

    if (mode === SpriteMode.Sprite && index !== 0) {
      // TODO: warn, doesn't make sense
    }

    if (mode === SpriteMode.Sprite) {
      return {
        image: image,
        rect: {
          x: 0,
          y: 0,
          w: image.width,
          h: image.height,
        },
      };
    } else {
      const columns = Math.floor(image.width / spriteWidth);

      const x = index % columns;
      const y = Math.floor(index / columns);

      return {
        image: image,
        rect: {
          x: x * spriteWidth,
          y: y * spriteHeight,
          w: spriteWidth,
          h: spriteHeight,
        },
      };
    }
  }

  static SpriteMode = SpriteMode;
}

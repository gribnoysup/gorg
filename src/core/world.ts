import {
  IWorld,
  ICanvas2DRenderer,
  IRuntimeFrameTimestamps,
  IOrthographicCamera,
  IScene,
  Vector2d,
  Rectangle,
  CanvasFillStrokeStyles,
} from './types';

import { add, multiply, subtract, angle } from './vector2d';

/**
 * Returns high res time in ms
 */
function now() {
  return performance.now();
}

export class Canvas2DRenderer implements ICanvas2DRenderer {
  view: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  currentCamera: IOrthographicCamera | null;

  constructor(width: number, height: number) {
    this.view = document.createElement('canvas');
    this.view.width = width;
    this.view.height = height;

    const context = this.view.getContext('2d');

    if (context == null) {
      throw new Error('Context not found on DOM element');
    }

    this.context = context;
    this.currentCamera = null;
  }

  appendTo(element: HTMLElement) {
    element.appendChild(this.view);
  }

  getPixelsRectInViewport(
    rect: Rectangle = {
      x: 0,
      y: 0,
      w: 1,
      h: 1,
    }
  ): Rectangle {
    const { width, height } = this.view;
    const { x, y, w, h } = rect;

    return {
      x: x * width,
      y: y * height,
      w: w * width,
      h: h * height,
    };
  }

  setCurrentCamera(camera: IOrthographicCamera) {
    this.currentCamera = camera;
  }

  prepareCanvas() {
    if (this.currentCamera == null) return;

    this.context.save();
    this.clipCameraViewport();
    this.clear();
    this.fillRectViewport(
      this.currentCamera.viewportRect,
      this.currentCamera.background
    );
    this.adjustContextToCamera();
  }

  private clipCameraViewport() {
    if (this.currentCamera == null) return;

    const { x, y, w, h } = this.getPixelsRectInViewport(
      this.currentCamera.viewportRect
    );
    this.context.beginPath();
    this.context.rect(x, y, w, h);
    this.context.clip();
  }

  private adjustContextToCamera() {
    if (this.currentCamera == null) return;

    const {
      position,
      rotation,
      scale,
    } = this.currentCamera.components.transform;

    const { x, y, w, h } = this.getPixelsRectInViewport(
      this.currentCamera.viewportRect
    );

    const offset: Vector2d = [x, y];
    const middle: Vector2d = [w / 2, h / 2];

    const translate = subtract(add(offset, middle), multiply(position, scale));

    this.context.translate(...translate);
    this.context.rotate(angle(rotation));
    this.context.scale(...scale);
  }

  draw(callback = () => {}) {
    this.context.save();
    callback();
    this.context.restore();
  }

  fillRectViewport(rect: Rectangle, fillStyle: CanvasFillStrokeStyles) {
    const { x, y, w, h } = this.getPixelsRectInViewport(rect);
    const _tmp = this.context.fillStyle;
    this.context.fillStyle = fillStyle;
    this.context.fillRect(x, y, w, h);
    this.context.fillStyle = _tmp;
  }

  clear() {
    this.context.clearRect(0, 0, Infinity, Infinity);
  }

  resetTransform() {
    this.context.setTransform(1, 0, 0, 1, 0, 0);
  }

  restoreCanvas() {
    this.context.restore();
  }
}

export class RuntimeFrameTimestamps implements IRuntimeFrameTimestamps {
  updateLag: number;
  currentUpdateTime: number;
  previousUpdateTime: number;
  elapsedUpdateTime: number;

  constructor() {
    this.updateLag = 0;
    this.currentUpdateTime = 0;
    this.previousUpdateTime = 0;
    this.elapsedUpdateTime = 0;
  }

  reset() {
    this.updateLag = 0;
    this.currentUpdateTime = 0;
    this.previousUpdateTime = 0;
    this.elapsedUpdateTime = 0;
  }
}

export class World implements IWorld {
  private scenes: Map<string, IScene>;
  private deltaTime: number;
  private activeScene: string | null;
  private timestamps: RuntimeFrameTimestamps;
  private animationFrame: number | null;
  renderer: ICanvas2DRenderer;

  constructor(
    scenes: IScene[] = [],
    fps: number = 30,
    width: number = 320,
    height: number = 240
  ) {
    this.scenes = new Map(
      scenes.map<[string, IScene]>(scene => [scene.name, scene])
    );
    this.deltaTime = 1000 / fps;
    this.activeScene = null;
    this.timestamps = new RuntimeFrameTimestamps();
    this.animationFrame = null;
    this.update = this.update.bind(this);
    this.safeUpdate = this.safeUpdate.bind(this);
    this.renderer = new Canvas2DRenderer(width, height);
  }

  addScenes(scenes: IScene | IScene[]) {
    if (Array.isArray(scenes)) {
      scenes.forEach(scene => {
        this.scenes.set(scene.name, scene);
      });
    } else {
      this.scenes.set(scenes.name, scenes);
    }
  }

  setActiveScene(sceneName: string) {
    if (this.scenes.has(sceneName)) {
      this.activeScene = sceneName;
    } else {
      throw new Error(`Scene ${sceneName} is not available in runtime`);
    }
  }

  start(sceneName?: string) {
    if (this.activeScene == null && sceneName == null) {
      throw new Error("Can't start runtime. Active scene is not set");
    } else if (this.activeScene == null && sceneName) {
      this.setActiveScene(sceneName);
    }

    this.timestamps.reset();
    this.timestamps.previousUpdateTime = now();
    this.safeUpdate();
  }

  private safeUpdate() {
    try {
      this.animationFrame = window.requestAnimationFrame(this.safeUpdate);
      this.update();
    } catch (error) {
      this.stop();
      console.error(error);
    }
  }

  private update() {
    const { timestamps: t, deltaTime, scenes, activeScene } = this;

    if (activeScene == null) return;

    const scene = scenes.get(activeScene);

    if (scene == null) return;

    t.currentUpdateTime = now();
    t.elapsedUpdateTime = t.currentUpdateTime - t.previousUpdateTime;
    t.previousUpdateTime = t.currentUpdateTime;
    t.updateLag += t.elapsedUpdateTime;

    while (t.updateLag >= deltaTime) {
      scene.update(this, deltaTime);
      t.updateLag -= deltaTime;
    }

    scene.render(this, t.updateLag / deltaTime);
  }

  stop() {
    if (this.animationFrame) {
      window.cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }
}

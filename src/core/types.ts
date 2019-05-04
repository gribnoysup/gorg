export type Vector2d = [number, number];

export type Rectangle = {
  x: number;
  y: number;
  w: number;
  h: number;
};

export type CanvasFillStrokeStyles = string | CanvasGradient | CanvasPattern;

export interface IStateComponent<K = any, V = any> {
  get(key: K): V;
  set(key: K, value: V): IStateComponent<K, V>;
}

export interface ITransformComponent {
  position: Vector2d;
  rotation: Vector2d;
  scale: Vector2d;
}

export interface IRenderComponent {
  render(
    world: IWorld,
    scene: IScene,
    gameObject: IGameObject,
    camera: IOrthographicCamera,
    remainder: number
  ): void;
}

export interface IUpdateComponent {
  update(
    world: IWorld,
    scene: IScene,
    gameObject: IGameObject,
    deltaTime: number
  ): void;
}

export type GameObjectComponents = {
  state: IStateComponent;
  transform: ITransformComponent;
  update: IUpdateComponent[];
  render: IRenderComponent[];
};

export interface IGameObject {
  name: string;
  disabled: boolean;
  components: GameObjectComponents;
  update(world: IWorld, scene: IScene, deltaTime: number): void;
  render(
    world: IWorld,
    scene: IScene,
    camera: IOrthographicCamera,
    remainder: number
  ): void;
}

export interface IOrthographicCamera extends IGameObject {
  background: CanvasFillStrokeStyles;
  viewportRect: Rectangle;
}

export interface IScene {
  name: string;
  gameObjects: IGameObject[];
  getActiveObjects(): IGameObject[];
  addObject(gameObject: IGameObject): void;
  update(world: IWorld, deltaTime: number): void;
  render(world: IWorld, remainder: number): void;
}

export interface IRuntimeFrameTimestamps {
  updateLag: number;
  currentUpdateTime: number;
  previousUpdateTime: number;
  elapsedUpdateTime: number;
  reset(): void;
}

export interface ICanvas2DRenderer {
  view: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  currentCamera: IOrthographicCamera;
  appendTo(element: HTMLElement): void;
  setCurrentCamera(camera: IOrthographicCamera): void;
  prepareCanvas(): void;
  restoreCanvas(): void;
  draw(cb: Function): void;
}

export interface IWorld {
  renderer: ICanvas2DRenderer;
  setActiveScene(sceneName: string): void;
  start(sceneName: string): void;
  stop(): void;
}

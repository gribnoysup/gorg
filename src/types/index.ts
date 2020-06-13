export type Vector2 = [number, number];

export type Rectangle = {
  x: number;
  y: number;
  w: number;
  h: number;
};

export type CanvasFillStrokeStyles = string | CanvasGradient | CanvasPattern;

interface IComponent {
  init?: (world: IWorld, scene: IScene, gameObject: IGameObject) => void;
}

export interface IStateComponent<K = unknown, V = unknown> extends IComponent {
  get(key: K): V | undefined;
  set(key: K, value: V): IStateComponent<K, V>;
}

export interface ITransformComponent extends IComponent {
  position: Vector2;
  rotation: Vector2;
  scale: Vector2;
  adjustRendererContext(renderer: ICanvas2DRenderer): void;
}

export interface IRenderComponent extends IComponent {
  render(
    world: IWorld,
    scene: IScene,
    gameObject: IGameObject,
    camera: IOrthographicCamera,
    remainder: number
  ): void;
}

export interface IUpdateComponent extends IComponent {
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
  init(world: IWorld, scene: IScene): void;
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
  init(world: IWorld): void;
  getActiveObjects(): IGameObject[];
  addObjects(gameObjects: IGameObject | IGameObject[]): void;
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
  currentCamera: IOrthographicCamera | null;
  appendTo(element: HTMLElement): void;
  setCurrentCamera(camera: IOrthographicCamera): void;
  prepareCanvas(): void;
  restoreCanvas(): void;
  draw(cb: () => void): void;
}

export interface IWorld {
  renderer: ICanvas2DRenderer;
  setActiveScene(sceneName: string): void;
  start(sceneName: string): void;
  stop(): void;
}

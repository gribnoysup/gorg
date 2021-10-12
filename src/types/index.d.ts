declare type Vector2 = [number, number];

declare type Rectangle = {
  x: number;
  y: number;
  w: number;
  h: number;
};

interface IComponent {
  init?: (world: IWorld, scene: IScene, gameObject: IGameObject) => void;
}

declare interface IColliderComponent extends IComponent {
  collidesWith(collider: IColliderComponent): boolean;
}

declare interface IStateComponent<K = unknown, V = unknown> extends IComponent {
  get(key: K): V | undefined;
  set(key: K, value: V): IStateComponent<K, V>;
}

declare interface ITransformComponent extends IComponent {
  position: Vector2;
  rotation: Vector2;
  scale: Vector2;
  adjustRendererContext(renderer: ICanvas2DRenderer): void;
}

declare type RenderFunction = (
  world: IWorld,
  scene: IScene,
  gameObject: IGameObject,
  camera: IOrthographicCamera,
  remainder: number
) => void;

declare interface IRenderComponent extends IComponent {
  render: RenderFunction;
}

declare type UpdateFunction = (
  world: IWorld,
  scene: IScene,
  gameObject: IGameObject,
  deltaTime: number
) => void;

declare interface IUpdateComponent extends IComponent {
  update: UpdateFunction;
}

declare type GameObjectComponents = {
  state: IStateComponent;
  transform: ITransformComponent;
  collider?: IColliderComponent;
  update: (IUpdateComponent | UpdateFunction)[];
  render: (IRenderComponent | RenderFunction)[];
};

declare interface IGameObject {
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

declare interface IOrthographicCamera extends IGameObject {
  background: CanvasFillStrokeStyles['fillStyle'];
  viewportRect: Rectangle;
}

declare interface IScene {
  name: string;
  gameObjects: IGameObject[];
  init(world: IWorld): void;
  getActiveObjects(): IGameObject[];
  addObjects(gameObjects: IGameObject | IGameObject[]): void;
  update(world: IWorld, deltaTime: number): void;
  render(world: IWorld, remainder: number): void;
}

declare interface IRuntimeFrameTimestamps {
  updateLag: number;
  currentUpdateTime: number;
  previousUpdateTime: number;
  elapsedUpdateTime: number;
  reset(): void;
}

declare interface ICanvas2DRenderer {
  view: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  currentCamera: IOrthographicCamera | null;
  appendTo(element: HTMLElement): void;
  setCurrentCamera(camera: IOrthographicCamera): void;
  prepareCanvas(): void;
  restoreCanvas(): void;
  draw(cb: () => void): void;
}

declare interface IWorld {
  renderer: ICanvas2DRenderer;
  setActiveScene(sceneName: string): void;
  start(sceneName: string): void;
  stop(): void;
}

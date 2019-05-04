import {
  IGameObject,
  GameObjectComponents,
  IOrthographicCamera,
  IWorld,
  IScene,
  Rectangle,
  CanvasFillStrokeStyles,
} from './types';

import { StateComponent, TransformComponent } from './components';

export class GameObject implements IGameObject {
  name: string;
  disabled: boolean;
  components: GameObjectComponents;

  constructor(name: string, components: Partial<GameObjectComponents> = {}) {
    this.name = name;
    this.disabled = false;
    this.components = {
      state: new StateComponent(),
      transform: new TransformComponent(),
      update: [],
      render: [],
      ...components,
    };
  }

  update(world: IWorld, scene: IScene, deltaTime: number) {
    this.components.update.forEach(updateComponent => {
      updateComponent.update(world, scene, this, deltaTime);
    });
  }

  render(
    world: IWorld,
    scene: IScene,
    camera: IOrthographicCamera,
    remainder: number
  ) {
    this.components.render.forEach(renderComponent => {
      renderComponent.render(world, scene, this, camera, remainder);
    });
  }
}

export class OrthographicCamera extends GameObject
  implements IOrthographicCamera {
  viewportRect: Rectangle;
  background: CanvasFillStrokeStyles;

  constructor(
    name: string,
    components: Partial<GameObjectComponents>,
    viewportRect: Rectangle = { x: 0, y: 0, w: 1, h: 1 },
    background: CanvasFillStrokeStyles = '#304d79'
  ) {
    super(name, components);
    this.viewportRect = viewportRect;
    this.background = background;
  }

  render(
    world: IWorld,
    scene: IScene,
    camera: IOrthographicCamera,
    remainder: number
  ) {
    world.renderer.setCurrentCamera(this);
    world.renderer.prepareCanvas();

    for (const gameObject of scene.getActiveObjects()) {
      if (!(gameObject instanceof OrthographicCamera)) {
        // TODO: calc if the object is in the camera
        // viewport / renderer working area before
        // calling `render`
        world.renderer.draw(() => {
          gameObject.components.transform.adjustRendererContext(world.renderer);
          gameObject.render(world, scene, camera, remainder);
        });
      }
    }

    world.renderer.restoreCanvas();
  }
}

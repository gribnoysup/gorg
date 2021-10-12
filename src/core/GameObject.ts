import { StateComponent } from './StateComponent';
import { TransformComponent } from './TransformComponent';

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

  init(world: IWorld, scene: IScene) {
    this.components.state.init?.(world, scene, this);
    this.components.transform.init?.(world, scene, this);
    this.components.collider?.init?.(world, scene, this);
    this.components.update.forEach((component) => {
      if (typeof component !== 'function') {
        component.init?.(world, scene, this);
      }
    });
    this.components.render.forEach((component) => {
      if (typeof component !== 'function') {
        component.init?.(world, scene, this);
      }
    });
  }

  update(world: IWorld, scene: IScene, deltaTime: number) {
    this.components.update.forEach((updateComponent) => {
      if (typeof updateComponent !== 'function') {
        updateComponent.update(world, scene, this, deltaTime);
      } else {
        updateComponent(world, scene, this, deltaTime);
      }
    });
  }

  render(
    world: IWorld,
    scene: IScene,
    camera: IOrthographicCamera,
    remainder: number
  ) {
    this.components.render.forEach((renderComponent) => {
      if (typeof renderComponent !== 'function') {
        renderComponent.render(world, scene, this, camera, remainder);
      } else {
        renderComponent(world, scene, this, camera, remainder);
      }
    });
  }
}

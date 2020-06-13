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
    if (this.components.state.init) {
      this.components.state.init(world, scene, this);
    }
    if (this.components.transform.init) {
      this.components.transform.init(world, scene, this);
    }
    this.components.update.forEach((component) => {
      if (component.init) {
        component.init(world, scene, this);
      }
    });
    this.components.render.forEach((component) => {
      if (component.init) {
        component.init(world, scene, this);
      }
    });
  }

  update(world: IWorld, scene: IScene, deltaTime: number) {
    this.components.update.forEach((updateComponent) => {
      updateComponent.update(world, scene, this, deltaTime);
    });
  }

  render(
    world: IWorld,
    scene: IScene,
    camera: IOrthographicCamera,
    remainder: number
  ) {
    this.components.render.forEach((renderComponent) => {
      renderComponent.render(world, scene, this, camera, remainder);
    });
  }
}

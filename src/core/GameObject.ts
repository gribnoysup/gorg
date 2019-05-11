import {
  IGameObject,
  GameObjectComponents,
  IOrthographicCamera,
  IWorld,
  IScene,
} from '../types';

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

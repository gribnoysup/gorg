import { IGameObject, IWorld } from './types';
import { OrthographicCamera } from './game-objects';

export class Scene {
  name: string;
  gameObjects: IGameObject[];

  constructor(name: string, gameObjects: IGameObject[]) {
    this.name = name;
    this.gameObjects = gameObjects;
  }

  getActiveObjects() {
    return this.gameObjects.filter(obj => obj.disabled === false);
  }

  addObjects(gameObjects: IGameObject | IGameObject[]) {
    this.gameObjects = this.gameObjects.concat(gameObjects);
  }

  update(world: IWorld, deltaTime: number) {
    for (const gameObject of this.gameObjects) {
      gameObject.update(world, this, deltaTime);
    }
  }

  render(world: IWorld, remainder: number) {
    for (const obj of this.getActiveObjects()) {
      if (obj instanceof OrthographicCamera) {
        obj.render(world, this, obj, remainder);
      }
    }
  }
}

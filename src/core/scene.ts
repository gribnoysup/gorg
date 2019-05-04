import { IGameObject, IWorld } from './types.js';
import { OrthographicCamera } from './game-objects.js';

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

  addObject(gameObject: IGameObject) {
    this.gameObjects.push(gameObject);
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

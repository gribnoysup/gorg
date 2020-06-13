import { OrthographicCamera } from './OrthographicCamera';

export class Scene {
  name: string;
  gameObjects: IGameObject[];

  constructor(name: string, gameObjects: IGameObject[]) {
    this.name = name;
    this.gameObjects = gameObjects;
  }

  init(world: IWorld) {
    this.gameObjects.forEach((gameObject) => {
      gameObject.init(world, this);
    });
  }

  getActiveObjects() {
    return this.gameObjects.filter((obj) => obj.disabled === false);
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
    this.getActiveObjects().forEach((gameObject) => {
      if (gameObject instanceof OrthographicCamera) {
        gameObject.render(world, this, gameObject, remainder);
      }
    });
  }
}

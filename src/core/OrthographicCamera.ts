import {
  GameObjectComponents,
  IOrthographicCamera,
  IWorld,
  IScene,
  Rectangle,
  CanvasFillStrokeStyles,
} from '../types';

import { GameObject } from './GameObject';

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

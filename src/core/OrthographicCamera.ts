import { GameObject } from './GameObject';
import { angle, divide, multiply, rotate, subtract } from './VecMath';
import { World } from './World';
export class OrthographicCamera
  extends GameObject
  implements IOrthographicCamera
{
  viewportRect: Rectangle;
  background: CanvasFillStrokeStyles['fillStyle'];

  constructor(
    name: string,
    components: Partial<GameObjectComponents>,
    viewportRect: Rectangle = { x: 0, y: 0, w: 1, h: 1 },
    background: CanvasFillStrokeStyles['fillStyle'] = '#304d79'
  ) {
    super(name, components);
    this.viewportRect = viewportRect;
    this.background = background;
  }

  projectWorldToCamera(
    {
      renderer: {
        view: { width, height },
      },
    }: World,
    vec: Vector2
  ): any {
    const {
      viewportRect: { x, y, w, h },
      components: {
        transform: { position, rotation, scale },
      },
    } = this;

    const viewOffset = multiply([x, y], [width, height]);
    const viewCenter = multiply([w, h], [width, height], [0.5, 0.5]);

    return divide(
      rotate(subtract(vec, viewOffset, viewCenter, position), angle(rotation)),
      scale
    );
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
        // TODO: calc if the object is in the camera viewport / renderer working
        // area before calling `render`
        world.renderer.draw(() => {
          gameObject.components.transform.adjustRendererContext(world.renderer);
          gameObject.render(world, scene, camera, remainder);
        });
      }
    }

    world.renderer.restoreCanvas();
  }
}

import * as Gorg from './index.js';
import * as Vec2d from './core/vector2d.js';
import { RectRenderer } from './addons/components/RectRenderer.js';

window.Gorg = Gorg;
window.Vec2d = Vec2d;

const {
  World,
  Scene,
  GameObject,
  OrthographicCamera,
  TransformComponent,
} = Gorg;

class RotateUpdater {
  constructor(angle) {
    this.angle = angle;
  }

  update(world, scene, gameObject, deltaTime) {
    gameObject.components.transform.rotateByDeg(this.angle * (1 / deltaTime));
  }
}

class BackAndForthUpdater {
  constructor(
    distance = Infinity,
    direction = Vec2d.angleDegToVector(0),
    step = 1
  ) {
    this.distance = distance;
    this.direction = direction;
    this.step = step;
    this.coveredDistance = 0;
    this.isMovingForward = 1;
  }

  update(world, scene, gameObject, deltaTime) {
    this.isMovingForward =
      this.coveredDistance >= this.distance
        ? -1
        : this.coveredDistance <= 0
        ? 1
        : this.isMovingForward;

    const step = this.step * (1 / deltaTime);

    const move = Vec2d.multiplyScalar(
      Vec2d.multiplyScalar(this.direction, step),
      this.isMovingForward
    );

    gameObject.components.transform.moveBy(move);

    this.coveredDistance += this.isMovingForward * step;
  }
}

const rect0 = new GameObject('rect1', {
  update: [new RotateUpdater(5)],
  render: [new RectRenderer(100, 100, null, 'cyan', 3)],
  transform: new TransformComponent({
    position: [-200, -100],
    rotation: Vec2d.angleDegToVector(45),
    scale: [2, 2],
  }),
});

const rect1 = new GameObject('rect1', {
  render: [new RectRenderer(50, 50, 'yellow')],
});

const rect2 = new GameObject('rect2', {
  update: [new BackAndForthUpdater(300, Vec2d.angleDegToVector(0), 10)],
  render: [new RectRenderer(25, 25, 'magenta', 'white', 2)],
  transform: new TransformComponent({
    position: [-150, 120],
  }),
});

const rect3 = new GameObject('rect3', {
  update: [
    new BackAndForthUpdater(400, Vec2d.angleDegToVector(90), 20),
    new RotateUpdater(15),
  ],
  render: [new RectRenderer(30, 30, 'navy')],
  transform: new TransformComponent({
    position: [200, -200],
  }),
});

const cam0 = new OrthographicCamera('cam0');

const cam1 = new OrthographicCamera(
  'cam1',
  {
    transform: new TransformComponent({
      position: [-10, -45],
      rotation: Vec2d.angleDegToVector(45),
      scale: [0.2, 0.2],
    }),
  },
  { x: 0.8, y: 0.8, w: 0.2, h: 0.2 },
  'black'
);

const scene = new Scene('main', [cam0, cam1, rect0, rect1, rect2, rect3]);

const world = new World([scene], 60, 640, 480);

window.world = world;

world.renderer.appendTo(document.querySelector('#root'));

world.start('main');

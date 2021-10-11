import { Core, Addons } from './gorg.modern.js';

window.Gorg = { Core, Addons };

const {
  World,
  Scene,
  GameObject,
  OrthographicCamera,
  TransformComponent,
  VecMath,
  InputManager,
} = Core;

function floatFix(n, correct = 8) {
  return Number(n.toFixed(correct));
}

function moveBy(v0) {
  return (v1) => VecMath.add(v0, v1);
}

const points = [
  [165, 291],
  [223, 219],
  [230, 175],
  [200, 177],
  [204, 372],
  [218, 302],
  [268, 282],
  [294, 366],
  [347, 343],
  [395, 280],
  [383, 247],
  [347, 273],
  [379, 383],
  [430, 348],
  [451, 223],
  [428, 184],
  [414, 218],
  [485, 348],
  [517, 354],
  [540, 265],
  [534, 205],
  [508, 168],
  [497, 212],
  [569, 346],
  [634, 346],
  [668, 311],
  [660, 250],
  [616, 243],
  [598, 291],
  [617, 325],
  [676, 342],
];

const hello = new Addons.CatmullRomSpline(
  points.map(moveBy([-400, -350])),
  false
);

const square = new Addons.CatmullRomSpline(
  [
    [0, 20],
    [20, 0],
    [180, 0],
    [200, 20],
    [200, 80],
    [180, 100],
    [20, 100],
    [0, 80],
  ].map(moveBy([-250, 100])),
  true
);

const line = new Addons.CatmullRomSpline([
  [-50, 0],
  [50, 0],
]);

class SplineRenderer {
  constructor(spline, fragmentsPerSegment = 10) {
    this.spline = spline;
    this.fragmentsPerSegment = fragmentsPerSegment;
  }

  render(world) {
    const { spline, fragmentsPerSegment } = this;

    const step = 1 / fragmentsPerSegment;
    const ctx = world.renderer.context;

    ctx.beginPath();

    spline.points.forEach(([x, y]) => {
      ctx.moveTo(x, y);
      ctx.arc(x, y, 3, 0, Math.PI * 2);
    });

    ctx.fill();

    ctx.beginPath();

    for (let t = 0; t <= spline.length; t = floatFix(t + step, 3)) {
      const point = spline.getPoint(t);
      ctx.lineTo(point[0], point[1]);
    }

    ctx.stroke();
  }
}

class SplineMover {
  constructor(spline, startPosition = 0, byDistance = true) {
    this.spline = spline;
    this.position = startPosition;
    this.byDistance = byDistance;
  }

  update(world, scene, gameObject, deltaTime) {
    const t = this.byDistance
      ? this.spline.getTForDistance(this.position)
      : this.position;

    const position = this.spline.getPoint(t);
    const rotation = this.spline.getTangent(t);

    gameObject.components.transform.moveTo(position);
    gameObject.components.transform.rotateToVector(rotation);

    const step = this.byDistance ? 20 / deltaTime : 1 / deltaTime;

    this.position += step;
  }
}

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
    direction = VecMath.angleDegToVector(0),
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

    const move = VecMath.multiplyScalar(
      VecMath.multiplyScalar(this.direction, step),
      this.isMovingForward
    );

    gameObject.components.transform.moveBy(move);

    this.coveredDistance += this.isMovingForward * step;
  }
}

const rect0 = new GameObject('rect0', {
  update: [new RotateUpdater(5)],
  render: [new Addons.RectangleRenderComponent(100, 100, null, 'cyan', 3)],
  transform: new TransformComponent({
    position: [-200, -100],
    rotation: VecMath.angleDegToVector(45),
    scale: [2, 2],
  }),
});

class MouseMover {
  update(world, renderer, gameObject) {
    if (InputManager.getKey('Mouse0')) {
      gameObject.components.transform.moveBy(InputManager.getMouseMovement());
    }
  }
}

const sharedTransform = new TransformComponent();

const rect00 = new GameObject('rect00', {
  transform: sharedTransform,
  update: [new MouseMover()],
  render: [new Addons.RectangleRenderComponent(10, 10, 'red')],
});

const rect01 = new GameObject('rect01', {
  transform: sharedTransform,
  render: [new Addons.RectangleRenderComponent(100, 2, 'blue')],
});

const rect02 = new GameObject('rect02', {
  transform: sharedTransform,
  render: [new Addons.RectangleRenderComponent(2, 100, 'green')],
});

const rect1 = new GameObject('rect1', {
  update: [new SplineMover(square)],
  render: [new Addons.RectangleRenderComponent(50, 50, 'yellow')],
});

const rect1_1 = new GameObject('rect1_1', {
  update: [new SplineMover(square, 0, false)],
  render: [new Addons.RectangleRenderComponent(30, 30, 'red')],
});

const rect2 = new GameObject('rect2', {
  update: [new BackAndForthUpdater(300, VecMath.angleDegToVector(0), 10)],
  render: [new Addons.RectangleRenderComponent(20, 20, 'magenta', 'white', 2)],
  transform: new TransformComponent({
    position: [-150, 120],
  }),
});

const rect3 = new GameObject('rect3', {
  update: [
    new BackAndForthUpdater(400, VecMath.angleDegToVector(90), 20),
    new RotateUpdater(15),
  ],
  render: [new Addons.RectangleRenderComponent(30, 30, 'navy')],
  transform: new TransformComponent({
    position: [200, -200],
  }),
});

const cam0 = new OrthographicCamera('cam0');

const cam1 = new OrthographicCamera(
  'cam1',
  {
    transform: new TransformComponent({
      position: [20, 50],
      rotation: VecMath.angleDegToVector(45),
      scale: [0.5, 0.5],
    }),
  },
  { x: 0.6, y: 0.6, w: 0.4, h: 0.4 },
  'cyan'
);

const sprite = new Addons.Sprite(
  './bat_32x32.png',
  Addons.Sprite.SpriteMode.SpriteSheet,
  64,
  32,
  32,
  32
);

const spline = new GameObject('spline', {
  render: [new SplineRenderer(hello)],
});

const spline1 = new GameObject('spline1', {
  render: [new SplineRenderer(square)],
});

const bat = new GameObject('bat', {
  render: [new Addons.SpriteRenderComponent(sprite, 64, 64, [0, 1], 15)],
  update: [new SplineMover(hello, 0)],
});

const scene = new Scene('main', [
  cam0,
  cam1,
  rect01,
  rect02,
  rect00,
  rect0,
  spline1,
  rect1,
  rect1_1,
  rect2,
  rect3,
  spline,
  bat,
]);

const world = new World([scene], 30, 640, 480);

window.world = world;

window.scene = scene;

window.splines = { line };

world.renderer.appendTo(document.querySelector('#root'));

world.start('main');

const debug = document.getElementById('debug');
const updateDebug = () => {
  debug.innerHTML = `<pre>${JSON.stringify(
    {
      ...world.timestamps,
      deltaTime: world.deltaTime,
      buttons: Array.from(InputManager.getKeys()),
      mouse: InputManager.getMousePosition(world),
      mouseMovement: InputManager.getMouseMovement(world),
      project: cam0.projectWorldToCamera(
        world,
        InputManager.getMousePosition(world)
      ),
      project1: cam1.projectWorldToCamera(
        world,
        InputManager.getMousePosition(world)
      ),
    },
    null,
    2
  )}</pre>`;
};
world.addEventListener('update', updateDebug);

# Gorg - Gorgeours Game Engine

Gorg is a very basic 2D game engine. Out of the box you get very small building
blocks that can't do too much on their own, but combined and enhanced you can
build literally anything you want. Let's take a closer look:

## World

Everything starts with a World.

```js
import { World } from 'gorg';

const width = 640;
const height = 480;
const fps = 60;

const world = new World([], fps, width, height);

world.renderer.appendTo(document.querySelector('#app'));
```

World keeps track of Scenes, viewport width and height and keeps the game loop
running with a set amount of frames per second.

## Scene

Having a world is pretty cool already, but without a scene, you can't even run
it. You can think of scenes as a level in your game: during the game loop, your
player will travel from scene to scene.

```diff
- import { World } from 'gorg';
+ import { World, Scene } from 'gorg';

const width = 640;
const height = 480;
const fps = 60;

const world = new World([], fps, width, height);

world.renderer.appendTo(document.querySelector('#app'));

+ const scene = new Scene('main', []);

+ world.addScenes(scene);
```

Now that we have a scene (even though it's empty), we can start our game:

```js
world.start('main');
```

## Camera

By default, scenes are completely empty. If you want scene to render something
on the screen, it needs a camera. Cameras are a special case of the `GameObject`
(that we will talk about later) and they are responsible for making other game
objects visible in the world.

```diff
- import { World, Scene } from 'gorg';
+ import { World, Scene, OrthographicCamera } from 'gorg';

const width = 640;
const height = 480;
const fps = 60;

const world = new World([], fps, width, height);

world.renderer.appendTo(document.querySelector('#app'));

const scene = new Scene('main', []);

+ const camera = new OrthographicCamera('camera');

+ scene.addObjects(camera);

world.addScenes(scene);

world.start('main');
```

## GameObject

Okay, so now we have at least something going on on the screen. Let's add some
`GameObject`s. Game objects are the main part of your game: player character is
a `GameObject`, their dog companion is a `GameObject`, treasures in the dungeon
that they will find together are `GameObject`, the possibilities are endless!
But let's start with something a little bit more basic.

```diff
- import { World, Scene, OrthographicCamera } from 'gorg';
+ import { World, Scene, OrthographicCamera, GameObject } from 'gorg';

const width = 640;
const height = 480;
const fps = 60;

const world = new World([], fps, width, height);

world.renderer.appendTo(document.querySelector('#app'));

const scene = new Scene('main', []);

const camera = new OrthographicCamera('camera');

+ const rectangle = new GameObject('rectangle');

- scene.addObjects(camera);
+ scene.addObjects([camera, rectangle]);

world.addScenes(scene);

world.start('main');
```

## Components

Well, just adding `GameObject`s to the scene was a little underwhelming, right?
`GameObject` on their own are not very interesting, their primary use-case is to
store components.

Components are what defines `GameObject` behavior. There are four types of
components: state, transform, update and render. Every `GameObject` by default
gets one state and transform component and can have multiple render and update
components.

- Transform component keeps `GameObject` position, rotation and scale
  information.

- State component is a basic key value storage for any information that you want
  to share between `GameObject` components.

- Render components allow you to tell the World how to draw `GameObject` on the
  screen.

```js
// file:./RectRendererComponent.js

export class RectRendererComponent {
  constructor(width, height, fillStyle) {
    this.width = width;
    this.height = height;
    this.fillStyle = fillStyle;
  }

  render(world, scene, gameObject, camera, remainder) {
    const { renderer } = world;

    const centerX = this.width / 2;
    const centerY = this.height / 2;

    renderer.context.fillStyle = this.fillStyle;
    renderer.context.fillRect(-centerX, -centerY, this.width, this.height);
  }
}
```

- Update components allow you to change `GameObject` state before any render
  component will have a chance to draw it on the screen:

```js
// file:./RotateUpdaterComponent.js

export class RotateUpdaterComponent {
  constructor(angle) {
    this.angle = angle;
  }

  update(world, scene, gameObject, deltaTime) {
    gameObject.components.transform.rotateByDeg(this.angle * (1 / deltaTime));
  }
}
```

## All Together Now

Okay, let's wrap up and put everything together:

```diff
import { World, Scene, OrthographicCamera, GameObject } from 'gorg';

+ import { RectRendererComponent } from './RectRendererComponent.js';
+ import { RotateUpdaterComponent } from './RotateUpdaterComponent.js';

const width = 640;
const height = 480;
const fps = 60;

const world = new World([], fps, width, height);

world.renderer.appendTo(document.querySelector('#app'));

const scene = new Scene('main', []);

const camera = new OrthographicCamera('camera');

- const rectangle = new GameObject('rectangle');
+ const rectangle = new GameObject('rectangle', {
+   update: [new RotateUpdaterComponent(10)],
+   render: [new RectRendererComponent(100, 50, 'cyan')],
+ });

scene.addObjects([camera, rectangle]);

world.addScenes(scene);

world.start('main');
```

If everything went according to plan, this is what you should see on your
screen:

[![Edit Gorg Demo](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/6lzn9x99pk?fontsize=14)
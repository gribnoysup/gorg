export { World } from './core/World';
export { Scene } from './core/Scene';
export { GameObject } from './core/GameObject';
export { OrthographicCamera } from './core/OrthographicCamera';
export { TransformComponent, StateComponent } from './core/components';

import * as Vector2d from './core/Vector2d';

import * as utils from './utils';

import { RectRendererComponent } from './addons/components/RectRendererComponent';

import { Sprite } from './addons/Sprite';

const addons = {
  components: {
    RectRendererComponent,
  },
  Sprite,
};

export { Vector2d, addons, utils };

export { World } from './core/World';
export { Scene } from './core/Scene';
export { GameObject } from './core/GameObject';
export { OrthographicCamera } from './core/OrthographicCamera';
export { TransformComponent, StateComponent } from './core/components';

import * as Vector2d from './core/Vector2d';

import * as utils from './utils';

import { RectangleRendererComponent } from './addons/components/RectangleRendererComponent';

import { Sprite } from './addons/Sprite';
import { SpriteRendererComponent } from './addons/components/SpriteRendererComponent';

const addons = {
  components: {
    RectangleRendererComponent,
    SpriteRendererComponent,
  },
  Sprite,
};

export { Vector2d, addons, utils };

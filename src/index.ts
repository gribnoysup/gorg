export { World } from './core/World';
export { Scene } from './core/Scene';
export { GameObject } from './core/GameObject';
export { OrthographicCamera } from './core/OrthographicCamera';
export { TransformComponent, StateComponent } from './core/components';

import * as VecMath from './core/VecMath';

import * as utils from './utils';

import { RectangleRendererComponent } from './addons/components/RectangleRendererComponent';

import { Sprite } from './addons/Sprite';
import { SpriteRendererComponent } from './addons/components/SpriteRendererComponent';
import { CatmullRomSpline } from './addons/Spline';

const addons = {
  components: {
    RectangleRendererComponent,
    SpriteRendererComponent,
  },
  Sprite,
  CatmullRomSpline,
};

export { VecMath, addons, utils };

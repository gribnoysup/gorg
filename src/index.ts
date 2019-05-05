export { World } from './core/World';
export { Scene } from './core/Scene';
export { GameObject } from './core/GameObject';
export { OrthographicCamera } from './core/OrthographicCamera';
export { TransformComponent, StateComponent } from './core/components';

import * as Vector2d from './core/Vector2d';

import { RectRendererComponent } from './addons/components/RectRendererComponent';

const addons = {
  components: {
    RectRendererComponent,
  },
};

export { Vector2d, addons };

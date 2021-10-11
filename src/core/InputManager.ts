import { clamp } from './Math';
import { add } from './VecMath';

class Mouse {
  constructor() {
    throw new Error("Mouse is a singleton and can't be initiated");
  }
  static rawButtons: number = 0;
  static position: Vector2 = [-Infinity, -Infinity];
  static movement: Vector2 = [0, 0];
  static start() {
    window.addEventListener('mousemove', Mouse.onMouseMove, { passive: true });
    window.addEventListener('mousedown', Mouse.onMouseButton, {
      passive: true,
    });
    window.addEventListener('mouseup', Mouse.onMouseButton, { passive: true });
    return Mouse;
  }
  static stop() {
    window.removeEventListener('mousemove', Mouse.onMouseMove);
    window.removeEventListener('mousedown', Mouse.onMouseButton);
    window.removeEventListener('mouseup', Mouse.onMouseButton);
    return Mouse;
  }
  static onMouseMove(evt: MouseEvent) {
    Mouse.position = [evt.pageX, evt.pageY];
    Mouse.movement = add(Mouse.movement, [evt.movementX, evt.movementY]);
  }
  static onMouseButton(evt: MouseEvent) {
    // TODO: also accumulate and flush (but I need a mouse to test this lol)
    Mouse.rawButtons = evt.buttons;
  }
  static getKeys() {
    const result = [];
    const buttons = Mouse.rawButtons;
    let i = 0;
    while (buttons >= 1 << i) {
      if (buttons & (1 << i)) {
        result.push(`Mouse${i}`);
      }
      i++;
    }
    return result;
  }
  static flush() {
    Mouse.movement = [0, 0];
  }
}

Mouse.start();

class Keyboard {
  private constructor() {
    throw new Error("Keyboard is a singleton and can't be initiated");
  }
  private static pressedBuffer: Set<string> = new Set();
  static pressed: Set<string> = new Set();
  static start() {
    window.addEventListener('keydown', Keyboard.onKeyDown, { passive: true });
    window.addEventListener('keyup', Keyboard.onKeyUp, { passive: true });
    return Keyboard;
  }
  static stop() {
    window.removeEventListener('keydown', Keyboard.onKeyDown);
    window.removeEventListener('keyup', Keyboard.onKeyUp);
    return Keyboard;
  }
  static onKeyDown(evt: KeyboardEvent) {
    Keyboard.pressed.add(evt.code);
    Keyboard.pressedBuffer.add(evt.code);
  }
  static onKeyUp(evt: KeyboardEvent) {
    Keyboard.pressed.delete(evt.code);
  }
  static getKeys() {
    return Array.from(Keyboard.pressedBuffer);
  }
  static flush() {
    Keyboard.pressedBuffer = new Set(Keyboard.pressed);
  }
}

Keyboard.start();

export class VirtualAxis {
  name: string;
  positiveButton: string;
  negativeButton: string;
  velocity: number;
  gravity: number;
  value: number = 0;
  constructor(
    name: string,
    positiveButton: string,
    negativeButton: string,
    velocity: number = 1,
    gravity: number = 1
  ) {
    this.name = name;
    this.positiveButton = positiveButton;
    this.negativeButton = negativeButton;
    this.velocity = velocity;
    this.gravity = gravity;
  }
  update(deltaTime: number) {
    const { positiveButton, negativeButton, value, gravity, velocity } = this;
    const direction = InputManager.getKey(positiveButton)
      ? 1
      : InputManager.getKey(negativeButton)
      ? -1
      : 0;

    if (direction === 0) {
      const newVal = value + -1 * Math.sign(value) * gravity * deltaTime;
      this.value = clamp(0, value, newVal);
    } else {
      const newVal = value + direction * velocity * deltaTime;
      this.value = clamp(-1, 1, newVal);
    }
  }
}

// Maybe later
// // Gamepad (but the name is taken)
// class Controller {}

function worldOffset(
  [x, y]: Vector2,
  {
    renderer: {
      // There is a chance that this offsetTop/Left needs to happen recursively
      // through all parent contexts of canvas is not directly inserted into the
      // document body
      view: { offsetTop, offsetLeft },
    },
  }: IWorld
): Vector2 {
  return [x - offsetLeft, y - offsetTop];
}

export class InputManager {
  private constructor() {
    throw new Error("InputManager is a singleton and can't be initiated");
  }
  static axes: Map<string, VirtualAxis> = new Map();
  static getKey(key: string) {
    const keysToCheck = key.split('+');
    const allPressedKeys = InputManager.getKeys();
    return keysToCheck.every((code) => allPressedKeys.has(code));
  }
  static getKeys() {
    return new Set([...Mouse.getKeys(), ...Keyboard.getKeys()]);
  }
  static getMousePosition(world?: IWorld): Vector2 {
    if (!world) {
      return Mouse.position;
    }
    return worldOffset(Mouse.position, world);
  }
  static getMouseMovement() {
    return Mouse.movement;
  }
  static getAxis(name: string) {
    return InputManager.axes.get(name);
  }
  static addAxis(axis: VirtualAxis) {
    InputManager.axes.set(axis.name, axis);
  }
  static update(deltaTime: number) {
    for (const axis of this.axes.values()) {
      axis.update(deltaTime);
    }
  }
  static flush() {
    Mouse.flush();
    Keyboard.flush();
  }
}

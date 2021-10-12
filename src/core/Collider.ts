import { clamp } from './Math';
import { add, distance, divideScalar, equal, subtract } from './VecMath';

function collides(c1: BoxCollider2D, c2: BoxCollider2D): boolean;
function collides(c1: BoxCollider2D, c2: PointCollider2D): boolean;
function collides(c1: BoxCollider2D, c2: CircleCollider2D): boolean;
function collides(c1: PointCollider2D, c2: PointCollider2D): boolean;
function collides(c1: PointCollider2D, c2: CircleCollider2D): boolean;
function collides(c1: CircleCollider2D, c2: CircleCollider2D): boolean;
function collides(c1: CircleCollider2D, c2: PointCollider2D): boolean;
function collides(c1: CircleCollider2D, c2: BoxCollider2D): boolean;
function collides(c1: PointCollider2D, c2: BoxCollider2D): boolean;
function collides(c1: IColliderComponent, c2: IColliderComponent): boolean;
function collides(c1: unknown, c2: unknown): boolean {
  if (c1 instanceof BoxCollider2D && c2 instanceof BoxCollider2D) {
    const midpoint1 = divideScalar(c1.size, 2);
    const midpoint2 = divideScalar(c2.size, 2);
    const [minX1, minY1] = subtract(c1.position, midpoint1);
    const [maxX1, maxY1] = add(c1.position, midpoint1);
    const [minX2, minY2] = subtract(c2.position, midpoint2);
    const [maxX2, maxY2] = add(c2.position, midpoint2);

    return minX1 <= maxX2 && maxX1 >= minX2 && minY1 <= maxY2 && maxY1 >= minY2;
  }

  if (c1 instanceof BoxCollider2D && c2 instanceof PointCollider2D) {
    const [x, y] = c2.position;
    const midpoint = divideScalar(c1.size, 2);
    const [minX, minY] = subtract(c1.position, midpoint);
    const [maxX, maxY] = add(c1.position, midpoint);

    return x >= minX && x <= maxX && y >= minY && y <= maxY;
  }

  if (c1 instanceof BoxCollider2D && c2 instanceof CircleCollider2D) {
    const midpoint = divideScalar(c1.size, 2);
    const [minX, minY] = subtract(c1.position, midpoint);
    const [maxX, maxY] = add(c1.position, midpoint);
    const [cX, cY] = c2.position;
    const closest: Vector2 = [clamp(minX, maxX, cX), clamp(minY, maxY, cY)];

    return distance(c2.position, closest) < c2.radius;
  }

  if (c1 instanceof PointCollider2D && c2 instanceof PointCollider2D) {
    return equal(c1.position, c2.position, Math.floor);
  }

  if (c1 instanceof PointCollider2D && c2 instanceof CircleCollider2D) {
    return distance(c1.position, c2.position) < c2.radius;
  }

  if (c1 instanceof CircleCollider2D && c2 instanceof CircleCollider2D) {
    return distance(c1.position, c2.position) < c1.radius + c2.radius;
  }

  if (c1 instanceof CircleCollider2D && c2 instanceof PointCollider2D) {
    return collides(c2, c1);
  }

  if (c1 instanceof CircleCollider2D && c2 instanceof BoxCollider2D) {
    return collides(c2, c1);
  }

  if (c1 instanceof PointCollider2D && c2 instanceof BoxCollider2D) {
    return collides(c2, c1);
  }

  return false;
}

abstract class Collider2D implements IColliderComponent {
  private gameObject!: IGameObject;
  constructor(private offset: Vector2 = [0, 0]) {}
  init(_world: IWorld, _scene: IScene, gameObject: IGameObject): void {
    console.log('this', this);
    this.gameObject = gameObject;
  }
  public get position(): Vector2 {
    return add(this.offset, this.gameObject.components.transform.position);
  }
  collidesWith(collider: IColliderComponent): boolean {
    return collides(this, collider);
  }
}

export class PointCollider2D extends Collider2D {}

export class BoxCollider2D extends Collider2D {
  constructor(offset: Vector2 = [0, 0], public size: Vector2 = [1, 1]) {
    super(offset);
  }
}

export class CircleCollider2D extends Collider2D {
  constructor(offset: Vector2 = [0, 0], public radius: number = 1) {
    super(offset);
  }
}

// TODO
// class CapsuleCollider2D {}
// class PolygonCollider2D {}

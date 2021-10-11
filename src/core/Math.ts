export function lerp(n0: number, n1: number, t: number): number {
  return (1 - t) * n0 + t * n1;
}

export function floatFix(n: number, correct = 8): number {
  return Number(n.toFixed(correct));
}

export function decimals(n: number): number {
  return (n.toString().split('.')[1] || '').length;
}

export function clamp(min: number, max: number, n: number): number {
  if (min > max) {
    [min, max] = [max, min];
  }
  return Math.min(max, Math.max(min, n));
}

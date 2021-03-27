export function randomInt(min: number, max: number): number {
  const t1 = Math.min(min, max);
  const t2 = Math.max(min, max);
  return Math.floor(t1 + Math.random() * (t2 - t1 + 1));
}

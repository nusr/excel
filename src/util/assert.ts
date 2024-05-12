export function assert(
  condition: boolean,
  message = 'assert error',
): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

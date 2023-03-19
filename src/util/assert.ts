export function assert(
  condition: boolean,
  message = 'assert error',
  env = process.env.NODE_ENV,
): asserts condition {
  if (!condition) {
    if (env === 'production') {
      window.alert(message);
      console.error(message);
      return;
    }
    throw new Error(message);
  }
}

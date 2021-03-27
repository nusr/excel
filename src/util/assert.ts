export function assert(
  condition: boolean,
  message = "assert error",
  env = process.env.NODE_ENV
): asserts condition {
  if (!condition) {
    if (env === "production") {
      console.error(message);
      return;
    }
    throw new Error(message);
  }
}

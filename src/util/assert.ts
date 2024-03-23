import { toast } from '../containers/components';
export function assert(
  condition: boolean,
  message = 'assert error',
  env = process.env.NODE_ENV,
): asserts condition {
  if (!condition) {
    if (env !== 'test') {
      toast({ type: 'error', message: message, duration: 5 });
    }
    throw new Error(message);
  }
}

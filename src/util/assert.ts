import { toast } from '../containers/components';
export function assert(
  condition: boolean,
  message = 'assert error',
  env = process.env.NODE_ENV,
): asserts condition {
  if (!condition) {
    toast({
      type: 'error',
      message: message,
      duration: 5,
      testId: 'assert_toast',
    });
    if (env !== 'test') {
      throw new Error(message);
    }
  }
}

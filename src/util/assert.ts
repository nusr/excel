import { toast } from '../containers/components';

export function assert(
  condition: boolean,
  message = 'assert error',
): asserts condition {
  if (!condition) {
    toast({
      type: 'error',
      message: message,
      duration: 5,
      testId: 'assert_toast',
    });
    throw new Error(message);
  }
}

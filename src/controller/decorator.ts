import { SYNC_FLAG, IController } from '../types';
import { controllerLog } from '../util';
import { $ } from '../i18n';

export function transaction(origin: SYNC_FLAG = SYNC_FLAG.MODEL) {
  return function (_target: any, key: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const self = this as IController;
      if (self.getReadOnly()) {
        controllerLog('no auth method:', key);
        return self.emit('toastMessage', {
          type: 'error',
          message: $('no-login-editing'),
        });
      }
      const doc = self.getHooks().doc;
      return doc.transact(() => originalMethod.apply(self, args), origin);
    };

    return descriptor;
  };
}

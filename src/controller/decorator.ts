import { SYNC_FLAG } from '@/types';

export function transaction(origin: SYNC_FLAG = SYNC_FLAG.MODEL) {
  return function (_target: any, _key: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      // @ts-ignore
      const doc = this.hooks.doc;
      return doc.transact(() => originalMethod.apply(this, args), origin);
    };

    return descriptor;
  };
}

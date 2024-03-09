/* eslint-disable @typescript-eslint/ban-ts-comment */
import { ICommand, WorkBookJSON, IModel } from '@/types';

export const DELETE_FLAG = Symbol('delete');

export class BaseCommand<keyType extends keyof WorkBookJSON>
  implements ICommand
{
  private oldValue: WorkBookJSON[keyType] | Record<string, symbol>;
  private newValue: WorkBookJSON[keyType] | Record<string, symbol>;
  private key: keyType;
  private target: IModel;
  constructor(
    target: IModel,
    key: keyType,
    newValue: WorkBookJSON[keyType] | Record<string, symbol>,
    oldValue: WorkBookJSON[keyType] | Record<string, symbol>,
  ) {
    this.oldValue = oldValue;
    this.newValue = newValue;
    this.key = key;
    this.target = target;
  }
  private patch(
    key: keyType,
    value: WorkBookJSON[keyType] | Record<string, symbol>,
  ) {
    if (value && typeof value === 'object') {
      for (const [k, v] of Object.entries(value)) {
        if (v === DELETE_FLAG) {
          // @ts-ignore
          delete this.target[key][k];
        } else {
          // @ts-ignore
          this.target[key][k] = v;
        }
      }
    } else {
      // @ts-ignore
      if (value === DELETE_FLAG) {
        // @ts-ignore
        delete this.target[key];
      } else {
        // @ts-ignore
        this.target[key] = value;
      }
    }
  }
  undo = () => {
    this.patch(this.key, this.oldValue);
  };
  redo = () => {
    this.execute();
  };
  execute = () => {
    this.patch(this.key, this.newValue);
  };
}

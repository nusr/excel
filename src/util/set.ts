export class BaseSet<T extends Record<string, any>> {
  private state: T;
  constructor(initValue: T) {
    this.state = initValue;
  }
  set = (data: T): void => {
    this.state = data;
  };
  merge = (data: Partial<T>): void => {
    this.state = Object.assign(this.state, data);
  };
}

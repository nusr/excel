export class Stack {
  items: any[] = [];
  constructor() {
    this.items = [];
  }

  push(value: any): void {
    this.items.push(value);
  }

  pop() {
    return this.items.pop();
  }

  top() {
    return this.items[this.items.length - 1];
  }
}

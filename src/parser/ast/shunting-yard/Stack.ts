// import type { Operator } from "./Operator";
// import type { Node } from "../../type";

// type StackItem = Operator | Node;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type StackItem = any;
export class Stack {
  items: StackItem[] = [];
  constructor() {
    this.items = [];
  }

  push(value: StackItem): void {
    this.items.push(value);
  }

  pop(): StackItem {
    return this.items.pop();
  }

  top(): StackItem {
    return this.items[this.items.length - 1];
  }
}

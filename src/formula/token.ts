import type { TokenType } from '@/types'
export class Token {
  type: TokenType;
  value: string;
  constructor(type: TokenType, value: string) {
    this.type = type;
    this.value = value;
  }
  error() {
    return `type:${this.type},value:${this.value}`;
  }
  toString(): string {
    return this.value;
  }
}
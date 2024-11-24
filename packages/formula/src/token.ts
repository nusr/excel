import type { TokenType } from '@excel/shared';

export class Token {
  type: TokenType;
  value: string;
  constructor(type: TokenType, value: string) {
    this.type = type;
    this.value = value;
  }
  toString(): string {
    return this.value;
  }
}

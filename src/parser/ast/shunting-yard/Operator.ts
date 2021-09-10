class Operator {
  operandCount: number;
  precedence: number;
  leftAssociative: boolean;
  symbol: string;
  constructor(
    symbol: string,
    precedence = 0,
    operandCount = 2,
    leftAssociative = true
  ) {
    if (operandCount < 1 || operandCount > 2) {
      throw new Error(`operandCount cannot be ${operandCount}, must be 1 or 2`);
    }

    this.symbol = symbol;
    this.precedence = precedence;
    this.operandCount = operandCount;
    this.leftAssociative = leftAssociative;
  }

  isUnary(): boolean {
    return this.operandCount === 1;
  }

  isBinary(): boolean {
    return this.operandCount === 2;
  }

  evaluatesBefore(other: Operator): boolean {
    if (this === SENTINEL) return false;
    if (other === SENTINEL) return true;
    if (other.isUnary()) return false;

    if (this.isUnary()) {
      return this.precedence >= other.precedence;
    } else if (this.isBinary()) {
      if (this.precedence === other.precedence) {
        return this.leftAssociative;
      } else {
        return this.precedence > other.precedence;
      }
    }
    return false;
  }
}

// fake operator with lowest precedence
const SENTINEL = new Operator("S", 0);

export { SENTINEL, Operator };

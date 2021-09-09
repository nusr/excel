class Operator {
  operandCount: number;
  precendence: number;
  leftAssociative: boolean;
  symbol: string;
  constructor(
    symbol: string,
    precendence = 0,
    operandCount = 2,
    leftAssociative = true
  ) {
    if (operandCount < 1 || operandCount > 2) {
      throw new Error(`operandCount cannot be ${operandCount}, must be 1 or 2`);
    }

    this.symbol = symbol;
    this.precendence = precendence;
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
      return this.precendence >= other.precendence;
    } else if (this.isBinary()) {
      if (this.precendence === other.precendence) {
        return this.leftAssociative;
      } else {
        return this.precendence > other.precendence;
      }
    }
    return false;
  }
}

// fake operator with lowest precendence
const SENTINEL = new Operator("S", 0);

export { SENTINEL, Operator };

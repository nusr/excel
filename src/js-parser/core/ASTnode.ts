class ASTNode {
  left: ASTNode | null;
  right: ASTNode | null;
  mid: ASTNode | null;
  op: string;
  value: any;
  option: any;
  type: any;
  constructor() {
    this.left = null;
    this.right = null;
    this.mid = null;
    this.op = "";
    this.value = null;
    this.option = null;
  }

  initLeafNode(op: string, value: any): this {
    this.op = op;
    this.value = value;
    return this;
  }

  initUnaryNode(op: string, left: ASTNode | null, value: any): this {
    this.left = left;
    return this.initLeafNode(op, value);
  }

  initTwoNode(
    op: string,
    left: ASTNode | null,
    right: ASTNode | null,
    value: any
  ): this {
    this.right = right;
    return this.initUnaryNode(op, left, value);
  }

  initThreeNode(
    op: string,
    left: ASTNode | null,
    mid: ASTNode | null,
    right: ASTNode | null,
    value: any
  ): this {
    this.mid = mid;
    return this.initTwoNode(op, left, right, value);
  }
}

export { ASTNode };

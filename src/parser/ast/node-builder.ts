import type {
  Node,
  CellNode,
  CellRangeNode,
  FunctionNode,
  NumberNode,
  TextNode,
  LogicalNode,
  BinaryExpressionNode,
  UnaryExpressionNode,
  RefTypes,
  BinaryOperatorTypes,
  unaryOperatorTypes,
} from "../type";

function cell(key: string, refType: RefTypes): CellNode {
  return {
    type: "cell",
    refType,
    key,
  };
}

function cellRange(leftCell: Node, rightCell: Node): CellRangeNode {
  if (!leftCell) {
    throw new Error("Invalid Syntax");
  }
  if (!rightCell) {
    throw new Error("Invalid Syntax");
  }
  return {
    type: "cell-range",
    left: leftCell,
    right: rightCell,
  };
}

function functionCall(name: string, ...args: Node[]): FunctionNode {
  const argArray = Array.isArray(args[0]) ? args[0] : args;

  return {
    type: "function",
    name,
    arguments: argArray,
  };
}

function number(value: number): NumberNode {
  return {
    type: "number",
    value,
  };
}

function text(value: string): TextNode {
  return {
    type: "text",
    value,
  };
}

function logical(value: boolean): LogicalNode {
  return {
    type: "logical",
    value,
  };
}

function binaryExpression(
  operator: BinaryOperatorTypes,
  left: Node,
  right: Node
): BinaryExpressionNode {
  if (!left) {
    throw new Error("Invalid Syntax");
  }
  if (!right) {
    throw new Error("Invalid Syntax");
  }
  return {
    type: "binary-expression",
    operator,
    left,
    right,
  };
}

function unaryExpression(
  operator: unaryOperatorTypes,
  expression: Node
): UnaryExpressionNode {
  if (!expression) {
    throw new Error("Invalid Syntax");
  }
  return {
    type: "unary-expression",
    operator,
    operand: expression,
  };
}
export {
  functionCall,
  number,
  text,
  logical,
  cell,
  cellRange,
  binaryExpression,
  unaryExpression,
};

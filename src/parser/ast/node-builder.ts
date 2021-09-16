import type {
  Node,
  CellNode,
  CellRangeNode,
  FunctionNode,
  NumberNode,
  StringNode,
  BooleanNode,
  BinaryExpressionNode,
  UnaryExpressionNode,
  RefTypes,
  BinaryOperatorTypes,
  unaryOperatorTypes,
  DefineNameNode,
} from "../type";

function cell(key: string, refType: RefTypes): CellNode {
  return {
    type: "Cell",
    refType,
    key,
  };
}

function cellRange(leftCell: CellNode, rightCell: CellNode): CellRangeNode {
  if (!leftCell) {
    throw new Error("Invalid Syntax");
  }
  if (!rightCell) {
    throw new Error("Invalid Syntax");
  }
  return {
    type: "CellRange",
    left: leftCell,
    right: rightCell,
  };
}

function functionCall(name: string, ...args: Node[]): FunctionNode {
  const argArray = Array.isArray(args[0]) ? args[0] : args;

  return {
    type: "CallExpression",
    name,
    arguments: argArray,
  };
}

function numberLiteral(value: number): NumberNode {
  return {
    type: "NumberLiteral",
    value,
  };
}

function stringLiteral(value: string): StringNode {
  return {
    type: "StringLiteral",
    value,
  };
}

function booleanLiteral(value: boolean): BooleanNode {
  return {
    type: "BooleanLiteral",
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
    type: "BinaryExpression",
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
    type: "UnaryExpression",
    operator,
    operand: expression,
  };
}

function defineName(value: string): DefineNameNode {
  return {
    type: "DefineName",
    value,
  };
}
export {
  functionCall,
  numberLiteral,
  stringLiteral,
  booleanLiteral,
  cell,
  cellRange,
  defineName,
  binaryExpression,
  unaryExpression,
};

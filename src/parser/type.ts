export interface Token {
  value: string;
  type: string;
  subtype: string;
}

export type Node =
  | BinaryExpressionNode
  | UnaryExpressionNode
  | FunctionNode
  | NumberNode
  | CellNode
  | LogicalNode
  | TextNode
  | CellRangeNode;
export type BinaryOperatorTypes =
  | ">"
  | "<"
  | "="
  | ">="
  | "<="
  | "+"
  | "-"
  | "^"
  | "*"
  | "/"
  | "&"
  | "<>"
  | " ";
export interface BinaryExpressionNode {
  type: "binary-expression";
  operator: BinaryOperatorTypes;
  left: Node;
  right: Node;
}
export type unaryOperatorTypes = "+" | "-";
export interface UnaryExpressionNode {
  type: "unary-expression";
  operator: unaryOperatorTypes;
  operand: Node;
}

export interface FunctionNode {
  type: "function";
  name: string;
  arguments: Node[];
}
export interface NumberNode {
  type: "number";
  value: number;
}
export type RefTypes = "relative" | "mixed" | "absolute";
export interface CellNode {
  type: "cell";
  refType?: RefTypes;
  key: string;
}
export interface CellRangeNode {
  type: "cell-range";
  left: Node;
  right: Node;
}
export interface LogicalNode {
  type: "logical";
  value: boolean;
}
export interface TextNode {
  type: "text";
  value: string;
}

export interface Visitor {
  enterCell?(node: CellNode): void;
  exitCell?(node: CellNode): void;

  enterCellRange?(node: CellRangeNode): void;
  exitCellRange?(node: CellRangeNode): void;

  enterFunction?(node: FunctionNode): void;
  exitFunction?(node: FunctionNode): void;

  enterNumber?(node: NumberNode): void;
  exitNumber?(node: NumberNode): void;

  enterText?(node: TextNode): void;
  exitText?(node: TextNode): void;

  enterLogical?(node: LogicalNode): void;
  exitLogical?(node: LogicalNode): void;

  enterBinaryExpression?(node: BinaryExpressionNode): void;
  exitBinaryExpression?(node: BinaryExpressionNode): void;

  enterUnaryExpression?(node: UnaryExpressionNode): void;
  exitUnaryExpression?(node: UnaryExpressionNode): void;
}

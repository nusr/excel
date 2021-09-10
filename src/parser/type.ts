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
  | BooleanNode
  | StringNode
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
  ns?: string;
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
  ns?: string;
}
export interface CellRangeNode {
  type: "cell-range";
  left: CellNode;
  right: CellNode;
  sheet?: string;
}
export interface BooleanNode {
  type: "boolean";
  value: boolean;
}
export interface StringNode {
  type: "string";
  value: string;
}

export type ResultType = boolean | string | number | null;

export type VisitParentType = any;

export interface Visitor {
  enterCell?(node: CellNode, parent: VisitParentType): void;
  exitCell?(node: CellNode, parent: VisitParentType): void;

  enterCellRange?(node: CellRangeNode, parent: VisitParentType): void;
  exitCellRange?(node: CellRangeNode, parent: VisitParentType): void;

  enterFunction?(node: FunctionNode, parent: VisitParentType): void;
  exitFunction?(node: FunctionNode, parent: VisitParentType): void;

  enterNumber?(node: NumberNode, parent: VisitParentType): void;
  exitNumber?(node: NumberNode, parent: VisitParentType): void;

  enterString?(node: StringNode, parent: VisitParentType): void;
  exitString?(node: StringNode, parent: VisitParentType): void;

  enterBoolean?(node: BooleanNode, parent: VisitParentType): void;
  exitBoolean?(node: BooleanNode, parent: VisitParentType): void;

  enterBinaryExpression?(
    node: BinaryExpressionNode,
    parent: VisitParentType
  ): void;
  exitBinaryExpression?(
    node: BinaryExpressionNode,
    parent: VisitParentType
  ): void;

  enterUnaryExpression?(
    node: UnaryExpressionNode,
    parent: VisitParentType
  ): void;
  exitUnaryExpression?(
    node: UnaryExpressionNode,
    parent: VisitParentType
  ): void;
}

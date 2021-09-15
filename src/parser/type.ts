import type { QueryCellResult } from "@/types";
export interface Token {
  value: string;
  type: TokenType;
  subtype?: TokenSubType;
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
  type: "BinaryExpression";
  operator: BinaryOperatorTypes;
  left: Node;
  right: Node;
}
export type unaryOperatorTypes = "+" | "-";
export interface UnaryExpressionNode {
  type: "UnaryExpression";
  operator: unaryOperatorTypes;
  operand: Node;
}

export interface FunctionNode {
  type: "CallExpression";
  name: string;
  arguments: Node[];
}
export interface NumberNode {
  type: "NumberLiteral";
  value: number;
}
export type RefTypes = "relative" | "mixed" | "absolute";
export interface CellNode {
  type: "Cell";
  refType?: RefTypes;
  key: string;
}
export interface CellRangeNode {
  type: "CellRange";
  left: CellNode;
  right: CellNode;
  sheet?: string;
}
export interface BooleanNode {
  type: "BooleanLiteral";
  value: boolean;
}
export interface StringNode {
  type: "StringLiteral";
  value: string;
}

export interface IParseFormulaOptions {
  queryCell: (row: number, col: number, sheetId?: string) => QueryCellResult;
}

export type TokenSubType =
  | "start"
  | "stop"
  | "range"
  | "number"
  | "text"
  | "logical"
  | "error"
  | "union"
  | "intersect"
  | "concatenate"
  | "math"
  | "";

export type TokenType =
  | "sub-expression"
  | "function"
  | "argument"
  | "operator-infix"
  | "operator-prefix"
  | "operator-postfix"
  | "operand"
  | "unknown"
  | "white-space"
  | "noop";

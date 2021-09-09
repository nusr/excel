import { generateAST, visit } from "../ast";
import { tokenize } from "../tokenize";
import type {
  Node,
  Visitor,
  CellNode,
  CellRangeNode,
  FunctionNode,
  NumberNode,
  TextNode,
  LogicalNode,
  BinaryExpressionNode,
  UnaryExpressionNode,
} from "../type";

function transformer(ast: Node) {}
function codeGenerator(newAst: any) {}

export function parseFormula(code: string) {
  const tokens = tokenize(code);
  const ast = generateAST(tokens);
  const newAst = transformer(ast);
  const result = codeGenerator(newAst);
  console.log(result);
}

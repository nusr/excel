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
export function visit(node: Node, visitor: Visitor): void {
  visitNode(node, visitor);
}

function visitNode(node: Node, visitor: Visitor) {
  switch (node.type) {
    case "cell":
      visitCell(node, visitor);
      break;
    case "cell-range":
      visitCellRange(node, visitor);
      break;
    case "function":
      visitFunction(node, visitor);
      break;
    case "number":
      visitNumber(node, visitor);
      break;
    case "text":
      visitText(node, visitor);
      break;
    case "logical":
      visitLogical(node, visitor);
      break;
    case "binary-expression":
      visitBinaryExpression(node, visitor);
      break;
    case "unary-expression":
      visitUnaryExpression(node, visitor);
      break;
  }
}

function visitCell(node: CellNode, visitor: Visitor) {
  if (visitor.enterCell) visitor.enterCell(node);
  if (visitor.exitCell) visitor.exitCell(node);
}

function visitCellRange(node: CellRangeNode, visitor: Visitor) {
  if (visitor.enterCellRange) visitor.enterCellRange(node);

  visitNode(node.left, visitor);
  visitNode(node.right, visitor);

  if (visitor.exitCellRange) visitor.exitCellRange(node);
}

function visitFunction(node: FunctionNode, visitor: Visitor) {
  if (visitor.enterFunction) visitor.enterFunction(node);

  node.arguments.forEach((arg) => visitNode(arg, visitor));

  if (visitor.exitFunction) visitor.exitFunction(node);
}

function visitNumber(node: NumberNode, visitor: Visitor) {
  if (visitor.enterNumber) visitor.enterNumber(node);
  if (visitor.exitNumber) visitor.exitNumber(node);
}

function visitText(node: TextNode, visitor: Visitor) {
  if (visitor.enterText) visitor.enterText(node);
  if (visitor.exitText) visitor.exitText(node);
}

function visitLogical(node: LogicalNode, visitor: Visitor) {
  if (visitor.enterLogical) visitor.enterLogical(node);
  if (visitor.exitLogical) visitor.exitLogical(node);
}

function visitBinaryExpression(node: BinaryExpressionNode, visitor: Visitor) {
  if (visitor.enterBinaryExpression) visitor.enterBinaryExpression(node);

  visitNode(node.left, visitor);
  visitNode(node.right, visitor);

  if (visitor.exitBinaryExpression) visitor.exitBinaryExpression(node);
}

function visitUnaryExpression(node: UnaryExpressionNode, visitor: Visitor) {
  if (visitor.enterUnaryExpression) visitor.enterUnaryExpression(node);

  visitNode(node.operand, visitor);

  if (visitor.exitUnaryExpression) visitor.exitUnaryExpression(node);
}

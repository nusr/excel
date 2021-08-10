import { Lexer, Parser, tokenTypes } from "./lex";
const lex = new Lexer("1 + 2 / 5 + 4");
const parser = new Parser(lex);
const ast = parser.parse();

function interpretAST(astNode: any): any {
  let leftResult;
  if (astNode.left) {
    leftResult = interpretAST(astNode.left);
  }
  let rightResult;
  if (astNode.right) {
    rightResult = interpretAST(astNode.right);
  }
  if (astNode.op === undefined) {
    return astNode.value;
  }

  switch (astNode.op) {
    case tokenTypes.NUMBER:
      return astNode.value;
    case tokenTypes.PLUS:
      if (leftResult === undefined || rightResult === undefined) {
        return leftResult;
      }
      return leftResult + rightResult;
    case tokenTypes.MINUS:
      if (leftResult === undefined || rightResult === undefined) {
        return -leftResult;
      }
      return leftResult - rightResult;
    case tokenTypes.ASTERISK:
      return leftResult * rightResult;
    case tokenTypes.SLASH:
      return leftResult / rightResult;
    default:
      throw new Error(`unknown ASTNode op: ${astNode.op}`);
  }
}

console.log(interpretAST(ast));

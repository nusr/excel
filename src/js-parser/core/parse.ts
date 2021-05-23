import { globalData, tokenTypes, ASTNodeTypes } from "./token";
import { errPrint } from "../init/commons";
import {
  match,
  scan,
  leftBrace,
  rightBrace,
  leftPt,
  rightPt,
  semicolon,
} from "./scanner";
import { parseExpression, prefixParserMap } from "./expression";
import { ASTNode } from "./ASTnode";

function varDeclaration() {
  const { token } = globalData;
  let tree = null,
    left = null,
    lastTokenValue;
  const type =
    token.type === tokenTypes.T_ARGUMENT
      ? ASTNodeTypes.T_ARGUMENT
      : ASTNodeTypes.T_VAR;
  let index = 0;
  scan();
  do {
    if (token.type === tokenTypes.T_IDENT) {
      left = new ASTNode().initLeafNode(type, token.value);
      lastTokenValue = left;
      if (type === tokenTypes.T_ARGUMENT) {
        left.option = index;
        ++index;
      }
      scan();
      if (tree === null) {
        tree = left;
      } else {
        tree = new ASTNode().initTwoNode(ASTNodeTypes.T_GLUE, tree, left, null);
      }
      if (token.type === tokenTypes.T_SEMI) {
        break;
      }
    } else {
      errPrint(`unknown error : token type: ${token.type}`);
    }
  } while (token.type === tokenTypes.T_COMMA && scan());

  if (token.type === tokenTypes.T_ASSIGN) {
    scan();
    const right = new ASTNode().initLeafNode(
      ASTNodeTypes.T_LVALUE,
      lastTokenValue?.value
    );
    const left = normalStatement();
    const assignTree = new ASTNode().initTwoNode(
      ASTNodeTypes.T_ASSIGN,
      left,
      right,
      null
    );
    tree = new ASTNode().initTwoNode(
      ASTNodeTypes.T_GLUE,
      tree,
      assignTree,
      null
    );
  }
  if (token.type === tokenTypes.T_SEMI) {
    semicolon();
  }
  return tree;
}

function ifStatement(): ASTNode {
  const { token } = globalData;
  let condition: ASTNode | null = null;
  let trueBody: ASTNode | null = null;
  let falseBody: ASTNode | null = null;
  match(tokenTypes.T_IF, "if");
  leftPt();
  condition = parseExpression(0);
  rightPt();
  leftBrace();
  trueBody = statement();
  rightBrace();
  if (token.type === tokenTypes.T_ELSE) {
    scan();
    leftBrace();
    falseBody = statement();
    rightBrace();
  }
  return new ASTNode().initThreeNode(
    ASTNodeTypes.T_IF,
    condition,
    trueBody,
    falseBody,
    null
  );
}

function whileStatement(): ASTNode {
  let condition: ASTNode | null = null;
  let body: ASTNode | null = null;
  match(tokenTypes.T_WHILE, "while");
  leftPt();
  condition = parseExpression(0);
  rightPt();
  leftBrace();
  body = statement();
  rightBrace();
  return new ASTNode().initTwoNode(ASTNodeTypes.T_WHILE, condition, body, null);
}

function funStatement(): ASTNode {
  const { token } = globalData;
  match(tokenTypes.T_FUN, "function");
  const funName = token.value;
  match(tokenTypes.T_IDENT, "identifier");
  token.type = tokenTypes.T_ARGUMENT;
  const left = statement();
  rightPt();
  leftBrace();
  const funBody = statement();
  rightBrace();
  return new ASTNode().initTwoNode(ASTNodeTypes.T_FUN, left, funBody, funName);
}

function returnStatement(): ASTNode {
  match(tokenTypes.T_RETURN, "return");
  const returnTree = parseExpression(0);
  semicolon();
  return new ASTNode().initUnaryNode(ASTNodeTypes.T_RETURN, returnTree, null);
}

function normalStatement() {
  const tree = parseExpression(0);
  semicolon();
  return tree;
}

function statement(): ASTNode | null {
  let tree: ASTNode | null = null;
  let left: ASTNode | null = null;
  while (
    ![tokenTypes.T_EOF, tokenTypes.T_RBR, tokenTypes.T_RPT].includes(
      globalData.token.type
    )
  ) {
    const { token } = globalData;
    switch (token.type) {
      case tokenTypes.T_VAR:
      case tokenTypes.T_ARGUMENT:
        left = varDeclaration();
        break;
      case tokenTypes.T_IF:
        left = ifStatement();
        break;
      case tokenTypes.T_WHILE:
        left = whileStatement();
        break;
      case tokenTypes.T_FUN:
        left = funStatement();
        break;
      case tokenTypes.T_RETURN:
        left = returnStatement();
        break;
      case tokenTypes.T_EOF:
      case tokenTypes.T_RBR:
      case tokenTypes.T_RPT:
        break;
      default:
        if (prefixParserMap[token.type]) {
          left = normalStatement();
        } else {
          errPrint(`unknown Syntax:${token.type} , at ${globalData.line} line`);
        }
    }
    if (left !== null) {
      if (tree === null) {
        tree = left;
      } else {
        tree = new ASTNode().initTwoNode(ASTNodeTypes.T_GLUE, tree, left, null);
      }
    }
  }
  return tree;
}

export { statement };

import { globalData, tokenTypes, ASTNodeTypes } from "./token";
import { printError } from "../init/commons";
import {
  match,
  scan,
  matchLeftCurlyBracket,
  matchRightCurlyBracket,
  matchLeftBracket,
  matchRightBracket,
  matchSemicolon,
} from "./scanner";
import { parseExpression, prefixParserMap } from "./expression";
import { ASTNode } from "./ASTNode";

function varDeclaration() {
  const { token } = globalData;
  let tree = null;
  let left = null;
  let lastTokenValue;
  const type =
    token.type === tokenTypes.T_ARGUMENT
      ? ASTNodeTypes.T_ARGUMENT
      : ASTNodeTypes.T_VAR;
  let index = 0;
  scan();
  do {
    if (token.type === tokenTypes.T_IDENTIFIER) {
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
      if (token.type === tokenTypes.T_SEMICOLON) {
        break;
      }
    } else {
      printError(`unknown error : token type: ${token.type}`);
    }
  } while (token.type === tokenTypes.T_COMMA && scan());

  if (token.type === tokenTypes.T_ASSIGN) {
    scan();
    const right = new ASTNode().initLeafNode(
      ASTNodeTypes.T_LEFT_VALUE,
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
  if (token.type === tokenTypes.T_SEMICOLON) {
    matchSemicolon();
  }
  return tree;
}

function ifStatement(): ASTNode {
  const { token } = globalData;
  let condition: ASTNode | null = null;
  let trueBody: ASTNode | null = null;
  let falseBody: ASTNode | null = null;
  match(tokenTypes.T_IF, "if");
  matchLeftBracket();
  condition = parseExpression(0);
  matchRightBracket();
  matchLeftCurlyBracket();
  trueBody = statement();
  matchRightCurlyBracket();
  if (token.type === tokenTypes.T_ELSE) {
    scan();
    matchLeftCurlyBracket();
    falseBody = statement();
    matchRightCurlyBracket();
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
  matchLeftBracket();
  condition = parseExpression(0);
  matchRightBracket();
  matchLeftCurlyBracket();
  body = statement();
  matchRightCurlyBracket();
  return new ASTNode().initTwoNode(ASTNodeTypes.T_WHILE, condition, body, null);
}

function functionStatement(): ASTNode {
  const { token } = globalData;
  match(tokenTypes.T_FUNCTION, "function");
  const funName = token.value;
  match(tokenTypes.T_IDENTIFIER, "identifier");
  token.type = tokenTypes.T_ARGUMENT;
  const left = statement();
  matchRightBracket();
  matchLeftCurlyBracket();
  const funBody = statement();
  matchRightCurlyBracket();
  return new ASTNode().initTwoNode(ASTNodeTypes.T_FUNCTION, left, funBody, funName);
}

function returnStatement(): ASTNode {
  match(tokenTypes.T_RETURN, "return");
  const returnTree = parseExpression(0);
  matchSemicolon();
  return new ASTNode().initUnaryNode(ASTNodeTypes.T_RETURN, returnTree, null);
}

function normalStatement() {
  const tree = parseExpression(0);
  matchSemicolon();
  return tree;
}

function statement(): ASTNode | null {
  let tree: ASTNode | null = null;
  let left: ASTNode | null = null;
  while (
    ![tokenTypes.T_EOF, tokenTypes.T_RIGHT_CURLY_BRACKET, tokenTypes.T_RIGHT_BRACKET].includes(
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
      case tokenTypes.T_FUNCTION:
        left = functionStatement();
        break;
      case tokenTypes.T_RETURN:
        left = returnStatement();
        break;
      case tokenTypes.T_EOF:
      case tokenTypes.T_RIGHT_CURLY_BRACKET:
      case tokenTypes.T_RIGHT_BRACKET:
        break;
      default:
        if (prefixParserMap[token.type]) {
          left = normalStatement();
        } else {
          printError(`unknown Syntax:${token.type} , at ${globalData.line} line`);
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

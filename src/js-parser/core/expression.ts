import { globalData, tokenTypes, precedenceList, ASTNodeTypes } from "./token";
import { printError } from "../init/commons";
import { match, scan, setNextToken } from "./scanner";
import { ASTNode } from "./ASTNode";

const prefixParserMap: Record<string, () => ASTNode> = {
  [tokenTypes.T_IDENTIFIER]: identifierHandler,
  [tokenTypes.INTEGER]: numberHandler,
  [tokenTypes.T_STRING]: stringHandler,
  [tokenTypes.T_LEFT_BRACKET]: groupHandler,
  [tokenTypes.T_LEFT_SQUARE_BRACKET]: arrayHandler,
  [tokenTypes.T_ADD]: prefixHandler.bind(null, tokenTypes.T_ADD),
  [tokenTypes.T_SUB]: prefixHandler.bind(null, tokenTypes.T_SUB),
};

type ParserType = {
  parser: (...rest: any[]) => ASTNode;
  precedence: number;
};

const infixParserMap: Record<string, ParserType> = {
  [tokenTypes.T_LEFT_BRACKET]: { parser: funCallHandler, precedence: precedenceList.call },
  [tokenTypes.TERNARY_EXPRESSION]: {
    parser: conditionHandler,
    precedence: precedenceList.condition,
  },

  [tokenTypes.T_ASSIGN]: { parser: assignHandler, precedence: precedenceList.assign },

  [tokenTypes.T_AND]: {
    parser: infixHandler.bind(null, precedenceList.and),
    precedence: precedenceList.and,
  },
  [tokenTypes.T_OR]: {
    parser: infixHandler.bind(null, precedenceList.and),
    precedence: precedenceList.and,
  },
  [tokenTypes.T_ADD]: {
    parser: infixHandler.bind(null, precedenceList.sum),
    precedence: precedenceList.sum,
  },
  [tokenTypes.T_SUB]: {
    parser: infixHandler.bind(null, precedenceList.sum),
    precedence: precedenceList.sum,
  },
  [tokenTypes.T_MUL]: {
    parser: infixHandler.bind(null, precedenceList.product),
    precedence: precedenceList.product,
  },
  [tokenTypes.T_DIV]: {
    parser: infixHandler.bind(null, precedenceList.product),
    precedence: precedenceList.product,
  },

  [tokenTypes.T_GT]: {
    parser: infixHandler.bind(null, precedenceList.compare),
    precedence: precedenceList.compare,
  },
  [tokenTypes.T_GE]: {
    parser: infixHandler.bind(null, precedenceList.compare),
    precedence: precedenceList.compare,
  },
  [tokenTypes.T_LT]: {
    parser: infixHandler.bind(null, precedenceList.compare),
    precedence: precedenceList.compare,
  },
  [tokenTypes.T_LE]: {
    parser: infixHandler.bind(null, precedenceList.compare),
    precedence: precedenceList.compare,
  },
  [tokenTypes.T_EQUAL]: {
    parser: infixHandler.bind(null, precedenceList.compare),
    precedence: precedenceList.compare,
  },
  [tokenTypes.T_NOT_EQUAL]: {
    parser: infixHandler.bind(null, precedenceList.compare),
    precedence: precedenceList.compare,
  },
};

function getPrecedence() {
  const { token } = globalData;
  const infix = infixParserMap[token.type];
  return infix.precedence;
}

function parseExpression(precedenceValue = 0): ASTNode {
  const { token } = globalData;

  const prefixParser = prefixParserMap[token.type];

  if (!prefixParser) {
    printError(`unknown token : ${token.value}（${token.type}）`);
  }

  let left = prefixParser();
  scan();
  if (
    token.type === tokenTypes.T_SEMICOLON ||
    token.type === tokenTypes.T_RIGHT_BRACKET ||
    token.type === tokenTypes.T_EOF ||
    token.type === tokenTypes.T_COMMA ||
    token.type === tokenTypes.COLON ||
    token.type === tokenTypes.T_RIGHT_SQUARE_BRACKET
  ) {
    return left;
  }
  let value = getPrecedence();
  while (value > precedenceValue) {
    const { token } = globalData;
    const type = token.type;
    if (
      token.type === tokenTypes.T_SEMICOLON ||
      token.type === tokenTypes.T_RIGHT_BRACKET ||
      token.type === tokenTypes.T_EOF ||
      token.type === tokenTypes.T_COMMA ||
      token.type === tokenTypes.T_RIGHT_SQUARE_BRACKET
    ) {
      return left;
    }
    const infix = infixParserMap[type];
    scan();
    left = infix.parser(left, type);

    if (infixParserMap[token.type]) {
      value = getPrecedence();
    }
  }

  return left;
}

function identifierHandler(): ASTNode {
  const { token } = globalData;
  const indent = new ASTNode().initLeafNode(ASTNodeTypes.T_IDENTIFIER, token.value);
  scan();
  if (token.type === tokenTypes.T_LEFT_SQUARE_BRACKET) {
    scan();
    const left = parseExpression(0);
    indent.op = ASTNodeTypes.T_VISIT;
    indent.left = left;
    return indent;
  }
  setNextToken(token);
  return indent;
}

function numberHandler(): ASTNode {
  const { token } = globalData;
  return new ASTNode().initLeafNode(ASTNodeTypes.INTEGER, token.value);
}

function stringHandler(): ASTNode {
  const { token } = globalData;
  return new ASTNode().initLeafNode(ASTNodeTypes.T_STRING, token.value);
}

function assignHandler(left: ASTNode): ASTNode {
  const right = parseExpression(0);
  left = new ASTNode().initUnaryNode(ASTNodeTypes.T_LEFT_VALUE, left, left.value);
  return new ASTNode().initTwoNode(ASTNodeTypes.T_ASSIGN, right, left, null);
}

function conditionHandler(left: ASTNode): ASTNode {
  const trueBody = parseExpression(0);
  match(tokenTypes.COLON, ":");
  const falseBody = parseExpression(precedenceList.condition - 1);
  return new ASTNode().initThreeNode(
    ASTNodeTypes.T_IF,
    left,
    trueBody,
    falseBody,
    null
  );
}

function groupHandler(): ASTNode {
  scan();
  return parseExpression(0);
}

function funCallHandler(left: ASTNode): ASTNode {
  const { token } = globalData;
  const args: any[] = [];
  const astNode = new ASTNode().initLeafNode(ASTNodeTypes.T_FUNCTION_ARGUMENTS, args);

  while (token.type !== tokenTypes.T_RIGHT_BRACKET) {
    const tree = parseExpression(0);
    args.push(tree);

    if (token.type !== tokenTypes.T_COMMA && token.type !== tokenTypes.T_RIGHT_BRACKET) {
      printError(`unknown Syntax token : ${token.type} : value : ${token.value}`);
    }
    if (token.type === tokenTypes.T_RIGHT_BRACKET) {
      scan();
      break;
    } else {
      scan();
    }
  }
  if (token.type === tokenTypes.T_RIGHT_BRACKET) {
    scan();
  }
  return new ASTNode().initUnaryNode(
    ASTNodeTypes.T_FUNCTION_CALL,
    astNode,
    left.value
  );
}

function prefixHandler(type: string): ASTNode {
  scan();
  const right = parseExpression(precedenceList.prefix);
  setNextToken(globalData.token);
  return new ASTNode().initUnaryNode(type, right, null);
}

function infixHandler(precedence: number, left: ASTNode, type: string): ASTNode {
  const right = parseExpression(precedence);
  return new ASTNode().initTwoNode(type, left, right, null);
}

function arrayHandler(): ASTNode {
  const { token } = globalData;
  scan();
  const arr = [];
  do {
    if (token.type === tokenTypes.T_RIGHT_SQUARE_BRACKET) {
      scan();
      break;
    }
    const exp = parseExpression() || undefined;
    arr.push(exp);
  } while (token.type === tokenTypes.T_COMMA && scan());
  return new ASTNode().initLeafNode(ASTNodeTypes.T_ARRAY, arr);
}

export { parseExpression, prefixParserMap };

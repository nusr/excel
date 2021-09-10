// https://www.engr.mun.ca/~theo/Misc/exp_parsing.htm
import {
  createStack,
  Operator,
  SENTINEL,
  CreateStackResult,
} from "./shunting-yard";
import { tokenStream, StreamResult } from "./token-stream";
import * as builder from "./node-builder";
import type { Token, Node, RefTypes } from "../type";

export function parser(tokens: Token[]): Node {
  const stream = tokenStream(tokens);
  const shuntingYard = createStack();

  parseExpression(stream, shuntingYard);

  const retVal = shuntingYard.operands.top();
  if (!retVal) {
    throw new Error("Syntax error");
  }
  return retVal;
}

function parseExpression(
  stream: StreamResult,
  shuntingYard: CreateStackResult
) {
  parseOperandExpression(stream, shuntingYard);

  let pos;
  while (true) {
    if (!stream.nextIsBinaryOperator()) {
      break;
    }
    if (pos === stream.pos()) {
      throw new Error("Invalid syntax!");
    }
    pos = stream.pos();
    pushOperator(createBinaryOperator(stream.getNext().value), shuntingYard);
    stream.consume();
    parseOperandExpression(stream, shuntingYard);
  }

  while (shuntingYard.operators.top() !== SENTINEL) {
    popOperator(shuntingYard);
  }
}

function parseOperandExpression(
  stream: StreamResult,
  shuntingYard: CreateStackResult
) {
  if (stream.nextIsTerminal()) {
    shuntingYard.operands.push(parseTerminal(stream));
    // parseTerminal already consumes once so don't need to consume on line below
    // stream.consume()
  } else if (stream.nextIsOpenParen()) {
    stream.consume(); // open paren
    withinSentinel(shuntingYard, function () {
      parseExpression(stream, shuntingYard);
    });
    stream.consume(); // close paren
  } else if (stream.nextIsPrefixOperator()) {
    const unaryOperator = createUnaryOperator(stream.getNext().value);
    pushOperator(unaryOperator, shuntingYard);
    stream.consume();
    parseOperandExpression(stream, shuntingYard);
  } else if (stream.nextIsFunctionCall()) {
    parseFunctionCall(stream, shuntingYard);
  }
}

function parseFunctionCall(
  stream: StreamResult,
  shuntingYard: CreateStackResult
) {
  const name = stream.getNext().value;
  stream.consume(); // consume start of function call

  const args = parseFunctionArgList(stream, shuntingYard);
  shuntingYard.operands.push(builder.functionCall(name, args));

  stream.consume(); // consume end of function call
}

function parseFunctionArgList(
  stream: StreamResult,
  shuntingYard: CreateStackResult
) {
  const reverseArgs: Node[] = [];

  withinSentinel(shuntingYard, function () {
    let arity = 0;
    let pos;
    while (true) {
      if (stream.nextIsEndOfFunctionCall()) break;
      if (pos === stream.pos()) {
        throw new Error("Invalid syntax");
      }
      pos = stream.pos();
      parseExpression(stream, shuntingYard);
      arity += 1;

      if (stream.nextIsFunctionArgumentSeparator()) {
        stream.consume();
      }
    }

    for (let i = 0; i < arity; i++) {
      reverseArgs.push(shuntingYard.operands.pop());
    }
  });

  return reverseArgs.reverse();
}

function withinSentinel(shuntingYard: CreateStackResult, fn: () => void) {
  shuntingYard.operators.push(SENTINEL);
  fn();
  shuntingYard.operators.pop();
}

function pushOperator(operator: Operator, shuntingYard: CreateStackResult) {
  while (shuntingYard.operators.top().evaluatesBefore(operator)) {
    popOperator(shuntingYard);
  }
  shuntingYard.operators.push(operator);
}

function popOperator({ operators, operands }: CreateStackResult) {
  if (operators.top().isBinary()) {
    const right = operands.pop();
    const left = operands.pop();
    const operator = operators.pop();
    operands.push(builder.binaryExpression(operator.symbol, left, right));
  } else if (operators.top().isUnary()) {
    const operand = operands.pop();
    const operator = operators.pop();
    operands.push(builder.unaryExpression(operator.symbol, operand));
  }
}

function parseTerminal(stream: StreamResult) {
  if (stream.nextIsNumber()) {
    return parseNumber(stream);
  }

  if (stream.nextIsText()) {
    return parseText(stream);
  }

  if (stream.nextIsLogical()) {
    return parseLogical(stream);
  }

  if (stream.nextIsRange()) {
    return parseRange(stream);
  }
}

function parseRange(stream: StreamResult) {
  const next = stream.getNext();
  stream.consume();
  return createCellRange(next.value);
}

function createCellRange(value: string) {
  const parts = value.split(":");

  if (parts.length == 2) {
    return builder.cellRange(
      builder.cell(parts[0], cellRefType(parts[0])),
      builder.cell(parts[1], cellRefType(parts[1]))
    );
  } else {
    return builder.cell(value, cellRefType(value));
  }
}

function cellRefType(key: string): RefTypes {
  if (/^\$[A-Z]+\$\d+$/.test(key)) return "absolute";
  if (/^\$[A-Z]+$/.test(key)) return "absolute";
  if (/^\$\d+$/.test(key)) return "absolute";
  if (/^\$[A-Z]+\d+$/.test(key)) return "mixed";
  if (/^[A-Z]+\$\d+$/.test(key)) return "mixed";
  if (/^[A-Z]+\d+$/.test(key)) return "relative";
  if (/^\d+$/.test(key)) return "relative";
  if (/^[A-Z]+$/.test(key)) return "relative";
  throw new Error("not found cell ref type");
}

function parseText(stream: StreamResult) {
  const next = stream.getNext();
  stream.consume();
  return builder.stringLiteral(next.value);
}

function parseLogical(stream: StreamResult) {
  const next = stream.getNext();
  stream.consume();
  return builder.booleanLiteral(next.value === "TRUE");
}

function parseNumber(stream: StreamResult) {
  let value = Number(stream.getNext().value);
  stream.consume();

  if (stream.nextIsPostfixOperator()) {
    value *= 0.01;
    stream.consume();
  }

  return builder.numberLiteral(value);
}

function createUnaryOperator(symbol: string) {
  const precedence = {
    // negation
    "-": 7,
  }[symbol];

  return new Operator(symbol, precedence, 1, true);
}

function createBinaryOperator(symbol: string) {
  const precedence = {
    // cell range union and intersect
    " ": 8,
    ",": 8,
    // raise to power
    "^": 5,
    // multiply, divide
    "*": 4,
    "/": 4,
    // add, subtract
    "+": 3,
    "-": 3,
    // string concat
    "&": 2,
    // comparison
    "=": 1,
    "<>": 1,
    "<=": 1,
    ">=": 1,
    ">": 1,
    "<": 1,
  }[symbol];

  return new Operator(symbol, precedence, 2, true);
}

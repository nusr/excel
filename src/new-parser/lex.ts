const OperatorMap = {
  equal: {
    value: "=",
    priority: 1,
  },
  notEqual: {
    value: "<>",
    priority: 1,
  },
  greaterThan: {
    value: "<",
    priority: 1,
  },
  greaterThanOrEqual: {
    value: "<=",
    priority: 1,
  },
  lessThan: {
    value: ">",
    priority: 1,
  },
  lessThanOrEqual: {
    value: ">=",
    priority: 1,
  },
  concatenation: {
    value: "&",
    priority: 2,
  },
  plus: {
    value: "+",
    priority: 3,
  },
  minus: {
    value: "-",
    priority: 3,
  },
  multi: {
    value: "*",
    priority: 4,
  },
  div: {
    value: "/",
    priority: 4,
  },
  exponent: {
    value: "^",
    priority: 5,
  },
  percent: {
    value: "%",
    priority: 6,
  },
  unaryPlus: {
    value: "+",
    priority: 7,
  },
  unaryMinus: {
    value: "-",
    priority: 7,
  },
  range: {
    value: ":",
    priority: 8,
  },
  rangeUnion: {
    value: ",",
    priority: 8,
  },
  rangeIntersection: {
    value: " ",
    priority: 8,
  },
};

type DataType =
  | "boolean"
  | "number"
  | "string"
  | "Date"
  | "time"
  | "dateTIme"
  | "date"
  | "error"
  | "formula";

type ReferenceType = "cell" | "column" | "sheet";

type ETokenType =
  | keyof typeof OperatorMap
  | ReferenceType
  | DataType
  | "rightParen"
  | "leftParen"
  | "comma"
  | "colon"
  | "whiteSpace";

class Token {
  type: ETokenType;
  text: string;
  constructor(text: string, type: ETokenType) {
    this.text = text;
    this.type = type;
  }
}

function isWhiteSpace(char: string): boolean {
  return char === " " || char === "\t" || char === "\n" || char === "\r";
}

function isNumber(char: string): boolean {
  return char >= "0" && char <= "9";
}

function isCharacter(char: string): boolean {
  return (char >= "a" && char <= "z") || (char >= "A" && char <= "Z");
}

export function lex(input: string): Token[] {
  let current = 0;
  const tokens: Token[] = [];
  while (current < input.length) {
    let char = input[current];
    if (isWhiteSpace(char)) {
      let value = "";
      while (isWhiteSpace(char)) {
        value += char;
        char = input[++current];
      }
      tokens.push(new Token(value, "whiteSpace"));
      continue;
    }
    if (char === ")") {
      tokens.push(new Token(")", "rightParen"));
      current += 1;
      continue;
    }
    if (char === "(") {
      tokens.push(new Token("(", "leftParen"));
      current += 1;
      continue;
    }
    if (char === ",") {
      tokens.push(new Token(",", "comma"));
      current += 1;
      continue;
    }
    if (char === ":") {
      tokens.push(new Token(":", "colon"));
      current += 1;
      continue;
    }
    if (char === "+") {
      tokens.push(new Token("+", "plus"));
      current += 1;
      continue;
    }

    if (char === "-") {
      tokens.push(new Token("-", "minus"));
      current += 1;
      continue;
    }
    if (char === "/") {
      tokens.push(new Token("/", "div"));
      current += 1;
      continue;
    }
    if (char === "*") {
      tokens.push(new Token("*", "multi"));
      current += 1;
      continue;
    }
    if (char === "^") {
      tokens.push(new Token("^", "exponent"));
      current += 1;
      continue;
    }
    if (char === ">") {
      const temp = input[++current];
      if (temp === "=") {
        tokens.push(new Token(">=", "lessThanOrEqual"));
        current += 1;
      } else {
        tokens.push(new Token(">", "lessThan"));
      }
      continue;
    }
    if (char === "<") {
      const temp = input[++current];
      if (temp === "=") {
        current += 1;
        tokens.push(new Token("<=", "greaterThanOrEqual"));
      } else if (temp === ">") {
        current += 1;
        tokens.push(new Token("<>", "notEqual"));
      } else {
        tokens.push(new Token("<", "greaterThan"));
      }
      continue;
    }
    if (char === "=") {
      tokens.push(new Token("=", "equal"));
      current += 1;
      continue;
    }
    if (isNumber(char)) {
      let value = "";
      while (isNumber(char)) {
        value += char;
        char = input[++current];
      }
      tokens.push(new Token(value, "number"));
      continue;
    }
    if (isCharacter(char)) {
      let value = "";
      while (isCharacter(char) || isNumber(char)) {
        value += char;
        char = input[++current];
      }
      if (char === "(") {
        tokens.push(new Token(value + "(", "formula"));
        current += 1;
        continue;
      } else if (char === "!") {
        tokens.push(new Token(value + "!", "sheet"));
        current += 1;
        continue;
      }
      if (/[$]?[A-Za-z]{1,3}[$]?[1-9][0-9]*/.test(value)) {
        tokens.push(new Token(value, "cell"));
      } else if (/[$]?[A-Za-z]{1,3}/.test(value)) {
        tokens.push(new Token(value, "column"));
      } else if (value.toLowerCase() === "true") {
        tokens.push(new Token("TRUE", "boolean"));
      } else if (value.toLowerCase() === "false") {
        tokens.push(new Token("FALSE", "boolean"));
      } else {
        tokens.push(new Token(value, "string"));
      }
      continue;
    }
  }
  return tokens;
}

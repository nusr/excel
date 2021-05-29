const IDENTIFIER_REG = /[a-z]|[A-Z]|_|\$/;
function validIdentifier(char: string): boolean {
  return IDENTIFIER_REG.test(char);
}

function isNumber(char: string): boolean {
  return char >= "0" && char <= "9";
}

function isBlankChar(value: string): boolean {
  return value === " " || value === "\r\n" || value === "\n" || value === "\r";
}

export { validIdentifier, isNumber, isBlankChar };

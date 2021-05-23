const reg = /[a-z]|[A-Z]|_|\$/;
function validVar(char: string): boolean {
  return reg.test(char);
}

function validNumber(char: string): boolean {
  const reg = /[0-9]/;
  return reg.test(char);
}

function validBlank(value: string): boolean {
  if (
    value !== " " &&
    value.indexOf("\r\n") === -1 &&
    value.indexOf("\n") === -1 &&
    value.indexOf("\r") === -1
  ) {
    return false;
  } else {
    return true;
  }
}

export { validVar, validNumber, validBlank };

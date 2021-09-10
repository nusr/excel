export default {
  "en-US": {
    // value for true
    true: "TRUE",
    // value for false
    false: "FALSE",
    // separates function arguments
    argumentSeparator: ",",
    // decimal point in numbers
    decimalSeparator: ".",
    // returns number string that can be parsed by Number()
    reformatNumberForJsParsing: (n: string): string => {
      return n;
    },
    isScientificNotation: (token: string): boolean => {
      return /^[1-9]{1}(\.[0-9]+)?E{1}$/.test(token);
    },
  },
  "de-DE": {
    true: "WAHR",
    false: "FALSCH",
    argumentSeparator: ";",
    decimalSeparator: ",",
    reformatNumberForJsParsing: (n: string): string => {
      return n.replace(",", ".");
    },
    isScientificNotation: (token: string): boolean => {
      return /^[1-9]{1}(,[0-9]+)?E{1}$/.test(token);
    },
  },
};

import { itBlock } from "./test-helper";

describe("define name expression", function () {
  [["foo", [["foo", "operand", "define-name"]]]].forEach(itBlock);
});

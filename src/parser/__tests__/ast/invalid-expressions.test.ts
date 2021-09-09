import { generateAST as buildTree } from "../../ast";
import { tokenize } from "../../tokenize";

describe("invalid expressions", function () {
  it("SUM(", function () {
    expect(function () {
      buildTree(tokenize("SUM("));
    }).toThrow();
  });
  it("+", function () {
    expect(function () {
      buildTree(tokenize("+"));
    }).toThrow();
  });
  it("SUM(,,", function () {
    expect(function () {
      buildTree(tokenize("SUM(,,"));
    }).toThrow();
  });
  it(">", function () {
    expect(function () {
      buildTree(tokenize(">"));
    }).toThrow();
  });
  it("a >", function () {
    expect(function () {
      buildTree(tokenize("a >"));
    }).toThrow();
  });
  it("> b", function () {
    expect(function () {
      buildTree(tokenize("> b"));
    }).toThrow();
  });
});

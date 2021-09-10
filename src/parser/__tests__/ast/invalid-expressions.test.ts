import { parser as buildTree } from "../../ast";
import { tokenizer } from "../../tokenize";

describe("invalid expressions", function () {
  it("SUM(", function () {
    expect(function () {
      buildTree(tokenizer("SUM("));
    }).toThrow();
  });
  it("+", function () {
    expect(function () {
      buildTree(tokenizer("+"));
    }).toThrow();
  });
  it("SUM(,,", function () {
    expect(function () {
      buildTree(tokenizer("SUM(,,"));
    }).toThrow();
  });
  it(">", function () {
    expect(function () {
      buildTree(tokenizer(">"));
    }).toThrow();
  });
  it("a >", function () {
    expect(function () {
      buildTree(tokenizer("a >"));
    }).toThrow();
  });
  it("> b", function () {
    expect(function () {
      buildTree(tokenizer("> b"));
    }).toThrow();
  });
});

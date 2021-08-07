import { jsParser, buildInMethodHandler } from "../";
import fs from "fs";
import path from "path";

const outputList = [
  [585, 1178, undefined],
  [false],
  [15],
  [20],
  [-5.5, 2],
  [6],
  [2],
  [0],
  [7, 7, 3],
  ['hi,"ss"~8'],
  [7],
  [[-2, 1, 2, 3, 5, 6, 9]],
];
describe("parser.test.ts", () => {
  describe("jsParser", () => {
    const assert = (i: number) => {
      buildInMethodHandler.register("log", (...result: unknown[]): void => {
        expect(result).toEqual(outputList[i]);
      });
    };
    for (let i = 0; i < outputList.length; i++) {
      const file = `${i + 1}`;
      it(`test${file}`, () => {
        const filePath = path.resolve(__dirname, "data", `${file}.js`);
        const fileData = fs.readFileSync(filePath).toString();
        assert(i);
        jsParser(fileData);
      });
    }
  });
});

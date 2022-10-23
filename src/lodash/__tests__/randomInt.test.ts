import { randomInt } from "../randomInt";

function checkResult(min: number, max: number): boolean {
  if (min < max) {
    const temp = randomInt(min, max);
    return temp >= min && temp <= max;
  } else {
    const temp = randomInt(min, max);
    return temp >= max && temp <= min;
  }
}

describe("randomInt.test.ts", () => {
  describe("randomInt", () => {
    it("should between [3, 22]", function () {
      expect(checkResult(0, 22)).toBeTruthy();
    });
    it("should between [-22, -10]", function () {
      expect(checkResult(-22, -10)).toBeTruthy();
    });
    it("should between [-22, 63]", function () {
      expect(checkResult(-22, 63)).toBeTruthy();
    });
  });
});

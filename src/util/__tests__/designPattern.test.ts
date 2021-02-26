import { singletonPattern } from "../designPattern";

class MockClass {
  static count = 0;
  constructor() {
    MockClass.count += 1;
  }
}
describe("designPattern.test.ts", () => {
  describe("singletonPattern", () => {
    it("should init once", function () {
      const testFunc = singletonPattern(MockClass);
      testFunc();
      testFunc();
      expect(MockClass.count).toEqual(1);
    });
  });
});

import { makeFont } from "../style";

describe("style.test.ts", () => {
  describe("makeFont", () => {
    it("should get normal normal 12px Source Sans Pro,sans-serif", function () {
      expect(makeFont()).toEqual(
        "normal normal 12px Source Sans Pro,sans-serif"
      );
    });
    it("should get normal normal 12px Source Sans Pro,sans-serif", function () {
      expect(makeFont("italic", "bold", 14, "simsun")).toEqual(
        "italic bold 14px simsun,sans-serif"
      );
    });
  });
});

import { dpr, npx, thinLineWidth, npxLine } from "../dpr";

describe("dpr.test.ts", () => {
  describe("0.5 dpr", () => {
    beforeAll(() => {
      Object.defineProperty(window, "devicePixelRatio", {
        writable: true,
        value: 0.5,
      });
    });
    describe("dpr", () => {
      it("should get 1", function () {
        expect(dpr()).toEqual(1);
      });
    });
    describe("npx", () => {
      it("should convert 1 to 1", function () {
        expect(npx(1)).toEqual(1);
      });
    });
    describe("thinLineWidth", () => {
      it("should convert 0.5", function () {
        expect(thinLineWidth()).toEqual(0.5);
      });
    });
    describe("npxLine", () => {
      it("should convert 1 to 0.5", function () {
        expect(npxLine(1)).toEqual(0.5);
      });
    });
  });

  describe("1 dpr", () => {
    beforeAll(() => {
      Object.defineProperty(window, "devicePixelRatio", {
        writable: true,
        value: 1,
      });
    });
    describe("dpr", () => {
      it("should get 1", function () {
        expect(dpr()).toEqual(1);
      });
    });
    describe("npx", () => {
      it("should convert 1 to 1", function () {
        expect(npx(1)).toEqual(1);
      });
    });
    describe("thinLineWidth", () => {
      it("should convert 0.5", function () {
        expect(thinLineWidth()).toEqual(0.5);
      });
    });
    describe("npxLine", () => {
      it("should convert 1 to 0.5", function () {
        expect(npxLine(1)).toEqual(0.5);
      });
    });
  });

  describe("2.5 dpr", () => {
    beforeAll(() => {
      Object.defineProperty(window, "devicePixelRatio", {
        writable: true,
        value: 2.5,
      });
    });
    describe("dpr", () => {
      it("should get 2", function () {
        expect(dpr()).toEqual(2);
      });
    });
    describe("npx", () => {
      it("should convert 1 to 1", function () {
        expect(npx(1)).toEqual(2);
      });
    });
    describe("thinLineWidth", () => {
      it("should get 1.5", function () {
        expect(thinLineWidth()).toEqual(1.5);
      });
    });
    describe("npxLine", () => {
      it("should convert 1 to 0.5", function () {
        expect(npxLine(1)).toEqual(1.5);
      });
    });
  });
});

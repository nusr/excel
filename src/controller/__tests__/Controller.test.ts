import { Controller } from "../Controller";

describe.skip("Controller.test.ts", () => {
  describe("Controller", () => {
    const controller = new Controller();
    it("can not redo", function () {
      expect(controller.canRedo()).toBeFalsy();
    });
    it("should add sheet", function () {
      expect(controller.model.workbook).toHaveLength(1);
    });
    it("should set value '1'", function () {
      controller.setCellValue("1");
      expect(controller.queryActiveCellInfo().value).toEqual(1);
    });
    it("should set style", function () {
      const style = {
        fontColor: "red",
        fillColor: "green",
        fontSize: 12,
        fontFamily: "simsun",
        verticalAlign: 1,
        horizontalAlign: 1,
        wrapText: 1,
        format: "test",
        isUnderline: true,
        isItalic: true,
        isBold: true,
        isCrossOut: true,
      };
      controller.setCellStyle(style);
      expect(controller.queryActiveCellInfo().style).toEqual(style);
    });
    it("can undo", function () {
      expect(controller.canUndo()).toBeTruthy();
    });
  });
});

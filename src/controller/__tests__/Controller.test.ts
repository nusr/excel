import { Controller } from "../Controller";

describe("Controller.test.ts", () => {
  describe("Controller", () => {
    const controller = new Controller();
    it("can not redo", function () {
      expect(controller.canRedo()).toBeFalsy();
    });
    it("should add sheet", function () {
      expect(controller.model.workbook).toHaveLength(1);
    });
    it("should set value '1'", function () {
      const data = {
        row: 2,
        col: 3,
      };
      controller.setCellValue(data, "1");
      const temp = controller.queryCell(data);
      expect(temp.value).toEqual("1");
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
      const data = controller.queryCell(controller.queryActiveCell());
      expect(data.style).toEqual({ ...style });
    });
    it("can undo", function () {
      expect(controller.canUndo()).toBeTruthy();
    });
  });
});

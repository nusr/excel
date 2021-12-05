import { assert, dpr, isCol, isRow, isSheet, canvasLog } from "@/util";
import type { Controller } from "@/controller";
import { Content } from "./Content";
import { CanvasOverlayPosition, EventType } from "@/types";
import theme from "@/theme";
import { Selection } from "./Selection";
import { strokeRect, resizeCanvas } from "./util";

export class Main {
  protected canvas: HTMLCanvasElement;
  protected ctx: CanvasRenderingContext2D;
  protected controller: Controller;
  protected content: Content;
  protected selection: Selection;
  protected isRendering = false;
  constructor(controller: Controller, canvas: HTMLCanvasElement) {
    this.controller = controller;
    this.canvas = canvas;
    const ctx = canvas.getContext("2d");
    assert(!!ctx);
    this.ctx = ctx;
    const size = dpr();
    this.ctx.scale(size, size);
    this.content = new Content({
      controller,
      name: "Content",
    });
    this.selection = new Selection({
      controller,
      name: "Selection",
    });
    const checkChange = (params: EventType["change"]) => {
      this.render(params);
      if (this.controller.renderController?.isChanged) {
        this.render({ changeSet: new Set(["contentChange", "selectionChange"]) });
      }
    };
    this.controller.on("change", checkChange);
    checkChange({ changeSet: new Set(["contentChange"]) });
  }

  getSelection(
    activeCell: CanvasOverlayPosition
  ): CanvasOverlayPosition | null {
    const { controller } = this;
    const { ranges, renderController } = controller;
    const [range] = ranges;
    if (
      (range.rowCount === range.colCount && range.rowCount === 1) ||
      !renderController
    ) {
      return null;
    }
    const drawSize = renderController.getDrawSize();
    if (isSheet(range)) {
      return {
        ...drawSize,
        left: activeCell.left,
        top: activeCell.top,
      };
    }
    if (isCol(range)) {
      const width = renderController.getColWidth(range.col);
      return {
        left: activeCell.left,
        top: activeCell.top,
        width: width,
        height: drawSize.height,
      };
    }
    if (isRow(range)) {
      const height = renderController.getRowHeight(range.row);
      return {
        left: activeCell.left,
        top: activeCell.top,
        width: drawSize.width,
        height,
      };
    }

    const endCellRow = range.row + range.rowCount - 1;
    const endCellCol = range.col + range.colCount - 1;
    assert(endCellRow >= 0 && endCellCol >= 0);
    const endCell = renderController.queryCell(endCellRow, endCellCol);
    const width = endCell.left + endCell.width - activeCell.left;
    const height = endCell.top + endCell.height - activeCell.top;
    assert(width >= 0 && height >= 0);
    return {
      left: activeCell.left,
      top: activeCell.top,
      width: width,
      height: height,
    };
  }
  render = ({ changeSet }: EventType["change"]): void => {
    const { renderController } = this.controller;
    if (!renderController) {
      return;
    }
    renderController.isChanged = false;
    if (this.isRendering) {
      console.log("isRendering");
      return;
    }
    this.isRendering = true;
    const isContentChange = changeSet.has("contentChange");
    const { width, height } = renderController.getCanvasSize();
    resizeCanvas(this.canvas, width, height);
    if (isContentChange) {
      canvasLog("render content");
      this.content.render(width, height);
    }
    const [range] = this.controller.ranges;
    const activeCell = renderController.queryCell(range.row, range.col);
    const selectAll = this.getSelection(activeCell);

    this.selection.render(width, height, selectAll);
    canvasLog("render selection");
    this.ctx.drawImage(this.content.canvas, 0, 0);
    this.ctx.drawImage(this.selection.canvas, 0, 0);

    this.ctx.strokeStyle = theme.primaryColor;
    this.ctx.lineWidth = dpr();
    const line = selectAll ? selectAll : activeCell;
    strokeRect(this.ctx, line.left, line.top, line.width, line.height);
    this.isRendering = false;
  };
}

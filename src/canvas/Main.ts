import {
  assert,
  dpr,
  isCol,
  isRow,
  isSheet,
  canvasLog,
  DOUBLE_CLICK_TIME,
  isTestEnv,
} from '@/util';
import { Content } from './Content';
import { CanvasOverlayPosition, EventType, IController } from '@/types';
import theme from '@/theme';
import { Selection } from './Selection';
import { strokeRect, resizeCanvas } from './util';
import { RenderController } from './Controller';

export class MainCanvas {
  private lastTimeStamp = 0;
  private ctx: CanvasRenderingContext2D;
  private controller: IController;
  private canvas: HTMLCanvasElement;
  private content: Content;
  private selection: Selection;
  private renderController: RenderController;
  constructor(
    controller: IController,
    renderController: RenderController,
    canvas: HTMLCanvasElement,
    content: Content = new Content(controller, renderController, 'content'),
    selection: Selection = new Selection(
      controller,
      renderController,
      'selection',
    ),
  ) {
    this.controller = controller;
    this.renderController = renderController;
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    assert(!!ctx);
    this.ctx = ctx;
    const size = dpr();
    this.ctx.scale(size, size);
    this.content = content;
    this.selection = selection;
    this.checkChange({ changeSet: new Set(['contentChange']) });
  }
  queryCell(row: number, col: number): CanvasOverlayPosition {
    return this.renderController.queryCell(row, col);
  }
  checkChange = (params: EventType['change']) => {
    this.render(params);
    if (this.renderController.isChanged) {
      this.renderController.isChanged = false;
      this.render({
        changeSet: new Set(['contentChange', 'selectionChange']),
      });
    }
  };
  addEvents(): void {
    if (isTestEnv()) {
      return;
    }
    const { canvas } = this;
    canvas.addEventListener('mousedown', this.mouseDown);
    canvas.addEventListener('mousemove', this.mouseMove);
    canvas.addEventListener('mouseup', this.mouseUp);
    window.addEventListener('resize', this.resize);
  }
  removeEvents(): void {
    if (isTestEnv()) {
      return;
    }
    const { canvas } = this;
    canvas.removeEventListener('mousedown', this.mouseDown);
    canvas.removeEventListener('mousemove', this.mouseMove);
    canvas.removeEventListener('mouseup', this.mouseUp);
    window.removeEventListener('resize', this.resize);
  }
  mouseDown = (event: MouseEvent): void => {
    const canvasRect = this.canvas.getBoundingClientRect();
    const { timeStamp, clientX, clientY } = event;
    const { controller } = this;
    const { width, height } = this.renderController.getHeaderSize();
    const x = clientX - canvasRect.left;
    const y = clientY - canvasRect.top;
    const position = this.renderController.getHitInfo(event);
    if (width > x && height > y) {
      controller.selectAll(position.row, position.col);
      return;
    }
    if (width > x && height <= y) {
      controller.selectRow(position.row, position.col);
      return;
    }
    if (width <= x && height > y) {
      controller.selectCol(position.row, position.col);
      return;
    }
    const activeCell = controller.getActiveCell();
    const check =
      activeCell.row >= 0 &&
      activeCell.row === position.row &&
      activeCell.col === position.col;
    if (!check) {
      controller.quitEditing();
      controller.setActiveCell(position.row, position.col, 1, 1);
    }
    const delay = timeStamp - this.lastTimeStamp;
    // const checkDelay = delay < DOUBLE_CLICK_TIME;
    if (delay < DOUBLE_CLICK_TIME) {
      // interactionLog("mouseDown", check, checkDelay);
      controller.enterEditing();
    }
    this.lastTimeStamp = timeStamp;
  };
  mouseMove = (event: MouseEvent): void => {
    const rect = this.canvas.getBoundingClientRect();
    const { clientX, clientY } = event;
    const { controller } = this;
    const { width, height } = this.renderController.getHeaderSize();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const checkMove = x > width && y > height && event.buttons === 1;
    if (checkMove) {
      const position = this.renderController.getHitInfo(event);
      controller.updateSelection(position.row, position.col);
    }
  };
  mouseUp = (): void => {
    // console.log(event);
  };
  resize = (): void => {
    this.controller.windowResize();
  };

  getSelection(
    activeCell: CanvasOverlayPosition,
  ): CanvasOverlayPosition | null {
    const { controller } = this;
    const ranges = controller.getRanges();
    const [range] = ranges;
    if (range.rowCount === range.colCount && range.rowCount === 1) {
      return null;
    }
    const drawSize = this.renderController.getDrawSize();
    if (isSheet(range)) {
      return {
        ...drawSize,
        left: activeCell.left,
        top: activeCell.top,
      };
    }
    if (isCol(range)) {
      const width = this.renderController.getColWidth(range.col);
      return {
        left: activeCell.left,
        top: activeCell.top,
        width: width,
        height: drawSize.height,
      };
    }
    if (isRow(range)) {
      const height = this.renderController.getRowHeight(range.row);
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
    const endCell = this.renderController.queryCell(endCellRow, endCellCol);
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
  render = ({ changeSet }: EventType['change']): void => {
    if (this.renderController.isRendering) {
      console.log('isRendering');
      return;
    }
    this.renderController.isChanged = false;
    this.renderController.isRendering = true;
    const isContentChange = changeSet.has('contentChange');
    const { width, height } = this.renderController.getCanvasSize();
    resizeCanvas(this.canvas, width, height);
    if (isContentChange) {
      canvasLog('render content');
      this.content.render(width, height);
    }
    const [range] = this.controller.getRanges();
    const activeCell = this.renderController.queryCell(range.row, range.col);
    const selectAll = this.getSelection(activeCell);

    this.selection.render(width, height, selectAll);
    canvasLog('render selection');

    this.ctx.drawImage(this.content.canvas, 0, 0);
    this.ctx.drawImage(this.selection.canvas, 0, 0);

    this.ctx.strokeStyle = theme.primaryColor;
    this.ctx.lineWidth = dpr();
    const line = selectAll ? selectAll : activeCell;
    strokeRect(this.ctx, line.left, line.top, line.width, line.height);
    this.renderController.isRendering = false;
  };
}

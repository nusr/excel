import { MainCanvas, scrollSheetToView } from '../../../canvas';
import { initController } from '../../../controller';
import {
  EHorizontalAlign,
  EUnderLine,
  EVerticalAlign,
  type DrawingElement,
  type IController,
  type IRange,
} from '../../../types';
import { DEFAULT_FONT_SIZE, DEFAULT_FORMAT_CODE } from '../../../util';
import {
  useActiveCell,
  useCoreStore,
  useScrollStore,
  useStyleStore,
  useUserInfo,
} from '../../store';
import { initCanvas } from '../util';

vi.mock('../../../canvas', async (importOriginal) => ({
  ...await importOriginal<typeof import('../../../canvas')>(),
  scrollSheetToView: vi.fn(),
}));

vi.mock('../isSupportFontFamily', () => ({
  initFontFamilyList: () => [
    { label: 'Unavailable', value: 'Unavailable', disabled: true },
    { label: 'Default font', value: 'Default font' },
  ],
}));

describe('canvas state synchronization', () => {
  let controller: IController;
  let parent: HTMLDivElement;
  let canvas: HTMLCanvasElement;
  let cleanup: () => void;
  let width: number;
  let height: number;

  const range = (row = 0, col = 0): IRange => ({
    row,
    col,
    rowCount: 1,
    colCount: 1,
    sheetId: controller.getCurrentSheetId(),
  });

  const drawing = (overrides: Partial<DrawingElement> = {}): DrawingElement => ({
    uuid: 'picture',
    title: 'Picture',
    type: 'floating-picture',
    sheetId: controller.getCurrentSheetId(),
    fromRow: 0,
    fromCol: 0,
    marginX: 0,
    marginY: 0,
    width: 100,
    height: 100,
    originWidth: 100,
    originHeight: 100,
    imageSrc: 'data:image/png;base64,',
    ...overrides,
  });

  beforeEach(() => {
    useActiveCell.setState(useActiveCell.getInitialState(), true);
    useCoreStore.setState(useCoreStore.getInitialState(), true);
    useScrollStore.setState(useScrollStore.getInitialState(), true);
    useStyleStore.setState(useStyleStore.getInitialState(), true);
    useUserInfo.setState(useUserInfo.getInitialState(), true);
    vi.spyOn(MainCanvas.prototype, 'render').mockResolvedValue(undefined);
    vi.spyOn(MainCanvas.prototype, 'resize').mockImplementation(() => {});
    controller = initController();
    controller.addFirstSheet();
    parent = document.createElement('div');
    canvas = document.createElement('canvas');
    parent.appendChild(canvas);
    document.body.appendChild(parent);
    width = 320;
    height = 220;
    Object.defineProperties(parent, {
      clientWidth: { get: () => width },
      clientHeight: { get: () => height },
    });
    vi.spyOn(parent, 'getBoundingClientRect').mockReturnValue(
      new DOMRect(10, 20, width, height),
    );
    cleanup = () => {};
  });

  afterEach(() => {
    cleanup();
    controller.destroy();
    parent.remove();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  test('measures the canvas before the initial UI projection', () => {
    cleanup = initCanvas(controller, canvas);

    expect(useScrollStore.getState()).toMatchObject({
      canvasWidth: 300,
      canvasHeight: 200,
    });
    expect(useCoreStore.getState()).toMatchObject({
      currentSheetId: controller.getCurrentSheetId(),
      sheetList: controller.getSheetList().map((sheet) => ({
        sheetId: sheet.sheetId,
        name: sheet.name,
        isHide: sheet.isHide,
        tabColor: sheet.tabColor || '',
      })),
    });
    expect(useStyleStore.getState()).toMatchObject({
      fontFamily: 'Default font',
      horizontalAlign: EHorizontalAlign.LEFT,
      verticalAlign: EVerticalAlign.MIDDLE,
    });
  });

  test('updates the name box without resetting an in-progress edit', () => {
    cleanup = initCanvas(controller, canvas);
    useActiveCell.setState({ value: 'draft', displayValue: 'draft' });

    controller.setDefineName(range(), 'SelectedCell');
    expect(useActiveCell.getState()).toMatchObject({
      defineName: 'SelectedCell',
      value: 'draft',
      displayValue: 'draft',
    });
    expect(useCoreStore.getState().defineNames).toEqual(['SelectedCell']);

    controller.setDefineName(range(), 'RenamedCell');
    expect(useActiveCell.getState().defineName).toBe('RenamedCell');
    expect(useCoreStore.getState().defineNames).toEqual(['RenamedCell']);
  });

  test('resets formatting when selecting an unstyled cell', () => {
    controller.setCell([[42]], [[{
      isBold: true,
      isItalic: true,
      isStrike: true,
      underline: EUnderLine.DOUBLE,
      fillColor: '#ff0000',
      fontSize: 24,
      fontFamily: 'Custom font',
      horizontalAlign: EHorizontalAlign.CENTER,
      verticalAlign: EVerticalAlign.BOTTOM,
    }]], range());
    cleanup = initCanvas(controller, canvas);
    expect(useStyleStore.getState().isBold).toBe(true);

    controller.setActiveRange(range(0, 1));
    expect(useActiveCell.getState()).toMatchObject({ value: '', displayValue: '' });
    expect(useStyleStore.getState()).toMatchObject({
      isBold: false,
      isItalic: false,
      isStrike: false,
      underline: EUnderLine.NONE,
      fillColor: '',
      fontSize: DEFAULT_FONT_SIZE,
      fontFamily: 'Default font',
      numberFormat: DEFAULT_FORMAT_CODE,
      horizontalAlign: EHorizontalAlign.LEFT,
      verticalAlign: EVerticalAlign.MIDDLE,
    });
  });

  test.each([
    { value: 0, text: '0', align: EHorizontalAlign.RIGHT },
    { value: false, text: 'FALSE', align: EHorizontalAlign.LEFT },
    { value: true, text: 'TRUE', align: EHorizontalAlign.LEFT },
  ])('preserves $value when projecting cell content', ({ value, text, align }) => {
    controller.setCell([[value]], [], range());
    cleanup = initCanvas(controller, canvas);
    expect(useActiveCell.getState()).toMatchObject({
      value: text,
      displayValue: text,
    });
    expect(useStyleStore.getState().horizontalAlign).toBe(align);
  });

  test('keeps formula text instead of the calculated value', () => {
    controller.setWorksheet([{ ...range(), value: 3, formula: '=SUM(1,2)' }]);
    cleanup = initCanvas(controller, canvas);
    expect(useActiveCell.getState()).toMatchObject({
      value: '=SUM(1,2)',
      displayValue: '=SUM(1,2)',
    });
  });

  test('refreshes cell geometry on row/column changes and scrolling without resetting edits', () => {
    controller.setActiveRange(range(2, 2));
    cleanup = initCanvas(controller, canvas);
    useActiveCell.setState({ value: 'draft', displayValue: 'draft' });

    controller.setRowHeight(0, 60);
    controller.setColWidth(0, 120);
    controller.setRowHeight(2, 77);
    controller.setColWidth(2, 155);
    const position = controller.computeCellPosition(range(2, 2));
    expect(useActiveCell.getState()).toMatchObject({
      top: position.top + 20,
      left: position.left + 10,
      height: 77,
      width: 155,
      value: 'draft',
      displayValue: 'draft',
    });

    const scroll = {
      row: 1, col: 1, top: 60, left: 120, scrollTop: 5, scrollLeft: 8,
    };
    controller.setScroll(scroll);
    const scrolled = controller.computeCellPosition(range(2, 2));
    expect(useActiveCell.getState()).toMatchObject({
      top: scrolled.top + 20,
      left: scrolled.left + 10,
      value: 'draft',
      displayValue: 'draft',
    });
    expect(useScrollStore.getState()).toMatchObject(scroll);
  });

  test('projects scroll state even when only the current sheet changes', () => {
    cleanup = initCanvas(controller, canvas);
    const scroll = {
      row: 3, col: 4, top: 90, left: 200, scrollTop: 12, scrollLeft: 15,
    };
    vi.spyOn(controller, 'getScroll').mockReturnValue(scroll);
    useCoreStore.setState({ activeUuid: 'old-sheet-picture' });
    controller.emit('renderChange', { changeSet: new Set(['currentSheetId']) });
    expect(useScrollStore.getState()).toMatchObject(scroll);
    expect(useCoreStore.getState().activeUuid).toBe('');
  });

  test.each([
    { top: 0, left: 0, width: 100, height: 100, visible: true },
    { top: -20, left: -20, width: 100, height: 100, visible: true },
    { top: -100, left: -100, width: 600, height: 500, visible: true },
    { top: 250, left: 10, width: 100, height: 100, visible: false },
    { top: 10, left: 350, width: 100, height: 100, visible: false },
    { top: 10, left: -100, width: 100, height: 100, visible: false },
    { top: 200, left: 10, width: 100, height: 100, visible: false },
    { top: 10, left: 300, width: 100, height: 100, visible: false },
  ])('checks drawing rectangle overlap: $top/$left/$width/$height', (item) => {
    vi.spyOn(controller, 'getDrawingList').mockReturnValue([drawing(item)]);
    vi.spyOn(controller, 'computeCellPosition').mockReturnValue({
      top: item.top, left: item.left,
    });
    vi.spyOn(controller, 'getScroll').mockReturnValue({
      row: 10, col: 10, top: 1000, left: 1000, scrollTop: 0, scrollLeft: 0,
    });
    cleanup = initCanvas(controller, canvas);
    expect(useCoreStore.getState().drawings).toHaveLength(item.visible ? 1 : 0);
  });

  test('resizing refreshes scroll dimensions and drawing visibility', () => {
    vi.spyOn(controller, 'getDrawingList').mockReturnValue([
      drawing({ marginX: 400 }),
    ]);
    cleanup = initCanvas(controller, canvas);
    expect(useCoreStore.getState().drawings).toHaveLength(0);
    useActiveCell.setState({ value: 'draft', displayValue: 'draft' });

    width = 620;
    height = 420;
    window.dispatchEvent(new Event('resize'));
    expect(useScrollStore.getState()).toMatchObject({
      canvasWidth: 600,
      canvasHeight: 400,
    });
    expect(useCoreStore.getState().drawings).toHaveLength(1);
    expect(useActiveCell.getState().value).toBe('draft');
  });

  test('uses the chart source sheet row visibility and preserves empty column positions', () => {
    const sourceSheetId = controller.getCurrentSheetId();
    controller.setWorksheet([
      { ...range(), value: 1 },
      { ...range(0, 2), value: 3 },
      { ...range(2), value: 7 },
    ]);
    controller.hideRow(1, 1);
    const targetSheetId = controller.addSheet()!.sheetId;
    controller.hideRow(0, 1);
    expect(controller.getCurrentSheetId()).toBe(targetSheetId);
    vi.spyOn(controller, 'getDrawingList').mockReturnValue([drawing({
      type: 'chart',
      chartType: 'bar',
      chartRange: {
        row: 0, col: 0, rowCount: 3, colCount: 3, sheetId: sourceSheetId,
      },
    })]);
    cleanup = initCanvas(controller, canvas);
    expect(useCoreStore.getState().drawings[0]).toMatchObject({
      labels: ['1', '2', '3'],
      datasets: [
        { label: 'Series1', data: [1, 0, 3] },
        { label: 'Series3', data: [7, 0, 0] },
      ],
    });
    controller.setCell([[9]], [], {
      ...range(0, 2), sheetId: sourceSheetId,
    });
    expect(useCoreStore.getState().drawings[0].datasets[0].data).toEqual([1, 0, 9]);
  });

  test('does not notify subscribers when scalar state is unchanged', () => {
    cleanup = initCanvas(controller, canvas);
    const coreListener = vi.fn();
    const cellListener = vi.fn();
    const styleListener = vi.fn();
    const unsubscribers = [
      useCoreStore.subscribe(coreListener),
      useActiveCell.subscribe(cellListener),
      useStyleStore.subscribe(styleListener),
    ];
    try {
      controller.emit('renderChange', { changeSet: new Set(['antLine']) });
      controller.emit('renderChange', { changeSet: new Set(['cellStyle']) });
      expect(coreListener).not.toHaveBeenCalled();
      expect(cellListener).not.toHaveBeenCalled();
      expect(styleListener).not.toHaveBeenCalled();
    } finally {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    }
  });

  test('coalesces sheet scrolling and cancels it when the canvas is disposed', () => {
    vi.useFakeTimers();
    for (let i = 0; i < 5; i++) controller.addSheet();
    cleanup = initCanvas(controller, canvas);
    const sheets = controller.getSheetList();
    controller.setCurrentSheetId(sheets[0].sheetId);
    controller.setCurrentSheetId(sheets[1].sheetId);
    vi.runOnlyPendingTimers();
    expect(scrollSheetToView).toHaveBeenCalledExactlyOnceWith(sheets[1].sheetId);

    controller.setCurrentSheetId(sheets[2].sheetId);
    cleanup();
    vi.runOnlyPendingTimers();
    expect(scrollSheetToView).toHaveBeenCalledTimes(1);
  });
});

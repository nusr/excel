import { type IController, type EventData } from '../../../../types';
import { initController } from '../../../../controller';
import { FilterHandler } from '../filter';

describe('filter.test.ts', () => {
  let controller: IController;
  let filterHandler: FilterHandler;

  beforeEach(() => {
    controller = initController();
    controller.addSheet();
    filterHandler = new FilterHandler();
  });

  test('pointerDown should return false if no position data', () => {
    const event: any = {
      stopPropagation: jest.fn(),
      clientX: 0,
      clientY: 0,
    };
    const data: EventData = { controller, position: undefined, x: 0, y: 0 };
    const result = filterHandler.pointerDown(data, event);
    expect(result).toBe(false);
  });

  test('pointerDown should return false if no filter', () => {
    const event: any = {
      stopPropagation: jest.fn(),
      clientX: 0,
      clientY: 0,
    };
    const data: EventData = {
      controller,
      position: { row: 0, col: 0, marginX: 0, marginY: 0 },
      x: 0,
      y: 0,
    };
    const result = filterHandler.pointerDown(data, event);
    expect(result).toBe(false);
  });

  test('pointerDown should return ModalValue if conditions are met', () => {
    const event: any = {
      stopPropagation: jest.fn(),
      clientX: 100,
      clientY: 100,
    };

    const data: EventData = {
      controller,
      position: { row: 0, col: 0, marginX: 95, marginY: 95 },
      x: 0,
      y: 0,
    };
    controller.addFilter({
      row: 0,
      col: 0,
      rowCount: 10,
      colCount: 10,
      sheetId: controller.getCurrentSheetId(),
    });

    const result = filterHandler.pointerDown(data, event);
    expect(result).toEqual({
      type: 'filter',
      row: 0,
      col: 0,
      x: 100,
      y: 100,
    });
  });

  test('pointerMove should return false', () => {
    const result = filterHandler.pointerMove();
    expect(result).toBe(false);
  });
});

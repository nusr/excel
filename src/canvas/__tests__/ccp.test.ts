import { initController } from '@/controller';
import { IController } from '@/types';
import { snapshot } from './util';

describe('ccp.test.ts', () => {
  let controller: IController;
  beforeEach(() => {
    controller = initController();
  });
  afterEach(async () => {
    await snapshot(controller);
  });
  describe('copy', () => {
    test('cell', () => {
      controller.setActiveRange({
        row: 0,
        col: 0,
        rowCount: 1,
        colCount: 1,
        sheetId: '',
      });
      controller.copy();
    });

    test('row', () => {
      controller.setActiveRange({
        row: 0,
        col: 0,
        rowCount: 1,
        colCount: 0,
        sheetId: '',
      });
      controller.copy();
    });
    test('col', () => {
      controller.setActiveRange({
        row: 0,
        col: 0,
        rowCount: 0,
        colCount: 1,
        sheetId: '',
      });
      controller.copy();
    });
    test('all', () => {
      controller.setActiveRange({
        row: 0,
        col: 0,
        rowCount: 0,
        colCount: 0,
        sheetId: '',
      });
      controller.copy();
    });
  });
  describe('cut', () => {
    test('cell', () => {
      controller.setActiveRange({
        row: 0,
        col: 0,
        rowCount: 1,
        colCount: 1,
        sheetId: '',
      });
      controller.cut();
    });

    test('row', () => {
      controller.setActiveRange({
        row: 0,
        col: 0,
        rowCount: 1,
        colCount: 0,
        sheetId: '',
      });
      controller.cut();
    });
    test('col', () => {
      controller.setActiveRange({
        row: 0,
        col: 0,
        rowCount: 0,
        colCount: 1,
        sheetId: '',
      });
      controller.cut();
    });
    test('all', () => {
      controller.setActiveRange({
        row: 0,
        col: 0,
        rowCount: 0,
        colCount: 0,
        sheetId: '',
      });
      controller.cut();
    });
  });
});

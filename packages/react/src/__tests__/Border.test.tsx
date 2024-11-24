import { screen, fireEvent } from '@testing-library/react';
import { BORDER_TYPE_MAP } from '@excel/shared';
import { BorderItem, IController } from '@excel/shared';
import { renderComponent } from './util';
import './global.mock';

describe('Border.test.tsx', () => {
  let controller: IController;
  beforeEach(async () => {
    const result = renderComponent();
    controller = result.controller;
  });
  describe('Line Color', () => {
    test('ok', () => {
      fireEvent.click(screen.getByTestId('toolbar-border-trigger'));
      fireEvent.click(screen.getByTestId('toolbar-border-color-trigger'));
      const dom = screen.getByTestId('toolbar-border-color-list');
      dom.setAttribute('data-value', '#B2B2B2');
      fireEvent.click(dom);
      expect(
        controller.getCell(controller.getActiveRange().range)?.borderLeft,
      ).toEqual({
        color: '#B2B2B2',
        type: 'thin',
      });
    });
  });
  describe('Line Style', () => {
    for (const item of Object.keys(BORDER_TYPE_MAP)) {
      test(item, () => {
        const selector = `toolbar-border-style-${item}`;
        fireEvent.click(screen.getByTestId('toolbar-border-trigger'));
        fireEvent.click(screen.getByTestId('toolbar-border-style'));
        fireEvent.click(screen.getByTestId(selector));

        fireEvent.click(screen.getByTestId('toolbar-border-style'));
        expect(screen.getByTestId(selector)).toHaveClass('active');
      });
    }
  });
  describe('All Borders', () => {
    test('ok', () => {
      fireEvent.click(screen.getByTestId('toolbar-border-trigger'));
      fireEvent.click(screen.getByTestId('toolbar-all-borders'));
      const item: BorderItem = {
        color: '',
        type: 'thin',
      };
      expect(
        controller.getCell(controller.getActiveRange().range),
      ).toMatchObject({
        borderLeft: item,
        borderRight: item,
        borderTop: item,
        borderBottom: item,
      });
    });
  });
  describe('No Border', () => {
    test('ok', () => {
      fireEvent.click(screen.getByTestId('toolbar-border-trigger'));
      fireEvent.click(screen.getByTestId('toolbar-all-borders'));
      const item: BorderItem = {
        color: '',
        type: 'thin',
      };
      expect(
        controller.getCell(controller.getActiveRange().range),
      ).toMatchObject({
        borderLeft: item,
        borderRight: item,
        borderTop: item,
        borderBottom: item,
      });

      fireEvent.click(screen.getByTestId('toolbar-no-border'));

      expect(
        controller.getCell(controller.getActiveRange().range),
      ).toMatchObject({
        borderLeft: undefined,
        borderRight: undefined,
        borderTop: undefined,
        borderBottom: undefined,
      });
    });
  });
  describe('Top Border', () => {
    test('ok', () => {
      fireEvent.click(screen.getByTestId('toolbar-border-trigger'));
      fireEvent.click(screen.getByTestId('toolbar-top-border'));
      const item: BorderItem = {
        color: '',
        type: 'thin',
      };
      expect(
        controller.getCell(controller.getActiveRange().range)?.borderTop,
      ).toEqual(item);
    });
  });
  describe('Bottom Border', () => {
    test('ok', () => {
      fireEvent.click(screen.getByTestId('toolbar-border-trigger'));
      fireEvent.click(screen.getByTestId('toolbar-bottom-border'));
      const item: BorderItem = {
        color: '',
        type: 'thin',
      };
      expect(
        controller.getCell(controller.getActiveRange().range)?.borderBottom,
      ).toEqual(item);
    });
  });
  describe('Left Border', () => {
    test('ok', () => {
      fireEvent.click(screen.getByTestId('toolbar-border-trigger'));
      fireEvent.click(screen.getByTestId('toolbar-left-border'));
      const item: BorderItem = {
        color: '',
        type: 'thin',
      };
      expect(
        controller.getCell(controller.getActiveRange().range)?.borderLeft,
      ).toEqual(item);
    });
  });
  describe('Right Border', () => {
    test('ok', () => {
      fireEvent.click(screen.getByTestId('toolbar-border-trigger'));
      fireEvent.click(screen.getByTestId('toolbar-right-border'));
      const item: BorderItem = {
        color: '',
        type: 'thin',
      };
      expect(
        controller.getCell(controller.getActiveRange().range)?.borderRight,
      ).toEqual(item);
    });
  });
  describe('Thick Box Border', () => {
    test('ok', () => {
      fireEvent.click(screen.getByTestId('toolbar-border-trigger'));
      fireEvent.click(screen.getByTestId('toolbar-thick-box-border'));
      const item: BorderItem = {
        color: '',
        type: 'medium',
      };
      expect(
        controller.getCell(controller.getActiveRange().range),
      ).toMatchObject({
        borderLeft: item,
        borderRight: item,
        borderTop: item,
        borderBottom: item,
      });
    });
  });
  describe('OutSide Borders', () => {
    test('ok', () => {
      fireEvent.click(screen.getByTestId('toolbar-border-trigger'));
      fireEvent.click(screen.getByTestId('toolbar-outside-borders'));
      const item: BorderItem = {
        color: '',
        type: 'thin',
      };
      expect(
        controller.getCell(controller.getActiveRange().range),
      ).toMatchObject({
        borderLeft: item,
        borderRight: item,
        borderTop: item,
        borderBottom: item,
      });
    });
  });
  describe('Border Shortcut', () => {
    test('ok', () => {
      fireEvent.click(screen.getByTestId('toolbar-border-trigger'));
      fireEvent.click(screen.getByTestId('toolbar-top-border'));
      fireEvent.keyDown(document.body, { key: 'Enter' });
      fireEvent.click(screen.getByTestId('toolbar-border-shortcut'));

      const item: BorderItem = {
        color: '',
        type: 'thin',
      };
      expect(
        controller.getCell(controller.getActiveRange().range)?.borderTop,
      ).toEqual(item);
    });
  });
});

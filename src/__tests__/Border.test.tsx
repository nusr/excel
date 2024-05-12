import { App } from '@/containers';
import * as React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { initController } from '@/controller';
import './global.mock';
import { BORDER_TYPE_MAP } from '@/util';
import { BorderItem } from '@/types';

describe('Border.test.tsx', () => {
  describe('Line Color', () => {
    test('ok', () => {
      const controller = initController();
      act(() => {
        render(<App controller={controller} />);
      });

      fireEvent.click(screen.getByTestId('toolbar-border-trigger'));
      fireEvent.click(screen.getByTestId('toolbar-border-color-trigger'));
      const dom = screen.getByTestId('toolbar-border-color-list');
      dom.setAttribute('data-value', '#B2B2B2');
      fireEvent.click(dom);
      expect(
        controller.getCell(controller.getActiveRange().range)?.style
          ?.borderLeft,
      ).toEqual({
        color: '#B2B2B2',
        type: 'thin',
      });
    });
  });
  describe('Line Style', () => {
    for (const item of Object.keys(BORDER_TYPE_MAP)) {
      test(item, () => {
        act(() => {
          render(<App controller={initController()} />);
        });
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
      const controller = initController();
      act(() => {
        render(<App controller={controller} />);
      });
      fireEvent.click(screen.getByTestId('toolbar-border-trigger'));
      fireEvent.click(screen.getByTestId('toolbar-all-borders'));
      const item: BorderItem = {
        color: '',
        type: 'thin',
      };
      expect(
        controller.getCell(controller.getActiveRange().range)?.style,
      ).toEqual({
        borderLeft: item,
        borderRight: item,
        borderTop: item,
        borderBottom: item,
      });
    });
  });
  describe('No Border', () => {
    test('ok', () => {
      const controller = initController();
      act(() => {
        render(<App controller={controller} />);
      });
      fireEvent.click(screen.getByTestId('toolbar-border-trigger'));
      fireEvent.click(screen.getByTestId('toolbar-all-borders'));
      const item: BorderItem = {
        color: '',
        type: 'thin',
      };
      expect(
        controller.getCell(controller.getActiveRange().range)?.style,
      ).toEqual({
        borderLeft: item,
        borderRight: item,
        borderTop: item,
        borderBottom: item,
      });

      fireEvent.click(screen.getByTestId('toolbar-no-border'));

      expect(
        controller.getCell(controller.getActiveRange().range)?.style,
      ).toEqual({
        borderLeft: undefined,
        borderRight: undefined,
        borderTop: undefined,
        borderBottom: undefined,
      });
    });
  });
  describe('Top Border', () => {
    test('ok', () => {
      const controller = initController();
      act(() => {
        render(<App controller={controller} />);
      });
      fireEvent.click(screen.getByTestId('toolbar-border-trigger'));
      fireEvent.click(screen.getByTestId('toolbar-top-border'));
      const item: BorderItem = {
        color: '',
        type: 'thin',
      };
      expect(
        controller.getCell(controller.getActiveRange().range)?.style,
      ).toEqual({
        borderTop: item,
      });
    });
  });
  describe('Bottom Border', () => {
    test('ok', () => {
      const controller = initController();
      act(() => {
        render(<App controller={controller} />);
      });
      fireEvent.click(screen.getByTestId('toolbar-border-trigger'));
      fireEvent.click(screen.getByTestId('toolbar-bottom-border'));
      const item: BorderItem = {
        color: '',
        type: 'thin',
      };
      expect(
        controller.getCell(controller.getActiveRange().range)?.style,
      ).toEqual({
        borderBottom: item,
      });
    });
  });
  describe('Left Border', () => {
    test('ok', () => {
      const controller = initController();
      act(() => {
        render(<App controller={controller} />);
      });
      fireEvent.click(screen.getByTestId('toolbar-border-trigger'));
      fireEvent.click(screen.getByTestId('toolbar-left-border'));
      const item: BorderItem = {
        color: '',
        type: 'thin',
      };
      expect(
        controller.getCell(controller.getActiveRange().range)?.style,
      ).toEqual({
        borderLeft: item,
      });
    });
  });
  describe('Right Border', () => {
    test('ok', () => {
      const controller = initController();
      act(() => {
        render(<App controller={controller} />);
      });
      fireEvent.click(screen.getByTestId('toolbar-border-trigger'));
      fireEvent.click(screen.getByTestId('toolbar-right-border'));
      const item: BorderItem = {
        color: '',
        type: 'thin',
      };
      expect(
        controller.getCell(controller.getActiveRange().range)?.style,
      ).toEqual({
        borderRight: item,
      });
    });
  });
  describe('Thick Box Border', () => {
    test('ok', () => {
      const controller = initController();
      act(() => {
        render(<App controller={controller} />);
      });
      fireEvent.click(screen.getByTestId('toolbar-border-trigger'));
      fireEvent.click(screen.getByTestId('toolbar-thick-box-border'));
      const item: BorderItem = {
        color: '',
        type: 'medium',
      };
      expect(
        controller.getCell(controller.getActiveRange().range)?.style,
      ).toEqual({
        borderLeft: item,
        borderRight: item,
        borderTop: item,
        borderBottom: item,
      });
    });
  });
  describe('OutSide Borders', () => {
    test('ok', () => {
      const controller = initController();
      act(() => {
        render(<App controller={controller} />);
      });
      fireEvent.click(screen.getByTestId('toolbar-border-trigger'));
      fireEvent.click(screen.getByTestId('toolbar-outside-borders'));
      const item: BorderItem = {
        color: '',
        type: 'thin',
      };
      expect(
        controller.getCell(controller.getActiveRange().range)?.style,
      ).toEqual({
        borderLeft: item,
        borderRight: item,
        borderTop: item,
        borderBottom: item,
      });
    });
  });
  describe('Border Shortcut', () => {
    test('ok', () => {
      const controller = initController();
      act(() => {
        render(<App controller={controller} />);
      });
      fireEvent.click(screen.getByTestId('toolbar-border-trigger'));
      fireEvent.click(screen.getByTestId('toolbar-top-border'));
      fireEvent.keyDown(document.body, { key: 'Enter' });
      fireEvent.click(screen.getByTestId('toolbar-border-shortcut'));

      const item: BorderItem = {
        color: '',
        type: 'thin',
      };
      expect(
        controller.getCell(controller.getActiveRange().range)?.style,
      ).toEqual({
        borderTop: item,
      });
    });
  });
});

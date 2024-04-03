import { App } from '@/containers';
import { initController } from '@/controller';
import * as React from 'react';
import {
  cleanup,
  render,
  screen,
  fireEvent,
  act,
} from '@testing-library/react';
import { isMac } from '@/util';

describe('Canvas.test.ts', () => {
  afterEach(cleanup);

  describe('canvas', () => {
    test('normal', () => {
      act(() => {
        render(<App controller={initController()} />);
      });
      expect(screen.getByTestId('canvas-container')!.childNodes).toHaveLength(
        5,
      );
      expect(
        screen.getByTestId('canvas-container')!.firstChild!.nodeName,
      ).toEqual('CANVAS');
    });
    test('context menu', () => {
      act(() => {
        render(<App controller={initController()} />);
      });
      fireEvent.contextMenu(screen.getByTestId('canvas-main'), {
        clientY: 200,
        clientX: 200,
      });
      expect(screen.getByTestId('context-menu')!.childNodes).toHaveLength(7);
    });
  });
  describe('BottomBar', () => {
    test('normal', () => {
      act(() => {
        render(<App controller={initController()} />);
      });
      const key = `${isMac() ? 'meta' : 'ctrl'}Key`;
      fireEvent.keyDown(document.body, { key: 'ArrowDown', [key]: true });
      expect(screen.getByTestId('canvas-bottom-bar').childNodes.length).toEqual(
        4,
      );
    });
    test('add rows', () => {
      const controller = initController();
      act(() => {
        render(<App controller={controller} />);
      });
      const key = `${isMac() ? 'meta' : 'ctrl'}Key`;
      fireEvent.keyDown(document.body, { key: 'ArrowDown', [key]: true });
      const oldSheetInfo = controller.getSheetInfo()!;

      fireEvent.change(screen.getByTestId('canvas-bottom-bar-input'), {
        currentTarget: { value: '12' },
        target: { value: '12' },
      });
      fireEvent.click(screen.getByTestId('canvas-bottom-bar-add'));
      const newSheetInfo = controller.getSheetInfo()!;
      expect(newSheetInfo.rowCount).toEqual(oldSheetInfo.rowCount + 12);
    });
    test('add rows threshold', () => {
      const controller = initController();
      act(() => {
        render(<App controller={controller} />);
      });
      const key = `${isMac() ? 'meta' : 'ctrl'}Key`;
      fireEvent.keyDown(document.body, { key: 'ArrowDown', [key]: true });
      const oldSheetInfo = controller.getSheetInfo()!;

      fireEvent.change(screen.getByTestId('canvas-bottom-bar-input'), {
        currentTarget: { value: '10000' },
        target: { value: '10000' },
      });
      fireEvent.click(screen.getByTestId('canvas-bottom-bar-add'));
      const newSheetInfo = controller.getSheetInfo()!;
      expect(newSheetInfo.rowCount).toEqual(oldSheetInfo.rowCount + 200);
    });
  });
  describe('ScrollBar', () => {
    test('wheel scroll down', async () => {
      act(() => {
        render(<App controller={initController()} />);
      });

      expect(
        window.getComputedStyle(
          screen.getByTestId('vertical-scroll-bar-content'),
        ).transform,
      ).toEqual('translateY(0px)');
      fireEvent.wheel(document.body, { deltaY: 500 });
      expect(
        window.getComputedStyle(
          screen.getByTestId('vertical-scroll-bar-content'),
        ).transform,
      ).toEqual('translateY(-3px)');
    });
    test('wheel scroll right', async () => {
      act(() => {
        render(<App controller={initController()} />);
      });
      expect(
        window.getComputedStyle(
          screen.getByTestId('horizontal-scroll-bar-content'),
        ).transform,
      ).toEqual('translateX(0px)');
      fireEvent.wheel(document.body, { deltaX: 500 });
      expect(
        window.getComputedStyle(
          screen.getByTestId('horizontal-scroll-bar-content'),
        ).transform,
      ).toEqual('translateX(-11px)');
    });
  });
});

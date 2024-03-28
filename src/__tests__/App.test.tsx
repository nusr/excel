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

describe('App.test.ts', () => {
  afterEach(cleanup);
  describe('menubar', () => {
    test('normal', () => {
      render(<App controller={initController()} />);
      expect(screen.getByTestId('menubar')!.childNodes.length).toEqual(4);
    });
    test('menu', () => {
      render(<App controller={initController()} />);
      fireEvent.click(screen.getByTestId('menubar-excel'));
      expect(
        screen.getByTestId('menubar-excel-portal')!.querySelectorAll('li')
          .length,
      ).toEqual(2);
    });
    test('fps', () => {
      act(() => {
        render(<App controller={initController()} />);
      });

      setTimeout(() => {
        const prefix = 'FPS: ';
        const text = screen
          .getByTestId('menubar-fps')!
          .textContent!.slice(prefix.length);
        expect(parseInt(text, 10)).toBeGreaterThan(50);
      }, 1000);
    });
    test('dark mode', () => {
      render(<App controller={initController()} />);
      const before = document.documentElement.getAttribute('data-theme');
      fireEvent.click(screen.getByTestId('menubar-theme-toggle'));
      const after = document.documentElement.getAttribute('data-theme');
      expect(before).not.toEqual(after);
      expect(new Set([after, before])).toEqual(new Set(['light', 'dark']));
    });
    test('i18n', () => {
      render(<App controller={initController()} />);
      expect(
        screen.getByTestId('menubar-i18n')!.querySelector('select')!.value,
      ).toEqual('en');
      expect(screen.getByTestId('menubar-excel').textContent).toEqual('Menu');
    });
  });
  describe('toolbar', () => {
    test('normal', () => {
      render(<App controller={initController()} />);
      expect(
        screen.getByTestId('toolbar')!.childNodes.length,
      ).toBeGreaterThanOrEqual(3);
    });
  });
  describe('formula bar', () => {
    test('normal', () => {
      render(<App controller={initController()} />);
      expect(
        screen.getByTestId('formula-bar-name')!.querySelector('input')!.value,
      ).toEqual('A1');
      expect(screen.getByTestId('formula-bar')!.childNodes).toHaveLength(2);
    });
  });
  describe('canvas', () => {
    test('normal', () => {
      render(<App controller={initController()} />);
      expect(screen.getByTestId('canvas-container')!.childNodes).toHaveLength(
        5,
      );
      expect(
        screen.getByTestId('canvas-container')!.firstChild!.nodeName,
      ).toEqual('CANVAS');
    });
    test('context menu', () => {
      render(<App controller={initController()} />);
      fireEvent.contextMenu(screen.getByTestId('canvas-main'), {
        clientY: 200,
        clientX: 200,
      });
      expect(screen.getByTestId('context-menu')!.childNodes).toHaveLength(3);
    });
  });
  describe('sheet bar', () => {
    test('normal', () => {
      render(<App controller={initController()} />);
      expect(screen.getByTestId('sheet-bar-list')!.childNodes).toHaveLength(1);
    });
    test('context menu', () => {
      render(<App controller={initController()} />);
      fireEvent.contextMenu(
        screen.getByTestId('sheet-bar-list')!.childNodes[0],
        {
          clientX: 199,
        },
      );
      expect(
        screen.getByTestId('sheet-bar-context-menu').childNodes,
      ).toHaveLength(6);
    });
  });
});

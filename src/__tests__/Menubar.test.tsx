import { App } from '@/containers';
import { initController } from '@/controller';
import * as React from 'react';
import {
  render,
  screen,
  fireEvent,
  act,
  RenderResult,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import './global.mock';

type MatchMediaFun = (data: { matches: boolean }) => void;

describe('Menubar.test.ts', () => {
  describe('menubar', () => {
    test('normal', () => {
      act(() => {
        render(<App controller={initController()} />);
      });
      expect(screen.getByTestId('menubar')!.childNodes.length).toEqual(4);
    });
    test('menu', () => {
      act(() => {
        render(<App controller={initController()} />);
      });
      fireEvent.click(screen.getByTestId('menubar-excel-trigger'));
      expect(
        screen.getByTestId('menubar-excel-portal')!.querySelectorAll('li')
          .length,
      ).toEqual(4);
    });
  });
  describe('dark mode', () => {
    afterEach(() => {
      sessionStorage.clear();
    });
    test('toggle', () => {
      act(() => {
        render(<App controller={initController()} />);
      });
      const before = document.documentElement.getAttribute('data-theme');
      fireEvent.click(screen.getByTestId('menubar-theme-toggle'));
      const after = document.documentElement.getAttribute('data-theme');
      expect(before).not.toEqual(after);
      expect(new Set([after, before])).toEqual(new Set(['light', 'dark']));
    });

    test('toggle twice', () => {
      act(() => {
        render(<App controller={initController()} />);
      });
      const before = document.documentElement.getAttribute('data-theme');
      fireEvent.click(screen.getByTestId('menubar-theme-toggle'));
      const after = document.documentElement.getAttribute('data-theme');
      expect(before).not.toEqual(after);
      expect(new Set([after, before])).toEqual(new Set(['light', 'dark']));

      fireEvent.click(screen.getByTestId('menubar-theme-toggle'));
      const after2 = document.documentElement.getAttribute('data-theme');
      expect(after2).toEqual(before);
    });

    test('mock matchMedia light to dark', () => {
      let func: MatchMediaFun;
      function addEventListener(
        _type: string,
        fn: (data: { matches: boolean }) => void,
      ) {
        func = fn;
      }
      Object.defineProperty(global, 'matchMedia', {
        writable: true,
        value: () => {
          return {
            matches: false,
            addEventListener,
          };
        },
      });
      act(() => {
        render(<App controller={initController()} />);
      });
      const before = document.documentElement.getAttribute('data-theme');
      expect(before).toEqual('light');
      act(() => {
        func({ matches: true });
      });
      const after = document.documentElement.getAttribute('data-theme');
      expect(after).toEqual('dark');
    });
    test('mock matchMedia dark to light', () => {
      let func: MatchMediaFun;
      function addEventListener(
        _type: string,
        fn: (data: { matches: boolean }) => void,
      ) {
        func = fn;
      }
      Object.defineProperty(global, 'matchMedia', {
        writable: true,
        value: () => {
          return {
            matches: true,
            addEventListener,
          };
        },
      });
      act(() => {
        render(<App controller={initController()} />);
      });
      const before = document.documentElement.getAttribute('data-theme');
      expect(before).toEqual('dark');
      act(() => {
        func({ matches: false });
      });
      const after = document.documentElement.getAttribute('data-theme');
      expect(after).toEqual('light');
    });
  });
  describe('i18n', () => {
    test('default', () => {
      act(() => {
        render(<App controller={initController()} />);
      });
      expect(screen.getByTestId('menubar-i18n-select')).toHaveValue('en');
    });
    test('change', () => {
      let result: RenderResult;
      const controller = initController();
      act(() => {
        result = render(<App controller={controller} />);
      });
      fireEvent.change(screen.getByTestId('menubar-i18n-select'), {
        target: { value: 'zh' },
      });
      act(() => {
        result.rerender(<App controller={controller} />);
      });
      expect(screen.getByTestId('menubar-i18n-select')).toHaveValue('zh');
    });
  });
});

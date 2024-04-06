import { App } from '@/containers';
import { initController } from '@/controller';
import * as React from 'react';
import {
  cleanup,
  render,
  screen,
  fireEvent,
  act,
  RenderResult,
} from '@testing-library/react';
import '@testing-library/jest-dom';

describe('Menubar.test.ts', () => {
  afterEach(cleanup);
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
      fireEvent.click(screen.getByTestId('menubar-excel'));
      expect(
        screen.getByTestId('menubar-excel-portal')!.querySelectorAll('li')
          .length,
      ).toEqual(2);
    });
    test('dark mode', () => {
      act(() => {
        render(<App controller={initController()} />);
      });
      const before = document.documentElement.getAttribute('data-theme');
      fireEvent.click(screen.getByTestId('menubar-theme-toggle'));
      const after = document.documentElement.getAttribute('data-theme');
      expect(before).not.toEqual(after);
      expect(new Set([after, before])).toEqual(new Set(['light', 'dark']));
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
      const g = window as any;
      delete g.location;
      g.location = {
        reload: () => {
          act(() => {
            result.rerender(<App controller={controller} />);
          });
        },
      };
      act(() => {
        result = render(<App controller={controller} />);
      });
      fireEvent.change(screen.getByTestId('menubar-i18n-select'), {
        target: { value: 'zh' },
      });
      expect(screen.getByTestId('menubar-i18n-select')).toHaveValue('zh');
    });
  });
});
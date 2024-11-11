import { App } from '@/containers';
import * as React from 'react';
import {
  screen,
  render,
  fireEvent,
  act,
  RenderResult,
} from '@testing-library/react';
import './global.mock';
import { renderComponent } from './util';
import { initController } from '@/controller';

type MatchMediaFun = (data: { matches: boolean }) => void;

describe('Menubar.test.ts', () => {
  beforeEach(async () => {
    renderComponent();
    await screen.findByTestId('menubar');
  });
  describe('menubar', () => {
    test('normal', async () => {
      expect((await screen.findByTestId('menubar')).childNodes.length).toEqual(
        4,
      );
    });
    test('menu', () => {
      fireEvent.click(screen.getByTestId('menubar-excel-trigger'));
      expect(
        screen.getByTestId('menubar-excel-portal')!.querySelectorAll('li')
          .length,
      ).toEqual(5);
    });
  });
  describe('dark mode', () => {
    afterEach(() => {
      sessionStorage.clear();
    });
    test('toggle', () => {
      const before = document.documentElement.getAttribute('data-theme');
      fireEvent.click(screen.getByTestId('menubar-theme-toggle'));
      const after = document.documentElement.getAttribute('data-theme');
      expect(before).not.toEqual(after);
      expect(new Set([after, before])).toEqual(new Set(['light', 'dark']));
    });

    test('toggle twice', () => {
      const before = document.documentElement.getAttribute('data-theme');
      fireEvent.click(screen.getByTestId('menubar-theme-toggle'));
      const after = document.documentElement.getAttribute('data-theme');
      expect(before).not.toEqual(after);
      expect(new Set([after, before])).toEqual(new Set(['light', 'dark']));

      fireEvent.click(screen.getByTestId('menubar-theme-toggle'));
      const after2 = document.documentElement.getAttribute('data-theme');
      expect(after2).toEqual(before);
    });
  });
  describe('i18n', () => {
    test('default', () => {
      expect(screen.getByTestId('menubar-i18n-select')).toHaveValue('en');
    });
  });
});

test('change i18n', () => {
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

describe('change theme', () => {
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
    renderComponent();
    const before = document.documentElement.getAttribute('data-theme');
    expect(before).toEqual('light');
    act(() => {
      func && func({ matches: true });
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

    renderComponent();
    const before = document.documentElement.getAttribute('data-theme');
    expect(before).toEqual('dark');
    act(() => {
      func && func({ matches: false });
    });
    const after = document.documentElement.getAttribute('data-theme');
    expect(after).toEqual('light');
  });
});

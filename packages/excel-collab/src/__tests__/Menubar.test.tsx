import { ExcelEditor, StateContext } from '../containers';
import {
  screen,
  render,
  fireEvent,
  act,
  RenderResult,
} from '@testing-library/react';
import './global.mock';
import { renderComponent } from './util';
import { initController } from '../controller';

type MatchMediaFun = (data: { matches: boolean }) => void;

describe('Menubar.test.ts', () => {
  beforeEach(async () => {
    await renderComponent();
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
      expect(screen.getByTestId('menubar-i18n-select')).toHaveValue('en-US');
    });
  });
});

test('change i18n', () => {
  let result: RenderResult;
  const controller = initController();
  controller.addFirstSheet();
  act(() => {
    result = render(
      <StateContext
        value={{
          controller,
        }}
      >
        <ExcelEditor />
      </StateContext>,
    );
  });
  fireEvent.change(screen.getByTestId('menubar-i18n-select'), {
    target: { value: 'zh-CN' },
  });
  act(() => {
    result.rerender(
      <StateContext
        value={{
          controller,
        }}
      >
        <ExcelEditor />
      </StateContext>,
    );
  });
  expect(screen.getByTestId('menubar-i18n-select')).toHaveValue('zh-CN');
});

describe('change theme', () => {
  test('mock matchMedia light to dark', async () => {
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
    await renderComponent();
    const before = document.documentElement.getAttribute('data-theme');
    expect(before).toEqual('light');
    act(() => {
      func?.({ matches: true });
    });
    const after = document.documentElement.getAttribute('data-theme');
    expect(after).toEqual('dark');
  });
  test('mock matchMedia dark to light', async () => {
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

    await renderComponent();
    const before = document.documentElement.getAttribute('data-theme');
    expect(before).toEqual('dark');
    act(() => {
       func?.({ matches: false });
    });
    const after = document.documentElement.getAttribute('data-theme');
    expect(after).toEqual('light');
  });
});

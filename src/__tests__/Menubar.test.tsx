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
    test('i18n', () => {
      act(() => {
        render(<App controller={initController()} />);
      });
      expect(
        screen.getByTestId('menubar-i18n')!.querySelector('select')!.value,
      ).toEqual('en');
      expect(screen.getByTestId('menubar-excel').textContent).toEqual('Menu');
    });
  });
});

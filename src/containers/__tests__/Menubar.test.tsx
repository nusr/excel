import { MenuBarContainer } from '../MenuBar';
import {
  cleanup,
  render,
  screen,
  fireEvent,
  act,
} from '@testing-library/react';
import React from 'react';
import { initController } from '@/controller';

describe('MenuBarContainer.test.ts', () => {
  afterEach(cleanup);
  test('normal', () => {
    render(<MenuBarContainer controller={initController()} />);

    expect(screen.getByTestId('menubar')!.childNodes.length).toEqual(4);
  });
  test('menu', () => {
    render(<MenuBarContainer controller={initController()} />);
    fireEvent.click(screen.getByTestId('menubar-excel'));
    expect(screen.getByTestId('menubar-excel-portal')!.querySelectorAll('li').length).toEqual(2);
  });
  test('fps', () => {
    act(() => {
      render(<MenuBarContainer controller={initController()} />);
    });

    setTimeout(() => {
      const prefix = 'FPS: ';
      const text = screen
        .getByTestId('menubar-fps')!
        .textContent!.slice(prefix.length);
      expect(parseInt(text, 10)).toBeGreaterThan(50);
    }, 1000);
  });
  test('i18n', () => {
    render(<MenuBarContainer controller={initController()} />);
    expect(
      screen.getByTestId('menubar-i18n')!.querySelector('select')!.value,
    ).toEqual('en');
    expect(screen.getByTestId('menubar-excel').textContent).toEqual('Menu');
  });

  test('dark mode', () => {
    render(<MenuBarContainer controller={initController()} />);
    const before = document.documentElement.getAttribute('data-theme');
    fireEvent.click(screen.getByTestId('menubar-theme-toggle'));
    const after = document.documentElement.getAttribute('data-theme');
    expect(before).not.toEqual(after);
    expect(new Set([after, before])).toEqual(new Set(['light', 'dark']));
  });
});

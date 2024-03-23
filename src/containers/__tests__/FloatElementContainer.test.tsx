import { FloatElementContainer } from '../FloatElement';
import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { initController } from '@/controller';
import { floatElementStore, FloatElementItem } from '../store';

beforeAll(() => {
  global.ResizeObserver = class ResizeObserver {
    observe() {
      // do nothing
    }
    unobserve() {
      // do nothing
    }
    disconnect() {
      // do nothing
    }
  };
});

const mockData: FloatElementItem[] = [
  {
    title: 'Chart Title',
    type: 'chart',
    uuid: '34bb3922-a9c2-4478-bdd0-9f80baf1b021',
    width: 400,
    height: 250,
    originHeight: 250,
    originWidth: 400,
    marginX: 0,
    marginY: 0,
    sheetId: '4',
    fromCol: 4,
    fromRow: 4,
    chartType: 'bar',
    chartRange: { row: 6, col: 6, colCount: 3, rowCount: 3, sheetId: '4' },
    top: 120,
    left: 306,
    labels: ['1', '2', '3'],
    datasets: [
      { label: 'Series1', data: [3, 6, 29] },
      { label: 'Series2', data: [35, 15, 34] },
      { label: 'Series3', data: [23, 24, 15] },
    ],
  },
  {
    title: 'Chart Title',
    type: 'chart',
    uuid: '34bb3922-a9c2-4478-bdd0-9f80baf1b0211',
    width: 400,
    height: 250,
    originHeight: 250,
    originWidth: 400,
    marginX: 0,
    marginY: 0,
    sheetId: '4',
    fromCol: 4,
    fromRow: 4,
    chartType: 'bar',
    chartRange: { row: 6, col: 6, colCount: 3, rowCount: 3, sheetId: '4' },
    top: 120,
    left: 306,
    labels: ['1', '2', '3'],
    datasets: [
      { label: 'Series1', data: [3, 6, 29] },
      { label: 'Series2', data: [35, 15, 34] },
      { label: 'Series3', data: [23, 24, 15] },
    ],
  },
];
describe('FloatElementContainer.test.ts', () => {
  afterEach(cleanup);
  test('normal', () => {
    floatElementStore.setState(mockData);

    render(<FloatElementContainer controller={initController()} />);

    expect(screen.getAllByTestId('float-element')).toHaveLength(2);
  });

  test('context-menu', () => {
    floatElementStore.setState([mockData[0]]);

    render(<FloatElementContainer controller={initController()} />);

    fireEvent.contextMenu(screen.getByTestId('float-element'), {
      clientY: 20,
      clientX: 20,
    });

    expect(
      screen.getByTestId('float-element-context-menu')!.childNodes,
    ).toHaveLength(10);
  });

  for (const [item, value] of [
    ['select-data', '$G$7:$J$10'],
    ['change-chart-title', 'Chart Title'],
    ['change-chart-type', 'bar'],
  ]) {
    test(`context-menu-${item}`, () => {
      floatElementStore.setState([mockData[0]]);

      render(<FloatElementContainer controller={initController()} />);

      fireEvent.contextMenu(screen.getByTestId('float-element'), {
        clientY: 20,
        clientX: 20,
      });
      fireEvent.click(screen.getByTestId(`float-element-context-menu-${item}`));
      const dom = screen
        .getByTestId(`dialog-${item}`)!
        .querySelector(
          item === 'change-chart-type' ? 'option[selected]' : 'input',
        )!;
      expect((dom as any).value).toEqual(value);
    });
  }
});

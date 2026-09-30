import { screen, fireEvent, act } from '@testing-library/react';
import { IController } from '../types';
import { renderComponent } from './util';
import './global.mock';

describe('Filter.test.tsx', () => {
  let controller: IController;
  beforeEach(async () => {
    const result = await renderComponent();
    controller = result.controller;
  });
  test('add filter', async () => {
    act(() => {
      controller.setActiveRange({
        row: 0,
        col: 0,
        colCount: 10,
        rowCount: 10,
        sheetId: '',
      });
    });
    fireEvent.click(screen.getByTestId('toolbar-filter'));

    expect(screen.getByTestId('toolbar-filter')).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  test('delete filter', async () => {
    act(() => {
      controller.setActiveRange({
        row: 0,
        col: 0,
        colCount: 10,
        rowCount: 10,
        sheetId: '',
      });
    });
    fireEvent.click(screen.getByTestId('toolbar-filter'));

    expect(screen.getByTestId('toolbar-filter')).toHaveAttribute(
      'aria-pressed',
      'true',
    );

    fireEvent.click(screen.getByTestId('toolbar-filter'));

    expect(screen.getByTestId('toolbar-filter')).not.toHaveClass('active');
  });
});

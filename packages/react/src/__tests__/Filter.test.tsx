import { screen, fireEvent } from '@testing-library/react';
import { IController } from '@excel/shared';
import { renderComponent } from './util';
import './global.mock';

describe('Filter.test.tsx', () => {
  let controller: IController;
  beforeEach(async () => {
    const result = await renderComponent();
    controller = result.controller
  });
  test('add filter', () => {
    controller.setActiveRange({
      row: 0,
      col: 0,
      colCount: 10,
      rowCount: 10,
      sheetId: '',
    });
    fireEvent.click(screen.getByTestId('toolbar-filter'));
    expect(screen.getByTestId('toolbar-filter')).toHaveClass('active');
  });

  test('delete filter', () => {
    controller.setActiveRange({
      row: 0,
      col: 0,
      colCount: 10,
      rowCount: 10,
      sheetId: '',
    });
    fireEvent.click(screen.getByTestId('toolbar-filter'));
    expect(screen.getByTestId('toolbar-filter')).toHaveClass('active');
    fireEvent.click(screen.getByTestId('toolbar-filter'));
    expect(screen.getByTestId('toolbar-filter')).not.toHaveClass('active');
  });
});
import { screen, fireEvent } from '@testing-library/react';
import { IController } from '@/types';
import { renderComponent } from './util';
import './global.mock';

describe('Filter.test.tsx', () => {
  let controller: IController;
  beforeEach(async () => {
    controller = renderComponent();
    await screen.findByTestId('toolbar');
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

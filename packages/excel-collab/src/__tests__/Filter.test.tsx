import { screen, fireEvent, act, render } from '@testing-library/react';
import { vi } from 'vitest';
import { IController } from '../types';
import { renderComponent, chooseSelectOption } from './util';
import { initController } from '../controller';
import { StateContext } from '../containers';
import { FilterModal } from '../containers/canvas/modal/Filter';
import { getFilterCriteria } from '../util';
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

    expect(screen.getByTestId('toolbar-filter')).toHaveAttribute('aria-pressed', 'true');
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

    expect(screen.getByTestId('toolbar-filter')).toHaveAttribute('aria-pressed', 'true');

    fireEvent.click(screen.getByTestId('toolbar-filter'));

    expect(screen.getByTestId('toolbar-filter')).not.toHaveClass('active');
  });
});

describe('Excel filter panel', () => {
  let controller: IController;
  const hide = vi.fn();
  beforeEach(() => {
    hide.mockClear();
    controller = initController();
    controller.addFirstSheet();
    const range = {
      row: 0,
      col: 0,
      rowCount: 5,
      colCount: 2,
      sheetId: controller.getCurrentSheetId(),
    };
    controller.setCell(
      [
        ['Name', 'Score'],
        ['Alpha', 10],
        ['Beta', 20],
        ['Alpha', 30],
        ['', 40],
      ],
      [],
      range,
    );
    controller.addFilter(range);
  });
  afterEach(() => controller.destroy());
  const show = (col = 0) =>
    render(
      <StateContext value={{ controller }}>
        <FilterModal type="filter" row={0} col={col} x={0} y={0} hide={hide} />
      </StateContext>,
    );
  test('searches values, shows counts and applies matching results only', () => {
    show();
    expect(screen.getByRole('checkbox', { name: 'Alpha' })).toBeInTheDocument();
    fireEvent.change(screen.getByRole('textbox', { name: 'Search values' }), {
      target: { value: 'alp' },
    });
    expect(screen.queryByRole('checkbox', { name: 'Beta' })).not.toBeInTheDocument();
    expect(screen.getByText('(2)')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Confirm' }));
    expect(controller.getRow(1).isHide).toBe(false);
    expect(controller.getRow(2).isHide).toBe(true);
    expect(controller.getRow(4).isHide).toBe(true);
    expect(hide).toHaveBeenCalledOnce();
  });
  test('refreshes changed cell values without losing pending selections', () => {
    show();
    fireEvent.click(screen.getByRole('checkbox', { name: 'Alpha' }));
    act(() =>
      controller.setCellValue('Gamma', {
        row: 2,
        col: 0,
        rowCount: 1,
        colCount: 1,
        sheetId: controller.getCurrentSheetId(),
      }),
    );
    expect(screen.queryByRole('checkbox', { name: 'Beta' })).not.toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'Gamma' })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Alpha' })).not.toBeChecked();
  });
  test('supports partial selection and one consistent blank option', () => {
    show();
    fireEvent.click(screen.getByRole('checkbox', { name: 'Beta' }));
    expect(screen.getByRole('checkbox', { name: 'All' })).toBePartiallyChecked();
    expect(screen.getAllByRole('checkbox', { name: '(empty)' })).toHaveLength(1);
    fireEvent.click(screen.getByRole('button', { name: 'Confirm' }));
    expect(controller.getRow(2).isHide).toBe(true);
    expect(controller.getRow(4).isHide).toBe(false);
  });
  test('disables applying a search with no matches and cancels without changing filters', () => {
    show();
    fireEvent.change(screen.getByRole('textbox', { name: 'Search values' }), {
      target: { value: 'missing' },
    });
    expect(screen.getByText('No matching values')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(getFilterCriteria(controller.getFilter())).toEqual({});
  });
  test('applies a numeric range and restores the condition when reopened', async () => {
    const panel = show(1);
    await chooseSelectOption('filter-mode', 'Number filters');
    await chooseSelectOption('filter-operator-0', 'Between');
    fireEvent.change(screen.getByRole('textbox', { name: 'Value 1' }), { target: { value: '15' } });
    fireEvent.change(screen.getByRole('textbox', { name: 'Upper bound' }), {
      target: { value: '30' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Confirm' }));
    expect([1, 2, 3, 4].map((row) => controller.getRow(row).isHide)).toEqual([
      true,
      false,
      false,
      true,
    ]);
    panel.unmount();
    show(1);
    expect(screen.getByRole('textbox', { name: 'Value 1' })).toHaveValue('15');
    expect(screen.getByRole('textbox', { name: 'Upper bound' })).toHaveValue('30');
  });
  test('supports two text conditions joined by OR', async () => {
    show();
    await chooseSelectOption('filter-mode', 'Text filters');
    fireEvent.change(screen.getByRole('textbox', { name: 'Value 1' }), {
      target: { value: 'alp' },
    });
    fireEvent.click(screen.getByRole('checkbox', { name: 'Add a second condition' }));
    await chooseSelectOption('filter-join', 'Or');
    fireEvent.change(screen.getByRole('textbox', { name: 'Value 2' }), {
      target: { value: 'BETA' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Confirm' }));
    expect([1, 2, 3, 4].map((row) => controller.getRow(row).isHide)).toEqual([
      false,
      false,
      false,
      true,
    ]);
  });
  test('filters by fill color using swatches', async () => {
    controller.updateCellStyle(
      { fillColor: '#ff0000' },
      {
        row: 1,
        col: 0,
        rowCount: 1,
        colCount: 1,
        sheetId: controller.getCurrentSheetId(),
      },
    );
    show();
    await chooseSelectOption('filter-mode', 'Color filters');
    fireEvent.click(screen.getByRole('button', { name: '#ff0000' }));
    fireEvent.click(screen.getByRole('button', { name: 'Confirm' }));
    expect(controller.getRow(1).isHide).toBe(false);
    expect(controller.getRow(2).isHide).toBe(true);
  });
  test('clears only this column and offers values that match the other columns', () => {
    controller.updateFilter('', { col: 0, value: { type: 'normal', value: ['Alpha'] } });
    controller.updateFilter('', { col: 1, value: { type: 'normal', value: [30] } });
    show();
    expect(screen.queryByRole('checkbox', { name: 'Beta' })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Clear this column' }));
    expect(getFilterCriteria(controller.getFilter())['0']).toBeUndefined();
    expect(getFilterCriteria(controller.getFilter())['1']).toEqual({ type: 'normal', value: [30] });
  });
});

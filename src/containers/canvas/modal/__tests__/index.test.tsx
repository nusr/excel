import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Modal, { type ModalProps } from '../index';
import { StateContext } from '../../../store';
import { initController } from '../../../../controller';

function renderComponent(props: Partial<ModalProps> = {}, addFilter = false) {
  const defaultProps = {
    type: 'filter' as const,
    x: 100,
    y: 200,
    row: 0,
    col: 0,
    hide: jest.fn(),
  };
  const controller = initController();
  controller.addFirstSheet();
  if (addFilter) {
    controller.addFilter({
      row: 0,
      col: 0,
      rowCount: 10,
      colCount: 10,
      sheetId: '',
    });
    controller.setCell(
      [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ],
      [],
      {
        row: 0,
        col: 0,
        rowCount: 10,
        colCount: 10,
        sheetId: '',
      },
    );
  }
  act(() => {
    render(
      <StateContext value={{ controller }}>
        <Modal {...defaultProps} {...props} />
      </StateContext>,
    );
  });
  return { controller };
}

describe('Canvas Modal', () => {
  it('renders FilterModal when type is filter', () => {
    renderComponent();
    expect(screen.getByTestId('filter-modal')).toBeInTheDocument();
  });
  it('renders FilterModal', () => {
    renderComponent({}, true);
    expect(screen.getAllByTestId('filter-model-item').length).toBeGreaterThan(
      1,
    );
  });

  it('throws an error for unsupported modal type', () => {
    expect(() => renderComponent({ type: 'unsupported' as any })).toThrow(
      "can't handle the modal type: unsupported",
    );
  });

  it('applies correct styles based on props', () => {
    renderComponent();
    expect(screen.getByTestId('filter-modal').parentElement).toHaveStyle({
      top: '200px',
      left: '100px',
    });
  });
});

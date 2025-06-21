import { SelectList } from '../Select';
import { cleanup, render, fireEvent, screen } from '@testing-library/react';

describe('Select.test.ts', () => {
  afterEach(cleanup);
  describe('SelectList', () => {
    test('empty', () => {
      const onChange = jest.fn();
      render(
        <SelectList
          data={[
            { value: '1', label: '1', disabled: false },
            { value: '2', label: '2', disabled: false },
          ]}
          value="1"
          onChange={onChange}
          testId="select-list"
        >
          <div>test</div>
        </SelectList>,
      );
      fireEvent.click(screen.getByTestId('select-list-trigger'));
      const dom = screen.getByTestId('select-list-popup');
      dom.setAttribute('data-value', '');
      fireEvent.click(dom);
      expect(onChange).not.toHaveBeenCalled();
    });
    test('same value', () => {
      const onChange = jest.fn();
      render(
        <SelectList
          data={[
            { value: '1', label: '1', disabled: false },
            { value: '2', label: '2', disabled: false },
          ]}
          value="1"
          onChange={onChange}
          testId="select-list"
        >
          <div>test</div>
        </SelectList>,
      );
      fireEvent.click(screen.getByTestId('select-list-trigger'));
      const dom = screen.getByTestId('select-list-popup');
      dom.setAttribute('data-value', '1');
      fireEvent.click(dom);
      expect(onChange).toHaveBeenCalled();
    });

    test('ok', () => {
      const onChange = jest.fn();
      render(
        <SelectList
          data={[
            { value: '1', label: '1', disabled: false },
            { value: '2', label: '2', disabled: false },
          ]}
          value="1"
          onChange={onChange}
          testId="select-list"
        >
          <div>test</div>
        </SelectList>,
      );
      fireEvent.click(screen.getByTestId('select-list-trigger'));
      const dom = screen.getByTestId('select-list-popup');
      dom.setAttribute('data-value', '2');
      fireEvent.click(dom);
      expect(onChange).toHaveBeenCalledWith('2');
    });

    test('click outside', () => {
      const onChange = jest.fn();
      render(
        <div>
          <div data-testid="outside">outside</div>
          <SelectList
            data={[
              { value: '1', label: '1', disabled: false },
              { value: '2', label: '2', disabled: false },
            ]}
            value="1"
            onChange={onChange}
            testId="select-list"
          >
            <div>test</div>
          </SelectList>
        </div>,
      );
      fireEvent.click(screen.getByTestId('select-list-trigger'));
      fireEvent.pointerDown(screen.getByTestId('outside'));
      expect(onChange).not.toHaveBeenCalled();
    });
  });
});

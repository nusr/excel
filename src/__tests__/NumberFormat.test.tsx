import { App } from '@/containers';
import * as React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { initController } from '@/controller';
import './global.mock';
import { type } from './util';
import { numberFormatOptionList } from '@/util';

describe('NumberFormat.test.tsx', () => {
  describe('General', () => {
    test('ok', () => {
      act(() => {
        render(<App controller={initController()} />);
      });
      expect(
        screen.getByTestId('toolbar-number-format-value'),
      ).toHaveTextContent('General');
    });
  });
  describe('active status', () => {
    for (let i = 0; i < numberFormatOptionList.length; i++) {
      const item = numberFormatOptionList[i];
      if (!item.value) {
        continue;
      }
      test(item.label, () => {
        act(() => {
          render(<App controller={initController()} />);
        });
        type('1');
        fireEvent.click(screen.getByTestId('toolbar-number-format-trigger'));
        const dom = screen.getByTestId('toolbar-number-format-popup');
        dom.setAttribute('data-value', item.value);
        fireEvent.click(dom);

        fireEvent.click(screen.getByTestId('toolbar-number-format-trigger'));
        expect(
          screen
            .getByTestId('toolbar-number-format-popup')
            .querySelector(`div:nth-child(${i + 1}) > span:nth-child(2)`),
        ).toBeInTheDocument();
      });
    }
  });
  describe('Percentage', () => {
    test('ok', () => {
      act(() => {
        render(<App controller={initController()} />);
      });
      type('1.2345');
      fireEvent.click(screen.getByTestId('toolbar-number-format-trigger'));
      const dom = screen.getByTestId('toolbar-number-format-popup');
      dom.setAttribute('data-value', '0.00%');
      fireEvent.click(dom);
      expect(screen.getByTestId('formula-editor-trigger')).toHaveTextContent(
        '123.45%',
      );
    });
  });
});

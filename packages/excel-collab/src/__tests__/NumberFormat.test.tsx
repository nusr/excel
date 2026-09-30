import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import './global.mock';
import { type, renderComponent } from './util';
import { numberFormatOptionList } from '../containers/ToolBar/constant';

describe('NumberFormat.test.tsx', () => {
  beforeEach(async () => {
    await renderComponent();
  });
  describe('General', () => {
    test('ok', () => {
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
      test(item.label, async () => {
        const user = userEvent.setup();
        type('1');
        const trigger = screen.getByTestId('toolbar-number-format-trigger');
        await user.click(trigger);
        await user.click(
          screen.getByRole('menuitemradio', { name: item.label }),
        );
        await user.click(trigger);

        expect(
          screen.getByRole('menuitemradio', { name: item.label }),
        ).toHaveAttribute('aria-checked', 'true');
      });
    }
  });
  describe('Percentage', () => {
    test('ok', async () => {
      const user = userEvent.setup();
      type('1.2345');
      await user.click(screen.getByTestId('toolbar-number-format-trigger'));
      await user.click(
        screen.getByRole('menuitemradio', { name: 'Percentage' }),
      );

      expect(screen.getByTestId('formula-editor-trigger')).toHaveTextContent(
        '123.45%',
      );
    });
  });
});

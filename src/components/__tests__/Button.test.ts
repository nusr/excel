import { Button, ButtonProps } from '../Button';
import { h, render } from '@/react';

describe('Button.test.ts', () => {
  test('normal', () => {
    render(
      h<ButtonProps>(
        Button,
        { active: true, className: 'button_test' },
        'button',
      ),
      document.body,
    );
    expect(document.querySelector('.button_test.active')!.textContent).toEqual(
      'button',
    );
  });
  test('icon button', () => {
    render(
      h<ButtonProps>(
        Button,
        {
          active: true,
          className: 'icon_button',
          icon: 'alignCenter',
          type: 'circle',
        },
        'add',
      ),
      document.body,
    );
    expect(document.querySelector('.icon_button.circle')!.textContent).toEqual(
      'add',
    );
    expect(document.querySelector('.icon_button')!.childNodes).toHaveLength(1);
  });
});

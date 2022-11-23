import { Button } from '../Button';
import { render } from '@/react';

describe('Button.test.ts', () => {
  test('normal', () => {
    const dom = render(
      document.body,
      Button({ active: true, className: 'button_test' }, 'button'),
    );
    expect(dom.elm!.textContent).toEqual('button');
  });
  test('icon button', () => {
    const dom = render(
      document.body,
      Button(
        {
          active: true,
          className: 'icon_button',
          type: 'circle',
        },
        'add',
      ),
    );
    expect(dom.elm!.textContent).toEqual('add');
    expect(dom.elm!.childNodes).toHaveLength(1);
  });
});

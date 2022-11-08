import { Button } from '../Button';
import { render } from '@/react';

describe('Button.test.ts', () => {
  test('normal', () => {
    const dom = render(
      document.body,
      Button({ active: true, className: 'button_test' }, 'button'),
    );
    expect(dom.textContent).toEqual('button');
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
    expect(dom.textContent).toEqual('add');
    expect(dom.childNodes).toHaveLength(1);
  });
});

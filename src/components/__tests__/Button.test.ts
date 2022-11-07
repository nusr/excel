import { Button } from '../Button';
import { render, text } from '@/react';
import { JSDOM } from 'jsdom';
global.document = new JSDOM(`<div id="app"></div>`).window.document;
describe('Button.test.ts', () => {
  test('normal', () => {
    render(
      document.getElementById('app')!,
      Button({ active: true, className: 'button_test' }, text('button')),
    );
    expect(document.querySelector('.button_test.active')!.textContent).toEqual(
      'button',
    );
  });
  test('icon button', () => {
    render(
      document.getElementById('app')!,
      Button(
        {
          active: true,
          className: 'icon_button',
          type: 'circle',
        },
        text('add'),
      ),
    );
    expect(document.querySelector('.icon_button.circle')!.textContent).toEqual(
      'add',
    );
    expect(document.querySelector('.icon_button')!.childNodes).toHaveLength(1);
  });
});

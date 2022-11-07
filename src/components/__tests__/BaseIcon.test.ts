import { Icon } from '../BaseIcon';
import { render } from '@/react';
import { JSDOM } from 'jsdom';

global.document = new JSDOM(`<div id="app"></div>`).window.document;

describe('BaseIcon.test.ts', () => {
  test('normal', () => {
    render(
      document.getElementById('app')!,
      Icon({ name: 'plus', className: 'icon' }),
    );
    expect(document.querySelector('.icon')).not.toBeNull();
  });
});

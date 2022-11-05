import { App } from '../App';
import { h, render } from '@/react';

describe('App.test.ts', () => {
  test('normal', () => {
    App.onceMount = () => {};
    render(h(App, {}), document.body);
    expect(document.querySelector('.app-container')!.childNodes).toHaveLength(
      4,
    );
  });
});

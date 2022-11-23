import { App } from '../App';
import { render } from '@/react';
import { DEFAULT_STORE_VALUE } from '@/util';
import { initController } from '../init';

describe('App.test.ts', () => {
  test('normal', () => {
    const dom = render(
      document.body,
      App(DEFAULT_STORE_VALUE, initController()),
    );
    expect(dom.elm!.childNodes).toHaveLength(4);
  });
});

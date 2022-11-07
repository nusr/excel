import { App } from '../App';
import { render } from '@/react';
import { JSDOM } from 'jsdom';

global.document = new JSDOM(`<div id="app"></div>`).window.document;

describe('App.test.ts', () => {
  test('normal', () => {
    render(document.getElementById('app')!, App({}));
    expect(document.querySelector('.app-container')!.childNodes).toHaveLength(
      4,
    );
  });
});

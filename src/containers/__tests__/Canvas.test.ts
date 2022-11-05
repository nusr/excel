import { CanvasContainer } from '..';
import { h, render } from '@/react';

describe('CanvasContainer.test.ts', () => {
  test('normal', () => {
    render(h(CanvasContainer, {}), document.body);
    expect(
      document.querySelector('.canvas-container')!.childNodes,
    ).toHaveLength(1);
    expect(
      document.querySelector('.canvas-container')!.firstChild!.nodeName,
    ).toEqual('CANVAS');
  });
});

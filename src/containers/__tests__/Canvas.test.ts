import { CanvasContainer } from '..';
import { render } from '@/react';

describe('CanvasContainer.test.ts', () => {
  test('normal', () => {
    const dom = render(document.body, CanvasContainer({}));
    expect(dom.querySelector('.canvas-container')!.childNodes).toHaveLength(1);
    expect(
      dom.querySelector('.canvas-container')!.firstChild!.nodeName,
    ).toEqual('CANVAS');
  });
});

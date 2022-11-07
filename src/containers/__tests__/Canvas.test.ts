import { CanvasContainer } from '..';
import { render } from '@/react';

describe('CanvasContainer.test.ts', () => {
  test('normal', () => {
    render(document.body, CanvasContainer({}));
    expect(
      document.querySelector('.canvas-container')!.childNodes,
    ).toHaveLength(1);
    expect(
      document.querySelector('.canvas-container')!.firstChild!.nodeName,
    ).toEqual('CANVAS');
  });
});

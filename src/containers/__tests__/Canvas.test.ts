import { CanvasContainer } from '../canvas';
import { render } from '@/react';
import { DEFAULT_STORE_VALUE } from '@/util';
import { initController } from '../../init';

describe('CanvasContainer.test.ts', () => {
  test('normal', () => {
    render(
      document.body,
      CanvasContainer(DEFAULT_STORE_VALUE, initController()),
    );
    expect(
      document.body.querySelector('[data-test-id="canvas-container"]')!.childNodes,
    ).toHaveLength(3);
    expect(
      document.body.querySelector('[data-test-id="canvas-container"]')!.firstChild!.nodeName,
    ).toEqual('CANVAS');
  });
});

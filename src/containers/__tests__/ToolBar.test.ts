import { ToolbarContainer } from '..';
import { render } from '@/react';
import { DEFAULT_STORE_VALUE } from '@/util';
import { initController } from '../../init';

describe('ToolbarContainer.test.ts', () => {
  test('normal', () => {
    render(
      document.body,
      ToolbarContainer(DEFAULT_STORE_VALUE, initController()),
    );
    expect(
      document.body.querySelector('.toolbar-wrapper')!.childNodes.length,
    ).toBeGreaterThanOrEqual(3);
  });
});

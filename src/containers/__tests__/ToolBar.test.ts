import { ToolbarContainer } from '../ToolBar';
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
      document.body.querySelector('[data-test-id="toolbar"]')!.childNodes.length,
    ).toBeGreaterThanOrEqual(3);
  });
});

import { SheetBarContainer } from '../SheetBar';
import { render } from '@/react';
import { DEFAULT_STORE_VALUE } from '@/util';
import { initController } from '../../init';

describe('SheetBarContainer.test.ts', () => {
  test('normal', () => {
    render(
      document.body,
      SheetBarContainer(DEFAULT_STORE_VALUE, initController()),
    );
    expect(
      document.body.querySelector('.sheet-bar-list')!.childNodes,
    ).toHaveLength(0);
  });
});

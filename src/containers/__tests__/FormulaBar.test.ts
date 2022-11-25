import { FormulaBarContainer } from '..';
import { render } from '@/react';
import { DEFAULT_STORE_VALUE } from '@/util';
import { initController } from '../../init';

describe('FormulaBarContainer.test.ts', () => {
  test('normal', () => {
    render(
      document.body,
      FormulaBarContainer(DEFAULT_STORE_VALUE, initController()),
    );
    expect(
      document.body.querySelector('.formula-bar-name')!.textContent,
    ).toEqual('A1');
    expect(
      document.body.querySelector('.formula-bar-wrapper')!.childNodes,
    ).toHaveLength(2);
  });
});

import { FormulaBarContainer } from '..';
import { render } from '@/react';
import globalStore from '@/store';

describe('FormulaBarContainer.test.ts', () => {
  test('normal', () => {
    globalStore.set({
      activeCell: {
        row: 0,
        col: 0,
      },
    });
    render(document.body, FormulaBarContainer({}));
    expect(
      document.querySelector('.formula-bar-wrapper')!.childNodes,
    ).toHaveLength(2);
    expect(document.querySelector('.formula-bar-name')!.textContent).toEqual(
      'A1',
    );
  });
});

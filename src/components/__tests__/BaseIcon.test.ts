import { BaseIcon, BaseIconProps } from '../BaseIcon';
import { h, render } from '@/react';

describe('BaseIcon.test.ts', () => {
  test('normal', () => {
    render(
      h<BaseIconProps>(BaseIcon, { name: 'plus', className: 'icon' }),
      document.body,
    );
    expect(document.querySelector('.icon')).not.toBeNull();
  });
});

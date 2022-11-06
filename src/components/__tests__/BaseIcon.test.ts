import { Icon, IconProps } from '../BaseIcon';
import { h, render } from '@/react';

describe('BaseIcon.test.ts', () => {
  test('normal', () => {
    render(
      h<IconProps>(Icon, { name: 'plus', className: 'icon' }),
      document.body,
    );
    expect(document.querySelector('.icon')).not.toBeNull();
  });
});

import { Icon } from '../BaseIcon';
import { render } from '@/react';

describe('BaseIcon.test.ts', () => {
  test('normal', () => {
    const dom = render(
      document.body,
      Icon({ name: 'plus', className: 'icon' }),
    );
    expect(dom).not.toBeNull();
  });
});

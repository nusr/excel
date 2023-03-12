import { ColorPicker } from '..';
import { render } from '@/react';

describe('ColorPicker.test.ts', () => {
  test('normal', () => {
    const dom = render(
      document.body,
      ColorPicker({
        color: '#fff',
        key: 'test',
        onChange() {},
      }),
    );
    expect(dom).not.toBeNull();
  });
});

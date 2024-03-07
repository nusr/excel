import { Dialog } from '../Dialog';
import { cleanup, render } from '@testing-library/react';
import React from 'react';

describe('Dialog.test.ts', () => {
  afterEach(cleanup);
  test('normal', () => {
    const dom = render(
      <Dialog visible title="test" getContainer={() => document.body}>
        <div className="test_dialog">test</div>
      </Dialog>,
    );
    expect(dom).not.toBeNull();
    expect(
      document.body.querySelector('[class="test_dialog"]')!.textContent,
    ).toEqual('test');
  });
});

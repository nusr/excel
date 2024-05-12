import { Button } from '../Button';
import { cleanup, render } from '@testing-library/react';
import React from 'react';

describe('Button.test.ts', () => {
  afterEach(cleanup);
  test('normal', () => {
    const dom = render(
      <Button active className="button_test">
        button
      </Button>,
    );
    expect(dom.container.textContent).toEqual('button');
  });
  test('icon button', () => {
    const dom = render(
      <Button active className="icon_button" type="circle">
        add
      </Button>,
    );
    expect(dom.container.textContent).toEqual('add');
    expect(dom.container.childNodes).toHaveLength(1);
  });
});

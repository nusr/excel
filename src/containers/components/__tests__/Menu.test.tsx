import { Menu, SubMenu, MenuItem } from '../Menu';
import { Button } from '../Button';
import React from 'react';
import { cleanup, render } from '@testing-library/react';

describe('BaseIcon.test.ts', () => {
  afterEach(cleanup);
  test('normal', () => {
    const dom = render(
      <Menu menuButton={<Button>trigger</Button>}>
        <MenuItem>33</MenuItem>
        <MenuItem>44</MenuItem>
        <SubMenu label="test">
          <MenuItem>11</MenuItem>
          <MenuItem>22</MenuItem>
        </SubMenu>
      </Menu>,
    );
    expect(dom.container.childNodes.length).toEqual(1);
  });
});

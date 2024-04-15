import { Menu, SubMenu, MenuItem } from '../Menu';
import { Button } from '../Button';
import React from 'react';
import {
  cleanup,
  fireEvent,
  render,
  screen,
  act,
} from '@testing-library/react';

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
  test('subMenu', () => {
    act(() => {
      render(
        <Menu testId="menu" menuButton={<Button testId="test">trigger</Button>}>
          <MenuItem>33</MenuItem>
          <MenuItem>44</MenuItem>
          <SubMenu label="test" testId="subMenu">
            <MenuItem>11</MenuItem>
            <MenuItem>22</MenuItem>
          </SubMenu>
        </Menu>,
      );
    });
    fireEvent.click(screen.getByTestId('menu'));
    fireEvent.click(screen.getByTestId('subMenu'));
    expect(screen.getByTestId('subMenu').childNodes.length).toEqual(2);
  });
  test('click outside', () => {
    act(() => {
      render(
        <div>
          <div data-testid="outside">outside</div>
          <Menu
            testId="menu"
            menuButton={<Button testId="test">trigger</Button>}
          >
            <MenuItem>33</MenuItem>
            <MenuItem>44</MenuItem>
            <SubMenu label="test" testId="subMenu">
              <MenuItem>11</MenuItem>
              <MenuItem>22</MenuItem>
            </SubMenu>
          </Menu>
          ,
        </div>,
      );
    });
    fireEvent.click(screen.getByTestId('menu'));
    fireEvent.click(screen.getByTestId('subMenu'));
    expect(screen.getByTestId('subMenu').childNodes.length).toEqual(2);
    fireEvent.pointerDown(screen.getByTestId('outside'));
    expect(() => screen.getByTestId('subMenu')).toThrow();
  });
});

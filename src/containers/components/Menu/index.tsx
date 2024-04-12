import React, { FunctionComponent, useState, memo, useCallback } from 'react';
import styles from './index.module.css';
import { classnames } from '@/util';
import { useClickOutside } from '../../hooks';

type MenuItemProps = {
  onClick?: () => void;
  testId?: string;
};
type SubMenuProps = {
  label: string;
  testId?: string;
  className?: string;
};
type MenuProps = {
  menuButton: React.ReactElement;
  testId?: string;
  className?: string;
};
export const MenuItem: FunctionComponent<
  React.PropsWithChildren<MenuItemProps>
> = ({ onClick, children, testId }) => {
  return (
    <li className={styles.menuItem} onClick={onClick} data-testid={testId}>
      {children}
    </li>
  );
};

export const SubMenu: FunctionComponent<
  React.PropsWithChildren<SubMenuProps>
> = ({ label, children, testId, className }) => {
  const [open, setOpen] = useState(false);
  const handleClick = useCallback(() => {
    setOpen((v) => !v);
  }, []);

  return (
    <li
      className={classnames(styles.menuItem, className)}
      onClick={handleClick}
      data-testid={testId}
    >
      <div>{label}</div>
      {open && (
        <div className={classnames(styles.subMenuContainer, styles.portal)}>
          <ul className={styles.menu}>{children}</ul>
        </div>
      )}
    </li>
  );
};

export const Menu: FunctionComponent<React.PropsWithChildren<MenuProps>> = memo(
  ({ menuButton, children, testId, className }) => {
    const [open, setOpen] = useState(false);
    const handleClick = useCallback(() => {
      setOpen((v) => !v);
    }, []);
    const [ref] = useClickOutside(() => setOpen(false));
    return (
      <div className={classnames(styles.container, className)} ref={ref}>
        <div onClick={handleClick} data-testid={testId}>
          {menuButton}
        </div>
        {open && (
          <div
            className={classnames(styles.menuContainer, styles.portal)}
            data-testid={`${testId}-portal`}
          >
            <ul className={styles.menu}>{children}</ul>
          </div>
        )}
      </div>
    );
  },
);

Menu.displayName = 'Menu';

import React, { FunctionComponent, useState } from 'react';
import styles from './index.module.css';
import { classnames } from '@/util';

type MenuItemProps = {
  onClick?: () => void;
  testId?: string;
};
type SubMenuProps = {
  label: string;
  style?: React.CSSProperties;
  testId?: string;
};
type MenuProps = {
  menuButton: React.ReactElement;
  style?: React.CSSProperties;
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
> = ({ label, children, style, testId }) => {
  const [open, setOpen] = useState(false);
  const handleClick = () => {
    setOpen((v) => !v);
  };
  return (
    <li className={styles.menuItem} onClick={handleClick} data-testid={testId}>
      <div>{label}</div>
      {open && (
        <div
          className={classnames(styles.subMenuContainer, styles.portal)}
          style={style}
        >
          <ul className={styles.menu}>{children}</ul>
        </div>
      )}
    </li>
  );
};

export const Menu: FunctionComponent<React.PropsWithChildren<MenuProps>> = ({
  menuButton,
  children,
  style,
}) => {
  const [open, setOpen] = useState(false);
  const handleClick = () => {
    setOpen((v) => !v);
  };
  return (
    <div className={styles.container} onMouseLeave={() => setOpen(false)}>
      <div onClick={handleClick}>{menuButton}</div>
      {open && (
        <div
          className={classnames(styles.menuContainer, styles.portal)}
          style={style}
        >
          <ul className={styles.menu}>{children}</ul>
        </div>
      )}
    </div>
  );
};

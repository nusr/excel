import React, { FunctionComponent, useState, memo, useCallback } from 'react';
import styles from './index.module.css';
import { classnames } from '@/util';
import { useClickOutside } from '../../hooks';
import { Button } from '../Button';

type MenuItemProps = {
  onClick?: () => void;
  testId?: string;
};

type MenuProps = {
  label: React.ReactNode;
  isPlain?: boolean;
  testId?: string;
  className?: string;
  position?: 'right' | 'bottom';
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

export const SubMenu: FunctionComponent<React.PropsWithChildren<MenuProps>> = ({
  label,
  children,
  testId,
  className,
}) => {
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
  ({
    label,
    children,
    testId,
    className,
    isPlain = false,
    position = 'right',
  }) => {
    const buttonType = isPlain ? 'plain' : undefined;
    const [open, setOpen] = useState(false);
    const handleClick = useCallback(() => {
      setOpen((v) => !v);
    }, []);
    const [ref] = useClickOutside(() => setOpen(false));
    return (
      <div
        className={classnames(styles.container, className)}
        ref={ref}
        data-testid={testId}
      >
        <Button
          onClick={handleClick}
          testId={`${testId}-trigger`}
          type={buttonType}
          className={styles.trigger}
        >
          {label}
        </Button>
        {open && (
          <div
            className={classnames(styles.menuContainer, styles.portal, {
              [styles.bottom]: position === 'bottom',
            })}
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

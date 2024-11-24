import React, { FunctionComponent, useState, memo, useCallback } from 'react';
import styles from './index.module.css';
import { classnames } from '@excel/shared';
import { useClickOutside } from '../../containers/hooks';
import { Button } from '../Button';

type MenuItemProps = {
  onClick?: () => void;
  testId?: string;
  active?: boolean;
};

type MenuProps = {
  label: React.ReactNode;
  isPlain?: boolean;
  testId?: string;
  className?: string;
  position?: 'right' | 'bottom';
  size?: 'normal' | 'small';
  portalClassName?: string;
};

type SubMenuProps = Pick<
  MenuProps,
  'label' | 'testId' | 'className' | 'portalClassName'
>;
export const MenuItem: FunctionComponent<
  React.PropsWithChildren<MenuItemProps>
> = ({ onClick, children, testId, active = false }) => {
  return (
    <li
      className={classnames(styles.menuItem, { [styles.active]: active })}
      onClick={onClick}
      data-testid={testId}
    >
      {children}
    </li>
  );
};

export const SubMenu: FunctionComponent<
  React.PropsWithChildren<SubMenuProps>
> = ({ label, children, testId, className, portalClassName }) => {
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
        <div
          className={classnames(
            styles.subMenuContainer,
            styles.portal,
            portalClassName,
          )}
        >
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
    size = 'normal',
    portalClassName,
  }) => {
    const buttonType = isPlain ? 'plain' : undefined;
    const [open, setOpen] = useState(false);
    const handleClick = useCallback(() => {
      setOpen((v) => !v);
    }, []);
    const closeMenu = useCallback(() => {
      setOpen(false);
    }, []);
    const ref = useClickOutside(closeMenu, open);
    return (
      <div
        className={classnames(styles.container, className, {
          [styles.small]: size === 'small',
        })}
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

        <div
          className={classnames(
            styles.menuContainer,
            styles.portal,
            portalClassName,
            {
              [styles.bottom]: position === 'bottom',
            },
          )}
          data-testid={`${testId}-portal`}
          hidden={!open}
        >
          <ul className={styles.menu}>{children}</ul>
        </div>
      </div>
    );
  },
);

Menu.displayName = 'Menu';

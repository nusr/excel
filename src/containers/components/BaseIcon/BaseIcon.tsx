import { classnames } from '@/util';
import styles from './BaseIcon.module.css';
import React, { FunctionComponent } from 'react';

type PathItem = {
  d: string;
  'fill-opacity'?: string;
};

export interface BaseIconProps {
  className?: string;
  paths: PathItem[];
}

export const BaseIcon: FunctionComponent<BaseIconProps> = ({
  className = '',
  paths = [],
}) => {
  return (
    <svg
      className={classnames(styles.baseIcon, className)}
      viewBox="0 0 1137 1024"
      aria-hidden
    >
      {paths.map((item, i) => (
        <path d={item.d} key={i} fillOpacity={item['fill-opacity']} />
      ))}
    </svg>
  );
};
BaseIcon.displayName = 'BaseIcon';

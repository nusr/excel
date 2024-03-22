import { classnames } from '@/util';
import styles from './BaseIcon.module.css';
import React, { FunctionComponent } from 'react';

interface PathItem {
  d: string;
  'fill-opacity'?: string;
}

export interface BaseIconProps {
  className?: string;
  paths: PathItem[];
  fill?: string;
}

export const BaseIcon: FunctionComponent<BaseIconProps> = ({
  className = '',
  paths = [],
  fill = 'currentcolor',
}) => {
  return (
    <svg
      fill={fill}
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

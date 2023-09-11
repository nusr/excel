import { h, FunctionComponent } from '@/react';
import { classnames } from '@/util';
import styles from './BaseIcon.module.css';

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
  return h(
    'svg',
    {
      className: classnames(styles.baseIcon, className),
      viewBox: '0 0 1137 1024',
      'aria-hidden': true,
    },
    ...paths.map((item) => h('path', item)),
  );
};
BaseIcon.displayName = 'BaseIcon';

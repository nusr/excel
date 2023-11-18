import React, { FunctionComponent, CSSProperties, useState } from 'react';
import { classnames } from '@/util';
import styles from './index.module.css';

export interface ColorPickerProps {
  color: string;
  style?: CSSProperties;
  onChange: (value: string) => void;
}
const NO_FILL = 'No Fill';
const COLOR_LIST = [
  '#4D4D4D',
  '#999999',
  '#FFFFFF',
  '#F44E3B',
  '#FE9200',
  '#FCDC00',
  '#DBDF00',
  '#A4DD00',
  '#68CCCA',
  '#73D8FF',
  '#AEA1FF',
  '#FDA1FF',
  '#333333',
  '#808080',
  '#cccccc',
  '#D33115',
  '#E27300',
  '#FCC400',
  '#B0BC00',
  '#68BC00',
  '#16A5A5',
  '#009CE0',
  '#7B64FF',
  '#FA28FF',
  '#000000',
  '#666666',
  '#B3B3B3',
  '#9F0500',
  '#C45100',
  '#FB9E00',
  '#808900',
  '#194D33',
  '#0C797D',
  '#0062B1',
  '#653294',
  '#AB149E',
  NO_FILL,
];

export const ColorPicker: FunctionComponent<React.PropsWithChildren<ColorPickerProps>> = (props) => {
  const { color, style = {}, onChange, children } = props;
  const [visible, setVisible] = useState(false);
  return (
    <div className={styles['color-picker']} style={style}>
      <div className={styles['color-picker-trigger']} style={{ color }} onClick={() => setVisible(true)}>
        {children}
      </div>
      <div
        className={classnames(styles['color-picker-wrapper'], {
          [styles['show']]: visible,
        })}
        onMouseLeave={() => setVisible(false)}
      >
        <div className={styles['color-picker-list']}>
          {COLOR_LIST.map((item) => {
            const isEmpty = item === NO_FILL;
            return (
              <div
                key={item}
                className={classnames(styles['color-picker-item'], {
                  [styles['no-fill']]: isEmpty,
                })}
                style={{ backgroundColor: item }}
                onClick={() => {
                  setVisible(false);
                  onChange(isEmpty ? '' : item);
                }}
              >
                {isEmpty ? NO_FILL : ''}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
ColorPicker.displayName = 'ColorPicker';

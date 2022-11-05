import { h, useState, Component } from '@/react';
import { classnames } from '@/util';
export type ColorPickerProps = {
  color: string;
  style?: string;
  onChange: (value: string) => void;
};
export const COLOR_LIST = [
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
];

export const ColorPicker: Component<ColorPickerProps> = (props, children) => {
  const { color, style = '', onChange } = props;
  const [visible, setVisible] = useState(false);
  const toggleColorPicker = () => {
    setVisible((v) => !v);
  };
  const handleBlur = () => {
    setVisible(false);
  };
  return h(
    'div',
    {
      className: 'relative',
      style: style,
      onblur: handleBlur,
      onmouseleave: handleBlur,
    },
    h(
      'div',
      {
        className: 'color-picker-trigger',
        style: `color:${color};`,
        onclick: toggleColorPicker,
      },
      ...children,
    ),

    h(
      'div',
      {
        className: classnames('color-picker-wrapper', {
          show: visible,
        }),
      },
      h(
        'div',
        {
          className: 'color-picker-list',
        },
        ...COLOR_LIST.map((item) =>
          h('div', {
            key: item,
            className: 'color-picker-item',
            style: `background-color:${item};`,
            onclick: () => {
              onChange(item);
              setVisible(false);
            },
          }),
        ),
      ),
    ),
  );
};
ColorPicker.displayName = 'ColorPicker';

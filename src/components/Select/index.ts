import { h } from '@/react';
import { classnames } from '@/util';
import { OptionItem, Component } from '@/types';

export type SelectProps = {
  value?: string | number;
  style?: string;
  data: Array<string | number | OptionItem>;
  getItemStyle?: (value: string | number) => string;
  onChange: (value: string | number) => void;
};

export const Select: Component<SelectProps> = (props) => {
  const {
    data,
    value: activeValue,
    style = '',
    onChange,
    getItemStyle = () => '',
  } = props;
  const handleChange = (event: any) => {
    const { value } = event.target;
    onChange(value);
  };
  return h(
    'select',
    {
      onchange: handleChange,
      value: activeValue,
      style,
      name: 'select',
      className: 'select-list',
    },
    ...data.map((item) => {
      const value = typeof item === 'object' ? item.value : item;
      const label = typeof item === 'object' ? item.label : item;
      const disabled = typeof item === 'object' ? item.disabled : false;
      const itemStyle = getItemStyle(value);
      return h(
        'option',
        {
          key: value,
          value,
          style: itemStyle,
          className: classnames('select-item', { disabled }),
        },
        label,
      );
    }),
  );
};
Select.displayName = 'Select';
import React, { memo } from 'react';

import { Hue } from './Hue';
import { Saturation } from './Saturation';

import { ColorModel, ColorPickerBaseProps, AnyColor } from './types';
import { useColorManipulation } from './useColorManipulation';
import { classnames, convertColorToHex } from '@/util';
import { hexToHsva, hsvaToHex } from './convert';
import styles from './panel.module.css';

interface Props<T extends AnyColor> extends Partial<ColorPickerBaseProps<T>> {
  colorModel: ColorModel<T>;
}

const ColorPicker = <T extends AnyColor>({
  className,
  colorModel,
  color = colorModel.defaultColor,
  onChange,
}: Props<T>): JSX.Element => {
  const [hsva, updateHsva] = useColorManipulation<T>(
    colorModel,
    color,
    onChange,
  );

  return (
    <div className={classnames(styles['color-picker-panel'], className)}>
      <Saturation hsva={hsva} onChange={updateHsva} />
      <Hue
        hue={hsva.h}
        onChange={updateHsva}
        className={styles['color-picker-panel__last-control']}
      />
    </div>
  );
};

const colorModel: ColorModel<string> = {
  defaultColor: '000',
  toHsva: hexToHsva,
  fromHsva: ({ h, s, v }) => hsvaToHex({ h, s, v, a: 1 }),
  equal: (first, second) => {
    const a = convertColorToHex(first);
    const b = convertColorToHex(second);
    return a === b;
  },
};

export const ColorPickerPanel = memo(
  (props: Partial<ColorPickerBaseProps<string>>): JSX.Element => (
    <ColorPicker
      className={props.className}
      color={props.color}
      onChange={props.onChange}
      colorModel={colorModel}
    />
  ),
);

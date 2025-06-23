import { memo } from 'react';

import { Hue } from './Hue';
import { Saturation } from './Saturation';

import { ColorModel, ColorPickerBaseProps, AnyColor } from './types';
import { useColorManipulation } from './useColorManipulation';
import { classnames, convertColorToHex } from '../../util';
import { hexToHsva, hsvaToHex } from './convert';
import styles from './panel.module.css';

interface Props<T extends AnyColor> extends Partial<ColorPickerBaseProps<T>> {
  colorModel: ColorModel<T>;
}

const ColorPicker = <T extends AnyColor>({
  className,
  colorModel,
  color,
  onChange,
  testId,
}: Props<T>) => {
  const [hsva, updateHsva] = useColorManipulation<T>(
    colorModel,
    color || colorModel.defaultColor,
    onChange,
  );

  return (
    <div className={classnames(styles['color-picker-panel'], className)}>
      <Saturation hsva={hsva} onChange={updateHsva} testId={testId} />
      <Hue
        hue={hsva.h}
        onChange={updateHsva}
        className={styles['color-picker-panel__last-control']}
        testId={testId}
      />
    </div>
  );
};

const colorModel: ColorModel<string> = {
  defaultColor: '#000',
  toHsva: hexToHsva,
  fromHsva: ({ h, s, v }) => hsvaToHex({ h, s, v, a: 1 }),
  equal: (first, second) => {
    const a = convertColorToHex(first);
    const b = convertColorToHex(second);
    return a === b;
  },
};

export const ColorPickerPanel = memo(
  (props: Partial<ColorPickerBaseProps<string>>) => (
    <ColorPicker
      className={props.className}
      color={props.color}
      onChange={props.onChange}
      testId={props.testId}
      colorModel={colorModel}
    />
  ),
);

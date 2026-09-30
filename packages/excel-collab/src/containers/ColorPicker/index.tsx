import {
  ColorPicker as AriaColorPicker,
  ColorSpace,
  getColorChannels,
  type ColorPickerProps as AriaColorPickerProps,
} from 'react-aria-components/ColorPicker';
import { DialogTrigger } from '../../component/Dialog';
import { ColorSlider } from '../../component/ColorSlider';
import { ColorArea } from '../../component/ColorArea';
import { ColorField } from '../../component/ColorField';
import { Popover } from '../../component/Popover';
import { Select, SelectItem } from '../../component/Select';
import {
  ColorSwatchPicker,
  ColorSwatchPickerItem,
} from '../../component/ColorSwatchPicker';
import { Button } from '../../component/Button';
import { COLOR_PICKER_COLOR_LIST } from '../../util';
import { useState } from 'react';

export interface ColorPickerProps extends Omit<
  AriaColorPickerProps,
  'children' | 'onChange'
> {
  children: React.ReactNode;
  onReset?: () => void;
  onChange?: (color: string) => void;
  'data-testid'?: string;
}

export function ColorPicker({
  children,
  onReset,
  onChange,
  'data-testid': testId,
  ...props
}: ColorPickerProps) {
  const [space, setSpace] = useState<ColorSpace>('rgb');
  const controlPrefix = testId?.replace(/-picker$/, '');
  const pickerValue = props.value || '#000000';
  return (
    <AriaColorPicker
      {...props}
      value={pickerValue}
      onChange={(color) => onChange?.(color.toString('hex'))}
    >
      <DialogTrigger>
        {children}
        <Popover
          hideArrow
          placement="bottom start"
          className="color-picker-dialog"
        >
          <ColorArea
            colorSpace="hsb"
            xChannel="saturation"
            yChannel="brightness"
            aria-label="Saturation and brightness"
            data-testid={controlPrefix && `${controlPrefix}-saturation`}
          />
          <ColorSlider
            colorSpace="hsb"
            channel="hue"
            aria-label="Hue"
            data-testid={controlPrefix && `${controlPrefix}-hue`}
          />
          <ColorSwatchPicker
            aria-label="Color swatches"
            data-testid={controlPrefix && `${controlPrefix}-list`}
            value={pickerValue}
            onChange={(color) =>
              onChange?.(
                typeof color === 'string' ? color : color.toString('hex'),
              )
            }
          >
            {COLOR_PICKER_COLOR_LIST.map((color) => (
              <ColorSwatchPickerItem
                key={color}
                color={color}
                aria-label={color}
                data-testid={
                  controlPrefix &&
                  `${controlPrefix}-swatch-${color.replace('#', '')}`
                }
              />
            ))}
          </ColorSwatchPicker>
          <Select
            aria-label="Color space"
            data-testid={controlPrefix && `${controlPrefix}-space`}
            value={space}
            onChange={(s) => setSpace(s as ColorSpace)}
          >
            <SelectItem id="rgb" aria-label="RGB">
              RGB
            </SelectItem>
            <SelectItem id="hsl" aria-label="HSL">
              HSL
            </SelectItem>
            <SelectItem id="hsb" aria-label="HSB">
              HSB
            </SelectItem>
          </Select>
          <div style={{ display: 'flex', gap: 4, width: 192 }}>
            {getColorChannels(space).map((channel) => (
              <ColorField
                key={channel}
                colorSpace={space}
                channel={channel}
                label={channel}
                style={{ flex: 1 }}
              />
            ))}
          </div>
          {onReset && (
            <Button
              data-testid={`${controlPrefix}-reset`}
              variant="secondary"
              onPress={onReset}
              aria-label="Reset"
            >
              Reset
            </Button>
          )}
        </Popover>
      </DialogTrigger>
    </AriaColorPicker>
  );
}

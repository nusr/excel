import { Button } from './Button';
import {
  ColorPicker as AriaColorPicker,
  ColorSpace,
  getColorChannels,
  type ColorPickerProps as AriaColorPickerProps,
} from 'react-aria-components/ColorPicker';
import { DialogTrigger } from './Dialog';
import { ColorSlider } from './ColorSlider';
import { ColorArea } from './ColorArea';
import { ColorField } from './ColorField';
import { Popover } from './Popover';
import './ColorPicker.css';
import { useState } from 'react';
import { Select, SelectItem } from './Select';

export interface ColorPickerProps extends Omit<AriaColorPickerProps, 'children'> {
  label?: React.ReactNode;
  children?: React.ReactNode;
  'data-testid'?: string;
  onReset?: () => void;
  addTriggerColor?: boolean;
}

export function ColorPicker({
  label,
  children,
  onReset,
  'data-testid': testId = 'color-picker',
  addTriggerColor,
  ...props
}: ColorPickerProps) {
  const [space, setSpace] = useState<ColorSpace>('rgb');
  const controlPrefix = testId?.replace(/-picker$/, '');

  const hexValue = typeof props.value === 'object' ? props.value.toString('hex') : props.value;
  const colorValue = props.value || props.defaultValue || '#000000';

  return (
    <AriaColorPicker {...props} value={colorValue}>
      <DialogTrigger>
        {children ? (
          children
        ) : (
          <Button
            style={{
              color: addTriggerColor ? hexValue : undefined,
            }}
            className="color-picker-trigger"
            aria-label="Color Picker Trigger"
            data-testid={controlPrefix && `${controlPrefix}-trigger`}
          >
            {label}
          </Button>
        )}

        <Popover hideArrow placement="bottom start" className="color-picker-dialog">
          {
            <>
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
            </>
          }
        </Popover>
      </DialogTrigger>
    </AriaColorPicker>
  );
}

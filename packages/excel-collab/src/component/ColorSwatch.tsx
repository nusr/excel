'use client';
import {
  ColorSwatch as AriaColorSwatch,
  type ColorSwatchProps,
} from 'react-aria-components/ColorSwatch';
import { composeRenderProps } from 'react-aria-components/composeRenderProps';
import './ColorSwatch.css';

export function ColorSwatch(props: ColorSwatchProps) {
  return (
    <AriaColorSwatch
      {...props}
      style={composeRenderProps(props.style, (style, { color }) => ({
        background: `linear-gradient(${color}, ${color}),
          repeating-conic-gradient(#CCC 0% 25%, white 0% 50%) 50% / 16px 16px`,
        ...style,
      }))}
    />
  );
}

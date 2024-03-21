import React from 'react';

import { Interactive, Interaction } from './Interactive';
import { Pointer } from './Pointer';

import { hsvaToHslString } from './convert';
import { clamp } from './clamp';
import { round } from './round';
import { classnames } from '@/util';
import styles from './panel.module.css';

interface Props {
  className?: string;
  hue: number;
  onChange: (newHue: { h: number }) => void;
}

const HueBase = ({ className, hue, onChange }: Props) => {
  const handleMove = (interaction: Interaction) => {
    onChange({ h: 360 * interaction.left });
  };

  const handleKey = (offset: Interaction) => {
    // Hue measured in degrees of the color circle ranging from 0 to 360
    onChange({
      h: clamp(hue + offset.left * 360, 0, 360),
    });
  };

  return (
    <div className={classnames(styles['color-picker-panel__hue'], className)}>
      <Interactive
        onMove={handleMove}
        onKey={handleKey}
        aria-label="Hue"
        aria-valuenow={round(hue)}
        aria-valuemax="360"
        aria-valuemin="0"
      >
        <Pointer
          className={styles['color-picker-panel__hue-pointer']}
          left={hue / 360}
          color={hsvaToHslString({ h: hue, s: 100, v: 100, a: 1 })}
        />
      </Interactive>
    </div>
  );
};

export const Hue = React.memo(HueBase);

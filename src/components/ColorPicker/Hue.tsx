import React from 'react';
import { Interactive, Interaction } from './Interactive';
import { Pointer } from './Pointer';
import { hsvaToHslString } from './convert';
import { round } from './round';
import { classnames } from '../../util';
import styles from './panel.module.css';

interface Props {
  className?: string;
  hue: number;
  testId?: string;
  onChange: (newHue: { h: number }) => void;
}

const HueBase = ({ className, hue, testId, onChange }: Props) => {
  const handleMove = (interaction: Interaction) => {
    onChange({ h: 360 * interaction.left });
  };

  return (
    <div className={classnames(styles['color-picker-panel__hue'], className)}>
      <Interactive
        onMove={handleMove}
        aria-label="Hue"
        aria-valuenow={round(hue)}
        aria-valuemax="360"
        aria-valuemin="0"
        testId={`${testId}-hue`}
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

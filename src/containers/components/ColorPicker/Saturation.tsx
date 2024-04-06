import React, { useCallback } from 'react';
import { Interactive, Interaction } from './Interactive';
import { Pointer } from './Pointer';
import { HsvaColor } from './types';
import { hsvaToHslString } from './convert';
import { round } from './round';
import styles from './panel.module.css';

interface Props {
  hsva: HsvaColor;
  testId?: string;
  onChange: (newColor: { s: number; v: number }) => void;
}

const SaturationBase = ({ hsva, testId, onChange }: Props) => {
  const handleMove = useCallback((interaction: Interaction) => {
    onChange({
      s: interaction.left * 100,
      v: 100 - interaction.top * 100,
    });
  }, []);

  const containerStyle = {
    backgroundColor: hsvaToHslString({ h: hsva.h, s: 100, v: 100, a: 1 }),
  };

  return (
    <div
      className={styles['color-picker-panel__saturation']}
      style={containerStyle}
    >
      <Interactive
        onMove={handleMove}
        aria-label="Color"
        aria-valuetext={`Saturation ${round(hsva.s)}%, Brightness ${round(
          hsva.v,
        )}%`}
        testId={`${testId}-saturation`}
      >
        <Pointer
          className={styles['color-picker-panel__saturation-pointer']}
          top={1 - hsva.v / 100}
          left={hsva.s / 100}
          color={hsvaToHslString(hsva)}
        />
      </Interactive>
    </div>
  );
};

export const Saturation = React.memo(SaturationBase);

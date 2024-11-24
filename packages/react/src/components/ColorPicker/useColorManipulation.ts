import { useState, useEffect, useCallback, useRef } from 'react';
import { ColorModel, AnyColor, HsvaColor } from './types';
import { useEventCallback } from '../../containers/hooks/useEventCallback';
import { deepEqual } from '@excel/shared';

export function useColorManipulation<T extends AnyColor>(
  colorModel: ColorModel<T>,
  color: T,
  onChange?: (color: T) => void,
): [HsvaColor, (color: Partial<HsvaColor>) => void] {
  const onChangeCallback = useEventCallback<T>(onChange);

  // No matter which color model is used (HEX, RGB(A) or HSL(A)),
  // all internal calculations are based on HSVA model
  const [hsva, updateHsva] = useState<HsvaColor>(() =>
    colorModel.toHsva(color),
  );

  const cache = useRef({ color, hsva });

  useEffect(() => {
    if (!colorModel.equal(color, cache.current.color)) {
      const newHsva = colorModel.toHsva(color);
      cache.current = { hsva: newHsva, color };
      updateHsva(newHsva);
    }
  }, [color, colorModel]);

  useEffect(() => {
    let newColor;
    if (
      !deepEqual(hsva, cache.current.hsva) &&
      !colorModel.equal(
        (newColor = colorModel.fromHsva(hsva)),
        cache.current.color,
      )
    ) {
      cache.current = { hsva, color: newColor };
      onChangeCallback(newColor);
    }
  }, [hsva, colorModel, onChangeCallback]);

  // Merge the current HSVA color object with updated params.
  // For example, when a child component sends `h` or `s` only
  const handleChange = useCallback((params: Partial<HsvaColor>) => {
    updateHsva((current) => Object.assign({}, current, params));
  }, []);

  return [hsva, handleChange];
}

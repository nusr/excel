function hslaToHex(h: number, s: number, l: number, alpha: number) {
  s = s / 100; // Convert percentage to decimal
  l = l / 100; // Convert percentage to decimal

  // Convert HSL to RGB
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r, g, b;

  if (h >= 0 && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (h >= 60 && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (h >= 180 && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (h >= 240 && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else {
    r = c;
    g = 0;
    b = x;
  }
  if (alpha !== 1) {
    return `rgba(${r},${g},${b},${alpha})`;
  }

  // Adjust RGB values and convert to HEX
  const toHex = (value: number) =>
    Math.round(value * 255)
      .toString(16)
      .padStart(2, '0');
  const hexR = toHex(r + m);
  const hexG = toHex(g + m);
  const hexB = toHex(b + m);

  // Combine the values and return the HEX color
  return `#${hexR}${hexG}${hexB}`;
}

const RGBToHSL = (red: number, green: number, blue: number) => {
  // Make r, g, and b fractions of 1
  const r = red / 255;
  const g = green / 255;
  const b = blue / 255;

  // Find greatest and smallest channel values
  const cmin = Math.min(r, g, b);
  const cmax = Math.max(r, g, b);
  const delta = cmax - cmin;
  const hue = getHue(r, g, b);
  const lightness = getLightness(cmax, cmin);
  const saturation = getSaturation(delta, lightness);

  return [hue, saturation * 100, lightness * 100];
};

const getHue = (r: number, g: number, b: number) => {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const c = max - min;
  let hue: number = 0;
  if (c == 0) {
    hue = 0;
  } else {
    switch (max) {
      case r: {
        let segment = (g - b) / c;
        let shift = 0; // R° / (360° / hex sides)
        if (segment < 0) {
          // hue > 180, full rotation
          shift = 360 / 60; // R° / (360° / hex sides)
        }
        hue = segment + shift;
        break;
      }

      case g: {
        let segment = (b - r) / c;
        let shift = 120 / 60; // G° / (360° / hex sides)
        hue = segment + shift;
        break;
      }

      case b:
        let segment = (r - g) / c;
        let shift = 240 / 60; // B° / (360° / hex sides)
        hue = segment + shift;
        break;
    }
  }
  return hue * 60; // hue is in [0,6], scale it up
};

const getSaturation = (delta: number, lightness: number) =>
  delta == 0 ? 0 : delta / (1 - Math.abs(2 * lightness - 1));

const getLightness = (cmax: number, cmin: number) => (cmax + cmin) / 2;

const fullDarkMode = ([red, green, blue, alpha]: number[]) => {
  const [hue, saturation, lightness] = RGBToHSL(red, green, blue);
  return hslaToHex(hue, saturation * 0.9, 100 - lightness, alpha);
};

function hexToRgba(hex: string) {
  if (hex.startsWith('#')) {
    hex = hex.slice(1);
  }

  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);
  let a = parseInt(hex.substring(6, 8) || 'ff', 16);
  return [r, g, b, a / 255];
}

export const convertColorToDark = (color: string) => {
  if (color.startsWith('rgb')) {
    const t = color
      .replace('rgb', '')
      .replace('a', '')
      .replace('(', '')
      .replace(')', '');
    const list = t.split(',').map(Number);
    if (list.length <= 3) {
      list.push(1);
    }
    return fullDarkMode(list);
  } else {
    return fullDarkMode(hexToRgba(color));
  }
};

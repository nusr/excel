export const colorMap: Record<string, string> = {
  maroon: '#800000',
  red: '#ff0000',
  orange: '#ffA500',
  yellow: '#ffff00',
  olive: '#808000',
  purple: '#800080',
  fuchsia: '#ff00ff',
  white: '#ffffff',
  lime: '#00ff00',
  green: '#008000',
  navy: '#000080',
  blue: '#0000ff',
  aqua: '#00ffff',
  teal: '#008080',
  black: '#000000',
  silver: '#c0c0c0',
  gray: '#808080',
  transparent: '#0000',
  cyan: '#F00',
  magenta: '#00F'
};

const hexStr = '(?:#([a-f0-9]{3,8}))';
const numberStr = '\\s*([.\\d%]+)\\s*';
const sopStr = '(?:,\\s*([.\\d]+)\\s*)?';
const listStr = `\\(${[numberStr, numberStr, numberStr]}${sopStr}\\)`;
const rgbStr = '(?:rgb)a?';
const hslStr = '(?:hsl)a?';

const hexReg = RegExp(hexStr, 'i');
const rgbReg = RegExp(rgbStr + listStr, 'i');
const hslReg = RegExp(hslStr + listStr, 'i');

function padZero(a: string) {
  if (a.length === 1) {
    return `0${a}`;
  }
  return a;
}
function RGBAToHex(r: number, g: number, b: number, a: number) {
  const list = [r, g, b, a * 255];
  return `#${list
    .map((item) => padZero(Math.round(item).toString(16)))
    .join('')}`;
}
function RGBtoHEX(r: string, g: string, b: string, a: string): string {
  let alpha = 1;
  if (a) {
    alpha = parseFloat(a);
  }
  const red = parseFloat(r);
  const green = parseFloat(g);
  const blue = parseFloat(b);
  if (
    !(
      red <= 255 &&
      red >= 0 &&
      green <= 255 &&
      green >= 0 &&
      blue <= 255 &&
      blue >= 0 &&
      alpha <= 1 &&
      alpha >= 0
    )
  ) {
    return '';
  }
  return RGBAToHex(red, green, blue, alpha);
}

function HUEtoRGB(p: number, q: number, t: number) {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
}

function HSLAtoHEX(x: string, y: string, z: string, a: string) {
  let alpha = 1;
  if (a) {
    alpha = parseFloat(a) / 1;
  }
  const h = parseFloat(x) / 360;
  const s = parseFloat(y) / 360;
  const l = parseFloat(z) / 360;
  if (
    h > 1 ||
    h < 0 ||
    s > 1 ||
    s < 0 ||
    l > 1 ||
    l < 0 ||
    alpha > 1 ||
    alpha < 0
  ) {
    return '';
  }
  let r: number;
  let g: number;
  let b: number;
  if (s === 0) {
    r = l;
    g = l;
    b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = HUEtoRGB(p, q, h + 1 / 3);
    g = HUEtoRGB(p, q, h);
    b = HUEtoRGB(p, q, h - 1 / 3);
  }
  return RGBAToHex(r * 255, g * 255, b * 255, alpha);
}

function padHex(color: string) {
  if (!hexReg.test(color)) {
    return '';
  }
  if (color.length === 9) {
    return color.toUpperCase();
  }
  if (color.length === 7) {
    const t = `${color}ff`;
    return t.toUpperCase();
  }
  if (color.length === 4) {
    const [, a, b, c] = color;
    const t = `#${a}${a}${b}${b}${c}${c}ff`;
    return t.toUpperCase();
  }
  return '';
}
export function convertColorToHex(color: string): string {
  if (colorMap[color]) {
    return padHex(colorMap[color]);
  }
  if (hexReg.test(color)) {
    return padHex(color);
  }
  if (rgbReg.test(color)) {
    const [, r, g, b, a] = color.match(rgbReg)!;
    return padHex(RGBtoHEX(r, g, b, a));
  }
  if (hslReg.test(color)) {
    const [, h, s, l, a] = color.match(hslReg)!;
    return padHex(HSLAtoHEX(h, s, l, a));
  }
  return '';
}

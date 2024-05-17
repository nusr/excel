import { FORMULA_MAX_PRECISION } from '@/util/constant';

export function roundNumber(a: number) {
  const temp = String(a);
  const result = /[.](\d*)/.exec(temp);
  if (result && result[1]) {
    const f = Math.pow(10, Math.min(result[1].length, FORMULA_MAX_PRECISION));
    const list = temp.split('.');
    const t = list[0] + list[1].slice(0, FORMULA_MAX_PRECISION);
    return Number(t) / f;
  } else {
    return a;
  }
}

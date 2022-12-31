import type { TextFormulaType } from '@/types';

export const T = (value: unknown): string => {
  return typeof value === 'string' ? value : '';
};

export const LOWER = (value: string): string => value.toLowerCase();
export const CHAR = (value: number): string => String.fromCharCode(value);
export const CODE = (value: string): number => value.charCodeAt(0);
export const LEN = (value: string): number => value.length;

export const SPLIT = (value: string, sep: string): string[] => value.split(sep);
export const UNICHAR = CHAR;
export const UNICODE = CODE;
export const UPPER = (value: string): string => value.toUpperCase();
export const TRIM = (value: string): string => value.replace(/ +/g, ' ').trim();
export const CONCAT = (...value: any[]): string => {
  return value.join('');
};

const textFormulas: TextFormulaType = {
  CONCAT: {
    func: CONCAT,
    options: {
      paramsType: 'any',
      minParamsCount: 1,
      maxParamsCount: 100,
      resultType: 'string',
    },
  },
  CONCATENATE: {
    func: CONCAT,
    options: {
      paramsType: 'any',
      minParamsCount: 1,
      maxParamsCount: 100,
      resultType: 'string',
    },
  },
  SPLIT: {
    func: SPLIT,
    options: {
      paramsType: 'string',
      minParamsCount: 2,
      maxParamsCount: 2,
      resultType: 'array string',
    }
  },
  CHAR: {
    func: CHAR,
    options: {
      paramsType: 'string',
      minParamsCount: 1,
      maxParamsCount: 1,
      resultType: 'string',
    },
  },
  CODE: {
    func: CODE,
    options: {
      paramsType: 'string',
      minParamsCount: 1,
      maxParamsCount: 1,
      resultType: 'number',
    },
  },
  UNICHAR: {
    func: UNICHAR,
    options: {
      paramsType: 'string',
      minParamsCount: 1,
      maxParamsCount: 1,
      resultType: 'string',
    },
  },
  UNICODE: {
    func: UNICODE,
    options: {
      paramsType: 'string',
      minParamsCount: 1,
      maxParamsCount: 1,
      resultType: 'number',
    },
  },
  LEN: {
    func: LEN,
    options: {
      paramsType: 'string',
      minParamsCount: 1,
      maxParamsCount: 1,
      resultType: 'number',
    },
  },
  LOWER: {
    func: LOWER,
    options: {
      paramsType: 'string',
      minParamsCount: 1,
      maxParamsCount: 1,
      resultType: 'string',
    },
  },
  UPPER: {
    func: UPPER,
    options: {
      paramsType: 'string',
      minParamsCount: 1,
      maxParamsCount: 1,
      resultType: 'string',
    },
  },
  TRIM: {
    func: TRIM,
    options: {
      paramsType: 'string',
      minParamsCount: 1,
      maxParamsCount: 1,
      resultType: 'string',
    },
  },
  T: {
    func: T,
    options: {
      paramsType: 'any',
      minParamsCount: 1,
      maxParamsCount: 1,
      resultType: 'string',
    },
  },
};

export default textFormulas;

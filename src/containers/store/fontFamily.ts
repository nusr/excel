import type { OptionItem } from '@/types';
import { initFontFamilyList } from '@/util';
import { BaseStore } from './base';

export const fontFamilyStore = new BaseStore<OptionItem[]>(
  initFontFamilyList(),
);

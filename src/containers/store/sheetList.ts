import type { OptionItem } from '@/types';
import { BaseStore } from './base';

export const sheetListStore = new BaseStore<OptionItem[]>([]);

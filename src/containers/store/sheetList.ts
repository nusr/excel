import type { WorksheetType } from '@/types';
import { BaseStore } from './base';

export type SheetItem = Pick<
  WorksheetType,
  'sheetId' | 'isHide' | 'name' | 'tabColor'
>;

export const sheetListStore = new BaseStore<SheetItem[]>([]);

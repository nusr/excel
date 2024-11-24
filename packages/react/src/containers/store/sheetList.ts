import type { WorksheetType } from '@excel/shared';
import { BaseStore } from './base';

export type SheetItem = Required<
  Pick<WorksheetType, 'sheetId' | 'isHide' | 'name' | 'tabColor'>
>;

export const sheetListStore = new BaseStore<SheetItem[]>([]);

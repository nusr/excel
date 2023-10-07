import { DEFAULT_POSITION } from '@/util';
import { BaseStore } from './base';

type MenuPosition = { top: number; left: number };

export const contextMenuStore = new BaseStore<MenuPosition>({
  top: DEFAULT_POSITION,
  left: DEFAULT_POSITION,
});

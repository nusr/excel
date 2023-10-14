import { BaseStore } from './base';
export type ScrollStore = {
  scrollTop: number;
  scrollLeft: number;
};

export const scrollStore = new BaseStore<ScrollStore>({
  scrollTop: 0,
  scrollLeft: 0,
});

import { create } from 'zustand';

export interface ScrollStore {
  scrollTop: number;
  scrollLeft: number;
  top: number;
  left: number;
  row: number;
  col: number;
  canvasHeight: number;
  canvasWidth: number;
}

export const useScrollStore = create<ScrollStore>(() => ({
  scrollTop: 0,
  scrollLeft: 0,
  top: 0,
  left: 0,
  row: 0,
  col: 0,
  canvasHeight: 0,
  canvasWidth: 0,
}));

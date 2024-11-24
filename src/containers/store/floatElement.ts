import type { DrawingElement } from '../../types';
import { BaseStore } from './base';
export type FloatElementItem = DrawingElement & {
  labels: string[];
  datasets: Array<{ label: string; data: number[] }>;
  top: number;
  left: number;
};

export const floatElementStore = new BaseStore<FloatElementItem[]>([]);

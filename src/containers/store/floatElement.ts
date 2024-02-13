import type { FloatElement } from '@/types';
import { BaseStore } from './base';
export type FloatElementItem = FloatElement & {
  labels: string[];
  datasets: Array<{ label: string; data: number[] }>;
};

export const floatElementStore = new BaseStore<FloatElementItem[]>([]);

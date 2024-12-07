import type { UserItem } from '../../types';
import { BaseStore } from './base';

export const userStore = new BaseStore<UserItem[]>([]);

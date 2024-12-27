import type { UserItem } from '../../types';

import { create } from 'zustand';

export type UserInfo = {
  clientId: number;
  userId: string;
  userName: string;
  users: UserItem[];
  fileId: string;
  fileName: string;
};

type Action = {
  setUserInfo(userId: string, userName: string): void;
  setUsers(users: UserItem[]): void;
  setClientId(clientId: number): void;
  setFileName(name: string): void;
};

export const useUserInfo = create<UserInfo & Action>((set) => ({
  clientId: 0,
  userId: '',
  userName: '',
  users: [],
  fileId: '',
  fileName: '',
  setUserInfo(id, name) {
    set({ userId: id, userName: name });
  },
  setUsers(users) {
    set({ users });
  },
  setClientId(clientId) {
    set({ clientId });
  },
  setFileName(name) {
    set({ fileName: name });
  },
}));

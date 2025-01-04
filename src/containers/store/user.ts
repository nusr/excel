import type { UserItem } from '../../types';

import { create } from 'zustand';

export type UserInfo = {
  clientId: number;
  users: UserItem[];
  fileId: string;
  fileName: string;
};

type Action = {
  setUsers(users: UserItem[]): void;
  setClientId(clientId: number): void;
  setFileName(name: string): void;
  setFileInfo(id: string, name: string): void;
};

export const useUserInfo = create<UserInfo & Action>((set) => ({
  clientId: 0,
  users: [],
  fileId: '',
  fileName: '',
  setUsers(users) {
    set({ users });
  },
  setClientId(clientId) {
    set({ clientId });
  },
  setFileName(name) {
    set({ fileName: name });
  },
  setFileInfo(id, name) {
    set({ fileId: id, fileName: name });
  },
}));

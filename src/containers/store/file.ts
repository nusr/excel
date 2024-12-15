import { BaseStore } from './base';
export interface FileStoreType {
  id: string;
  name: string;
  clientId: number;
}

export const fileStore = new BaseStore<FileStoreType>({
  id: '',
  name: '',
  clientId: 0,
});

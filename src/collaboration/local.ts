import Dexie, { Table } from 'dexie';
import { uint8ArrayToString } from './util';
import { DocumentItem, HistoryItem } from './type';

function sortByCreateTime(
  a: HistoryItem | DocumentItem,
  b: HistoryItem | DocumentItem,
  isDesc = false,
) {
  const bTime = new Date(b.create_time).getTime();
  const aTime = new Date(a.create_time).getTime();
  return isDesc ? bTime - aTime : aTime - bTime;
}

export class DocumentDB extends Dexie {
  readonly document!: Table<DocumentItem, string>;
  readonly history!: Table<HistoryItem, number>;
  constructor(version = 1) {
    super('excel');
    this.version(version).stores({
      document: 'id',
      history: '++id, doc_id',
    });
    this.on('populate', () => {
      this.resetDatabase();
    });
  }

  deleteDocument(docId: string) {
    return this.transaction('rw', this.history, this.document, () => {
      this.history.where({ doc_id: docId }).delete();
      this.document.delete(docId);
    });
  }
  updateDocument(docId: string, name: string) {
    return this.document.update(docId, { name });
  }
  getDocument(docId: string) {
    return this.document.get(docId);
  }
  addDocument(docId: string, name: string, sync = false) {
    return this.document.add({
      id: docId,
      name,
      create_time: new Date().toISOString(),
      sync,
    });
  }
  addHistory(docId: string, update: Uint8Array, sync = false) {
    if (update.length > 65535) {
      return Promise.resolve(0);
    }
    const str = uint8ArrayToString(update);
    return this.history.add({
      doc_id: docId,
      update: str,
      create_time: new Date().toISOString(),
      sync,
    });
  }
  async getAllHistory(docId: string) {
    const list = await this.history.where({ doc_id: docId }).toArray();
    list.sort((a, b) => sortByCreateTime(a, b, true));
    return list;
  }
  syncData(
    callback: (
      documentList: DocumentItem[],
      historyList: HistoryItem[],
    ) => Promise<boolean>,
  ) {
    return this.transaction('rw', this.document, this.history, async () => {
      const documentList = await this.document.where({ sync: false }).toArray();
      const historyList = await this.history.where({ sync: false }).toArray();
      documentList.sort(sortByCreateTime);
      historyList.sort(sortByCreateTime);
      await callback(documentList, historyList);
      await this.history.where({ sync: false }).modify({ sync: true });
      await this.document.where({ sync: false }).modify({ sync: true });
    });
  }
  resetDatabase() {
    return this.transaction('rw', this.document, this.history, async () => {
      await Promise.all(this.tables.map((table) => table.clear()));
    });
  }
}

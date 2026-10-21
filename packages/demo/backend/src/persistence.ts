import { applyUpdate, encodeStateAsUpdate, type Doc } from 'yjs';
import {
  SharedRoot, hydrateDocument, initializeEmptyDocument, upgradeDocument,
} from 'excel-collab/protocol';
import type { ModelJSON } from 'excel-collab';
import {
  setContentInitializor, setPersistence, docs, type WSSharedDoc,
} from '@y/websocket-server/utils';
import { loadDocumentState, saveDocumentState } from './db';
import { withDocumentLock } from './documentAccess';
import { hasRoomReservations } from './roomReservations';

export class DocumentPersistence {
  private readonly pending = new Map<Doc, Promise<void>>();
  constructor(private readonly storage = {
    load: loadDocumentState,
    save: saveDocumentState,
  }) {}

  initialize = (doc: WSSharedDoc): Promise<void> =>
    withDocumentLock(doc.name, () => this.initializeDocument(doc));

  private async initializeDocument(doc: WSSharedDoc): Promise<void> {
    const saved = await this.storage.load(doc.name);
    if (saved?.state) {
      applyUpdate(doc, saved.state);
      upgradeDocument(doc);
    } else if (saved?.content) {
      const json: ModelJSON = JSON.parse(saved.content);
      hydrateDocument(doc, json);
    }
    initializeEmptyDocument(doc);
    const persist = () => {
      const state = encodeStateAsUpdate(doc);
      const content = JSON.stringify(new SharedRoot(doc).toJSON());
      const write = () => this.storage.save(doc.name, state, content);
      const task = (this.pending.get(doc) ?? Promise.resolve()).then(write, write);
      this.pending.set(doc, task);
      task.catch((error: unknown) => {
        console.error(`Failed to persist collaboration document ${doc.name}`, error);
        for (const connection of doc.conns.keys()) {
          connection.close(1011, 'Document persistence failed');
        }
      });
    }
    doc.on('update', persist);
    doc.once('destroy', () => {
      doc.off('update', persist);
      this.pending.delete(doc);
    });
    persist();
    await this.flush(doc);
  };

  async flush(doc: Doc): Promise<void> {
    let task: Promise<void> | undefined;
    do {
      task = this.pending.get(doc);
      await task;
    } while (task !== this.pending.get(doc));
  }

  async flushAll(): Promise<void> {
    await Promise.all(Array.from(this.pending.keys(), (doc) => this.flush(doc)));
  }

  async release(doc: WSSharedDoc): Promise<void> {
    await doc.whenInitialized;
    await this.flush(doc);
    if (doc.conns.size === 0 && !hasRoomReservations(doc) && docs.get(doc.name) === doc) {
      docs.delete(doc.name);
      doc.destroy();
    }
  }

  install() {
    setContentInitializor(this.initialize);
    setPersistence(null);
  }
}

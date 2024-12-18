import {
  SupabaseClient,
  RealtimeChannel,
  REALTIME_LISTEN_TYPES,
} from '@supabase/supabase-js';
import type { Database, DocumentItem } from './type';
import { SYNC_FLAG, IRange, UserItem } from '../types';
import { collaborationLog, eventEmitter, omit } from '../util';
import * as Y from 'yjs';
import { uint8ArrayToString, stringToUint8Array } from './util';
import { DocumentDB } from './local';
import { v4 as uuidV4 } from 'uuid';
import * as awarenessProtocol from 'y-protocols/awareness';

const DIRECTORY = 'supabase/';

type EventType = 'message' | 'awareness';

export class CollaborationProvider {
  public readonly doc: Y.Doc;
  private readonly remoteDB: SupabaseClient<Database> | null = null;
  private readonly channel: RealtimeChannel | null = null;
  private readonly localDB: DocumentDB | null = null;
  private readonly broadcastChannel: BroadcastChannel;
  private readonly _isOnline: boolean = false;
  private readonly awareness: awarenessProtocol.Awareness;
  constructor(doc: Y.Doc) {
    const url = import.meta.env.VITE_SUPABASE_URL ?? '';
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';
    if (url && key && navigator.onLine) {
      this._isOnline = true;
      const remoteDB = new SupabaseClient<Database>(url, key);
      this.remoteDB = remoteDB;
      this.channel = remoteDB.channel(doc.guid, {
        config: { broadcast: { ack: false } },
      });
    }
    this.doc = doc;
    if (typeof indexedDB !== 'undefined') {
      this.localDB = new DocumentDB();
    }
    this.broadcastChannel = new BroadcastChannel(this.docId);
    this.awareness = new awarenessProtocol.Awareness(doc);
    this.onConnect();
    this.subscribe();
  }
  private get clientID() {
    return this.doc.clientID;
  }
  private get docId() {
    return this.doc.guid;
  }

  isOnline = () => {
    if (this._isOnline === false) {
      return false;
    }
    return navigator.onLine;
  };

  private subscribe() {
    this.awareness.on('update', this.onAwarenessUpdate);
    this.broadcastChannel.addEventListener(
      'message',
      (
        event: MessageEvent<{
          update: Uint8Array;
          type: EventType;
          clientID: number;
        }>,
      ) => {
        const { update, type, clientID } = event.data;
        if (this.isOnline() || this.clientID === clientID) {
          return;
        }
        collaborationLog('onmessage', event);
        this.applyUpdate(update, type);
      },
    );

    this.channel
      ?.on(
        REALTIME_LISTEN_TYPES.BROADCAST,
        { event: this.docId },
        (payload) => {
          const { update, clientID, type } = payload?.payload || {};
          if (!update || this.clientID === clientID) {
            return;
          }
          collaborationLog('subscribe:', payload);
          const updateData = stringToUint8Array(update);
          this.applyUpdate(updateData, type);
        },
      )
      .subscribe((status, error) => {
        if (error) {
          collaborationLog('subscribe error:', error, status);
        }
        if (status === 'SUBSCRIBED') {
          collaborationLog('subscribe connect success');
        }
      });
    window.addEventListener('beforeunload', this.onDisconnect);

    this.awareness.on('change', () => {
      const list = this.awareness.getStates();
      if (!list) {
        return;
      }
      const users: UserItem[] = [];
      for (const [key, value] of list.entries()) {
        if (key === this.clientID) {
          continue;
        }
        users.push({ range: value.range as IRange, clientId: key });
      }
      collaborationLog('awarenessChange', users);
      eventEmitter.emit('awarenessChange', { users });
    });

    eventEmitter.on('rangeChange', ({ range }) => {
      this.syncRange(range);
    });
  }

  private applyUpdate(update: Uint8Array, type: EventType) {
    if (type === 'message') {
      Y.applyUpdate(this.doc, update, SYNC_FLAG.SKIP_UPDATE);
    } else if (type === 'awareness') {
      awarenessProtocol.applyAwarenessUpdate(this.awareness, update, this);
    }
  }
  private onConnect() {
    if (this.awareness.getLocalState() !== null) {
      const awarenessUpdate = awarenessProtocol.encodeAwarenessUpdate(
        this.awareness,
        [this.clientID],
      );
      this.broadcastChannel.postMessage({
        update: awarenessUpdate,
        type: 'awareness',
        clientId: this.clientID,
      });
    }
  }
  private readonly onDisconnect = () => {
    awarenessProtocol.removeAwarenessStates(
      this.awareness,
      [this.clientID],
      this,
    );
  };

  private readonly onAwarenessUpdate = ({ added, updated, removed }: any) => {
    const changedClients = added.concat(updated).concat(removed);
    const awarenessUpdate = awarenessProtocol.encodeAwarenessUpdate(
      this.awareness,
      changedClients,
    );
    this.postMessage(awarenessUpdate, 'awareness');
  };

  private async postMessage(update: Uint8Array, type: EventType) {
    if (!this.isOnline()) {
      this.broadcastChannel.postMessage({
        update,
        clientID: this.clientID,
        type,
      });
      return;
    }
    const result = uint8ArrayToString(update);
    const real = await this.channel?.send({
      type: REALTIME_LISTEN_TYPES.BROADCAST,
      event: this.docId,
      payload: { update: result, clientID: this.clientID, type },
    });
    collaborationLog('channel send', real);
  }

  async addHistory(update: Uint8Array) {
    this.postMessage(update, 'message');
    if (!this.isOnline()) {
      await this.localDB?.addHistory(this.docId, update);
      return;
    }
    const result = uint8ArrayToString(update);
    const r = await this.remoteDB
      ?.from('history')
      .insert([{ doc_id: this.docId, update: result }]);
    collaborationLog('db insert', r);
    await this.localDB?.addHistory(this.docId, update, true);
  }

  async retrieveHistory(): Promise<Uint8Array[]> {
    if (!this.isOnline()) {
      const list = await this.localDB?.getAllHistory(this.docId);
      return list?.map((item) => stringToUint8Array(item.update)) || [];
    }
    const result = await this.remoteDB
      ?.from('history')
      .select('*')
      .eq('doc_id', this.docId)
      .order('create_time', { ascending: false });
    collaborationLog('retrieveHistory', result);
    const list = (result?.data || []).map((v) => stringToUint8Array(v.update));
    return list;
  }
  updateFile = async (file: File, _base64: string): Promise<string> => {
    if (!this.isOnline()) {
      return _base64;
    }
    const filePath = `${DIRECTORY}${file.name}`;
    const result = await this.remoteDB?.storage
      .from('avatars')
      .upload(filePath, file);
    collaborationLog('updateFile', result);
    return result?.data?.path ?? '';
  };
  downloadFile = async (filePath: string): Promise<string> => {
    if (!this.isOnline()) {
      return filePath;
    }
    if (!filePath?.startsWith(DIRECTORY)) {
      return filePath;
    }
    const result = await this.remoteDB?.storage
      .from('avatars')
      .download(filePath);
    collaborationLog('downloadFile', result);
    if (result?.data) {
      return URL.createObjectURL(result.data);
    }
    return '';
  };
  async syncData() {
    if (!this.isOnline()) {
      return;
    }
    await this.localDB?.syncData(async (documentList, historyList) => {
      await this.remoteDB
        ?.from('document')
        .upsert(documentList.map((v) => omit(v, ['sync'])));
      await this.remoteDB
        ?.from('history')
        .insert(historyList.map((v) => omit(v, ['id', 'sync'])));
      return true;
    });
  }
  async addDocument(): Promise<string> {
    if (!this.isOnline()) {
      const docId = uuidV4();
      await this.localDB?.addDocument(docId, '');
      return docId;
    }
    const r = await this.remoteDB
      ?.from('document')
      .insert([{ name: '' }])
      .select();
    collaborationLog('db addDocument', r);
    // @ts-ignore
    const docId = r.data?.[0].id as string;
    return docId;
  }
  async updateDocument(name: string): Promise<void> {
    if (!this.isOnline()) {
      await this.localDB?.updateDocument(this.docId, name);
      return;
    }
    await this.remoteDB?.from('document').update({ name }).eq('id', this.docId);
  }
  async getDocument(): Promise<DocumentItem | undefined> {
    if (!this.isOnline()) {
      return await this.localDB?.getDocument(this.docId);
    }
    const result = await this.remoteDB
      ?.from('document')
      .select('*')
      .eq('id', this.docId);
    return result?.data?.[0];
  }
  syncRange(range: IRange) {
    this.awareness.setLocalStateField('range', range);
  }
}

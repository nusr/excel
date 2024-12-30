import type { RealtimeChannel } from '@supabase/supabase-js';
import { SupabaseClient } from '@supabase/supabase-js';
import {
  SYNC_FLAG,
  UserItem,
  ICollaborationProvider,
  DocumentItem,
  collaborationLog,
  omit,
  uint8ArrayToString,
  stringToUint8Array,
  shouldSkipUpdate,
  HistoryItem,
} from '../src';
import * as Y from 'yjs';
import { DocumentDB } from './local';
import { v4 as uuidV4 } from 'uuid';
import * as awarenessProtocol from 'y-protocols/awareness';

interface Database {
  public: {
    Tables: {
      document: {
        Row: Required<DocumentItem>;
        Insert: {
          id?: string;
          name: string;
          create_time?: never;
        };
        Update: {
          id?: string;
          name?: string;
          create_time?: never;
        };
      };
      history: {
        Row: Required<HistoryItem>;
        Insert: {
          id?: number;
          doc_id: string;
          update: string;
          create_time?: never;
        };
      };
    };
  };
}

type CollaborationOptions = {
  doc: Y.Doc;
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  enableIndexDb?: boolean;
};

const DIRECTORY = 'supabase/';

type EventType = 'message' | 'awareness';

const BROADCAST = 'broadcast';

export class CollaborationProvider implements ICollaborationProvider {
  private readonly doc: Y.Doc;
  private readonly remoteDB: SupabaseClient<Database> | null = null;
  private readonly channel: RealtimeChannel | null = null;
  private readonly localDB: DocumentDB | null = null;
  private readonly broadcastChannel: BroadcastChannel;
  private readonly awareness: awarenessProtocol.Awareness;
  private awarenessChangeCallback: ((users: UserItem[]) => void) | null = null;
  constructor(options: CollaborationOptions) {
    const { doc } = options;
    if (options.supabaseUrl && options.supabaseAnonKey) {
      this.remoteDB = new SupabaseClient<Database>(
        options.supabaseUrl,
        options.supabaseAnonKey,
      );
      this.channel = this.remoteDB.channel(doc.guid, {
        config: { broadcast: { ack: false } },
      });
    }
    this.doc = doc;
    if (typeof indexedDB !== 'undefined' && options.enableIndexDb) {
      this.localDB = new DocumentDB(2);
    }
    this.broadcastChannel = new BroadcastChannel(this.docId);
    this.awareness = new awarenessProtocol.Awareness(doc);
    this.subscribe();
  }
  getDoc() {
    return this.doc;
  }
  private get clientID() {
    return this.doc.clientID;
  }
  private get docId() {
    return this.doc.guid;
  }

  setAwarenessChangeCallback(callback: (users: UserItem[]) => void): void {
    this.awarenessChangeCallback = callback;
  }

  private isOnline() {
    return navigator.onLine && this.remoteDB !== null;
  }

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
      ?.on(BROADCAST, { event: this.docId }, (payload) => {
        const { update, clientID, type } = payload?.payload || {};
        if (!update || this.clientID === clientID) {
          return;
        }
        collaborationLog('subscribe:', payload);
        const updateData = stringToUint8Array(update);
        this.applyUpdate(updateData, type);
      })
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
        if (key === this.clientID || !value) {
          continue;
        }
        const userData = value as Pick<
          UserItem,
          'range' | 'userId' | 'userName'
        >;
        users.push({
          range: userData.range,
          clientId: key,
          userName: userData.userName,
          userId: userData.userId,
        });
      }
      collaborationLog('awareness', users);
      this.awarenessChangeCallback?.(users);
    });

    this.doc.on('update', (update: Uint8Array, _b, _c, tran) => {
      if (shouldSkipUpdate(tran)) {
        return;
      }
      collaborationLog('doc update', tran.doc.clientID, tran);
      this.addHistory(update);
    });

    this.onConnect();
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
      type: BROADCAST,
      event: this.docId,
      payload: { update: result, clientID: this.clientID, type },
    });
    collaborationLog('channel send', real);
  }

  private async addHistory(update: Uint8Array) {
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
  uploadFile = async (file: File, _base64: string): Promise<string> => {
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
  async updateDocument(docId: string, name: string): Promise<void> {
    if (!this.isOnline()) {
      await this.localDB?.updateDocument(docId || this.docId, name);
      return;
    }
    await this.remoteDB
      ?.from('document')
      .update({ name })
      .eq('id', docId || this.docId);
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
  syncRange(data: Pick<UserItem, 'range' | 'userId' | 'userName'>) {
    this.awareness.setLocalState(data);
  }
}

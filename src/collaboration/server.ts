import {
  SupabaseClient,
  RealtimeChannel,
  REALTIME_LISTEN_TYPES,
  type AuthChangeEvent,
  type Session,
} from '@supabase/supabase-js';
import type { Database, CollaborationOptions } from './type';
import {
  SYNC_FLAG,
  UserItem,
  ICollaborationProvider,
  DocumentItem,
} from '../types';
import { collaborationLog, eventEmitter, omit } from '../util';
import * as Y from 'yjs';
import { uint8ArrayToString, stringToUint8Array } from './util';
import { DocumentDB } from './local';
import { v4 as uuidV4 } from 'uuid';
import * as awarenessProtocol from 'y-protocols/awareness';

const DIRECTORY = 'supabase/';

type EventType = 'message' | 'awareness';

export class CollaborationProvider implements ICollaborationProvider {
  public readonly doc: Y.Doc;
  private readonly remoteDB: SupabaseClient<Database> | null = null;
  private readonly channel: RealtimeChannel | null = null;
  private readonly localDB: DocumentDB | null = null;
  private readonly broadcastChannel: BroadcastChannel;
  private readonly _isOnline: boolean = false;
  private readonly awareness: awarenessProtocol.Awareness;
  private options: CollaborationOptions;
  private awarenessChangeCallback: ((users: UserItem[]) => void) | null = null;
  private authChangeCallback:
    | ((
        event: AuthChangeEvent,
        session: Session | null,
      ) => void | Promise<void>)
    | null = null;
  constructor(options: CollaborationOptions) {
    this.options = options;
    const { doc } = options;
    if (options.supabaseUrl && options.supabaseAnonKey && navigator.onLine) {
      this._isOnline = true;
      const remoteDB = new SupabaseClient<Database>(
        options.supabaseUrl,
        options.supabaseAnonKey,
      );
      this.remoteDB = remoteDB;
      this.channel = remoteDB.channel(doc.guid, {
        config: { broadcast: { ack: false } },
      });
    }
    this.doc = doc;
    if (typeof indexedDB !== 'undefined' && !options.disableIndexDB) {
      this.localDB = new DocumentDB(options.dbVersion);
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
  canUseRemoteDB() {
    return Boolean(this.remoteDB);
  }
  async login() {
    if (!this.remoteDB) {
      return eventEmitter.emit('toastMessage', {
        type: 'error',
        message: 'Need to config VITE_SUPABASE_ANON_KEY and VITE_SUPABASE_URL env',
      });
    }
    collaborationLog('loginRedirectTo:', this.options.loginRedirectTo);
    const result = await this.remoteDB?.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: this.options.loginRedirectTo,
      },
    });
    collaborationLog('login result:', result);
  }
  async getLoginInfo() {
    if (!this.remoteDB) {
      return;
    }
    const result = await this.remoteDB.auth.getSession();
    collaborationLog('getLoginInfo:', result);
    return result?.data.session;
  }
  async logOut() {
    const result = await this.remoteDB?.auth.signOut();
    collaborationLog('log out result:', result);
  }

  setAuthChangeCallback(
    callback: (
      event: AuthChangeEvent,
      session: Session | null,
    ) => void | Promise<void>,
  ): void {
    this.authChangeCallback = callback;
  }
  setAwarenessChangeCallback(callback: (users: UserItem[]) => void): void {
    this.awarenessChangeCallback = callback;
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

    this.remoteDB?.auth.onAuthStateChange((event, session) => {
      collaborationLog('onAuthStateChange', event, session);
      this.authChangeCallback?.(event, session);
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
  syncRange(data: Pick<UserItem, 'range' | 'userId' | 'userName'>) {
    this.awareness.setLocalState(data);
  }
}

import {
  SupabaseClient,
  RealtimeChannel,
  REALTIME_LISTEN_TYPES,
} from '@supabase/supabase-js';
import type { Database } from './data.type';
import { CollaborationProvider, SYNC_FLAG } from '@/types';
import * as Y from 'yjs';
import { uint8ArrayToString, stringToUint8Array } from './util';
import { collaborationLog } from '@/util';

const DIRECTORY = 'supabase/';

export class ServerProvider implements CollaborationProvider {
  private readonly db: SupabaseClient<Database>;
  private readonly doc: Y.Doc;
  private readonly channel: RealtimeChannel;
  constructor(supabase: SupabaseClient<Database>, doc: Y.Doc) {
    this.db = supabase;
    this.doc = doc;
    this.channel = supabase.channel(this.doc.guid, {
      config: { broadcast: { ack: false } },
    });
  }

  subscribe() {
    this.channel
      .on(
        REALTIME_LISTEN_TYPES.BROADCAST,
        { event: this.doc.guid },
        (payload) => {
          const update = payload?.payload?.update;
          if (!update) {
            return;
          }
          collaborationLog('subscribe:', payload);
          Y.applyUpdate(
            this.doc,
            stringToUint8Array(update as string),
            SYNC_FLAG.SKIP_UPDATE,
          );
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
  }

  async addHistory(update: Uint8Array) {
    const result = uint8ArrayToString(update);
    const r = await this.db
      .from('history')
      .insert([{ doc_id: this.doc.guid, update: result }]);
    collaborationLog('db insert', r);
    const real = await this.channel.send({
      type: REALTIME_LISTEN_TYPES.BROADCAST,
      event: this.doc.guid,
      payload: { update: result },
    });
    collaborationLog('channel send', real);
  }
  async retrieveHistory() {
    const result = await this.db
      .from('history')
      .select('*')
      .eq('doc_id', this.doc.guid)
      .order('create_time', { ascending: false });
    collaborationLog('retrieveHistory', result);
    const list = (result.data || []).map((v) => stringToUint8Array(v.update));
    return list;
  }
  updateFile = async (file: File, _base64: string): Promise<string> => {
    const filePath = `${DIRECTORY}${file.name}`;
    const result = await this.db.storage.from('avatars').upload(filePath, file);
    collaborationLog('updateFile', result);
    return result.data?.path || '';
  };
  downloadFile = async (filePath: string): Promise<string> => {
    if (!filePath || !filePath.startsWith(DIRECTORY)) {
      return filePath
    }
    const result = await this.db.storage.from('avatars').download(filePath);
    collaborationLog('downloadFile', result);
    if (result.data) {
      return URL.createObjectURL(result.data);
    }
    return ''
  };
}

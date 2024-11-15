import { CollaborationProvider, SYNC_FLAG } from '@/types';
import * as Y from 'yjs';
import { collaborationLog } from '@/util';

export class LocalProvider implements CollaborationProvider {
  private readonly broadcastChannel: BroadcastChannel;
  private doc: Y.Doc;
  constructor(doc: Y.Doc) {
    this.doc = doc;
    this.broadcastChannel = new BroadcastChannel(this.doc.guid);
  }
  subscribe() {
    this.broadcastChannel.addEventListener(
      'message',
      (
        event: MessageEvent<{
          update: Uint8Array;
        }>,
      ) => {
        const { update } = event.data;
        collaborationLog('onmessage', event);
        Y.applyUpdate(this.doc, update, SYNC_FLAG.REMOTE);
      },
    );
  }

  addHistory = async (update: Uint8Array) => {
    this.broadcastChannel.postMessage({
      update,
    });
  };
  retrieveHistory = async () => {
    return [];
  };
}

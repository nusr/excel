import { CollaborationProvider, SYNC_FLAG } from '@excel/shared';
import * as Y from 'yjs';
import { collaborationLog } from '@excel/shared';

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
        Y.applyUpdate(this.doc, update, SYNC_FLAG.SKIP_UPDATE);
      },
    );
  }

  async addHistory(update: Uint8Array) {
    this.broadcastChannel.postMessage({
      update,
    });
  }
  async retrieveHistory() {
    return [];
  }
  updateFile = async (_file: File, base64: string): Promise<string> => {
    return base64;
  };
  downloadFile = async (filePath: string): Promise<string> => {
    return filePath;
  };
}

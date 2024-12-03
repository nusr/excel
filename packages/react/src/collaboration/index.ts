import { initProvider } from './provider';
import * as Y from 'yjs';
import { collaborationLog, CollaborationProvider } from '@excel/shared';
import { SYNC_FLAG } from '@excel/shared';
import { DEFAULT_UPDATE } from './provider/util';

function shouldSkip(isServer: boolean, tran: Y.Transaction) {
  if (isServer && tran.origin === SYNC_FLAG.SKIP_UPDATE) {
    return true;
  }
  return false;
}

export async function initCollaboration(doc: Y.Doc): Promise<{
  provider: CollaborationProvider;
  isServer: boolean;
  isInit: boolean;
}> {
  const { provider, isServer } = initProvider(doc);

  doc.on('update', (update: Uint8Array, _b, _c, tran) => {
    if (shouldSkip(isServer, tran)) {
      return;
    }
    collaborationLog('doc update', tran.doc.clientID, tran);
    provider.addHistory(update);
  });
  provider.subscribe();

  const result = await provider.retrieveHistory();
  let isInit = false;
  if (result.length > 0) {
    Y.applyUpdate(doc, Y.mergeUpdates(result), SYNC_FLAG.SKIP_UPDATE);
  } else {
    isInit = true;
    Y.applyUpdate(doc, DEFAULT_UPDATE, SYNC_FLAG.SKIP_UNDO_REDO);
  }

  return { isServer, provider, isInit };
}

import { initProvider, ResultData } from './provider';
import * as Y from 'yjs';
import { collaborationLog } from '@excel/shared';
import { SYNC_FLAG } from '@excel/shared';
import { DEFAULT_UPDATE } from './provider/util';

function shouldSkip(isServer: boolean, tran: Y.Transaction) {
  if (isServer && tran.origin === SYNC_FLAG.SKIP_UPDATE) {
    return true;
  }
  return false;
}

export async function initCollaboration(doc: Y.Doc): Promise<ResultData> {
  const { provider, isServer } = initProvider(doc);

  doc.on('update', (update: Uint8Array, _b, _c, tran) => {
    if (shouldSkip(isServer, tran)) {
      return;
    }
    collaborationLog('doc update', tran);
    provider.addHistory(update);
  });
  provider.subscribe();

  const result = await provider.retrieveHistory();
  if (result.length > 0) {
    Y.applyUpdate(doc, Y.mergeUpdates(result), SYNC_FLAG.SKIP_UPDATE);
  } else {
    Y.applyUpdate(doc, DEFAULT_UPDATE, SYNC_FLAG.SKIP_UNDO_REDO);
  }

  return { isServer, provider };
}

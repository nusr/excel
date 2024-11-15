import type { Doc } from 'yjs';
import { initProvider } from './provider';
import * as Y from 'yjs';
import { collaborationLog } from '@/util';
import { SYNC_FLAG } from '@/types';
import { DEFAULT_UPDATE } from './provider/util';

function shouldSkip(tran: Y.Transaction) {
  if (tran.origin === SYNC_FLAG.REMOTE || tran.origin === SYNC_FLAG.INIT) {
    return true;
  }
  for (const value of tran.changed.values()) {
    if (value.has('drawings')) {
      return true;
    }
  }
  return false;
}

export async function initCollaboration(
  doc: Doc,
): Promise<{ isServer: boolean }> {
  const { provider, isServer } = initProvider(doc);

  doc.on('update', (update: Uint8Array, _b, _c, tran) => {
    if (isServer && shouldSkip(tran)) {
      return;
    }
    collaborationLog('doc update', tran);
    provider.addHistory(update);
  });
  provider.subscribe();

  const result = await provider.retrieveHistory();
  if (result.length > 0) {
    Y.applyUpdate(doc, Y.mergeUpdates(result), SYNC_FLAG.INIT);
  } else {
    Y.applyUpdate(doc, DEFAULT_UPDATE, SYNC_FLAG.EMPTY);
  }

  return { isServer };
}

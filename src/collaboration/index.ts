import { CollaborationProvider } from './server';
import * as Y from 'yjs';
import { SYNC_FLAG } from '../types';
import { collaborationLog } from '../util';

export function shouldSkipUpdate(
  tran: Y.Transaction,
  _provider: CollaborationProvider,
) {
  if (
    [SYNC_FLAG.SKIP_UPDATE, SYNC_FLAG.SKIP_UNDO_REDO_UPDATE].includes(
      tran.origin,
    )
  ) {
    return true;
  }
  return false;
}

export function initCollaboration(doc: Y.Doc) {
  const provider = new CollaborationProvider(doc);
  doc.on('update', (update: Uint8Array, _b, _c, tran) => {
    if (shouldSkipUpdate(tran, provider)) {
      return;
    }
    collaborationLog('doc update', tran.doc.clientID, tran);
    provider.addHistory(update);
  });

  return provider;
}

export function applyUpdate(doc: Y.Doc, result: Uint8Array[]) {
  Y.applyUpdate(doc, Y.mergeUpdates(result), SYNC_FLAG.SKIP_UPDATE);
}

export { CollaborationProvider };

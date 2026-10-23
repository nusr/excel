import { docs } from '@y/websocket-server/utils';
import { loadDocumentState } from './db';

const operations = new Map<string, Promise<void>>();

export const CONTENT_WRITE_CONFLICT =
  'Document content is managed by Yjs; use the collaboration connection to edit it.';

class ContentWriteConflict extends Error {
  readonly status = 409;

  constructor() {
    super(CONTENT_WRITE_CONFLICT);
  }
}

export async function withDocumentLock<T>(id: string, operation: () => Promise<T>): Promise<T> {
  const previous = operations.get(id) ?? Promise.resolve();
  let release!: () => void;
  const current = new Promise<void>((resolve) => {
    release = resolve;
  });
  operations.set(id, current);
  await previous;
  try {
    return await operation();
  } finally {
    release();
    if (operations.get(id) === current) operations.delete(id);
  }
}

export async function writeJsonContent<T>(id: string, write: () => Promise<T>): Promise<T> {
  if (docs.has(id)) throw new ContentWriteConflict();
  return withDocumentLock(id, async () => {
    if (docs.has(id)) throw new ContentWriteConflict();
    const saved = await loadDocumentState(id);
    if (saved?.state != null || docs.has(id)) throw new ContentWriteConflict();
    return write();
  });
}

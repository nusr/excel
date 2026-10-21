import { vi } from 'vitest';
import http from 'node:http';
import { once } from 'node:events';
import WebSocket from 'ws';
import {
  Array as YArray,
  Map as YMap,
  Doc,
  applyUpdate,
  encodeStateAsUpdate,
} from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import {
  docs,
  getYDoc,
  setContentInitializor,
} from '@y/websocket-server/utils';
import { PROTOCOL_VERSION, SharedRoot } from 'excel-collab/protocol';
import {
  initDatabase,
  createDocument,
  findDocument,
  loadDocumentState,
  saveDocumentState,
  closeDatabase,
} from '../db';
import { DocumentPersistence } from '../persistence';
import { WebSocketManager } from '../websocket';

vi.mock('sqlite3', async (importOriginal) => {
  const { default: sqlite3 } = await importOriginal<{
    default: typeof import('sqlite3');
  }>();
  return {
    default: {
      ...sqlite3,
      Database: class extends sqlite3.Database {
        constructor(_filename: string, callback?: (error: Error | null) => void) {
          super(':memory:', callback);
        }
      },
    },
  };
});

const quiet = vi.spyOn(console, 'log').mockImplementation(() => {});

function deferred() {
  let resolve!: () => void;
  const promise = new Promise<void>((done) => {
    resolve = done;
  });
  return { promise, resolve };
}

function v2State(version = 2) {
  const doc = new Doc();
  doc.getMap('excel:meta').set('version', version);
  const sheet = new YMap<unknown>(
    Object.entries({
      sheetId: 'legacy',
      name: 'Legacy',
      sort: 1,
      isHide: false,
      rowCount: 3,
      colCount: 3,
    }),
  );
  for (const axis of ['rows', 'cols']) {
    const entries = new YArray<string>();
    entries.insert(0, ['0', '1', '2']);
    sheet.set(axis, entries);
  }
  doc.getMap('excel:workbook').set('legacy', sheet);
  doc.getMap('excel:worksheets').set(
    'legacy_0_0',
    new YMap<unknown>([
      ['value', 42],
      ['isBold', true],
    ]),
  );
  const state = encodeStateAsUpdate(doc);
  doc.destroy();
  return state;
}

function inspect(state: Uint8Array) {
  const doc = new Doc();
  applyUpdate(doc, state);
  return doc;
}

async function seed(id: string, state = v2State()) {
  await createDocument({
    id,
    name: 'Preserved metadata',
    create_time: '2024-01-01T00:00:00Z',
  });
  await saveDocumentState(id, state, '{"workbook":{}}');
}

async function network(persistence: DocumentPersistence) {
  persistence.install();
  const server = http.createServer();
  const manager = new WebSocketManager(server, (doc) =>
    persistence.release(doc),
  );
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const address = server.address();
  if (!address || typeof address === 'string')
    throw new Error('Expected a TCP address');
  return {
    url: `ws://127.0.0.1:${address.port}`,
    async close() {
      await manager.closeAllConnections();
      await persistence.flushAll();
      await new Promise<void>((resolve, reject) =>
        server.close((error) => (error ? reject(error) : resolve())),
      );
    },
  };
}

beforeAll(initDatabase);
afterEach(async () => {
  for (const [name, doc] of docs) {
    docs.delete(name);
    doc.destroy();
  }
  setContentInitializor(async () => {});
});
afterAll(async () => {
  quiet.mockRestore();
  await closeDatabase();
});

test('persisted v2 binary migrates atomically and restarts with unchanged v3 identities', async () => {
  const id = 'v2-restart';
  await seed(id);
  const persistence = new DocumentPersistence();
  persistence.install();
  const doc = getYDoc(id);
  await doc.whenInitialized;

  expect(doc.getMap('excel:meta').get('version')).toBe(PROTOCOL_VERSION);
  expect(new SharedRoot(doc).toJSON().worksheets.legacy_0_0).toMatchObject({
    value: 42,
    isBold: true,
  });
  const saved = await loadDocumentState(id);
  const binary = inspect(saved!.state!);
  expect(binary.getMap('excel:meta').get('version')).toBe(PROTOCOL_VERSION);
  expect(new SharedRoot(binary).toJSON()).toEqual(JSON.parse(saved!.content!));
  expect((await findDocument(id))!).toMatchObject({
    name: 'Preserved metadata',
    create_time: '2024-01-01T00:00:00Z',
  });
  binary.destroy();
  const expected = encodeStateAsUpdate(doc);
  const rowIds = new SharedRoot(doc)
    .get('workbook')
    .get('legacy')!
    .get('rows')!
    .toArray();
  await persistence.release(doc);

  const restarted = new DocumentPersistence();
  restarted.install();
  const restored = getYDoc(id);
  await restored.whenInitialized;

  expect(encodeStateAsUpdate(restored)).toEqual(expected);
  expect(
    new SharedRoot(restored)
      .get('workbook')
      .get('legacy')!
      .get('rows')!
      .toArray(),
  ).toEqual(rowIds);
  expect(new SharedRoot(restored).toJSON().worksheets.legacy_0_0).toMatchObject(
    {
      value: 42,
      isBold: true,
    },
  );
});

test('v2 migration is saved before real clients sync, and reconnect retains migrated edits', async () => {
  const id = 'v2-network-reconnect';
  await seed(id);
  const loading = deferred();
  let saving = false;
  const persistence = new DocumentPersistence({
    load: loadDocumentState,
    save: async (...args) => {
      saving = true;
      await loading.promise;
      await saveDocumentState(...args);
    },
  });
  const server = await network(persistence);
  const clients: Array<{ doc: Doc; provider: WebsocketProvider }> = [];
  const connect = () => {
    const doc = new Doc();
    const provider = new WebsocketProvider(server.url, id, doc, {
      disableBc: true,
      params: { protocol: String(PROTOCOL_VERSION) },
    });
    clients.push({ doc, provider });
    return { doc, provider };
  };
  try {
    const first = connect();
    await vi.waitFor(() => expect(saving).toBe(true));
    expect(first.provider.synced).toBe(false);
    const before = await loadDocumentState(id);
    const unchanged = inspect(before!.state!);
    expect(unchanged.getMap('excel:meta').get('version')).toBe(2);
    expect(before!.content).toBe('{"workbook":{}}');
    unchanged.destroy();

    loading.resolve();
    await vi.waitFor(() => expect(first.provider.synced).toBe(true));

    expect(first.doc.getMap('excel:meta').get('version')).toBe(
      PROTOCOL_VERSION,
    );
    const root = new SharedRoot(first.doc);
    expect(root.toJSON().worksheets.legacy_0_0).toMatchObject({
      value: 42,
      isBold: true,
    });
    root.get('workbook').get('legacy')!.set('name', 'After migration');
    await vi.waitFor(() =>
      expect(new SharedRoot(docs.get(id)!).getSheets()[0].name).toBe(
        'After migration',
      ),
    );
    await persistence.flush(docs.get(id)!);
    const persisted = await loadDocumentState(id);
    expect(persisted!.state).toBeInstanceOf(Buffer);
    expect(JSON.parse(persisted!.content!).workbook.legacy.name).toBe(
      'After migration',
    );
    first.provider.destroy();
    await vi.waitFor(() => expect(docs.has(id)).toBe(false));

    const second = connect();
    await vi.waitFor(() => expect(second.provider.synced).toBe(true));
    expect(new SharedRoot(second.doc).getSheets()[0].name).toBe(
      'After migration',
    );
    expect(
      new SharedRoot(second.doc).toJSON().worksheets.legacy_0_0,
    ).toMatchObject({
      value: 42,
      isBold: true,
    });
  } finally {
    loading.resolve();
    for (const { doc, provider } of clients) {
      provider.destroy();
      doc.destroy();
    }
    await server.close();
  }
});

test.each([
  'unknown-version',
  'malformed-v2',
  'failed-migration-save',
] as const)(
  '%s closes the socket without syncing or resetting saved content',
  async (failure) => {
    const id = `v2-failure-${failure}`;
    let binary = v2State(failure === 'unknown-version' ? 99 : 2);
    if (failure === 'malformed-v2') {
      const invalid = inspect(binary);
      invalid
        .getMap<YMap<unknown>>('excel:workbook')
        .get('legacy')!
        .delete('rows');
      binary = encodeStateAsUpdate(invalid);
      invalid.destroy();
    }
    await seed(id, binary);
    const original = await loadDocumentState(id);
    const save = vi.fn(saveDocumentState);
    if (failure === 'failed-migration-save')
      save.mockRejectedValue(new Error('Migration storage unavailable'));
    const persistence = new DocumentPersistence({
      load: loadDocumentState,
      save,
    });
    const log = vi.spyOn(console, 'error').mockImplementation(() => {});
    const server = await network(persistence);
    const socket = new WebSocket(
      `${server.url}/${id}?protocol=${PROTOCOL_VERSION}`,
    );
    const closed = once(socket, 'close');
    const messages: unknown[] = [];
    socket.on('message', (message) => messages.push(message));
    try {
      const [code] = await closed;

      expect(code).toBe(1011);
      expect(messages).toHaveLength(0);
      expect(await loadDocumentState(id)).toEqual(original);
      expect(docs.has(id)).toBe(false);
      expect(log).toHaveBeenCalled();
      if (failure !== 'failed-migration-save')
        expect(save).not.toHaveBeenCalled();
    } finally {
      socket.terminate();
      await server.close();
      log.mockRestore();
    }
  },
);

test.each(['', '?protocol=2', '?protocol=99'])(
  'rejects incompatible clients before loading a persisted room (%s)',
  async (query) => {
    const id = `rejected-client-${encodeURIComponent(query)}`;
    await seed(id);
    const saved = await loadDocumentState(id);
    const load = vi.fn(loadDocumentState);
    const persistence = new DocumentPersistence({
      load,
      save: saveDocumentState,
    });
    const server = await network(persistence);
    const socket = new WebSocket(`${server.url}/${id}${query}`);
    const closed = once(socket, 'close');
    const messages: unknown[] = [];
    socket.on('message', (message) => messages.push(message));
    try {
      const [code, reason] = await closed;

      expect(code).toBe(1008);
      expect(reason.toString()).toBe(
        `Collaboration protocol version ${PROTOCOL_VERSION} required`,
      );
      expect(messages).toHaveLength(0);
      expect(load).not.toHaveBeenCalled();
      expect(docs.has(id)).toBe(false);
      expect(await loadDocumentState(id)).toEqual(saved);
    } finally {
      socket.terminate();
      await server.close();
    }
  },
);

test('real clients merge concurrent first-cell field writes after migration and reconnect', async () => {
  const id = 'v3-concurrent-first-cell';
  await seed(id);
  const persistence = new DocumentPersistence();
  const server = await network(persistence);
  const clients: Array<{ doc: Doc; provider: WebsocketProvider }> = [];
  const connect = async () => {
    const doc = new Doc();
    const provider = new WebsocketProvider(server.url, id, doc, {
      disableBc: true,
      params: { protocol: String(PROTOCOL_VERSION) },
    });
    clients.push({ doc, provider });
    await vi.waitFor(() => expect(provider.synced).toBe(true));
    return { doc, provider };
  };
  try {
    const first = await connect();
    const second = await connect();
    first.provider.disconnect();
    second.provider.disconnect();
    await vi.waitFor(() => expect(docs.has(id)).toBe(false));
    const firstRoot = new SharedRoot(first.doc);
    const secondRoot = new SharedRoot(second.doc);
    firstRoot.cell('legacy_1_1', true)!.set('value', 'Concurrent value');
    secondRoot.cell('legacy_1_1', true)!.set('isBold', true);
    first.provider.connect();
    second.provider.connect();
    await vi.waitFor(() => {
      expect(first.provider.synced).toBe(true);
      expect(second.provider.synced).toBe(true);
      expect(firstRoot.cellJSON('legacy_1_1')).toMatchObject({
        value: 'Concurrent value',
        isBold: true,
      });
      expect(secondRoot.cellJSON('legacy_1_1')).toMatchObject({
        value: 'Concurrent value',
        isBold: true,
      });
    });
    await persistence.flush(docs.get(id)!);
    expect(
      JSON.parse((await loadDocumentState(id))!.content!).worksheets.legacy_1_1,
    ).toMatchObject({ value: 'Concurrent value', isBold: true });
    first.provider.destroy();
    second.provider.destroy();
    await vi.waitFor(() => expect(docs.has(id)).toBe(false));

    const restored = await connect();

    expect(new SharedRoot(restored.doc).cellJSON('legacy_1_1')).toMatchObject({
      value: 'Concurrent value',
      isBold: true,
    });
  } finally {
    for (const { doc, provider } of clients) {
      provider.destroy();
      doc.destroy();
    }
    await server.close();
  }
});

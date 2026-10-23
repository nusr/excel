import http from 'node:http';
import { once } from 'node:events';
import { docs, getYDoc } from '@y/websocket-server/utils';
import { PROTOCOL_VERSION, SharedRoot } from 'excel-collab/protocol';
import {
  initDatabase,
  createDocument,
  findDocument,
  closeDatabase,
  loadDocumentState,
  saveDocumentState,
} from '../db';
import * as database from '../db';
import { DocumentPersistence } from '../persistence';
import app from '../route';
import { WebSocketManager } from '../websocket';
import { WebsocketProvider } from 'y-websocket';
import { Doc } from 'yjs';
import { vi } from 'vitest';
import { CONTENT_WRITE_CONFLICT } from '../documentAccess';

vi.spyOn(console, 'log').mockImplementation(() => {});
const persistence = new DocumentPersistence();
const server = http.createServer(app.callback());
const manager = new WebSocketManager(server, (doc) => persistence.release(doc));
const clients: Array<{ doc: Doc; provider: WebsocketProvider }> = [];
let baseURL: string;

function deferred() {
  let resolve!: () => void;
  const promise = new Promise<void>((done) => {
    resolve = done;
  });
  return { promise, resolve };
}

function workbook(name: string) {
  return {
    workbook: {
      sheet: {
        sheetId: 'sheet',
        name,
        sort: 0,
        isHide: false,
        rowCount: 2,
        colCount: 2,
      },
    },
  };
}

function sendContent(method: 'PUT' | 'sync', id: string, content: unknown) {
  return fetch(`${baseURL}/${method === 'PUT' ? `document/${id}` : 'sync'}`, {
    method: method === 'PUT' ? 'PUT' : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(
      method === 'PUT'
        ? { content: JSON.stringify(content) }
        : { room: id, data: { excel: { content } } },
    ),
    signal: AbortSignal.timeout(2000),
  });
}

beforeAll(async () => {
  await initDatabase();
  persistence.install();
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('Expected TCP address');
  baseURL = `http://127.0.0.1:${address.port}`;
});

afterAll(async () => {
  for (const { doc, provider } of clients) {
    provider.destroy();
    doc.destroy();
  }
  await manager.closeAllConnections();
  await persistence.flushAll();
  for (const [name, doc] of docs) {
    await persistence.flush(doc);
    docs.delete(name);
    doc.destroy();
  }
  await new Promise<void>((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
    server.closeAllConnections();
  });
  await closeDatabase();
});

test.each([
  ['PUT', false],
  ['PUT', true],
  ['sync', false],
  ['sync', true],
] as const)(
  '%s rejects content replacement after collaboration (active=%s)',
  async (method, active) => {
    const id = `rest-divergence-${method}-${active}`;
    await createDocument({ id, name: 'Metadata' });
    const original = getYDoc(id);
    await original.whenInitialized;
    const root = new SharedRoot(original);
    const sheetId = root.getSheets()[0].sheetId;
    root.get('workbook').get(sheetId)!.set('name', 'Before REST');
    await persistence.flush(original);
    const replacement = root.toJSON();
    replacement.workbook[sheetId].name = 'After REST';
    if (!active) await persistence.release(original);
    let client: Doc | undefined;
    if (active) {
      client = new Doc();
      const provider = new WebsocketProvider(baseURL.replace('http:', 'ws:'), id, client, {
        disableBc: true,
        params: { protocol: String(PROTOCOL_VERSION) },
      });
      clients.push({ doc: client, provider });
      await vi.waitFor(() => expect(provider.synced).toBe(true));
    }

    const response = await fetch(`${baseURL}/${method === 'PUT' ? `document/${id}` : 'sync'}`, {
      method: method === 'PUT' ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(
        method === 'PUT'
          ? { name: 'Rejected metadata', content: JSON.stringify(replacement) }
          : { room: id, data: { excel: { content: replacement } } },
      ),
    });
    expect(response.status).toBe(409);
    expect(await response.json()).toEqual({
      error: CONTENT_WRITE_CONFLICT,
      message: CONTENT_WRITE_CONFLICT,
    });
    expect(JSON.parse((await findDocument(id))!.content!).workbook[sheetId].name).toBe(
      'Before REST',
    );
    expect((await findDocument(id))!.name).toBe('Metadata');

    const restored = active ? original : getYDoc(id);
    await restored.whenInitialized;
    const roomNameAfterREST = new SharedRoot(restored).getSheets()[0].name;
    const clientNameAfterREST = client ? new SharedRoot(client).getSheets()[0].name : undefined;
    if (client) {
      new SharedRoot(client).get('workbook').get(sheetId)!.set('sort', 2);
      await vi.waitFor(() => expect(root.getSheets()[0].sort).toBe(2));
    }
    await persistence.flush(restored);
    const storedNameAfterHydrationOrNextEdit = JSON.parse((await findDocument(id))!.content!)
      .workbook[sheetId].name;
    expect({
      roomNameAfterREST,
      ...(client ? { clientNameAfterREST } : {}),
      storedNameAfterHydrationOrNextEdit,
    }).toEqual({
      roomNameAfterREST: 'Before REST',
      ...(client ? { clientNameAfterREST: 'Before REST' } : {}),
      storedNameAfterHydrationOrNextEdit: 'Before REST',
    });
  },
);

test.each(['PUT', 'sync'] as const)(
  '%s allows JSON initialization before collaboration',
  async (method) => {
    const id = `initial-json-${method}`;
    if (method === 'PUT') await createDocument({ id });
    const content = workbook('Initialized through REST');

    const response = await sendContent(method, id, content);

    expect(response.status).toBe(200);
    expect(JSON.parse((await response.json()).content)).toEqual(content);
    expect((await loadDocumentState(id))!.state).toBeNull();
    const doc = getYDoc(id);
    await doc.whenInitialized;
    expect(new SharedRoot(doc).getSheets()[0].name).toBe('Initialized through REST');
  },
);

test.each([false, true])('metadata-only PUT preserves Yjs state (active=%s)', async (active) => {
  const id = `metadata-only-${active}`;
  await createDocument({ id, name: 'Before' });
  const doc = getYDoc(id);
  await doc.whenInitialized;
  const saved = await loadDocumentState(id);
  if (!active) await persistence.release(doc);

  const response = await fetch(`${baseURL}/document/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'After' }),
  });

  expect(response.status).toBe(200);
  expect((await response.json()).name).toBe('After');
  expect(await loadDocumentState(id)).toEqual(saved);
});

test.each(['PUT', 'sync'] as const)(
  '%s rejects a cached room still initializing without persisted state',
  async (method) => {
    const id = `initializing-room-${method}`;
    const loading = deferred();
    const entered = deferred();
    const delayed = new DocumentPersistence({
      load: async (name) => {
        entered.resolve();
        await loading.promise;
        return loadDocumentState(name);
      },
      save: saveDocumentState,
    });
    delayed.install();
    const doc = getYDoc(id);
    try {
      await entered.promise;
      expect(await loadDocumentState(id)).toBeUndefined();

      const response = await sendContent(method, id, workbook('Rejected'));

      expect(response.status).toBe(409);
      expect(await response.json()).toEqual({
        error: CONTENT_WRITE_CONFLICT,
        message: CONTENT_WRITE_CONFLICT,
      });
      expect(await loadDocumentState(id)).toBeUndefined();
    } finally {
      loading.resolve();
      await doc.whenInitialized;
      await delayed.release(doc);
      persistence.install();
    }
  },
);

test.each(['PUT', 'sync'] as const)(
  '%s rechecks rooms created while checking persisted state',
  async (method) => {
    const id = `content-initialization-race-${method}`;
    await createDocument({ id, content: JSON.stringify(workbook('Before race')) });
    const checking = deferred();
    const checked = deferred();
    const actualLoad = database.loadDocumentState;
    const load = vi.spyOn(database, 'loadDocumentState').mockImplementationOnce(async (name) => {
      checking.resolve();
      await checked.promise;
      return actualLoad(name);
    });
    let doc: ReturnType<typeof getYDoc> | undefined;
    try {
      const pending = sendContent(method, id, workbook('Rejected'));
      await checking.promise;
      doc = getYDoc(id);
      checked.resolve();

      const response = await pending;

      expect(response.status).toBe(409);
      await doc.whenInitialized;
      expect(new SharedRoot(doc).getSheets()[0].name).toBe('Before race');
      expect(JSON.parse((await findDocument(id))!.content!).workbook.sheet.name).toBe(
        'Before race',
      );
    } finally {
      checked.resolve();
      load.mockRestore();
      if (doc) await doc.whenInitialized;
    }
  },
);

test('serializes concurrent legacy sync initialization requests without duplicate insertion', async () => {
  const id = 'concurrent-sync';

  const responses = await Promise.all([
    sendContent('sync', id, workbook('First')),
    sendContent('sync', id, workbook('Second')),
  ]);

  expect(responses.map((response) => response.status)).toEqual([200, 200]);
  expect(['First', 'Second']).toContain(
    JSON.parse((await findDocument(id))!.content!).workbook.sheet.name,
  );
});

test('room initialization waits for an already accepted pre-collaboration JSON write', async () => {
  const id = 'accepted-content-before-initialization';
  await createDocument({ id, content: JSON.stringify(workbook('Before')) });
  const writing = deferred();
  const written = deferred();
  const actualUpdate = database.updateDocument;
  const update = vi.spyOn(database, 'updateDocument').mockImplementationOnce(async (...args) => {
    writing.resolve();
    await written.promise;
    return actualUpdate(...args);
  });
  let doc: ReturnType<typeof getYDoc> | undefined;
  try {
    const pending = sendContent('PUT', id, workbook('Accepted before collaboration'));
    await writing.promise;
    doc = getYDoc(id);
    await Promise.resolve();
    expect((await loadDocumentState(id))!.state).toBeNull();
    written.resolve();

    expect((await pending).status).toBe(200);
    await doc.whenInitialized;
    expect(new SharedRoot(doc).getSheets()[0].name).toBe('Accepted before collaboration');
    expect(JSON.parse((await findDocument(id))!.content!).workbook.sheet.name).toBe(
      'Accepted before collaboration',
    );
  } finally {
    written.resolve();
    update.mockRestore();
    if (doc) await doc.whenInitialized;
  }
});

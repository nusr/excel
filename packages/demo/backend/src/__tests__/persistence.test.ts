import { vi } from 'vitest';
import http from 'node:http';
import { once } from 'node:events';
import WebSocket from 'ws';
import { Doc, applyUpdate, encodeStateAsUpdate } from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { docs, getYDoc, setContentInitializor, type WSSharedDoc } from '@y/websocket-server/utils';
import { PROTOCOL_VERSION, SharedRoot, createSharedSheet } from 'excel-collab/protocol';
import { DocumentPersistence } from '../persistence';
import { WebSocketManager } from '../websocket';
import { closeDatabase, loadDocumentState } from '../db';
import { reserveRoom } from '../roomReservations';

const rooms = new Set<WSSharedDoc>();
const quiet = vi.spyOn(console, 'log').mockImplementation(() => {});
function storage(saved?: Awaited<ReturnType<typeof loadDocumentState>>) {
  return {
    load: vi.fn(async (_id: string) => saved),
    save: vi.fn(async (_id: string, state: Uint8Array, content: string) => {
      saved = { state: Buffer.from(state), content };
    }),
  };
}
async function room(persistence: DocumentPersistence, name = 'persistence-test') {
  persistence.install();
  const doc = getYDoc(name);
  rooms.add(doc);
  await doc.whenInitialized;
  return doc;
}
function deferred() {
  let resolve!: () => void;
  const promise = new Promise<void>((done) => { resolve = done; });
  return { promise, resolve };
}
async function mockConnection() {
  const { WebSocket: MockSocket } = await vi.importMock<typeof import('ws')>('ws');
  const socket = new MockSocket('ws://unused');
  vi.spyOn(socket, 'readyState', 'get').mockReturnValue(WebSocket.OPEN);
  return socket;
}
afterEach(() => {
  for (const doc of rooms) {
    if (docs.get(doc.name) === doc) docs.delete(doc.name);
    doc.destroy();
  }
  rooms.clear();
  setContentInitializor(async () => {});
});
afterAll(async () => {
  quiet.mockRestore();
  await closeDatabase();
});

test('legacy coordinate JSON is migrated and binary state takes precedence over stale JSON', async () => {
  const json = {
    workbook: { '1': { sheetId: '1', name: 'Legacy', sort: 1, isHide: false, rowCount: 3, colCount: 3 } },
    worksheets: { '1_1_2': { value: 'saved' } },
    customWidth: { '1_2': { len: 120, isHide: false } },
  };
  const disk = storage({ state: null, content: JSON.stringify(json) });
  const persistence = new DocumentPersistence(disk);
  const doc = await room(persistence);
  expect(new SharedRoot(doc).toJSON()).toMatchObject(json);
  const saved = await disk.load(doc.name);
  const restored = await room(new DocumentPersistence(storage({
    state: saved!.state, content: '{"workbook":{}}',
  })), 'restored');
  expect(new SharedRoot(restored).toJSON()).toEqual(new SharedRoot(doc).toJSON());
  expect(encodeStateAsUpdate(restored)).toEqual(encodeStateAsUpdate(doc));
});

test('queued writes save matching JSON and binary snapshots in update order', async () => {
  const disk = storage();
  const persistence = new DocumentPersistence(disk);
  const doc = await room(persistence);
  disk.save.mockClear();
  const root = new SharedRoot(doc);
  const sheet = root.getSheets()[0];
  root.get('workbook').get(sheet.sheetId)!.set('name', 'first');
  root.get('workbook').get(sheet.sheetId)!.set('name', 'second');
  await persistence.flush(doc);
  expect(disk.save).toHaveBeenCalledTimes(2);
  for (const [, binary, content] of disk.save.mock.calls) {
    const copy = new Doc();
    applyUpdate(copy, binary);
    expect(new SharedRoot(copy).toJSON()).toEqual(JSON.parse(content));
    copy.destroy();
  }
  expect(JSON.parse(disk.save.mock.calls[1][2]).workbook[sheet.sheetId].name).toBe('second');
});

test('closing the last connection during initialization does not destroy an initializing room', async () => {
  const disk = storage();
  const loading = deferred();
  disk.load.mockImplementationOnce(async () => { await loading.promise; return undefined; });
  const persistence = new DocumentPersistence(disk);
  persistence.install();
  const doc = getYDoc('initializing');
  rooms.add(doc);
  const released = persistence.release(doc);
  await Promise.resolve();
  expect(doc.isDestroyed).toBe(false);
  expect(docs.get(doc.name)).toBe(doc);
  loading.resolve();
  await released;
  expect(doc.isDestroyed).toBe(true);
  expect(disk.save).toHaveBeenCalledOnce();
});

test('release waits for writes queued while flushing and retains a room that reconnects', async () => {
  const disk = storage();
  const persistence = new DocumentPersistence(disk);
  const doc = await room(persistence);
  const first = deferred();
  const second = deferred();
  const save = disk.save.getMockImplementation()!;
  disk.save.mockImplementationOnce(async (...args) => { await first.promise; await save(...args); })
    .mockImplementationOnce(async (...args) => { await second.promise; await save(...args); });
  const sheet = new SharedRoot(doc).get('workbook').values().next().value!;
  sheet.set('name', 'first');
  const released = persistence.release(doc);
  sheet.set('name', 'second');
  first.resolve();
  await vi.waitFor(() => expect(disk.save).toHaveBeenCalledTimes(3));
  expect(doc.isDestroyed).toBe(false);
  expect(getYDoc(doc.name)).toBe(doc);
  const connection = await mockConnection();
  doc.conns.set(connection, new Set());
  second.resolve();
  await released;
  expect(docs.get(doc.name)).toBe(doc);
  expect(doc.isDestroyed).toBe(false);
  doc.conns.delete(connection);
  await persistence.release(doc);
  expect(doc.isDestroyed).toBe(true);
  const restored = await room(persistence);
  expect(new SharedRoot(restored).getSheets()[0].name).toBe('second');
});

test('pending room reservations retain a room without exposing it to broadcasts', async () => {
  const persistence = new DocumentPersistence(storage());
  const doc = await room(persistence, 'reserved-room');
  const release = reserveRoom(doc);

  await persistence.release(doc);

  expect(doc.conns.size).toBe(0);
  expect(docs.get(doc.name)).toBe(doc);
  expect(doc.isDestroyed).toBe(false);
  release();
  release();
  await persistence.release(doc);
  expect(doc.isDestroyed).toBe(true);
});

test('failed saves reject flush, report errors, close clients and retain unsaved state for retry', async () => {
  const disk = storage();
  const persistence = new DocumentPersistence(disk);
  const doc = await room(persistence);
  const connection = await mockConnection();
  const close = vi.spyOn(connection, 'close').mockImplementation(() => {});
  doc.conns.set(connection, new Set());
  const error = new Error('disk unavailable');
  const log = vi.spyOn(console, 'error').mockImplementation(() => {});
  try {
    disk.save.mockRejectedValueOnce(error);
    const sheet = new SharedRoot(doc).get('workbook').values().next().value!;
    sheet.set('name', 'unsaved');
    await expect(persistence.flush(doc)).rejects.toThrow('disk unavailable');
    await expect(persistence.release(doc)).rejects.toThrow('disk unavailable');
    expect(close).toHaveBeenCalledWith(1011, 'Document persistence failed');
    expect(log).toHaveBeenCalledWith(expect.stringContaining(doc.name), error);
    expect(docs.get(doc.name)).toBe(doc);
    sheet.set('name', 'retry');
    await persistence.flush(doc);
    expect((await disk.load(doc.name))!.content).toContain('retry');
  } finally {
    log.mockRestore();
  }
});

test('invalid persisted binary rejects initialization without falling back to JSON or overwriting storage', async () => {
  const binary = Buffer.from([255]);
  const content = JSON.stringify({
    workbook: { '1': { sheetId: '1', name: 'Do not reset', sort: 1, isHide: false, rowCount: 3, colCount: 3 } },
  });
  const disk = storage({ state: binary, content });
  const persistence = new DocumentPersistence(disk);
  persistence.install();
  const doc = getYDoc('invalid-persisted-state');
  rooms.add(doc);

  await expect(doc.whenInitialized).rejects.toThrow();

  expect(disk.save).not.toHaveBeenCalled();
  expect(await disk.load(doc.name)).toEqual({ state: binary, content });
});

test('websocket sends no sync frames before initialization is durably saved', async () => {
  const disk = storage();
  const saving = deferred();
  const saved = deferred();
  const save = disk.save.getMockImplementation()!;
  disk.save.mockImplementationOnce(async (...args) => {
    saving.resolve();
    await saved.promise;
    await save(...args);
  });
  const persistence = new DocumentPersistence(disk);
  persistence.install();
  const server = http.createServer();
  const manager = new WebSocketManager(server, (doc) => persistence.release(doc));
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('Expected a TCP address');
  const socket = new WebSocket(`ws://127.0.0.1:${address.port}/durable-handshake?protocol=${PROTOCOL_VERSION}`);
  const opened = once(socket, 'open');
  const messages: Uint8Array[] = [];
  socket.on('message', (message) => messages.push(new Uint8Array(message as Buffer)));
  try {
    await saving.promise;
    rooms.add(docs.get('durable-handshake')!);
    await opened;
    expect(docs.get('durable-handshake')!.conns.size).toBe(0);
    expect(messages).toHaveLength(0);
    expect(await disk.load('durable-handshake')).toBeUndefined();

    saved.resolve();

    await vi.waitFor(() => expect(messages).not.toHaveLength(0));
    expect(docs.get('durable-handshake')!.conns.size).toBe(1);
    expect((await disk.load('durable-handshake'))!.state).toBeInstanceOf(Buffer);
  } finally {
    saved.resolve();
    socket.terminate();
    await manager.closeAllConnections();
    await persistence.flushAll();
    await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  }
});

test('real websocket clients synchronize before editing and reconnect with persisted identities', async () => {
  const disk = storage();
  const load = disk.load.getMockImplementation()!;
  disk.load.mockImplementation(async (...args) => {
    await new Promise((resolve) => setTimeout(resolve, 50));
    return load(...args);
  });
  const persistence = new DocumentPersistence(disk);
  persistence.install();
  const server = http.createServer();
  const manager = new WebSocketManager(server, (doc) => persistence.release(doc));
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('Expected a TCP address');
  const clients: Array<{ doc: Doc; provider: WebsocketProvider }> = [];
  const connect = async () => {
    const doc = new Doc();
    const provider = new WebsocketProvider(`ws://127.0.0.1:${address.port}`, 'network-test', doc, {
      disableBc: true, params: { protocol: String(PROTOCOL_VERSION) },
    });
    clients.push({ doc, provider });
    await vi.waitFor(() => expect(provider.synced).toBe(true));
    return doc;
  };
  try {
    const a = await connect();
    const b = await connect();
    const rootA = new SharedRoot(a);
    const rootB = new SharedRoot(b);
    expect(rootA.getSheets()).toHaveLength(1);
    expect(rootB.toJSON()).toEqual(rootA.toJSON());
    const sheet = rootA.getSheets()[0];
    rootA.get('workbook').get(sheet.sheetId)!.get('rows')!.insert(0, ['inserted-row']);
    rootB.get('workbook').set('second', createSharedSheet({ ...sheet, sheetId: 'second', name: 'Other' }));
    await vi.waitFor(() => expect(rootA.toJSON()).toEqual(rootB.toJSON()));
    const sharedDoc = docs.get('network-test')!;
    rooms.add(sharedDoc);
    await persistence.flush(sharedDoc);
    const expected = rootA.toJSON();
    for (const { provider } of clients) provider.destroy();
    await vi.waitFor(() => expect(docs.has('network-test')).toBe(false));
    const restored = await connect();
    rooms.add(docs.get('network-test')!);
    expect(new SharedRoot(restored).toJSON()).toEqual(expected);
    expect(new SharedRoot(restored).get('workbook').get(sheet.sheetId)!.get('rows')!.get(0)).toBe('inserted-row');
  } finally {
    for (const { doc, provider } of clients) {
      provider.destroy();
      doc.destroy();
    }
    await manager.closeAllConnections();
    await persistence.flushAll();
    await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  }
}, 15000);

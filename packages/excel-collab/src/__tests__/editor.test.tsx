import { vi } from 'vitest';
import { StrictMode } from 'react';
import { render } from '@testing-library/react';
import { Doc, UndoManager } from 'yjs';
import * as controllers from '../controller';
import { Excel } from '../editor';
import './global.mock';

const { workers, editorMount } = vi.hoisted(() => ({ workers: [] as Worker[], editorMount: vi.fn() }));
vi.mock('../worker?worker&inline', () => ({
  default: class extends globalThis.Worker {
    constructor() {
      super('test-worker');
      workers.push(this);
    }
    terminate = vi.fn();
  },
}));
vi.mock('../containers', async () => {
  const { createContext, useEffect } = await import('react');
  return {
    ExcelEditor: () => { useEffect(() => { editorMount(); }, []); return null; },
    StateContext: createContext(undefined),
  };
});

afterEach(() => {
  workers.length = 0;
  editorMount.mockClear();
  vi.restoreAllMocks();
});

test('StrictMode cleanup destroys controllers and workers but preserves an external Doc', () => {
  const doc = new Doc();
  const undo = vi.spyOn(UndoManager.prototype, 'destroy');
  const view = render(<StrictMode><Excel doc={doc} /></StrictMode>);
  expect(workers).toHaveLength(2);
  expect(workers[0].terminate).toHaveBeenCalledOnce();
  expect(workers[1].terminate).not.toHaveBeenCalled();
  expect(undo).toHaveBeenCalledOnce();
  view.unmount();
  expect(workers[1].terminate).toHaveBeenCalledOnce();
  expect(undo).toHaveBeenCalledTimes(2);
  expect(doc.isDestroyed).toBe(false);
  doc.destroy();
});

test('StrictMode cleanup also destroys internally owned Docs', () => {
  const init = vi.spyOn(controllers, 'initController');
  const view = render(<StrictMode><Excel /></StrictMode>);
  const docs = init.mock.calls.map(([options]) => options!.doc);
  expect(docs).toHaveLength(2);
  expect(docs[0].isDestroyed).toBe(true);
  expect(docs[1].isDestroyed).toBe(false);
  view.unmount();
  expect(docs[1].isDestroyed).toBe(true);
  expect(workers.every((worker) => vi.mocked(worker.terminate).mock.calls.length === 1)).toBe(true);
});

test('replacing an external Doc disposes the old controller and worker', () => {
  const first = new Doc();
  const second = new Doc();
  const view = render(<Excel doc={first} />);
  view.rerender(<Excel doc={second} />);
  expect(workers[0].terminate).toHaveBeenCalledOnce();
  expect(workers[1].terminate).not.toHaveBeenCalled();
  expect(first.isDestroyed).toBe(false);
  view.unmount();
  expect(workers[1].terminate).toHaveBeenCalledOnce();
  expect(second.isDestroyed).toBe(false);
  first.destroy();
  second.destroy();
});

test('recreating a controller for the same Doc remounts controller-bound UI callbacks', () => {
  const doc = new Doc();
  const view = render(<Excel doc={doc} provider={{}} />);
  expect(editorMount).toHaveBeenCalledOnce();
  view.rerender(<Excel doc={doc} provider={{}} />);
  expect(editorMount).toHaveBeenCalledTimes(2);
  view.unmount();
  doc.destroy();
});

test('an incompatible document does not leak the newly created worker', () => {
  const doc = new Doc();
  doc.getMap('excel').set('legacy', true);
  expect(() => render(<Excel doc={doc} />)).toThrow('Legacy Yjs documents');
  expect(workers[0].terminate).toHaveBeenCalledOnce();
  expect(doc.isDestroyed).toBe(false);
  doc.destroy();
});

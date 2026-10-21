import type { Doc } from 'yjs';

const reservations = new WeakMap<Doc, number>();

export function reserveRoom(doc: Doc): () => void {
  reservations.set(doc, (reservations.get(doc) ?? 0) + 1);
  let released = false;
  return () => {
    if (released) return;
    released = true;
    const remaining = (reservations.get(doc) ?? 1) - 1;
    if (remaining === 0) reservations.delete(doc);
    else reservations.set(doc, remaining);
  };
}

export function hasRoomReservations(doc: Doc): boolean {
  return reservations.has(doc);
}

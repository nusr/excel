declare module '@y/websocket-server/utils' {
  import type { WebSocket } from 'ws';
  import type { IncomingMessage } from 'http';
  import { Doc } from 'yjs';

  export interface WSSharedDoc extends Doc {
    on: Doc['on'] & ((event: 'error', listener: (error: Error) => void) => void);
    name: string;
    conns: Map<WebSocket, Set<number>>;
    whenInitialized: Promise<void>;
  }
  export function getYDoc(name: string): WSSharedDoc;
  export function setContentInitializor(initializer: (doc: WSSharedDoc) => Promise<void>): void;
  export function setPersistence(
    persistence: {
      bindState(name: string, doc: WSSharedDoc): void;
      writeState(name: string, doc: WSSharedDoc): Promise<void>;
    } | null,
  ): void;

  export function setupWSConnection(
    ws: WebSocket,
    request: IncomingMessage,
    config?: { gc?: boolean; docName?: string },
  ): void;

  export const docs: Map<string, WSSharedDoc>;
}

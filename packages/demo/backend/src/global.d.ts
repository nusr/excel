declare module '@y/websocket-server/utils' {
  import type { WebSocket } from 'ws';
  import type { IncomingMessage } from 'http';

  export function setupWSConnection(
    ws: WebSocket,
    request: IncomingMessage,
    config?: { gc?: boolean; docName?: string },
  ): void;

  export const docs: Map<string, any>;
}

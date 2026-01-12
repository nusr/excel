import WebSocket, { Server as WebSocketServer } from 'ws';
import http from 'http';
import { setupWSConnection } from '@y/websocket-server/utils';

export class WebSocketManager {
  private wss: WebSocketServer;
  private connections: Map<string, WebSocket> = new Map();

  constructor(server: http.Server) {
    console.log('CALLBACK_OBJECTS: ', process.env.CALLBACK_OBJECTS);
    console.log('CALLBACK_URL: ', process.env.CALLBACK_URL);
    this.wss = new WebSocketServer({ server });
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    this.wss.on(
      'connection',
      (ws: WebSocket, request: http.IncomingMessage) => {
        const docId = request.url?.slice(1) ?? '';
        console.log(`WebSocket connection established for document ${docId}`);

        const connectionId = this.generateConnectionId();
        this.connections.set(connectionId, ws);

        try {
          setupWSConnection(ws, request, { gc: true, docName: docId });
        } catch (error) {
          console.error(`Error setting up WebSocket connection: ${error}`);
          ws.close(1011, 'Internal server error');
        }

        ws.on('message', () => {
          console.log(`Received message from connection ${connectionId}`);
        });

        ws.on('close', (code: number, reason: string) => {
          console.log(
            `WebSocket connection closed for connection ${connectionId}: ${code} - ${reason}`,
          );
          this.connections.delete(connectionId);
        });

        ws.on('error', (error: Error) => {
          console.error(
            `WebSocket error for connection ${connectionId}: ${error}`,
          );
        });
      },
    );

    this.wss.on('error', (error: Error) => {
      console.error(`WebSocket server error: ${error}`);
    });
  }

  private generateConnectionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  getConnectionCount(): number {
    return this.connections.size;
  }

  closeAllConnections(): void {
    this.wss.close(() => {
      console.log('All WebSocket connections have been closed');
    });
  }
}

import WebSocket, { WebSocketServer  } from 'ws';
import http from 'node:http';
import { setupWSConnection, getYDoc, docs, type WSSharedDoc } from '@y/websocket-server/utils';
import { reserveRoom } from './roomReservations';
import { PROTOCOL_VERSION } from 'excel-collab/protocol';

export class WebSocketManager {
  private wss: WebSocketServer;
  private connections: Map<string, WebSocket> = new Map();

  constructor(
    server: http.Server,
    private readonly releaseDocument?: (doc: WSSharedDoc) => Promise<void>,
  ) {
    this.wss = new WebSocketServer({ server });
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    this.wss.on(
      'connection',
      async (ws: WebSocket, request: http.IncomingMessage) => {
        let docId: string;
        try {
          const url = new URL(request.url ?? '/', 'http://localhost');
          docId = decodeURIComponent(url.pathname.slice(1));
          if (url.searchParams.get('protocol') !== String(PROTOCOL_VERSION)) {
            ws.close(1008, `Collaboration protocol version ${PROTOCOL_VERSION} required`);
            return;
          }
        } catch (error) {
          console.error('Invalid collaboration document URL', error);
          ws.close(1008, 'Invalid document URL');
          return;
        }
        console.log(`WebSocket connection established for document ${docId}`);

        const connectionId = this.generateConnectionId();
        this.connections.set(connectionId, ws);
        let sharedDoc: WSSharedDoc | undefined;
        let initialized = false;
        let releaseReservation: (() => void) | undefined;

        ws.on('message', () => {
          console.log(`Received message from connection ${connectionId}`);
        });

        ws.on('close', (code: number, reason: string) => {
          console.log(
            `WebSocket connection closed for connection ${connectionId}: ${code} - ${reason}`,
          );
          this.connections.delete(connectionId);
          queueMicrotask(() => {
            if (!sharedDoc) return;
            releaseReservation?.();
            sharedDoc.conns.delete(ws);
            if (sharedDoc.conns.size === 0) {
              this.releaseDocument?.(sharedDoc).catch((error: unknown) => {
                console.error(`Failed to release collaboration document ${docId}`, error);
              });
            }
          });
        });

        ws.on('error', (error: Error) => {
          console.error(
            `WebSocket error for connection ${connectionId}: ${error}`,
          );
        });
        try {
          // Buffer the first client sync frame while the room loads from storage.
          ws.pause();
          sharedDoc = getYDoc(docId);
          releaseReservation = reserveRoom(sharedDoc);
          await sharedDoc.whenInitialized;
          initialized = true;
          if (ws.readyState === WebSocket.OPEN) {
            setupWSConnection(ws, request, { gc: true, docName: docId });
          }
        } catch (error) {
          console.error(`Error setting up WebSocket connection: ${error}`);
          if (sharedDoc && !initialized && docs.get(docId) === sharedDoc) {
            docs.delete(docId);
            sharedDoc.destroy();
          }
          ws.close(1011, 'Internal server error');
        } finally {
          releaseReservation?.();
          ws.resume();
        }
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

  closeAllConnections(): Promise<void> {
    for (const connection of this.connections.values()) connection.close(1001, 'Server shutting down');
    return new Promise((resolve, reject) => {
      this.wss.close((error) => {
        if (error) reject(error);
        else {
          console.log('All WebSocket connections have been closed');
          resolve();
        }
      });
    });
  }
}

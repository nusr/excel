import { vi } from 'vitest';
// Mock dependencies
const { mockSetupWSConnection } = vi.hoisted(() => ({
  mockSetupWSConnection: vi.fn(),
}));

// Mock modules before importing
vi.mock('ws', () => {
  return {
    __esModule: true,
    default: Object.assign(
      vi.fn().mockImplementation(function () {
        return {
          on: vi.fn(),
          close: vi.fn(),
          send: vi.fn(),
        };
      }),
      { OPEN: 1 },
    ),
    WebSocketServer: vi.fn().mockImplementation(function () {
      return {
        on: vi.fn(),
        close: vi.fn(),
      };
    }),
  };
});

vi.mock('@y/websocket-server/utils', () => {
  return {
    __esModule: true,
    setupWSConnection: mockSetupWSConnection,
    getYDoc: vi.fn(() => ({
      conns: new Map(),
      whenInitialized: Promise.resolve(),
    })),
    docs: new Map(),
  };
});

vi.spyOn(console, 'log').mockImplementation(() => {});
vi.spyOn(console, 'error').mockImplementation(() => {});

// Import the WebSocketManager after mocks are set up
import { WebSocketManager } from '../websocket';
import http from 'http';
import { EventEmitter } from 'node:events';
import WebSocket, { WebSocketServer as WSServer } from 'ws';
import { PROTOCOL_VERSION } from 'excel-collab/protocol';

describe('Yjs protocol compatibility', () => {
  it('should complete real sync handshakes and apply Yjs 13 updates', async () => {
    const { setupWSConnection, docs } = await vi.importActual<
      typeof import('@y/websocket-server/utils')
    >('@y/websocket-server/utils');
    const Y = await vi.importActual<typeof import('yjs')>('yjs');
    const sync = await vi.importActual<typeof import('y-protocols/sync')>('y-protocols/sync');
    const encoding = await vi.importActual<typeof import('lib0/encoding')>('lib0/encoding');
    const decoding = await vi.importActual<typeof import('lib0/decoding')>('lib0/decoding');
    const messages: Uint8Array[] = [];
    const connection: EventEmitter & Pick<WebSocket, 'readyState' | 'send' | 'close' | 'ping'> =
      Object.assign(new EventEmitter(), {
        readyState: 1 as const,
        send(message: Parameters<WebSocket['send']>[0]) {
          if (!(message instanceof Uint8Array)) {
            throw new TypeError('Expected a binary WebSocket message');
          }
          messages.push(message);
        },
        close: vi.fn(),
        ping: vi.fn(),
      });
    const docName = 'protocol-compatibility-test';
    const client = new Y.Doc();
    const protocolErrors: Error[] = [];

    try {
      setupWSConnection(connection as WebSocket, { url: `/${docName}` } as http.IncomingMessage, {
        docName,
      });
      docs.get(docName)!.on('error', (error: Error) => protocolErrors.push(error));
      expect(messages).toHaveLength(1);

      const handshake = decoding.createDecoder(messages.shift()!);
      expect(decoding.readVarUint(handshake)).toBe(0);
      const reply = encoding.createEncoder();
      encoding.writeVarUint(reply, 0);
      sync.readSyncMessage(handshake, reply, client, null);
      connection.emit('message', encoding.toUint8Array(reply));

      const request = encoding.createEncoder();
      encoding.writeVarUint(request, 0);
      sync.writeSyncStep1(request, client);
      connection.emit('message', encoding.toUint8Array(request));
      expect(messages).toHaveLength(1);

      const response = decoding.createDecoder(messages.shift()!);
      expect(decoding.readVarUint(response)).toBe(0);
      sync.readSyncMessage(response, encoding.createEncoder(), client, null);

      client.getMap('sheet').set('A1', 'compatible');
      const update = encoding.createEncoder();
      encoding.writeVarUint(update, 0);
      sync.writeUpdate(update, Y.encodeStateAsUpdate(client));
      connection.emit('message', encoding.toUint8Array(update));
      expect(docs.get(docName)!.getMap('sheet').get('A1')).toBe('compatible');
      expect(protocolErrors).toEqual([]);
    } finally {
      connection.emit('close');
      docs.get(docName)?.destroy();
      docs.delete(docName);
      client.destroy();
    }
  });
});

describe('WebSocketManager Tests', () => {
  let mockServer: http.Server;
  let wsManager: WebSocketManager;
  let mockWss: any;
  let mockWs: any;
  let mockRequest: http.IncomingMessage;

  beforeEach(() => {
    vi.clearAllMocks();
    mockSetupWSConnection.mockReset();

    // Create mock server
    mockServer = {} as http.Server;

    // Create mock WebSocket and request
    mockWs = {
      readyState: 1,
      pause: vi.fn(),
      resume: vi.fn(),
      on: vi.fn(),
      close: vi.fn(),
      send: vi.fn(),
    };
    mockRequest = {
      url: `/test-doc-1?protocol=${PROTOCOL_VERSION}`,
    } as http.IncomingMessage;

    // Create mock WebSocketServer with a connection event handler
    mockWss = {
      on: vi.fn().mockImplementation((event, callback) => {
        if (event === 'connection') {
          // Store the connection callback for later use
          mockWss.connectionCallback = callback;
        }
      }),
      close: vi.fn(),
    };

    // Import ws module to access the mocked Server constructor

    // Mock the WebSocketServer constructor to return our mockWss
    vi.mocked(WSServer).mockImplementation(function () {
      return mockWss;
    });

    // Create WebSocketManager instance
    wsManager = new WebSocketManager(mockServer);
  });

  describe('Constructor', () => {
    it('should create a WebSocketServer with the provided HTTP server', () => {
      // Import ws module to access the mocked Server constructor
      expect(WSServer).toHaveBeenCalledWith({ server: mockServer });
    });

    it('should call setupEventListeners to configure event handlers', () => {
      // Verify that connection event handler was registered
      expect(mockWss.on).toHaveBeenCalledWith('connection', expect.any(Function));
    });
  });

  describe('Connection Handling', () => {
    it('should handle new connections and register them', async () => {
      // Import ws module to access the mocked WebSocket constructor

      // Mock the WebSocket constructor to return our mockWs
      vi.mocked(WebSocket).mockImplementation(function () {
        return mockWs;
      });

      // Simulate a new connection by calling the stored callback
      if (mockWss.connectionCallback) {
        await mockWss.connectionCallback(mockWs, mockRequest);
      }

      // Verify connection was registered
      expect(wsManager.getConnectionCount()).toBe(1);
      expect(mockSetupWSConnection).toHaveBeenCalledWith(mockWs, mockRequest, {
        gc: true,
        docName: 'test-doc-1',
      });
    });

    it('should generate unique connection IDs', async () => {
      // Import ws module to access the mocked WebSocket constructor

      // Mock the WebSocket constructor to return our mockWs
      vi.mocked(WebSocket).mockImplementation(function () {
        return mockWs;
      });

      // Create a second mock WebSocket
      const mockWs2 = {
        readyState: 1,
        pause: vi.fn(),
        resume: vi.fn(),
        on: vi.fn(),
        close: vi.fn(),
        send: vi.fn(),
      };

      // Simulate two connections
      if (mockWss.connectionCallback) {
        await mockWss.connectionCallback(mockWs, mockRequest);
        await mockWss.connectionCallback(mockWs2, mockRequest);
      }

      // Verify both connections are registered
      expect(wsManager.getConnectionCount()).toBe(2);
    });

    it('should handle connection errors', async () => {
      // Import ws module to access the mocked WebSocket constructor

      // Mock the WebSocket constructor to return our mockWs
      vi.mocked(WebSocket).mockImplementation(function () {
        return mockWs;
      });

      // Make setupWSConnection throw an error
      mockSetupWSConnection.mockImplementation(() => {
        throw new Error('Setup error');
      });

      // Simulate a new connection
      if (mockWss.connectionCallback) {
        await mockWss.connectionCallback(mockWs, mockRequest);
      }

      // Verify error was logged and connection was closed
      expect(console.error).toHaveBeenCalledWith(
        'Error setting up WebSocket connection: Error: Setup error',
      );
      expect(mockWs.close).toHaveBeenCalledWith(1011, 'Internal server error');
    });

    it('should handle message events', async () => {
      // Import ws module to access the mocked WebSocket constructor

      // Mock the WebSocket constructor to return our mockWs
      vi.mocked(WebSocket).mockImplementation(function () {
        return mockWs;
      });

      // Simulate a new connection
      if (mockWss.connectionCallback) {
        await mockWss.connectionCallback(mockWs, mockRequest);
      }

      // Verify message handler was registered
      expect(mockWs.on).toHaveBeenCalledWith('message', expect.any(Function));
    });

    it('should handle close events and remove connections', async () => {
      // Import ws module to access the mocked WebSocket constructor

      // Mock the WebSocket constructor to return our mockWs
      vi.mocked(WebSocket).mockImplementation(function () {
        return mockWs;
      });

      // Simulate a new connection
      if (mockWss.connectionCallback) {
        await mockWss.connectionCallback(mockWs, mockRequest);
      }
      expect(wsManager.getConnectionCount()).toBe(1);

      // Get the close event handler
      const closeHandler = mockWs.on.mock.calls.find((call: any[]) => call[0] === 'close')[1];

      // Simulate closing the connection
      closeHandler(1000, 'Normal closure');

      // Verify connection was removed
      expect(wsManager.getConnectionCount()).toBe(0);
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('WebSocket connection closed'),
      );
    });

    it('should handle error events', async () => {
      // Import ws module to access the mocked WebSocket constructor

      // Mock the WebSocket constructor to return our mockWs
      vi.mocked(WebSocket).mockImplementation(function () {
        return mockWs;
      });

      // Simulate a new connection
      if (mockWss.connectionCallback) {
        await mockWss.connectionCallback(mockWs, mockRequest);
      }

      // Get the error event handler
      const errorHandler = mockWs.on.mock.calls.find((call: any[]) => call[0] === 'error')[1];

      // Simulate an error
      const mockError = new Error('WebSocket error');
      errorHandler(mockError);

      // Verify error was logged
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('WebSocket error for connection'),
      );
    });
  });

  describe('Server Level Events', () => {
    it('should handle server-level errors', () => {
      // Simulate a server error
      const mockError = new Error('Server error');

      // Get the error event handler from the WebSocketServer
      const errorHandler = mockWss.on.mock.calls.find((call: any[]) => call[0] === 'error')?.[1];

      // Call the error handler if it exists
      if (errorHandler) {
        errorHandler(mockError);
      }

      // Verify error was logged
      expect(console.error).toHaveBeenCalledWith('WebSocket server error: Error: Server error');
    });
  });

  describe('Helper Methods', () => {
    it('should return the correct connection count', () => {
      // Initial count should be 0
      expect(wsManager.getConnectionCount()).toBe(0);

      // Import ws module to access the mocked WebSocket constructor

      // Mock the WebSocket constructor to return our mockWs
      vi.mocked(WebSocket).mockImplementation(function () {
        return mockWs;
      });

      // Create a second mock WebSocket
      const mockWs2 = {
        readyState: 1,
        pause: vi.fn(),
        resume: vi.fn(),
        on: vi.fn(),
        close: vi.fn(),
        send: vi.fn(),
      };

      // Simulate two connections
      if (mockWss.connectionCallback) {
        mockWss.connectionCallback(mockWs, mockRequest);
        mockWss.connectionCallback(mockWs2, mockRequest);
      }

      // Count should now be 2
      expect(wsManager.getConnectionCount()).toBe(2);
    });

    it('should close all connections when closeAllConnections is called', () => {
      // Create a simpler mock for close that doesn't require typing
      mockWss.close = vi.fn().mockImplementation((cb: any) => {
        if (typeof cb === 'function') cb();
      });

      wsManager.closeAllConnections();

      // Verify WebSocketServer close was called
      expect(mockWss.close).toHaveBeenCalled();

      // The console.log should have been called by the callback
      expect(console.log).toHaveBeenCalledWith('All WebSocket connections have been closed');
    });
  });

  describe('Edge Cases', () => {
    it('should reject connections without a protocol version before loading a room', async () => {
      // Import ws module to access the mocked WebSocket constructor

      // Mock the WebSocket constructor to return our mockWs
      vi.mocked(WebSocket).mockImplementation(function () {
        return mockWs;
      });

      // Create request without URL
      const requestWithoutUrl = {} as http.IncomingMessage;

      // Simulate a new connection
      if (mockWss.connectionCallback) {
        await mockWss.connectionCallback(mockWs, requestWithoutUrl);
      }

      expect(mockSetupWSConnection).not.toHaveBeenCalled();
      expect(mockWs.close).toHaveBeenCalledWith(
        1008,
        `Collaboration protocol version ${PROTOCOL_VERSION} required`,
      );
    });

    it('should handle connections with empty URL path', async () => {
      // Import ws module to access the mocked WebSocket constructor

      // Mock the WebSocket constructor to return our mockWs
      vi.mocked(WebSocket).mockImplementation(function () {
        return mockWs;
      });

      // Create request with empty URL
      const requestWithEmptyUrl = {
        url: `/?protocol=${PROTOCOL_VERSION}`,
      } as http.IncomingMessage;

      // Simulate a new connection
      if (mockWss.connectionCallback) {
        await mockWss.connectionCallback(mockWs, requestWithEmptyUrl);
      }

      // Verify connection was set up with empty docName
      expect(mockSetupWSConnection).toHaveBeenCalledWith(mockWs, requestWithEmptyUrl, {
        gc: true,
        docName: '',
      });
    });
  });

  describe('Message Handling', () => {
    it('should log messages received from clients', () => {
      // Import ws module to access the mocked WebSocket constructor

      // Mock the WebSocket constructor to return our mockWs
      vi.mocked(WebSocket).mockImplementation(function () {
        return mockWs;
      });

      // Simulate a new connection
      if (mockWss.connectionCallback) {
        mockWss.connectionCallback(mockWs, mockRequest);
      }

      // Get all the message event handlers
      const messageHandlers = mockWs.on.mock.calls
        .filter((call: any[]) => call[0] === 'message')
        .map((call: any[]) => call[1]);

      // Verify at least one message handler was registered
      expect(messageHandlers.length).toBeGreaterThan(0);
    });
  });
});

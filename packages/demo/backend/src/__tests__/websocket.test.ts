// Mock dependencies
const mockSetupWSConnection = jest.fn();

// Mock modules before importing
jest.mock('ws', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      on: jest.fn(),
      close: jest.fn(),
      send: jest.fn(),
    })),
    Server: jest.fn().mockImplementation(() => ({
      on: jest.fn(),
      close: jest.fn(),
    })),
  };
});

jest.mock('@y/websocket-server/utils', () => {
  return {
    __esModule: true,
    setupWSConnection: mockSetupWSConnection,
  };
});

jest.spyOn(console, 'log').mockImplementation(() => {});
jest.spyOn(console, 'error').mockImplementation(() => {});

// Import the WebSocketManager after mocks are set up
import { WebSocketManager } from '../websocket';
import http from 'http';

describe('WebSocketManager Tests', () => {
  let mockServer: http.Server;
  let wsManager: WebSocketManager;
  let mockWss: any;
  let mockWs: any;
  let mockRequest: http.IncomingMessage;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Create mock server
    mockServer = {} as http.Server;
    
    // Create mock WebSocket and request
    mockWs = {
      on: jest.fn(),
      close: jest.fn(),
      send: jest.fn(),
    };
    mockRequest = { url: '/test-doc-1' } as http.IncomingMessage;
    
    // Create mock WebSocketServer with a connection event handler
    mockWss = {
      on: jest.fn().mockImplementation((event, callback) => {
        if (event === 'connection') {
          // Store the connection callback for later use
          mockWss.connectionCallback = callback;
        }
      }),
      close: jest.fn(),
    };
    
    // Import ws module to access the mocked Server constructor
    const { Server: WSServer } = require('ws');
    
    // Mock the WebSocketServer constructor to return our mockWss
    (WSServer as jest.Mock).mockReturnValue(mockWss);
    
    // Create WebSocketManager instance
    wsManager = new WebSocketManager(mockServer);
  });

  describe('Constructor', () => {
    it('should create a WebSocketServer with the provided HTTP server', () => {
      // Import ws module to access the mocked Server constructor
      const { Server: WSServer } = require('ws');
      expect(WSServer).toHaveBeenCalledWith({ server: mockServer });
    });

    it('should call setupEventListeners to configure event handlers', () => {
      // Verify that connection event handler was registered
      expect(mockWss.on).toHaveBeenCalledWith(
        'connection',
        expect.any(Function)
      );
    });

    it('should log environment variables CALLBACK_OBJECTS and CALLBACK_URL', () => {
      expect(console.log).toHaveBeenCalledWith('CALLBACK_OBJECTS: ', process.env.CALLBACK_OBJECTS);
      expect(console.log).toHaveBeenCalledWith('CALLBACK_URL: ', process.env.CALLBACK_URL);
    });
  });

  describe('Connection Handling', () => {
    it('should handle new connections and register them', () => {
      // Import ws module to access the mocked WebSocket constructor
      const WebSocket = require('ws').default;
      
      // Mock the WebSocket constructor to return our mockWs
      (WebSocket as jest.Mock).mockReturnValue(mockWs);
      
      // Simulate a new connection by calling the stored callback
      if (mockWss.connectionCallback) {
        mockWss.connectionCallback(mockWs, mockRequest);
      }
      
      // Verify connection was registered
      expect(wsManager.getConnectionCount()).toBe(1);
      expect(mockSetupWSConnection).toHaveBeenCalledWith(
        mockWs,
        mockRequest,
        { gc: true, docName: 'test-doc-1' }
      );
    });

    it('should generate unique connection IDs', () => {
      // Import ws module to access the mocked WebSocket constructor
      const WebSocket = require('ws').default;
      
      // Mock the WebSocket constructor to return our mockWs
      (WebSocket as jest.Mock).mockReturnValue(mockWs);
      
      // Create a second mock WebSocket
      const mockWs2 = {
        on: jest.fn(),
        close: jest.fn(),
        send: jest.fn(),
      };
      
      // Simulate two connections
      if (mockWss.connectionCallback) {
        mockWss.connectionCallback(mockWs, mockRequest);
        mockWss.connectionCallback(mockWs2, mockRequest);
      }
      
      // Verify both connections are registered
      expect(wsManager.getConnectionCount()).toBe(2);
    });

    it('should handle connection errors', () => {
      // Import ws module to access the mocked WebSocket constructor
      const WebSocket = require('ws').default;
      
      // Mock the WebSocket constructor to return our mockWs
      (WebSocket as jest.Mock).mockReturnValue(mockWs);
      
      // Make setupWSConnection throw an error
      mockSetupWSConnection.mockImplementation(() => {
        throw new Error('Setup error');
      });
      
      // Simulate a new connection
      if (mockWss.connectionCallback) {
        mockWss.connectionCallback(mockWs, mockRequest);
      }
      
      // Verify error was logged and connection was closed
      expect(console.error).toHaveBeenCalledWith(
        'Error setting up WebSocket connection: Error: Setup error'
      );
      expect(mockWs.close).toHaveBeenCalledWith(1011, 'Internal server error');
    });

    it('should handle message events', () => {
      // Import ws module to access the mocked WebSocket constructor
      const WebSocket = require('ws').default;
      
      // Mock the WebSocket constructor to return our mockWs
      (WebSocket as jest.Mock).mockReturnValue(mockWs);
      
      // Simulate a new connection
      if (mockWss.connectionCallback) {
        mockWss.connectionCallback(mockWs, mockRequest);
      }
      
      // Verify message handler was registered
      expect(mockWs.on).toHaveBeenCalledWith('message', expect.any(Function));
    });

    it('should handle close events and remove connections', () => {
      // Import ws module to access the mocked WebSocket constructor
      const WebSocket = require('ws').default;
      
      // Mock the WebSocket constructor to return our mockWs
      (WebSocket as jest.Mock).mockReturnValue(mockWs);
      
      // Simulate a new connection
      if (mockWss.connectionCallback) {
        mockWss.connectionCallback(mockWs, mockRequest);
      }
      expect(wsManager.getConnectionCount()).toBe(1);
      
      // Get the close event handler
      const closeHandler = mockWs.on.mock.calls.find(
        (call: any[]) => call[0] === 'close'
      )[1];
      
      // Simulate closing the connection
      closeHandler(1000, 'Normal closure');
      
      // Verify connection was removed
      expect(wsManager.getConnectionCount()).toBe(0);
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('WebSocket connection closed')
      );
    });

    it('should handle error events', () => {
      // Import ws module to access the mocked WebSocket constructor
      const WebSocket = require('ws').default;
      
      // Mock the WebSocket constructor to return our mockWs
      (WebSocket as jest.Mock).mockReturnValue(mockWs);
      
      // Simulate a new connection
      if (mockWss.connectionCallback) {
        mockWss.connectionCallback(mockWs, mockRequest);
      }
      
      // Get the error event handler
      const errorHandler = mockWs.on.mock.calls.find(
        (call: any[]) => call[0] === 'error'
      )[1];
      
      // Simulate an error
      const mockError = new Error('WebSocket error');
      errorHandler(mockError);
      
      // Verify error was logged
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('WebSocket error for connection')
      );
    });
  });

  describe('Server Level Events', () => {
    it('should handle server-level errors', () => {
      // Simulate a server error
      const mockError = new Error('Server error');
      
      // Get the error event handler from the WebSocketServer
      const errorHandler = mockWss.on.mock.calls.find(
        (call: any[]) => call[0] === 'error'
      )?.[1];
      
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
      const WebSocket = require('ws').default;
      
      // Mock the WebSocket constructor to return our mockWs
      (WebSocket as jest.Mock).mockReturnValue(mockWs);
      
      // Create a second mock WebSocket
      const mockWs2 = {
        on: jest.fn(),
        close: jest.fn(),
        send: jest.fn(),
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
      mockWss.close = jest.fn().mockImplementation((cb: any) => {
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
    it('should handle connections without a docId in URL', () => {
      // Import ws module to access the mocked WebSocket constructor
      const WebSocket = require('ws').default;
      
      // Mock the WebSocket constructor to return our mockWs
      (WebSocket as jest.Mock).mockReturnValue(mockWs);
      
      // Create request without URL
      const requestWithoutUrl = {} as http.IncomingMessage;
      
      // Simulate a new connection
      if (mockWss.connectionCallback) {
        mockWss.connectionCallback(mockWs, requestWithoutUrl);
      }
      
      // Verify connection was set up with empty docName
      expect(mockSetupWSConnection).toHaveBeenCalledWith(
        mockWs,
        requestWithoutUrl,
        { gc: true, docName: '' }
      );
    });

    it('should handle connections with empty URL path', () => {
      // Import ws module to access the mocked WebSocket constructor
      const WebSocket = require('ws').default;
      
      // Mock the WebSocket constructor to return our mockWs
      (WebSocket as jest.Mock).mockReturnValue(mockWs);
      
      // Create request with empty URL
      const requestWithEmptyUrl = { url: '/' } as http.IncomingMessage;
      
      // Simulate a new connection
      if (mockWss.connectionCallback) {
        mockWss.connectionCallback(mockWs, requestWithEmptyUrl);
      }
      
      // Verify connection was set up with empty docName
      expect(mockSetupWSConnection).toHaveBeenCalledWith(
        mockWs,
        requestWithEmptyUrl,
        { gc: true, docName: '' }
      );
    });
  });

  describe('Message Handling', () => {
    it('should log messages received from clients', () => {
      // Import ws module to access the mocked WebSocket constructor
      const WebSocket = require('ws').default;
      
      // Mock the WebSocket constructor to return our mockWs
      (WebSocket as jest.Mock).mockReturnValue(mockWs);
      
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

import { vi } from 'vitest';
// Mock dependencies before importing the app
const { mockDb, mockReadFile, mockRemoveFile, mockJoin, mockExtname } = vi.hoisted(() => ({
  mockDb: {
    findFile: vi.fn(),
    createFile: vi.fn(),
    createDocument: vi.fn(),
    deleteDocument: vi.fn(),
    updateDocument: vi.fn(),
    findDocument: vi.fn(),
    findAllDocuments: vi.fn(),
    upsertDocument: vi.fn(),
    loadDocumentState: vi.fn().mockResolvedValue(undefined),
    initDatabase: vi.fn().mockResolvedValue(undefined),
  },
  mockReadFile: vi.fn(),
  mockRemoveFile: vi.fn().mockResolvedValue(undefined),
  mockJoin: vi.fn(),
  mockExtname: vi.fn(),
}));

// Mock modules before importing
vi.mock('../db', () => mockDb);

vi.mock('node:fs', async (importOriginal) => {
  const actual = await importOriginal<typeof import('node:fs')>();
  return {
    ...actual,
    default: {
      ...actual,
      promises: { ...actual.promises, readFile: mockReadFile, rm: mockRemoveFile },
    },
    promises: { ...actual.promises, readFile: mockReadFile, rm: mockRemoveFile },
  };
});

vi.mock('node:path', async (importOriginal) => {
  const actual = await importOriginal<typeof import('node:path')>();
  return {
    ...actual,
    default: { ...actual, join: mockJoin, extname: mockExtname },
    join: mockJoin,
    extname: mockExtname,
  };
});

vi.spyOn(console, 'log').mockImplementation(() => {});

import { Context } from 'koa';
import http from 'node:http';
import { once } from 'node:events';
import { Socket } from 'node:net';

// Type declaration for Koa middleware next function
type NextFunction = () => Promise<void>;
import app, {
  errorHandler,
  assertParam,
  assertString,
  assertNumber,
  sendFile,
  createDocument,
  deleteDocument,
  updateDocument,
  findDocument,
  listDocuments,
  sync,
  upload,
} from '../route';

describe('Route Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Upload cleanup', () => {
    it.each([false, true])(
      'removes all temporary files even when storage fails (%s)',
      async (fails) => {
        const file = { filepath: '/tmp/upload-first', originalFilename: 'photo.png', size: 5 };
        const ctx = {
          request: {
            files: {
              file: [file, { ...file, filepath: '/tmp/upload-second' }],
              extra: { ...file, filepath: '/tmp/upload-extra' },
            },
          },
          body: undefined,
          throw(status: number, message: string): never {
            throw Object.assign(new Error(message), { status });
          },
        };
        mockReadFile.mockResolvedValue(Buffer.from('image'));
        if (fails) mockDb.createFile.mockRejectedValueOnce(new Error('storage unavailable'));
        else
          mockDb.createFile.mockResolvedValueOnce({
            id: 7,
            name: 'photo.png',
            size: 5,
            content: Buffer.from('image'),
          });
        const result = upload(ctx as unknown as Context);
        if (fails) await expect(result).rejects.toThrow('storage unavailable');
        else {
          await result;
          expect(ctx.body).toEqual({ id: 7, name: 'photo.png', size: 5, filePath: '/upload/7' });
        }
        for (const filepath of ['/tmp/upload-first', '/tmp/upload-second', '/tmp/upload-extra']) {
          expect(mockRemoveFile).toHaveBeenCalledWith(filepath, { force: true });
        }
      },
    );
    it('cleans up an unexpected file field when rejecting a request without the required field', async () => {
      const ctx = {
        request: {
          files: { extra: { filepath: '/tmp/unexpected', originalFilename: 'photo.png', size: 5 } },
        },
        throw(status: number, message: string): never {
          throw Object.assign(new Error(message), { status });
        },
      };
      await expect(upload(ctx as unknown as Context)).rejects.toMatchObject({ status: 400 });
      expect(mockDb.createFile).not.toHaveBeenCalled();
      expect(mockRemoveFile).toHaveBeenCalledWith('/tmp/unexpected', { force: true });
    });
  });

  describe('Error Handling Middleware', () => {
    it('should turn unexpected errors into 500 responses even with Koa default 404 status', async () => {
      const ctx = { status: 404, body: undefined };

      await errorHandler(ctx as unknown as Context, async () => {
        throw new Error('Database unavailable');
      });

      expect(ctx.status).toBe(500);
      expect(ctx.body).toEqual({
        error: 'Internal Server Error',
        message: 'An unexpected error occurred',
      });
    });

    it('should handle body parser errors with the JSON error middleware', async () => {
      const server = http.createServer(app.callback());
      server.listen(0, '127.0.0.1');
      await once(server, 'listening');
      try {
        const address = server.address();
        if (!address || typeof address === 'string') throw new Error('Expected TCP address');
        const response = await fetch(`http://127.0.0.1:${address.port}/document`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: '{broken',
        });

        expect(response.status).toBe(400);
        expect(await response.json()).toMatchObject({ error: expect.any(String) });
        expect(mockDb.createDocument).not.toHaveBeenCalled();
      } finally {
        await new Promise<void>((resolve, reject) => {
          server.close((error) => (error ? reject(error) : resolve()));
          server.closeAllConnections();
        });
      }
    });

    it('should handle generic errors', async () => {
      const ctx = {
        status: 200,
        throw: (status: number, message: string) => {
          ctx.status = status;
          ctx.body = message;
        },
        body: '' as any,
      };

      const error = new Error('Test error');
      const next = vi.fn().mockRejectedValue(error);

      await errorHandler(ctx as unknown as Context, next as NextFunction);

      expect(ctx.status).toBe(500);
      expect(ctx.body).toEqual({
        error: 'Internal Server Error',
        message: 'An unexpected error occurred',
      });
    });

    it('should handle custom errors with specific status codes', async () => {
      const ctx = {
        status: 200,
        throw: (status: number, message: string) => {
          ctx.status = status;
          ctx.body = message;
        },
        body: '' as any,
      };

      const error = new Error('Custom error');
      (error as any).status = 404;
      const next = vi.fn().mockRejectedValue(error);

      await errorHandler(ctx as unknown as Context, next as NextFunction);

      expect(ctx.status).toBe(404);
      expect(ctx.body).toEqual({ error: 'Custom error', message: 'Custom error' });
    });

    it('should call next if no error occurs', async () => {
      const ctx = {
        body: '' as any,
      };
      const next = vi.fn();

      await errorHandler(ctx as unknown as Context, next as NextFunction);

      expect(next).toHaveBeenCalled();
    });
  });

  describe('Parameter Validation Functions', () => {
    describe('assertParam', () => {
      it('should validate parameter exists', () => {
        const ctx = {
          throw: vi.fn(),
          body: '' as any,
        };

        // Test with valid parameter
        expect(() =>
          assertParam(ctx as unknown as Context, 'test-value', 'Param validation'),
        ).not.toThrow();
      });

      it('should throw an error if parameter does not exist', () => {
        const ctx = {
          throw: vi.fn(),
          body: '' as any,
        };

        assertParam(ctx as unknown as Context, null, 'Missing parameter');

        expect(ctx.throw).toHaveBeenCalledWith(400, 'Missing parameter');
      });
    });

    describe('assertString', () => {
      it('should validate string parameter', () => {
        const ctx = {
          throw: vi.fn(),
          body: '' as any,
        };

        // Test with valid string
        expect(() =>
          assertString(ctx as unknown as Context, 'test-string', 'String validation'),
        ).not.toThrow();
      });

      it('should throw an error if parameter is not a string', () => {
        const ctx = {
          throw: vi.fn(),
          body: '' as any,
        };

        assertString(ctx as unknown as Context, 123, 'Must be a string');

        expect(ctx.throw).toHaveBeenCalledWith(400, 'Must be a string');
      });
    });

    describe('assertNumber', () => {
      it('should validate number parameter', () => {
        const ctx = {
          throw: vi.fn(),
          body: '' as any,
        };

        // Test with valid number
        expect(() =>
          assertNumber(ctx as unknown as Context, 123, 'Number validation'),
        ).not.toThrow();
      });

      it('should throw an error if parameter is not a valid number', () => {
        const ctx = {
          throw: vi.fn(),
        };

        assertNumber(ctx as unknown as Context, 'abc', 'Must be a number');

        expect(ctx.throw).toHaveBeenCalledWith(400, 'Must be a number');
      });

      it('should throw an error if parameter is NaN', () => {
        const ctx = {
          throw: vi.fn(),
        };

        assertNumber(ctx as unknown as Context, NaN, 'Must be a valid number');

        expect(ctx.throw).toHaveBeenCalledWith(400, 'Must be a valid number');
      });
    });
  });

  describe('sendFile Function', () => {
    it.each(['GET', 'HEAD'])(
      'should honor conditional %s requests with a real Koa context',
      async (method) => {
        const modified = new Date('2023-01-01T00:00:00Z');
        mockDb.findFile.mockResolvedValue({
          id: 1,
          name: 'test.txt',
          size: 4,
          content: Buffer.from('test'),
          last_modified: modified.toISOString(),
        });
        mockExtname.mockReturnValue('.txt');
        const request = new http.IncomingMessage(new Socket());
        request.method = method;
        request.headers['if-modified-since'] = modified.toUTCString();
        const ctx = app.createContext(request, new http.ServerResponse(request));
        ctx.params = { fileId: '1' };
        ctx.res.statusCode = 404;

        await sendFile(ctx);

        expect(ctx.status).toBe(304);
        expect(ctx.body).toBeUndefined();
      },
    );

    it('should set correct headers and body for file download (GET)', async () => {
      const mockFile = {
        id: 1,
        name: 'test.txt',
        content: Buffer.from('test content'),
        size: 12,
        last_modified: new Date('2023-01-01'),
      };

      mockDb.findFile.mockResolvedValue(mockFile);
      mockExtname.mockReturnValue('.txt');

      const ctx = {
        params: { fileId: '1' },
        set: vi.fn(),
        response: {
          lastModified: null,
          length: null,
        },
        type: '',
        body: '' as any,
        status: 200,
        request: {
          method: 'GET',
          fresh: false,
        },
        throw: vi.fn(),
      };

      await sendFile(ctx as unknown as Context);

      expect(mockDb.findFile).toHaveBeenCalledWith(1);
      expect(ctx.response.lastModified).toEqual(mockFile.last_modified);
      expect(ctx.response.length).toBe(12);
      expect(ctx.type).toBe('.txt');
      expect(ctx.status).toBe(200);
    });

    it('should handle HEAD request for file', async () => {
      const mockFile = {
        id: 1,
        name: 'test.txt',
        content: Buffer.from('test content'),
        size: 12,
        last_modified: new Date('2023-01-01'),
      };

      mockDb.findFile.mockResolvedValue(mockFile);

      const ctx = {
        params: { fileId: '1' },
        response: {
          lastModified: null,
          length: null,
        },
        type: '',
        status: 200,
        request: {
          method: 'HEAD',
          fresh: false,
        },
        throw: vi.fn(),
      };

      await sendFile(ctx as unknown as Context);

      expect(mockDb.findFile).toHaveBeenCalledWith(1);
      expect(ctx.response.lastModified).toEqual(mockFile.last_modified);
      expect(ctx.response.length).toBe(12);
      expect(ctx.status).toBe(200);
    });

    it('should handle file not found', async () => {
      mockDb.findFile.mockResolvedValue(null);

      const ctx = {
        params: { fileId: '1' },
        throw: vi.fn(),
        body: '' as any,
      };

      await sendFile(ctx as unknown as Context);

      expect(ctx.throw).toHaveBeenCalledWith(404, 'File with ID 1 not found');
    });

    it('should handle invalid fileId parameter', async () => {
      const ctx = {
        params: { fileId: 'abc' },
        throw: vi.fn(),
        body: '' as any,
      };

      await sendFile(ctx as unknown as Context);

      expect(ctx.throw).toHaveBeenCalledWith(400, 'fileId should be a valid number');
    });

    it.each(['1abc', '1.5', '0', '-1', 'Infinity', '9007199254740992'])(
      'should reject invalid integer file id %s before querying storage',
      async (fileId) => {
        const ctx = { params: { fileId }, throw: vi.fn() };

        await sendFile(ctx as unknown as Context);

        expect(ctx.throw).toHaveBeenCalledWith(400, 'fileId should be a valid number');
        expect(mockDb.findFile).not.toHaveBeenCalled();
      },
    );

    it('should handle GET request with fresh cache (304 Not Modified)', async () => {
      const mockFile = {
        id: 1,
        name: 'test.txt',
        content: Buffer.from('test content'),
        size: 12,
        last_modified: new Date('2023-01-01'),
      };

      mockDb.findFile.mockResolvedValue(mockFile);
      mockExtname.mockReturnValue('.txt');

      const ctx = {
        params: { fileId: '1' },
        response: {
          lastModified: null,
          length: null,
        },
        type: '',
        body: '' as any,
        status: 200,
        request: {
          method: 'GET',
          fresh: true,
        },
        throw: vi.fn(),
      };

      await sendFile(ctx as unknown as Context);

      expect(ctx.status).toBe(304);
      expect(ctx.body).toBe(''); // No body for 304 response
    });

    it('should handle HEAD request with fresh cache (304 Not Modified)', async () => {
      const mockFile = {
        id: 1,
        name: 'test.txt',
        content: Buffer.from('test content'),
        size: 12,
        last_modified: new Date('2023-01-01'),
      };

      mockDb.findFile.mockResolvedValue(mockFile);

      const ctx = {
        params: { fileId: '1' },
        response: {
          lastModified: null,
          length: null,
        },
        type: '',
        status: 200,
        request: {
          method: 'HEAD',
          fresh: true,
        },
        throw: vi.fn(),
      };

      await sendFile(ctx as unknown as Context);

      expect(ctx.status).toBe(304);
    });

    it('should handle file with null last_modified', async () => {
      const mockFile = {
        id: 1,
        name: 'test.txt',
        content: Buffer.from('test content'),
        size: 12,
        last_modified: null,
      };

      mockDb.findFile.mockResolvedValue(mockFile);
      mockExtname.mockReturnValue('.txt');

      const ctx = {
        params: { fileId: '1' },
        response: {
          lastModified: null,
          length: null,
        },
        type: '',
        body: '' as any,
        status: 200,
        request: {
          method: 'GET',
          fresh: false,
        },
        throw: vi.fn(),
      };

      const now = new Date();
      vi.useFakeTimers({ toFake: ['Date'] });
      vi.setSystemTime(now);

      await sendFile(ctx as unknown as Context);

      expect(ctx.response.lastModified).toEqual(now);
      expect(ctx.status).toBe(200);

      vi.useRealTimers();
    });
  });

  describe('Route Handlers', () => {
    // Test direct function calls
    it('should handle document finding with valid ID', async () => {
      const mockDocument = { id: 'test-doc', name: 'Test Document', content: 'Test content' };
      mockDb.findDocument.mockResolvedValue(mockDocument);

      const ctx = {
        params: { id: 'test-doc' },
        body: '',
        throw: vi.fn(),
      };

      await findDocument(ctx as any);

      expect(mockDb.findDocument).toHaveBeenCalledWith('test-doc');
      expect(ctx.body).toEqual(mockDocument);
    });

    it('should handle document finding with non-existent ID', async () => {
      mockDb.findDocument.mockResolvedValue(null);

      const ctx = {
        params: { id: 'non-existing' },
        body: '',
        throw: vi.fn(),
      };

      await findDocument(ctx as any);

      expect(mockDb.findDocument).toHaveBeenCalledWith('non-existing');
      expect(ctx.throw).toHaveBeenCalledWith(404, 'Document with ID non-existing not found');
    });

    it('should handle document creation with valid data', async () => {
      const mockDocument = { id: 'new-doc', name: 'New Document', content: '{}' };
      mockDb.createDocument.mockResolvedValue(mockDocument);

      const ctx = {
        request: { body: { name: 'New Document' } },
        body: '',
        throw: vi.fn(),
      };

      await createDocument(ctx as any);

      expect(mockDb.createDocument).toHaveBeenCalled();
      expect(ctx.body).toEqual(mockDocument);
    });

    it('should handle document updating with valid data', async () => {
      const mockDocument = {
        id: 'update-doc',
        name: 'Updated Document',
        content: '{"updated":true}',
      };
      mockDb.updateDocument.mockResolvedValue(mockDocument);

      const ctx = {
        params: { id: 'update-doc' },
        request: { body: { name: 'Updated Document', content: '{"updated":true}' } },
        body: '',
        throw: vi.fn(),
      };

      await updateDocument(ctx as any);

      expect(mockDb.updateDocument).toHaveBeenCalledWith('update-doc', {
        name: 'Updated Document',
        content: '{"updated":true}',
      });
      expect(ctx.body).toEqual(mockDocument);
    });

    it('should allow clearing document fields', async () => {
      const ctx = {
        params: { id: 'update-doc' },
        request: { body: { name: '', content: '' } },
        throw: vi.fn(),
      };

      await updateDocument(ctx as any);

      expect(ctx.throw).not.toHaveBeenCalled();
      expect(mockDb.updateDocument).toHaveBeenCalledWith('update-doc', { name: '', content: '' });
    });

    it.each([{ name: 123 }, { content: {} }, { name: null }])(
      'should reject non-string document updates %j',
      async (body) => {
        const ctx = {
          params: { id: 'update-doc' },
          request: { body },
          throw(status: number, message: string): never {
            throw Object.assign(new Error(message), { status });
          },
        };

        await expect(updateDocument(ctx as any)).rejects.toMatchObject({ status: 400 });
        expect(mockDb.updateDocument).not.toHaveBeenCalled();
      },
    );

    it('should handle document deletion with valid ID', async () => {
      mockDb.deleteDocument.mockResolvedValue(1);

      const ctx = {
        params: { id: 'delete-doc' },
        body: '',
        throw: vi.fn(),
      };

      await deleteDocument(ctx as any);

      expect(mockDb.deleteDocument).toHaveBeenCalledWith('delete-doc');
      expect(ctx.body).toEqual(1);
    });

    it('should handle document list with default ordering', async () => {
      const mockDocuments = [
        { id: 'doc1', name: 'Doc 1' },
        { id: 'doc2', name: 'Doc 2' },
      ];
      mockDb.findAllDocuments.mockResolvedValue(mockDocuments);

      const ctx = {
        query: {},
        body: '',
        throw: vi.fn(),
      };

      await listDocuments(ctx as any);

      expect(mockDb.findAllDocuments).toHaveBeenCalledWith('desc');
      expect(ctx.body).toEqual(mockDocuments);
    });

    it('should handle document list with custom ordering', async () => {
      const mockDocuments = [
        { id: 'doc1', name: 'Doc 1' },
        { id: 'doc2', name: 'Doc 2' },
      ];
      mockDb.findAllDocuments.mockResolvedValue(mockDocuments);

      const ctx = {
        query: { orderBy: 'asc' },
        body: '',
        throw: vi.fn(),
      };

      await listDocuments(ctx as any);

      expect(mockDb.findAllDocuments).toHaveBeenCalledWith('asc');
      expect(ctx.body).toEqual(mockDocuments);
    });

    it('should handle sync with valid content', async () => {
      const mockContent = { sheet1: { cells: {} } };
      const mockResult = { id: 'test-room', content: JSON.stringify(mockContent) };
      mockDb.upsertDocument.mockResolvedValue(mockResult);

      const ctx = {
        request: { body: { room: 'test-room', data: { excel: { content: mockContent } } } },
        body: '',
        throw: vi.fn(),
      };

      await sync(ctx as any);

      expect(mockDb.upsertDocument).toHaveBeenCalledWith('test-room', {
        content: JSON.stringify(mockContent),
        id: 'test-room',
      });
      expect(ctx.body).toEqual(mockResult);
    });

    it('should handle sync with missing content', async () => {
      const ctx = {
        request: { body: { room: 'test-room', data: {} } },
        body: '',
        throw: vi.fn(),
      };

      await sync(ctx as any);

      expect(ctx.body).toEqual({ message: 'content should be provided' });
    });
  });

  describe('Application Setup', () => {
    it('should have the app instance available', () => {
      expect(app).toBeDefined();
      expect(typeof app.callback).toBe('function');
    });

    it('should have middleware configured', () => {
      expect(app.middleware).toBeDefined();
      expect(app.middleware.length).toBeGreaterThan(0);
    });
  });
});

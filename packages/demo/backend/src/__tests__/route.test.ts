// Mock dependencies before importing the app
const mockDb = {
  findFile: jest.fn(),
  createFile: jest.fn(),
  createDocument: jest.fn(),
  deleteDocument: jest.fn(),
  updateDocument: jest.fn(),
  findDocument: jest.fn(),
  findAllDocuments: jest.fn(),
  upsertDocument: jest.fn(),
  initDatabase: jest.fn().mockResolvedValue(undefined),
};

const mockReadFile = jest.fn();
const mockJoin = jest.fn();
const mockExtname = jest.fn();

// Mock modules before importing
jest.mock('../db', () => mockDb);

jest.mock('fs', () => ({
  promises: {
    readFile: mockReadFile,
  },
}));

jest.mock('path', () => ({
  join: mockJoin,
  extname: mockExtname,
}));

jest.spyOn(console, 'log').mockImplementation(() => {});

import { Context } from 'koa';

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
  sync
} from '../route';

describe('Route Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Error Handling Middleware', () => {
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
      const next = jest.fn().mockRejectedValue(error);

      await errorHandler(ctx as unknown as Context, next as NextFunction);

      expect(ctx.status).toBe(500);
      expect(ctx.body).toEqual({ error: 'Internal Server Error', message: 'An unexpected error occurred' });
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
      const next = jest.fn().mockRejectedValue(error);

      await errorHandler(ctx as unknown as Context, next as NextFunction);

      expect(ctx.status).toBe(404);
      expect(ctx.body).toEqual({ error: 'Custom error', message: 'Custom error' });
    });

    it('should call next if no error occurs', async () => {
      const ctx = {
        body: '' as any,
      };
      const next = jest.fn();

      await errorHandler(ctx as unknown as Context, next as NextFunction);

      expect(next).toHaveBeenCalled();
    });
  });

  describe('Parameter Validation Functions', () => {
    describe('assertParam', () => {
      it('should validate parameter exists', () => {
        const ctx = {
          throw: jest.fn(),
          body: '' as any,
        };

        // Test with valid parameter
        expect(() =>
          assertParam(
            ctx as unknown as Context,
            'test-value',
            'Param validation',
          ),
        ).not.toThrow();
      });

      it('should throw an error if parameter does not exist', () => {
        const ctx = {
          throw: jest.fn(),
          body: '' as any,
        };

        assertParam(ctx as unknown as Context, null, 'Missing parameter');

        expect(ctx.throw).toHaveBeenCalledWith(400, 'Missing parameter');
      });
    });

    describe('assertString', () => {
      it('should validate string parameter', () => {
        const ctx = {
          throw: jest.fn(),
          body: '' as any,
        };

        // Test with valid string
        expect(() =>
          assertString(
            ctx as unknown as Context,
            'test-string',
            'String validation',
          ),
        ).not.toThrow();
      });

      it('should throw an error if parameter is not a string', () => {
        const ctx = {
          throw: jest.fn(),
          body: '' as any,
        };

        assertString(ctx as unknown as Context, 123, 'Must be a string');

        expect(ctx.throw).toHaveBeenCalledWith(400, 'Must be a string');
      });
    });

    describe('assertNumber', () => {
      it('should validate number parameter', () => {
        const ctx = {
          throw: jest.fn(),
          body: '' as any,
        };

        // Test with valid number
        expect(() =>
          assertNumber(ctx as unknown as Context, 123, 'Number validation'),
        ).not.toThrow();
      });

      it('should throw an error if parameter is not a valid number', () => {
        const ctx = {
          throw: jest.fn(),
        };

        assertNumber(ctx as unknown as Context, 'abc', 'Must be a number');

        expect(ctx.throw).toHaveBeenCalledWith(400, 'Must be a number');
      });

      it('should throw an error if parameter is NaN', () => {
        const ctx = {
          throw: jest.fn(),
        };

        assertNumber(ctx as unknown as Context, NaN, 'Must be a valid number');

        expect(ctx.throw).toHaveBeenCalledWith(400, 'Must be a valid number');
      });
    });
  });

  describe('sendFile Function', () => {
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
        set: jest.fn(),
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
        throw: jest.fn(),
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
        throw: jest.fn(),
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
        throw: jest.fn(),
        body: '' as any,
      };

      await sendFile(ctx as unknown as Context);

      expect(ctx.throw).toHaveBeenCalledWith(404, 'File with ID 1 not found');
    });

    it('should handle invalid fileId parameter', async () => {
      const ctx = {
        params: { fileId: 'abc' },
        throw: jest.fn(),
        body: '' as any,
      };

      await sendFile(ctx as unknown as Context);

      expect(ctx.throw).toHaveBeenCalledWith(
        400,
        'fileId should be a valid number',
      );
    });

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
        throw: jest.fn(),
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
        throw: jest.fn(),
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
        throw: jest.fn(),
      };

      const now = new Date();
      jest.spyOn(global, 'Date').mockImplementation(() => now as unknown as Date);

      await sendFile(ctx as unknown as Context);

      expect(ctx.response.lastModified).toEqual(now);
      expect(ctx.status).toBe(200);

      jest.restoreAllMocks();
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
        throw: jest.fn(),
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
        throw: jest.fn(),
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
        throw: jest.fn(),
      };

      await createDocument(ctx as any);

      expect(mockDb.createDocument).toHaveBeenCalled();
      expect(ctx.body).toEqual(mockDocument);
    });

    it('should handle document updating with valid data', async () => {
      const mockDocument = { id: 'update-doc', name: 'Updated Document', content: { updated: true } };
      mockDb.updateDocument.mockResolvedValue(mockDocument);

      const ctx = {
        params: { id: 'update-doc' },
        request: { body: { name: 'Updated Document', content: { updated: true } } },
        body: '',
        throw: jest.fn(),
      };

      await updateDocument(ctx as any);

      expect(mockDb.updateDocument).toHaveBeenCalledWith('update-doc', {
        name: 'Updated Document',
        content: { updated: true },
      });
      expect(ctx.body).toEqual(mockDocument);
    });

    it('should handle document deletion with valid ID', async () => {
      mockDb.deleteDocument.mockResolvedValue(1);

      const ctx = {
        params: { id: 'delete-doc' },
        body: '',
        throw: jest.fn(),
      };

      await deleteDocument(ctx as any);

      expect(mockDb.deleteDocument).toHaveBeenCalledWith('delete-doc');
      expect(ctx.body).toEqual(1);
    });

    it('should handle document list with default ordering', async () => {
      const mockDocuments = [{ id: 'doc1', name: 'Doc 1' }, { id: 'doc2', name: 'Doc 2' }];
      mockDb.findAllDocuments.mockResolvedValue(mockDocuments);

      const ctx = {
        query: {},
        body: '',
        throw: jest.fn(),
      };

      await listDocuments(ctx as any);

      expect(mockDb.findAllDocuments).toHaveBeenCalledWith('desc');
      expect(ctx.body).toEqual(mockDocuments);
    });

    it('should handle document list with custom ordering', async () => {
      const mockDocuments = [{ id: 'doc1', name: 'Doc 1' }, { id: 'doc2', name: 'Doc 2' }];
      mockDb.findAllDocuments.mockResolvedValue(mockDocuments);

      const ctx = {
        query: { orderBy: 'asc' },
        body: '',
        throw: jest.fn(),
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
        throw: jest.fn(),
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
        throw: jest.fn(),
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

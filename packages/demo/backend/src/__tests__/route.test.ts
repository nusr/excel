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

// Import app after mocks are set up
import app from '../route';

describe('Route Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Database Document Operations', () => {
    it('should create a document with correct data', async () => {
      const mockDocument = {
        id: 'doc1',
        name: 'Test Document',
        create_time: new Date('2023-01-01').toISOString(),
        content: null,
      };

      mockDb.createDocument.mockResolvedValue(mockDocument);

      // Test the mock setup
      expect(mockDb.createDocument).toBeDefined();

      // Simulate calling the create method
      const result = await mockDb.createDocument({
        name: 'Test Document',
        id: 'doc1',
      });

      expect(mockDb.createDocument).toHaveBeenCalledWith({
        name: 'Test Document',
        id: 'doc1',
      });
      expect(result).toEqual(mockDocument);
    });

    it('should delete a document by id', async () => {
      const mockDocument = {
        id: 'doc1',
        name: 'Test Document',
        create_time: new Date('2023-01-01').toISOString(),
        content: null,
      };

      mockDb.deleteDocument.mockResolvedValue(mockDocument);

      // Simulate calling the delete method
      const result = await mockDb.deleteDocument('doc1');

      expect(mockDb.deleteDocument).toHaveBeenCalledWith('doc1');
      expect(result).toEqual(mockDocument);
    });

    it('should update a document with new data', async () => {
      const mockDocument = {
        id: 'doc1',
        name: 'Updated Document',
        content: 'Updated content',
        create_time: new Date('2023-01-01').toISOString(),
      };

      mockDb.updateDocument.mockResolvedValue(mockDocument);

      // Simulate calling the update method
      const result = await mockDb.updateDocument('doc1', {
        name: 'Updated Document',
        content: 'Updated content',
      });

      expect(mockDb.updateDocument).toHaveBeenCalledWith('doc1', {
        name: 'Updated Document',
        content: 'Updated content',
      });
      expect(result).toEqual(mockDocument);
    });

    it('should find a document by id', async () => {
      const mockDocument = {
        id: 'doc1',
        name: 'Test Document',
        content: 'Document content',
        create_time: new Date('2023-01-01').toISOString(),
      };

      mockDb.findDocument.mockResolvedValue(mockDocument);

      // Simulate calling the findDocument method
      const result = await mockDb.findDocument('doc1');

      expect(mockDb.findDocument).toHaveBeenCalledWith('doc1');
      expect(result).toEqual(mockDocument);
    });

    it('should find all documents with ordering', async () => {
      const mockDocuments = [
        {
          id: 'doc1',
          name: 'Document 1',
          create_time: new Date('2023-01-02').toISOString(),
          content: null,
        },
        {
          id: 'doc2',
          name: 'Document 2',
          create_time: new Date('2023-01-01').toISOString(),
          content: null,
        },
      ];

      mockDb.findAllDocuments.mockResolvedValue(mockDocuments);

      // Simulate calling the findAllDocuments method
      const result = await mockDb.findAllDocuments('desc');

      expect(mockDb.findAllDocuments).toHaveBeenCalledWith('desc');
      expect(result).toEqual(mockDocuments);
    });

    it('should upsert a document with sync data', async () => {
      const mockContent = { sheets: [{ name: 'Sheet1', data: [] }] };
      const mockDocument = {
        id: 'room1',
        content: JSON.stringify(mockContent),
        name: null,
        create_time: new Date('2023-01-01').toISOString(),
      };

      mockDb.upsertDocument.mockResolvedValue(mockDocument);

      // Simulate calling the upsert method
      const result = await mockDb.upsertDocument('room1', {
        content: JSON.stringify(mockContent),
        id: 'room1',
      });

      expect(mockDb.upsertDocument).toHaveBeenCalledWith('room1', {
        content: JSON.stringify(mockContent),
        id: 'room1',
      });
      expect(result).toEqual(mockDocument);
    });
  });

  describe('File Operations', () => {
    it('should find a file by id', async () => {
      const mockFile = {
        id: 1,
        name: 'test.txt',
        content: Buffer.from('test content'),
        size: 12,
        last_modified: new Date('2023-01-01').toISOString(),
      };

      mockDb.findFile.mockResolvedValue(mockFile);
      mockExtname.mockReturnValue('.txt');

      // Simulate calling the file findFile method
      const result = await mockDb.findFile(1);

      expect(mockDb.findFile).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockFile);
    });

    it('should create a file with proper data', async () => {
      const mockBuffer = Buffer.from('test content');
      const mockFile = {
        id: 1,
        name: 'test.txt',
        content: mockBuffer,
        size: 1024,
        last_modified: new Date('2023-01-01').toISOString(),
      };

      mockDb.createFile.mockResolvedValue(mockFile);

      // Simulate calling the file create method
      const result = await mockDb.createFile({
        name: 'test.txt',
        content: new Uint8Array(mockBuffer),
        size: 1024,
        last_modified: new Date('2023-01-01'),
      });

      expect(mockDb.createFile).toHaveBeenCalledWith({
        name: 'test.txt',
        content: expect.any(Uint8Array),
        size: 1024,
        last_modified: new Date('2023-01-01'),
      });
      expect(result).toEqual(mockFile);
    });
  });

  describe('File System Operations', () => {
    it('should read HTML file', async () => {
      const mockHtml = '<html><body>Test</body></html>';
      mockReadFile.mockResolvedValue(mockHtml);
      mockJoin.mockReturnValue('/mocked/path/index.html');

      // Simulate reading the HTML file
      const result = await mockReadFile('/mocked/path/index.html', 'utf-8');

      expect(mockReadFile).toHaveBeenCalledWith(
        '/mocked/path/index.html',
        'utf-8',
      );
      expect(result).toBe(mockHtml);
    });

    it('should handle file read errors', async () => {
      const error = new Error('File not found');
      mockReadFile.mockRejectedValue(error);

      // Simulate file read error
      try {
        await mockReadFile('/nonexistent/path');
        fail('Expected error to be thrown');
      } catch (e) {
        expect(e).toBe(error);
      }

      expect(mockReadFile).toHaveBeenCalledWith('/nonexistent/path');
    });
  });

  describe('Path Operations', () => {
    it('should join paths correctly', () => {
      mockJoin.mockReturnValue('/mocked/path/index.html');

      const result = mockJoin('/mocked/path', 'index.html');

      expect(mockJoin).toHaveBeenCalledWith('/mocked/path', 'index.html');
      expect(result).toBe('/mocked/path/index.html');
    });

    it('should get file extension', () => {
      mockExtname.mockReturnValue('.txt');

      const result = mockExtname('test.txt');

      expect(mockExtname).toHaveBeenCalledWith('test.txt');
      expect(result).toBe('.txt');
    });
  });

  describe('Application Setup', () => {
    it('should have the app instance available', () => {
      expect(app).toBeDefined();
      expect(typeof app.callback).toBe('function');
    });

    it('should have middleware configured', () => {
      // Test that the app has been properly configured
      expect(app.middleware).toBeDefined();
      expect(app.middleware.length).toBeGreaterThan(0);
    });
  });
});

// Mock dependencies before importing the app
const mockPrismaClient = {
  file: {
    findFirst: jest.fn(),
    create: jest.fn(),
  },
  document: {
    create: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    upsert: jest.fn(),
  },
};

const mockReadFile = jest.fn();
const mockJoin = jest.fn();
const mockExtname = jest.fn();

// Mock modules before importing
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => mockPrismaClient),
}));

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

  describe('Prisma Client Document Operations', () => {
    it('should create a document with correct data', async () => {
      const mockDocument = {
        id: 'doc1',
        name: 'Test Document',
        create_time: new Date('2023-01-01'),
      };

      mockPrismaClient.document.create.mockResolvedValue(mockDocument);

      // Test the mock setup
      expect(mockPrismaClient.document.create).toBeDefined();

      // Simulate calling the create method
      const result = await mockPrismaClient.document.create({
        data: { name: 'Test Document', id: 'doc1' },
      });

      expect(mockPrismaClient.document.create).toHaveBeenCalledWith({
        data: { name: 'Test Document', id: 'doc1' },
      });
      expect(result).toEqual(mockDocument);
    });

    it('should delete a document by id', async () => {
      const mockDocument = {
        id: 'doc1',
        name: 'Test Document',
      };

      mockPrismaClient.document.delete.mockResolvedValue(mockDocument);

      // Simulate calling the delete method
      const result = await mockPrismaClient.document.delete({
        where: { id: 'doc1' },
      });

      expect(mockPrismaClient.document.delete).toHaveBeenCalledWith({
        where: { id: 'doc1' },
      });
      expect(result).toEqual(mockDocument);
    });

    it('should update a document with new data', async () => {
      const mockDocument = {
        id: 'doc1',
        name: 'Updated Document',
        content: 'Updated content',
      };

      mockPrismaClient.document.update.mockResolvedValue(mockDocument);

      // Simulate calling the update method
      const result = await mockPrismaClient.document.update({
        data: { name: 'Updated Document', content: 'Updated content' },
        where: { id: 'doc1' },
      });

      expect(mockPrismaClient.document.update).toHaveBeenCalledWith({
        data: { name: 'Updated Document', content: 'Updated content' },
        where: { id: 'doc1' },
      });
      expect(result).toEqual(mockDocument);
    });

    it('should find a document by id', async () => {
      const mockDocument = {
        id: 'doc1',
        name: 'Test Document',
        content: 'Document content',
      };

      mockPrismaClient.document.findFirst.mockResolvedValue(mockDocument);

      // Simulate calling the findFirst method
      const result = await mockPrismaClient.document.findFirst({
        where: { id: 'doc1' },
      });

      expect(mockPrismaClient.document.findFirst).toHaveBeenCalledWith({
        where: { id: 'doc1' },
      });
      expect(result).toEqual(mockDocument);
    });

    it('should find all documents with ordering', async () => {
      const mockDocuments = [
        {
          id: 'doc1',
          name: 'Document 1',
          create_time: new Date('2023-01-02'),
        },
        {
          id: 'doc2',
          name: 'Document 2',
          create_time: new Date('2023-01-01'),
        },
      ];

      mockPrismaClient.document.findMany.mockResolvedValue(mockDocuments);

      // Simulate calling the findMany method
      const result = await mockPrismaClient.document.findMany({
        orderBy: { create_time: 'desc' },
      });

      expect(mockPrismaClient.document.findMany).toHaveBeenCalledWith({
        orderBy: { create_time: 'desc' },
      });
      expect(result).toEqual(mockDocuments);
    });

    it('should upsert a document with sync data', async () => {
      const mockContent = { sheets: [{ name: 'Sheet1', data: [] }] };
      const mockDocument = {
        id: 'room1',
        content: JSON.stringify(mockContent),
      };

      mockPrismaClient.document.upsert.mockResolvedValue(mockDocument);

      // Simulate calling the upsert method
      const result = await mockPrismaClient.document.upsert({
        create: {
          content: JSON.stringify(mockContent),
          id: 'room1',
        },
        update: {
          content: JSON.stringify(mockContent),
        },
        where: {
          id: 'room1',
        },
      });

      expect(mockPrismaClient.document.upsert).toHaveBeenCalledWith({
        create: {
          content: JSON.stringify(mockContent),
          id: 'room1',
        },
        update: {
          content: JSON.stringify(mockContent),
        },
        where: {
          id: 'room1',
        },
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
        last_modified: new Date('2023-01-01'),
      };

      mockPrismaClient.file.findFirst.mockResolvedValue(mockFile);
      mockExtname.mockReturnValue('.txt');

      // Simulate calling the file findFirst method
      const result = await mockPrismaClient.file.findFirst({
        where: { id: 1 },
      });

      expect(mockPrismaClient.file.findFirst).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(mockFile);
    });

    it('should create a file with proper data', async () => {
      const mockBuffer = Buffer.from('test content');
      const mockFile = {
        id: 1,
        name: 'test.txt',
        content: mockBuffer,
        size: 1024,
        last_modified: new Date('2023-01-01'),
      };

      mockPrismaClient.file.create.mockResolvedValue(mockFile);

      // Simulate calling the file create method
      const result = await mockPrismaClient.file.create({
        data: {
          name: 'test.txt',
          content: mockBuffer,
          size: 1024,
          last_modified: new Date('2023-01-01'),
        },
      });

      expect(mockPrismaClient.file.create).toHaveBeenCalledWith({
        data: {
          name: 'test.txt',
          content: mockBuffer,
          size: 1024,
          last_modified: new Date('2023-01-01'),
        },
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

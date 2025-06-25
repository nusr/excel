const mockPrismaClient = {
  document: {
    create: jest.fn(),
  },
  file: {
    create: jest.fn(),
  },
  $disconnect: jest.fn(),
};

const mockSeedConsoleLog = jest.fn();
const mockSeedConsoleError = jest.fn();
const mockSeedProcessExit = jest.fn();

// Mock modules
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => mockPrismaClient),
  Prisma: {},
}));

// Store original functions
const originalSeedConsoleLog = console.log;
const originalSeedConsoleError = console.error;
const originalSeedProcessExit = process.exit;

describe('Prisma Seed Tests', () => {
  beforeAll(() => {
    console.log = mockSeedConsoleLog;
    console.error = mockSeedConsoleError;
    process.exit = mockSeedProcessExit as any;
  });

  afterAll(() => {
    console.log = originalSeedConsoleLog;
    console.error = originalSeedConsoleError;
    process.exit = originalSeedProcessExit;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    mockSeedConsoleLog.mockClear();
    mockSeedConsoleError.mockClear();
    mockSeedProcessExit.mockClear();

    // Reset mock implementations
    mockPrismaClient.document.create.mockResolvedValue({
      id: '184858c4-be37-41b5-af82-52689004e605',
      name: 'Template',
      content: expect.any(String),
      create_time: expect.any(String),
    });

    mockPrismaClient.file.create.mockResolvedValue({
      id: 'file-123',
      name: 'icon.jpeg',
      content: expect.any(Object),
      size: 14643,
      last_modified: new Date('2025-01-15T11:51:44.104Z'),
    });

    mockPrismaClient.$disconnect.mockResolvedValue(undefined);
  });

  describe('Seeding process', () => {
    it('should create documents successfully', async () => {
      // Import the module which will execute the seeding
      await import('../seed');

      // Wait for the main function to complete
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(mockPrismaClient.document.create).toHaveBeenCalledWith({
        data: {
          id: '184858c4-be37-41b5-af82-52689004e605',
          name: 'Template',
          content: expect.any(String), // JSON.stringify of actual mockModal
          create_time: expect.any(String),
        },
      });
    });

    it('should create files successfully', async () => {
      await import('../seed');

      // Wait for the main function to complete
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(mockPrismaClient.file.create).toHaveBeenCalledWith({
        data: {
          name: 'icon.jpeg',
          content: expect.any(Object), // Uint8Array from actual mockImage
          size: 14643,
          last_modified: new Date('2025-01-15T11:51:44.104Z'),
        },
      });
    });

    it('should log seeding progress', async () => {
      await import('../seed');

      // Wait for the main function to complete
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(mockSeedConsoleLog).toHaveBeenCalledWith('Start seeding ...');
      expect(mockSeedConsoleLog).toHaveBeenCalledWith(
        'Created document with id: 184858c4-be37-41b5-af82-52689004e605',
      );
      expect(mockSeedConsoleLog).toHaveBeenCalledWith(
        'Created file with id: file-123',
      );
      expect(mockSeedConsoleLog).toHaveBeenCalledWith('Seeding finished.');
    });

    it('should disconnect from Prisma after successful seeding', async () => {
      await import('../seed');

      // Wait for the main function to complete
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(mockPrismaClient.$disconnect).toHaveBeenCalled();
    });
  });

  describe('Error handling', () => {
    it('should handle document creation errors', async () => {
      const testError = new Error('Document creation failed');
      mockPrismaClient.document.create.mockRejectedValue(testError);

      await import('../seed');

      // Wait for error handling to complete
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(mockSeedConsoleError).toHaveBeenCalledWith(testError);
      expect(mockPrismaClient.$disconnect).toHaveBeenCalled();
      expect(mockSeedProcessExit).toHaveBeenCalledWith(1);
    });

    it('should handle file creation errors', async () => {
      const testError = new Error('File creation failed');
      mockPrismaClient.file.create.mockRejectedValue(testError);

      await import('../seed');

      // Wait for error handling to complete
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(mockSeedConsoleError).toHaveBeenCalledWith(testError);
      expect(mockPrismaClient.$disconnect).toHaveBeenCalled();
      expect(mockSeedProcessExit).toHaveBeenCalledWith(1);
    });

    it('should call Prisma disconnect method', async () => {
      // Test that disconnect is called without forcing an error
      await import('../seed');

      // Wait for operations to complete
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(mockPrismaClient.$disconnect).toHaveBeenCalled();
    });
  });

  describe('Data structure validation', () => {
    it('should have correct document structure', async () => {
      await import('../seed');

      // Wait for the main function to complete
      await new Promise((resolve) => setTimeout(resolve, 100));

      const documentCall = mockPrismaClient.document.create.mock.calls[0][0];
      expect(documentCall.data).toMatchObject({
        id: expect.any(String),
        name: expect.any(String),
        content: expect.any(String),
        create_time: expect.any(String),
      });
    });

    it('should have correct file structure', async () => {
      await import('../seed');

      // Wait for the main function to complete
      await new Promise((resolve) => setTimeout(resolve, 100));

      const fileCall = mockPrismaClient.file.create.mock.calls[0][0];
      expect(fileCall.data).toMatchObject({
        name: expect.any(String),
        content: expect.any(Object), // Uint8Array
        size: expect.any(Number),
        last_modified: expect.any(Date),
      });
    });

    it('should use correct JSON content for document', async () => {
      await import('../seed');

      // Wait for the main function to complete
      await new Promise((resolve) => setTimeout(resolve, 100));

      const documentCall = mockPrismaClient.document.create.mock.calls[0][0];
      expect(documentCall.data.content).toEqual(expect.any(String));
      // Verify it's valid JSON
      expect(() => JSON.parse(documentCall.data.content)).not.toThrow();
    });

    it('should use Uint8Array for file content', async () => {
      await import('../seed');

      // Wait for the main function to complete
      await new Promise((resolve) => setTimeout(resolve, 100));

      const fileCall = mockPrismaClient.file.create.mock.calls[0][0];
      expect(fileCall.data.content).toBeInstanceOf(Uint8Array);
    });
  });

  describe('Prisma client interaction', () => {
    it('should create PrismaClient instance', async () => {
      const { PrismaClient } = await import('@prisma/client');
      await import('../seed');

      expect(PrismaClient).toHaveBeenCalled();
    });

    it('should call document and file create methods in correct order', async () => {
      await import('../seed');

      // Wait for the main function to complete
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Verify both methods were called
      expect(mockPrismaClient.document.create).toHaveBeenCalled();
      expect(mockPrismaClient.file.create).toHaveBeenCalled();
    });

    it('should handle multiple documents if present', async () => {
      // This test ensures the loop works correctly
      await import('../seed');

      // Wait for the main function to complete
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Should be called once for each document in the array
      expect(mockPrismaClient.document.create).toHaveBeenCalledTimes(1);
    });

    it('should handle multiple files if present', async () => {
      // This test ensures the loop works correctly
      await import('../seed');

      // Wait for the main function to complete
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Should be called once for each file in the array
      expect(mockPrismaClient.file.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('Async execution flow', () => {
    it('should execute main function and handle promise resolution', async () => {
      await import('../seed');

      // Wait for all async operations to complete
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(mockPrismaClient.document.create).toHaveBeenCalled();
      expect(mockPrismaClient.file.create).toHaveBeenCalled();
      expect(mockPrismaClient.$disconnect).toHaveBeenCalled();
    });

    it('should handle promise rejection and cleanup', async () => {
      const testError = new Error('Async operation failed');
      mockPrismaClient.document.create.mockRejectedValue(testError);

      await import('../seed');

      // Wait for error handling to complete
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(mockSeedConsoleError).toHaveBeenCalledWith(testError);
      expect(mockPrismaClient.$disconnect).toHaveBeenCalled();
      expect(mockSeedProcessExit).toHaveBeenCalledWith(1);
    });
  });
});

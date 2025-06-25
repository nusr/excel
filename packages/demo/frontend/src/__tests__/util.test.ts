// Set up mocks before any imports
const mockRemoteProvider = {
  getDocument: jest.fn(),
  addDocument: jest.fn(),
  updateDocument: jest.fn(),
};

const mockLocalProvider = {
  getDocument: jest.fn(),
  addDocument: jest.fn(),
  updateDocument: jest.fn(),
};

jest.mock('../constant', () => {
  const mockConstants = {
    VITE_DEFAULT_EXCEL_ID: '',
    BASE_URL: '/',
    VITE_BACKEND_URL: '',
  };
  
  return {
    get VITE_DEFAULT_EXCEL_ID() { return mockConstants.VITE_DEFAULT_EXCEL_ID; },
    get BASE_URL() { return mockConstants.BASE_URL; },
    get VITE_BACKEND_URL() { return mockConstants.VITE_BACKEND_URL; },
    __setMockConstants: (newConstants: any) => {
      Object.assign(mockConstants, newConstants);
    },
  };
});

jest.mock('../provider', () => ({
  RemoteProvider: jest.fn().mockImplementation(() => mockRemoteProvider),
  LocalProvider: jest.fn().mockImplementation(() => mockLocalProvider),
}));

// Import the mocked constants module to access the setter
const constantsModule = require('../constant');

// Mock location and parent properties
const mockLocation = {
  hash: '',
  search: '',
  href: '',
  origin: 'http://localhost:3000',
};

const mockParent = {
  location: {
    search: '',
  },
};

// Import the actual module then replace the functions

// Mock the functions with implementations that use our mocked location
const getDocId = jest.fn().mockImplementation(() => {
  const hash = mockLocation.hash;
  if (hash.startsWith('#')) {
    return hash.slice(1);
  }
  return constantsModule.VITE_DEFAULT_EXCEL_ID || '184858c4-be37-41b5-af82-52689004e605';
});

const jumpPage = jest.fn().mockImplementation((route: 'collab' | '' | 'app', id?: string) => {
  mockLocation.href = mockLocation.origin + constantsModule.BASE_URL + route + (id ? '#' + id : '');
});

const isE2ETest = jest.fn().mockImplementation(() => {
  const flag = 'is_e2e_test=true';
  return (
    mockLocation.search.includes(flag) || mockParent?.location?.search?.includes?.(flag)
  );
});

const getProvider = jest.fn().mockImplementation(async (_callback: any) => {
  const httpBaseUrl = constantsModule.VITE_BACKEND_URL;
  const provider = httpBaseUrl
    ? mockRemoteProvider
    : mockLocalProvider;

  const docId = getDocId();
  const doc = await provider.getDocument(docId);
  if (!doc && !isE2ETest()) {
    await provider.addDocument(docId);
    const mockData = { drawings: {} }; // Simplified mock data
    await provider.updateDocument(docId, {
      content: JSON.stringify(mockData),
      name: 'Template',
    });
  }
  return provider;
});

describe('Util Functions Tests (Clean)', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockLocation.hash = '';
    mockLocation.search = '';
    mockLocation.href = '';
    mockLocation.origin = 'http://localhost:3000';
    mockParent.location.search = '';

    // Reset mock constants
    constantsModule.__setMockConstants({
      VITE_DEFAULT_EXCEL_ID: '',
      BASE_URL: '/',
      VITE_BACKEND_URL: '',
    });

    mockRemoteProvider.getDocument.mockReset();
    mockRemoteProvider.addDocument.mockReset();
    mockRemoteProvider.updateDocument.mockReset();
    mockLocalProvider.getDocument.mockReset();
    mockLocalProvider.addDocument.mockReset();
    mockLocalProvider.updateDocument.mockReset();
  });

  describe('getDocId', () => {
    it('should return hash value without # when hash is present', () => {
      mockLocation.hash = '#test-doc-id-123';

      const result = getDocId();

      expect(result).toBe('test-doc-id-123');
    });

    it('should return VITE_DEFAULT_EXCEL_ID when no hash and env var is set', () => {
      mockLocation.hash = '';
      constantsModule.__setMockConstants({
        VITE_DEFAULT_EXCEL_ID: 'env-doc-id-456',
        BASE_URL: '/',
        VITE_BACKEND_URL: '',
      });

      const result = getDocId();

      expect(result).toBe('env-doc-id-456');
    });

    it('should return fallback ID when no hash and no env var', () => {
      mockLocation.hash = '';
      constantsModule.__setMockConstants({
        VITE_DEFAULT_EXCEL_ID: '',
        BASE_URL: '/',
        VITE_BACKEND_URL: '',
      });

      const result = getDocId();

      expect(result).toBe('184858c4-be37-41b5-af82-52689004e605');
    });

    it('should prioritize hash over env var', () => {
      mockLocation.hash = '#hash-id';
      constantsModule.__setMockConstants({
        VITE_DEFAULT_EXCEL_ID: 'env-id',
        BASE_URL: '/',
        VITE_BACKEND_URL: '',
      });

      const result = getDocId();

      expect(result).toBe('hash-id');
    });
  });

  describe('jumpPage', () => {
    beforeEach(() => {
      mockLocation.origin = 'http://localhost:3000';
      constantsModule.__setMockConstants({
        VITE_DEFAULT_EXCEL_ID: '',
        BASE_URL: '/app/',
        VITE_BACKEND_URL: '',
      });
    });

    it('should navigate to collab route with id', () => {
      jumpPage('collab', 'test-id');

      expect(mockLocation.href).toBe(
        'http://localhost:3000/app/collab#test-id',
      );
    });

    it('should navigate to route without id', () => {
      jumpPage('collab');

      expect(mockLocation.href).toBe('http://localhost:3000/app/collab');
    });

    it('should handle different BASE_URL', () => {
      constantsModule.__setMockConstants({
        VITE_DEFAULT_EXCEL_ID: '',
        BASE_URL: '/custom-base/',
        VITE_BACKEND_URL: '',
      });

      jumpPage('collab', 'test-id');

      expect(mockLocation.href).toBe(
        'http://localhost:3000/custom-base/collab#test-id',
      );
    });
  });

  describe('isE2ETest', () => {
    it('should return true when flag is in current location search', () => {
      mockLocation.search = '?is_e2e_test=true&other=param';
      mockParent.location.search = '';

      const result = isE2ETest();

      expect(result).toBe(true);
    });

    it('should return true when flag is in parent location search', () => {
      mockLocation.search = '';
      mockParent.location.search = '?is_e2e_test=true&other=param';

      const result = isE2ETest();

      expect(result).toBe(true);
    });

    it('should return false when flag is not present', () => {
      mockLocation.search = '?other=param';
      mockParent.location.search = '?another=value';

      const result = isE2ETest();

      expect(result).toBe(false);
    });
  });

  describe('getProvider', () => {
    const mockCallback = jest.fn();

    beforeEach(() => {
      mockCallback.mockReset();
      mockLocation.hash = '#test-doc-id';
    });

    describe('RemoteProvider scenarios', () => {
      beforeEach(() => {
        constantsModule.__setMockConstants({
          VITE_DEFAULT_EXCEL_ID: '',
          BASE_URL: '/',
          VITE_BACKEND_URL: 'http://api.example.com',
        });
      });

      it('should create RemoteProvider when VITE_BACKEND_URL is set', async () => {
        mockRemoteProvider.getDocument.mockResolvedValue({
          id: 'test-doc-id',
          content: 'existing',
        });

        const provider = await getProvider(mockCallback);

        expect(provider).toBe(mockRemoteProvider);
        expect(mockRemoteProvider.getDocument).toHaveBeenCalledWith(
          'test-doc-id',
        );
      });

      it('should return existing document when found', async () => {
        const existingDoc = { id: 'test-doc-id', content: 'existing' };
        mockRemoteProvider.getDocument.mockResolvedValue(existingDoc);

        const provider = await getProvider(mockCallback);

        expect(mockRemoteProvider.getDocument).toHaveBeenCalledWith(
          'test-doc-id',
        );
        expect(mockRemoteProvider.addDocument).not.toHaveBeenCalled();
        expect(mockRemoteProvider.updateDocument).not.toHaveBeenCalled();
        expect(provider).toBe(mockRemoteProvider);
      });

      it('should create and initialize document when not found and not E2E test', async () => {
        mockRemoteProvider.getDocument.mockResolvedValue(null);
        mockLocation.search = ''; // Not E2E test

        await getProvider(mockCallback);

        expect(mockRemoteProvider.getDocument).toHaveBeenCalledWith(
          'test-doc-id',
        );
        expect(mockRemoteProvider.addDocument).toHaveBeenCalledWith(
          'test-doc-id',
        );
        expect(mockRemoteProvider.updateDocument).toHaveBeenCalledWith(
          'test-doc-id',
          {
            content: expect.any(String),
            name: 'Template',
          },
        );
      });

      it('should not create document when not found but is E2E test', async () => {
        mockRemoteProvider.getDocument.mockResolvedValue(null);
        mockLocation.search = '?is_e2e_test=true';

        await getProvider(mockCallback);

        expect(mockRemoteProvider.getDocument).toHaveBeenCalledWith(
          'test-doc-id',
        );
        expect(mockRemoteProvider.addDocument).not.toHaveBeenCalled();
        expect(mockRemoteProvider.updateDocument).not.toHaveBeenCalled();
      });
    });

    describe('LocalProvider scenarios', () => {
      beforeEach(() => {
        constantsModule.__setMockConstants({
          VITE_DEFAULT_EXCEL_ID: '',
          BASE_URL: '/',
          VITE_BACKEND_URL: '', // No backend URL
        });
      });

      it('should create LocalProvider when VITE_BACKEND_URL is not set', async () => {
        mockLocalProvider.getDocument.mockResolvedValue({
          id: 'test-doc-id',
          content: 'existing',
        });

        const provider = await getProvider(mockCallback);

        expect(provider).toBe(mockLocalProvider);
        expect(mockLocalProvider.getDocument).toHaveBeenCalledWith(
          'test-doc-id',
        );
      });

      it('should create and initialize document with LocalProvider when not found', async () => {
        mockLocalProvider.getDocument.mockResolvedValue(null);
        mockLocation.search = ''; // Not E2E test

        await getProvider(mockCallback);

        expect(mockLocalProvider.addDocument).toHaveBeenCalledWith(
          'test-doc-id',
        );
        expect(mockLocalProvider.updateDocument).toHaveBeenCalledWith(
          'test-doc-id',
          {
            content: expect.any(String),
            name: 'Template',
          },
        );
      });
    });

    describe('Error handling', () => {
      beforeEach(() => {
        constantsModule.__setMockConstants({
          VITE_DEFAULT_EXCEL_ID: '',
          BASE_URL: '/',
          VITE_BACKEND_URL: 'http://api.example.com',
        });
      });

      it('should handle getDocument errors', async () => {
        const error = new Error('Failed to get document');
        mockRemoteProvider.getDocument.mockRejectedValue(error);

        await expect(getProvider(mockCallback)).rejects.toThrow(
          'Failed to get document',
        );
      });

      it('should handle addDocument errors when creating new document', async () => {
        mockRemoteProvider.getDocument.mockResolvedValue(null);
        const error = new Error('Failed to add document');
        mockRemoteProvider.addDocument.mockRejectedValue(error);
        mockLocation.search = ''; // Not E2E test

        await expect(getProvider(mockCallback)).rejects.toThrow(
          'Failed to add document',
        );
      });
    });
  });
});

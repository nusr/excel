const mockConsoleLog = jest.fn();
const mockApp = {
  listen: jest.fn(),
};
const mockFs = {
  existsSync: jest.fn(),
  writeFileSync: jest.fn(),
  unlinkSync: jest.fn(),
};
const mockPath = {
  join: jest.fn(),
};

// Mock modules
jest.mock('../route', () => mockApp);
jest.mock('fs', () => mockFs);
jest.mock('path', () => mockPath);

// Store original functions
const originalConsoleLog = console.log;

describe('Server Index Tests', () => {
  beforeAll(() => {
    console.log = mockConsoleLog;
  });

  afterAll(() => {
    console.log = originalConsoleLog;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    mockConsoleLog.mockClear();

    // Set up default mock returns
    mockPath.join.mockReturnValue('/mocked/path/to/.env.development');
    mockFs.existsSync.mockReturnValue(false);
    mockApp.listen.mockImplementation((port: number, callback?: () => void) => {
      if (callback) {
        setTimeout(callback, 0); // Async callback simulation
      }
      return mockApp;
    });
  });

  it('should call app.listen with correct port', () => {
    // Require the module which should trigger the side effects
    require('../index');

    expect(mockApp.listen).toHaveBeenCalledWith(4000, expect.any(Function));
  });

  it('should construct correct file path', () => {
    require('../index');

    expect(mockPath.join).toHaveBeenCalledWith(
      expect.any(String),
      '../../frontend/.env.development',
    );
  });

  it('should check if file exists', () => {
    require('../index');

    expect(mockFs.existsSync).toHaveBeenCalledWith(
      '/mocked/path/to/.env.development',
    );
  });

  it('should write file when it does not exist', () => {
    mockFs.existsSync.mockReturnValue(false);

    require('../index');

    expect(mockFs.writeFileSync).toHaveBeenCalledWith(
      '/mocked/path/to/.env.development',
      'VITE_BACKEND_URL=http://localhost:4000\nVITE_DEFAULT_EXCEL_ID=',
    );
  });

  it('should not write file when it exists', () => {
    mockFs.existsSync.mockReturnValue(true);

    require('../index');

    expect(mockFs.writeFileSync).not.toHaveBeenCalled();
  });

  it('should log server startup message', (done) => {
    mockApp.listen.mockImplementation((port: number, callback?: () => void) => {
      if (callback) {
        callback();
      }
      return mockApp;
    });

    require('../index');

    // Give some time for the callback to be called
    setTimeout(() => {
      expect(mockConsoleLog).toHaveBeenCalledWith(
        'server running on http://localhost:4000',
      );
      done();
    }, 10);
  });
});

import { fetchData, RemoteProvider, LocalProvider } from '../provider';

const BASE_URL = 'http://localhost:4000';
const LOCAL_STORAGE_KEY = 'excel-collab-docs';

describe('fetchData', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  it('should fetch data with GET method', async () => {
    const mockResponse = { data: 'test' };
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockResponse),
    });

    const result = await fetchData('/test-endpoint');
    expect(result).toEqual(mockResponse);
    expect(global.fetch).toHaveBeenCalledWith(`/test-endpoint`, {
      method: 'GET',
      body: undefined,
      headers: { 'Content-Type': 'application/json' },
    });
  });

  it('should fetch data with POST method and JSON body', async () => {
    const mockResponse = { data: 'test' };
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockResponse),
    });

    const data = JSON.stringify({ key: 'value' });
    const result = await fetchData('/test-endpoint', 'POST', data);
    expect(result).toEqual(mockResponse);
    expect(global.fetch).toHaveBeenCalledWith(`/test-endpoint`, {
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  });

  it('should fetch data with POST method and FormData body', async () => {
    const mockResponse = { data: 'test' };
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockResponse),
    });

    const formData = new FormData();
    formData.append('key', 'value');
    const result = await fetchData('/test-endpoint', 'POST', formData);
    expect(result).toEqual(mockResponse);
    expect(global.fetch).toHaveBeenCalledWith(`/test-endpoint`, {
      method: 'POST',
      body: formData,
      headers: undefined,
    });
  });

  it('should return undefined if fetch response is not ok', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
    });

    const result = await fetchData('/test-endpoint');
    expect(result).toBeUndefined();
  });

  it('should return undefined if fetch throws an error', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Fetch error'));

    const result = await fetchData('/test-endpoint');
    expect(result).toBeUndefined();
  });
});

describe('RemoteProvider', () => {
  let provider: RemoteProvider;

  beforeEach(() => {
    provider = new RemoteProvider(BASE_URL);
    global.fetch = jest.fn();
  });

  it('should upload a file and return the file path', async () => {
    const mockResponse = { filePath: '/path/to/file' };
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockResponse),
    });

    const file = new File(['content'], 'test.txt', { type: 'text/plain' });
    const result = await provider.uploadFile('docId', file, 'base64string');
    expect(result).toEqual('/path/to/file');
    expect(global.fetch).toHaveBeenCalledWith(`${BASE_URL}/upload`, {
      method: 'POST',
      body: expect.any(FormData),
      headers: undefined,
    });
  });

  it('should return base64 string if upload fails', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
    });

    const file = new File(['content'], 'test.txt', { type: 'text/plain' });
    const result = await provider.uploadFile('docId', file, 'base64string');
    expect(result).toEqual('base64string');
  });

  it('should download a file and return the file path', async () => {
    const result = await provider.downloadFile('docId', 'path/to/file');
    expect(result).toEqual('path/to/file');
  });

  it('should add a document', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({}),
    });

    await provider.addDocument('docId');
    expect(global.fetch).toHaveBeenCalledWith(`${BASE_URL}/document`, {
      method: 'POST',
      body: JSON.stringify({ name: '', id: 'docId' }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  });

  it('should update a document', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({}),
    });

    const data = { name: 'new name', content: 'new content' };
    await provider.updateDocument('docId', data);
    expect(global.fetch).toHaveBeenCalledWith(`${BASE_URL}/document/docId`, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  });

  it('should get a document', async () => {
    const mockResponse = {
      id: 'docId',
      name: 'test',
      content: 'content',
      create_time: '2021-01-01',
    };
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockResponse),
    });

    const result = await provider.getDocument('docId');
    expect(result).toEqual(mockResponse);
    expect(global.fetch).toHaveBeenCalledWith(`${BASE_URL}/document/docId`, {
      method: 'GET',
      body: undefined,
      headers: { 'Content-Type': 'application/json' },
    });
  });

  it('should return undefined if getDocument fetch response is not ok', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
    });

    const result = await provider.getDocument('docId');
    expect(result).toBeUndefined();
  });
});

describe('LocalProvider', () => {
  let localProvider: LocalProvider;
  const mockCallback = jest.fn();

  beforeEach(() => {
    localProvider = new LocalProvider(mockCallback);
    localStorage.clear();
  });

  test('getDocumentList should return sorted document list', async () => {
    const documents = [
      { id: '1', name: 'Doc 1', create_time: '2023-01-01T00:00:00Z' },
      { id: '2', name: 'Doc 2', create_time: '2023-01-02T00:00:00Z' },
    ];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(documents));

    const result = await localProvider.getDocumentList();

    expect(result).toEqual([documents[1], documents[0]]);
  });

  test('uploadFile should return base64 string', async () => {
    const base64 = 'base64string';
    const result = await localProvider.uploadFile(
      'docId',
      new File([], 'file'),
      base64,
    );

    expect(result).toBe(base64);
  });

  test('downloadFile should return file path', async () => {
    const filePath = 'path/to/file';
    const result = await localProvider.downloadFile('docId', filePath);

    expect(result).toBe(filePath);
  });

  test('addDocument should add a new document and call callback', async () => {
    const id = '3';
    await localProvider.addDocument(id);

    const documents = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_KEY) || '[]',
    );
    expect(documents).toHaveLength(1);
    expect(documents[0].id).toBe(id);
    expect(mockCallback).toHaveBeenCalled();
  });

  test('updateDocument should update document name and content', async () => {
    const documents = [
      {
        id: '1',
        name: 'Doc 1',
        create_time: '2023-01-01T00:00:00Z',
        content: 'Old content',
      },
    ];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(documents));

    await localProvider.updateDocument('1', {
      name: 'Updated Doc 1',
      content: 'New content',
    });

    const updatedDocuments = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_KEY) || '[]',
    );
    expect(updatedDocuments[0].name).toBe('Updated Doc 1');
    expect(updatedDocuments[0].content).toBe('New content');
  });

  test('getDocument should return the document by id', async () => {
    const documents = [
      { id: '1', name: 'Doc 1', create_time: '2023-01-01T00:00:00Z' },
    ];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(documents));

    const result = await localProvider.getDocument('1');

    expect(result).toEqual(documents[0]);
  });

  test('getDocument should return undefined if document not found', async () => {
    const result = await localProvider.getDocument('non-existent-id');

    expect(result).toBeUndefined();
  });
});

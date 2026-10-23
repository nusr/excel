import { vi, type Mock } from 'vitest';
import { fetchData, RemoteProvider, LocalProvider } from '../provider';

const BASE_URL = 'http://localhost:4000';
const LOCAL_STORAGE_KEY = 'excel-collab-docs';

describe('fetchData', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  it('should fetch data with GET method', async () => {
    const mockResponse = { data: 'test' };
    (global.fetch as Mock).mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(mockResponse),
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
    (global.fetch as Mock).mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(mockResponse),
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
    (global.fetch as Mock).mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(mockResponse),
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
    (global.fetch as Mock).mockResolvedValue({
      ok: false,
    });

    const result = await fetchData('/test-endpoint');
    expect(result).toBeUndefined();
  });

  it('should return undefined if fetch throws an error', async () => {
    (global.fetch as Mock).mockRejectedValue(new Error('Fetch error'));

    const result = await fetchData('/test-endpoint');
    expect(result).toBeUndefined();
  });

  it('should return undefined if the response body is not JSON', async () => {
    (global.fetch as Mock).mockResolvedValue({
      ok: true,
      json: vi.fn().mockRejectedValue(new SyntaxError('Invalid JSON')),
    });

    await expect(fetchData('/test-endpoint')).resolves.toBeUndefined();
  });
});

describe('RemoteProvider', () => {
  let provider: RemoteProvider;

  beforeEach(() => {
    provider = new RemoteProvider(BASE_URL);
    global.fetch = vi.fn();
  });

  it('should upload a file and return the file path', async () => {
    const mockResponse = { filePath: '/path/to/file' };
    (global.fetch as Mock).mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(mockResponse),
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
    (global.fetch as Mock).mockResolvedValue({
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
    (global.fetch as Mock).mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({}),
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
    (global.fetch as Mock).mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({}),
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

  it('should send empty fields when clearing document metadata and content', async () => {
    (global.fetch as Mock).mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({}),
    });

    await provider.updateDocument('docId', { name: '', content: '' });

    expect(global.fetch).toHaveBeenCalledWith(
      `${BASE_URL}/document/docId`,
      expect.objectContaining({
        body: JSON.stringify({ name: '', content: '' }),
      }),
    );
  });

  it('should not navigate when document creation fails', async () => {
    const callback = vi.fn();
    provider = new RemoteProvider(BASE_URL, callback);
    (global.fetch as Mock).mockResolvedValue({ ok: false });

    await provider.addDocument('docId');

    expect(callback).not.toHaveBeenCalled();
  });

  it('should get a document', async () => {
    const mockResponse = {
      id: 'docId',
      name: 'test',
      content: 'content',
      create_time: '2021-01-01',
    };
    (global.fetch as Mock).mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(mockResponse),
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
    (global.fetch as Mock).mockResolvedValue({
      ok: false,
    });

    const result = await provider.getDocument('docId');
    expect(result).toBeUndefined();
  });
});

describe('LocalProvider', () => {
  let localProvider: LocalProvider;
  const mockCallback = vi.fn();

  beforeEach(() => {
    localProvider = new LocalProvider(mockCallback);
    sessionStorage.clear();
  });

  test('uploadFile should return base64 string', async () => {
    const base64 = 'base64string';
    const result = await localProvider.uploadFile('docId', new File([], 'file'), base64);

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

    const documents = JSON.parse(sessionStorage.getItem(LOCAL_STORAGE_KEY + '_' + id) ?? '{}');
    expect(documents.id).toBe('3');
    expect(documents.name).toBe('');
    expect(mockCallback).toHaveBeenCalled();
  });

  test('updateDocument should update document name and content', async () => {
    const documents = {
      id: '1',
      name: 'Doc 1',
      create_time: '2023-01-01T00:00:00Z',
      content: 'Old content',
    };
    sessionStorage.setItem(LOCAL_STORAGE_KEY + '_1', JSON.stringify(documents));

    await localProvider.updateDocument('1', {
      name: 'Updated Doc 1',
      content: 'New content',
    });

    const updatedDocuments = JSON.parse(sessionStorage.getItem(LOCAL_STORAGE_KEY + '_1') || '{}');
    expect(updatedDocuments.name).toBe('Updated Doc 1');
    expect(updatedDocuments.content).toBe('New content');
  });

  test('updateDocument should allow clearing existing fields', async () => {
    sessionStorage.setItem(
      LOCAL_STORAGE_KEY + '_1',
      JSON.stringify({
        id: '1',
        name: 'Old name',
        content: 'Old content',
      }),
    );

    await localProvider.updateDocument('1', { name: '', content: '' });

    expect(await localProvider.getDocument('1')).toMatchObject({ name: '', content: '' });
  });

  test('getDocument should return the document by id', async () => {
    const documents = [{ id: '1', name: 'Doc 1', create_time: '2023-01-01T00:00:00Z' }];
    sessionStorage.setItem(LOCAL_STORAGE_KEY + '_1', JSON.stringify(documents));

    const result = await localProvider.getDocument('1');

    expect(result).toEqual(documents);
  });

  test('getDocument should return undefined if document not found', async () => {
    const result = await localProvider.getDocument('non-existent-id');

    expect(result).toBeUndefined();
  });
});

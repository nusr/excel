import { fetchData, RemoteProvider } from '../provider';
import { DocumentItem } from 'excel-collab';

const BASE_URL = 'http://localhost:4000';

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

describe('Provider', () => {
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
    expect(result).toEqual(BASE_URL + '/path/to/file');
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
    const mockResponse: DocumentItem = {
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

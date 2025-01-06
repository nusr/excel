import { ICollaborationProvider, DocumentItem } from '../src';

const BASE_URL = 'http://localhost:4000';

async function fetchData<T>(
  url: string,
  method: 'POST' | 'GET' | 'PUT' | 'DELETE' = 'GET',
  data: string | FormData = '',
) {
  try {
    const result = await fetch(`${BASE_URL}${url}`, {
      method,
      body: method === 'POST' || method === 'PUT' ? data : undefined,
      headers:
        typeof data === 'string'
          ? {
              'Content-Type': 'application/json',
            }
          : undefined,
    });
    if (result.status !== 200) {
      return;
    }
    const res = result.json();
    return res as T;
  } catch (error) {
    console.log(error);
    return;
  }
}

export class Provider implements ICollaborationProvider {
  async uploadFile(
    docId: string,
    file: File,
    _base64: string,
  ): Promise<string> {
    const form = new FormData();
    form.append('file', file);
    form.append('docId', docId);
    const res = await fetchData<{ filePath: string }>('/upload', 'POST', form);
    return res?.filePath ?? _base64;
  }
  downloadFile(_docId: string, filePath: string): Promise<string> {
    return Promise.resolve(BASE_URL + filePath);
  }
  async addDocument(id: string) {
    await fetchData<DocumentItem>(
      '/document',
      'POST',
      JSON.stringify({ name: '', id }),
    );
  }
  async updateDocument(
    id: string,
    data: Pick<DocumentItem, 'name' | 'content'>,
  ): Promise<void> {
    await fetchData<DocumentItem>(
      '/document/' + id,
      'PUT',
      JSON.stringify(data),
    );
  }
  async getDocument(id: string): Promise<DocumentItem | undefined> {
    const res = await fetchData<DocumentItem>('/document/' + id);
    return res;
  }
}

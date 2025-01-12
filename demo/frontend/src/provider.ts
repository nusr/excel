import { ICollaborationProvider, DocumentItem } from 'excel-collab';

export interface IProvider extends ICollaborationProvider {
  getDocumentList(): Promise<DocumentItem[]>;
}

export async function fetchData<T>(
  url: string,
  method: 'POST' | 'GET' | 'PUT' | 'DELETE' = 'GET',
  data: string | FormData = '',
) {
  let headers: HeadersInit | undefined = undefined;
  if (typeof data === 'string') {
    headers = {
      'Content-Type': 'application/json',
    };
  }
  try {
    const result = await fetch(url, {
      method,
      body: method === 'POST' || method === 'PUT' ? data : undefined,
      headers,
    });
    if (!result.ok) {
      return;
    }
    const res = result.json();
    return res as T;
  } catch (error) {
    console.log(error);
    return;
  }
}

export class RemoteProvider implements IProvider {
  private readonly baseUrl: string;
  private readonly callback: (id: string) => void;
  constructor(baseUrl: string, callback: (id: string) => void = () => {}) {
    this.baseUrl = baseUrl;
    this.callback = callback;
  }
  async uploadFile(
    docId: string,
    file: File,
    _base64: string,
  ): Promise<string> {
    const form = new FormData();
    form.append('file', file);
    form.append('docId', docId);
    const res = await fetchData<{ filePath: string }>(
      this.baseUrl + '/upload',
      'POST',
      form,
    );
    if (res?.filePath) {
      return this.baseUrl + res?.filePath;
    }
    return _base64;
  }
  downloadFile(_docId: string, filePath: string): Promise<string> {
    return Promise.resolve(filePath);
  }
  async addDocument(id: string) {
    await fetchData<DocumentItem>(
      this.baseUrl + '/document',
      'POST',
      JSON.stringify({ name: '', id }),
    );
    this.callback(id);
  }
  async updateDocument(
    id: string,
    data: Pick<DocumentItem, 'name' | 'content'>,
  ): Promise<void> {
    await fetchData<DocumentItem>(
      this.baseUrl + '/document/' + id,
      'PUT',
      JSON.stringify(data),
    );
  }
  async getDocument(id: string): Promise<DocumentItem | undefined> {
    const res = await fetchData<DocumentItem>(this.baseUrl + '/document/' + id);
    return res;
  }
  async getDocumentList(): Promise<DocumentItem[]> {
    const res = await fetchData<DocumentItem[]>(this.baseUrl + '/documents');
    return res || [];
  }
}

const LOCAL_STORAGE_KEY = 'excel-collab-docs';

export class LocalProvider implements IProvider {
  private readonly callback: (id: string) => void;
  constructor(callback: (id: string) => void = () => {}) {
    this.callback = callback;
  }
  async getDocumentList() {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    const list: DocumentItem[] = data ? JSON.parse(data) : [];
    list.sort(
      (a, b) =>
        new Date(b.create_time).getTime() - new Date(a.create_time).getTime(),
    );
    return list;
  }
  async uploadFile(
    _docId: string,
    _file: File,
    base64: string,
  ): Promise<string> {
    return base64;
  }
  downloadFile(_docId: string, filePath: string): Promise<string> {
    return Promise.resolve(filePath);
  }
  async addDocument(id: string) {
    const list = await this.getDocumentList();
    list.push({
      id,
      name: '',
      create_time: new Date().toISOString(),
    });
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
    this.callback(id);
  }
  async updateDocument(
    id: string,
    data: Pick<DocumentItem, 'name' | 'content'>,
  ): Promise<void> {
    const list = await this.getDocumentList();
    const item = list.find((item) => item.id === id);
    if (!item) {
      return;
    }
    if (data.name) {
      item.name = data.name;
    }
    if (data.content) {
      item.content = data.content;
    }
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
  }
  async getDocument(id: string): Promise<DocumentItem | undefined> {
    const list = await this.getDocumentList();
    const item = list.find((item) => item.id === id);
    return item;
  }
}

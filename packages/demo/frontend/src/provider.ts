import type { ICollaborationProvider, DocumentItem } from 'excel-collab';

const LOCAL_STORAGE_KEY = 'excel-collab-docs';

export interface IProvider extends ICollaborationProvider {
  getDocuments(): Promise<DocumentItem[] | undefined>;
}

function safeParse<T>(data: any, defaultValue: T | undefined): T | undefined {
  try {
    return JSON.parse(data) as T;
  } catch (error) {
    console.log(error)
    return defaultValue;
  }
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
    const fetchOptions: RequestInit = {
      method,
      headers,
    };

    if (method === 'POST' || method === 'PUT') {
      fetchOptions.body = data;
    }

    const result = await fetch(url, fetchOptions);
    if (!result.ok) {
      return;
    }
    const res = result.json();
    return res as T;
  } catch (error) {
    if (process.env.NODE_ENV !== 'test') {
      console.log(error);
    }
    return;
  }
}

export class RemoteProvider implements IProvider {
  private readonly baseUrl: string;
  private readonly callback: (
    p: ICollaborationProvider,
    id: string,
  ) => Promise<void>;
  constructor(
    baseUrl: string,
    callback: (
      p: ICollaborationProvider,
      id: string,
    ) => Promise<void> = async () => {},
  ) {
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
      return res?.filePath;
    }
    return _base64;
  }
  downloadFile(_docId: string, filePath: string): Promise<string> {
    if (filePath.startsWith('/upload/')) {
      return Promise.resolve(this.baseUrl + filePath);
    }
    return Promise.resolve(filePath);
  }
  async addDocument(id: string) {
    await fetchData<DocumentItem>(
      this.baseUrl + '/document',
      'POST',
      JSON.stringify({ name: '', id }),
    );
    await this.callback(this, id);
  }
  async updateDocument(
    id: string,
    data: Pick<DocumentItem, 'name' | 'content'>,
  ): Promise<void> {
    const temp: Pick<DocumentItem, 'name' | 'content'> = {};
    if (data.name) {
      temp.name = data.name;
    }
    if (data.content) {
      temp.content = data.content;
    }

    await fetchData<DocumentItem>(
      this.baseUrl + '/document/' + id,
      'PUT',
      JSON.stringify(temp),
    );
  }
  async getDocument(id: string): Promise<DocumentItem | undefined> {
    const res = await fetchData<DocumentItem>(this.baseUrl + '/document/' + id);
    return res;
  }
  async getDocuments() {
    const res = await fetchData<DocumentItem[]>(this.baseUrl + '/documents');
    return res;
  }
}

export class LocalProvider implements IProvider {
  private readonly callback: (
    p: ICollaborationProvider,
    id: string,
  ) => Promise<void>;
  constructor(
    callback: (
      p: ICollaborationProvider,
      id: string,
    ) => Promise<void> = async () => {},
  ) {
    this.callback = callback;
  }
  private getKey(id: string) {
    return `${LOCAL_STORAGE_KEY}_${id}`;
  }
  async getDocuments() {
    const list: DocumentItem[] = [];
    for (const [key, value] of Object.entries(sessionStorage)) {
      if (!key.startsWith(LOCAL_STORAGE_KEY)) {
        continue;
      }
      const doc = safeParse<DocumentItem>(value, undefined);
      if (!doc) {
        continue;
      }
      list.push(doc);
    }
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
    const data: DocumentItem = {
      id,
      name: '',
      create_time: new Date().toISOString(),
    };

    sessionStorage.setItem(this.getKey(id), JSON.stringify(data));
    await this.callback(this, id);
  }
  async updateDocument(
    id: string,
    data: Pick<DocumentItem, 'name' | 'content'>,
  ): Promise<void> {
    const doc = sessionStorage.getItem(this.getKey(id));
    if (!doc) {
      const docData: DocumentItem = {
        ...data,
        id,
        create_time: new Date().toISOString(),
      };
      sessionStorage.setItem(this.getKey(id), JSON.stringify(docData));
      return;
    }

    const docData = safeParse<DocumentItem>(doc, undefined);

    if (!docData) {
      return;
    }

    if (data.name) {
      docData.name = data.name;
    }
    if (data.content) {
      docData.content = data.content;
    }
    sessionStorage.setItem(this.getKey(id), JSON.stringify(docData));
  }
  async getDocument(id: string): Promise<DocumentItem | undefined> {
    const doc = sessionStorage.getItem(this.getKey(id));
    if (!doc) {
      return;
    }
    return safeParse<DocumentItem>(doc, undefined);
  }
}

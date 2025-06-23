import { RemoteProvider, LocalProvider, type IProvider } from './provider';
import mockModal from '../../../../scripts/model.json';

export function getDocId(): string {
  const hash = location.hash;
  if (hash.startsWith('#')) {
    return hash.slice(1);
  }
  return (
    import.meta.env.VITE_DEFAULT_EXCEL_ID ||
    '184858c4-be37-41b5-af82-52689004e605'
  );
}

export function jumpPage(route: 'collab' | '' | 'app', id?: string) {
  location.href =
    location.origin + import.meta.env.BASE_URL + route + (id ? '#' + id : '');
}

export function isE2ETest() {
  const flag = 'is_e2e_test=true';

  return (
    location.search.includes(flag) || parent.location.search.includes(flag)
  );
}

export async function getProvider(
  callback: (p: IProvider, id: string) => Promise<void>,
) {
  const httpBaseUrl = import.meta.env.VITE_BACKEND_URL;
  const provider = httpBaseUrl
    ? new RemoteProvider(httpBaseUrl, callback)
    : new LocalProvider(callback);

  const docId = getDocId();
  const doc = await provider.getDocument(docId);
  if (!doc && !isE2ETest()) {
    await provider.addDocument(docId);
    const data = { ...mockModal };
    for (const [k, v] of Object.entries(data.drawings)) {
      if (v.type === 'floating-picture') {
        // @ts-ignore
        delete data.drawings[k];
      }
    }
    await provider.updateDocument(docId, {
      content: JSON.stringify(data),
      name: 'Template',
    });
  }
  return provider;
}

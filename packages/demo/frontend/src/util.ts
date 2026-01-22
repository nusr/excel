import { RemoteProvider, LocalProvider } from './provider';
import mockModal from '../../../../scripts/model.json';
import { VITE_DEFAULT_EXCEL_ID, VITE_BACKEND_URL } from './constant';
import type { ICollaborationProvider } from 'excel-collab';

export function getDocId(): string {
  const hash = location.hash;
  if (hash.startsWith('#')) {
    return hash.slice(1);
  }
  return VITE_DEFAULT_EXCEL_ID || '184858c4-be37-41b5-af82-52689004e605';
}

export async function getProvider(
  callback: (p: ICollaborationProvider, id: string) => Promise<void>,
) {
  const provider = VITE_BACKEND_URL
    ? new RemoteProvider(VITE_BACKEND_URL, callback)
    : new LocalProvider(callback);

  const docId = getDocId();
  const doc = await provider.getDocument(docId);
  if (!doc && !process.env.E2E_TEST) {
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

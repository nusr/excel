import { createRoot } from 'react-dom/client';
import { StrictMode, useEffect, useState, useRef } from 'react';
import { RemoteProvider, LocalProvider } from '../provider';
import type { DocumentItem } from 'excel-collab';
import { getDocId, jumpPage } from '../util';
import styles from './index.module.css';
import { v4 } from 'uuid';
import mockModel from '../model.json';

const App = () => {
  const [docs, setDocs] = useState<DocumentItem[]>([]);
  const providerRef = useRef<RemoteProvider | LocalProvider | null>(null);
  useEffect(() => {
    const docId = getDocId();

    const callback = async () => {
      const list = await provider.getDocumentList();
      const item = list.find((item) => item.id === docId);
      if (item) {
        setDocs(list);
        return;
      }
      await provider.addDocument(docId);
      await provider.updateDocument(docId, {
        content: JSON.stringify(mockModel),
      });
      setDocs(await provider.getDocumentList());
    };

    const httpBaseUrl = import.meta.env.VITE_BACKEND_URL;
    const provider = httpBaseUrl
      ? new RemoteProvider(httpBaseUrl, callback)
      : new LocalProvider(callback);
    callback();
    providerRef.current = provider;
  }, []);

  return (
    <div className={styles.cardList}>
      {docs.map((v) => (
        <div
          key={v.id}
          className={styles.card}
          onClick={() => jumpPage('collab', v.id)}
        >
          <div>{v.name || 'default name'}</div>
          <div>{v.id}</div>
          <div>{new Date(v.create_time).toLocaleString('zh')}</div>
        </div>
      ))}
      <div
        className={styles.card}
        onClick={async () => {
          const id = v4();
          await providerRef.current?.addDocument(id);
          jumpPage('collab', id);
        }}
        style={{ fontSize: 30 }}
      >
        +
      </div>
    </div>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

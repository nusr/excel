import { createRoot } from 'react-dom/client';
import { StrictMode, useEffect, useState, useRef } from 'react';
import { RemoteProvider, LocalProvider } from '../provider';
import { type DocumentItem } from 'excel-collab';
import { jumpPage, getProvider } from '../util';
import styles from './index.module.css';
import { v4 } from 'uuid';
import '../sentry';

const App = () => {
  const [docs, setDocs] = useState<DocumentItem[]>([]);
  const providerRef = useRef<RemoteProvider | LocalProvider | null>(null);
  useEffect(() => {
    getProvider(async (provider) => {
      setDocs(await provider.getDocumentList());
    }).then(async (provider) => {
      providerRef.current = provider;
      setDocs(await provider.getDocumentList());
    });
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
          <div className={styles.cardId}>{v.id}</div>
          <div>{new Date(v.create_time).toLocaleString('zh')}</div>
        </div>
      ))}
      <div
        className={styles.card}
        onClick={async () => {
          const id = v4();
          await providerRef.current?.addDocument(id);
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

import { type ExcelProps, type DocumentItem } from 'excel-collab';
import { useEffect, useState, useCallback } from 'react';
import { type IProvider } from './provider';
import styles from './List.module.css';
import { v4 } from 'uuid';

export const List = (
  props: Omit<ExcelProps, 'provider'> & {
    provider: IProvider;
    changePage: (id: string) => void;
  },
) => {
  const { provider, changePage } = props;
  const [documents, setDocuments] = useState<DocumentItem[]>([]);

  const getList = useCallback(() => {
    provider?.getDocuments().then((list) => {
      if (list) {
        setDocuments(list);
      }
    });
  }, [provider]);

  useEffect(() => {
    getList();
  }, []);

  const handleAdd = useCallback(async () => {
    await provider?.addDocument(v4());
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.list}>
        {documents.map((v) => {
          return (
            <div
              key={v.id}
              className={styles['list-item']}
              onClick={() => {
                changePage(v.id);
              }}
            >
              <div>ID: {v.id}</div>
              <div>Name: {v.name || 'default name'}</div>
              <div>Create Time: {v.create_time}</div>
            </div>
          );
        })}
        <div className={styles.add} onClick={handleAdd}>
          +
        </div>
      </div>
    </div>
  );
};

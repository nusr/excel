import React, { memo, useEffect, useState } from 'react';
import styles from './FloatElement.module.css';
import { useExcel } from '../store';
import { ProgressCircle } from '../../component/ProgressCircle';

type Props = {
  title: string;
  imageSrc: string;
  uuid: string;
};

export const Image: React.FunctionComponent<Props> = memo(
  ({ title, imageSrc = '', uuid }) => {
    const [src, setSrc] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>();
    const { provider, controller } = useExcel();

    useEffect(() => {
      let cancelled = false;
      setError(undefined);
      setSrc('');
      if (!provider?.downloadFile) {
        setSrc(imageSrc);
        setLoading(false);
        return;
      }
      setLoading(true);
      Promise.resolve()
        .then(() => provider.downloadFile!(controller.getHooks().doc.guid, imageSrc))
        .then((data) => {
          if (!cancelled) setSrc(data);
        })
        .catch((cause: unknown) => {
          if (!cancelled) setError(cause instanceof Error ? cause.message : String(cause));
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
      return () => { cancelled = true; };
    }, [imageSrc, provider, controller]);
    if (error) return <div role="alert">{error}</div>;
    if (loading || !src) {
      return (
        <ProgressCircle
          value={60}
          size={64}
          isIndeterminate
          aria-label="Loading image"
        />
      );
    }
    return (
      <img
        title={title}
        alt={title}
        src={src}
        className={styles['image']}
        data-uuid={uuid}
        data-testid="float-element-image"
      />
    );
  },
);

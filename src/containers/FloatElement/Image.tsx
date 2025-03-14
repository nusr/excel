import React, { memo, useEffect, useState } from 'react';
import styles from './FloatElement.module.css';
import { useExcel } from '../store';
import { Loading } from '../../components';

type Props = {
  title: string;
  imageSrc: string;
  uuid: string;
};

export const Image: React.FunctionComponent<Props> = memo(
  ({ title, imageSrc = '', uuid }) => {
    const [src, setSrc] = useState('');
    const [loading, setLoading] = useState(false);
    const { provider, controller } = useExcel();

    useEffect(() => {
      if (!provider?.downloadFile) {
        setSrc(imageSrc);
        return;
      }
      setLoading(true);
      provider
        .downloadFile(controller.getHooks().doc.guid, imageSrc)
        .then((data) => {
          setSrc(data);
        })
        .finally(() => {
          setLoading(false);
        });
    }, [imageSrc, provider]);
    if (loading || !src) {
      return <Loading />;
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

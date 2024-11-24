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
    const { downloadFile } = useExcel();

    useEffect(() => {
      setLoading(true);
      downloadFile(imageSrc)
        .then((data) => {
          setSrc(data);
        })
        .finally(() => {
          setLoading(false);
        });
    }, [imageSrc, downloadFile]);
    if (loading) {
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

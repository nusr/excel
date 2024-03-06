import React, { useSyncExternalStore, Fragment, memo, useState } from 'react';
import { IController } from '@/types';
import { floatElementStore } from '@/containers/store';
import { FloatElement } from './FloatElement';
import { classnames } from '@/util';
import styles from './FloatElement.module.css';

interface Props {
  controller: IController;
}
export const FloatElementContainer: React.FunctionComponent<Props> = memo(
  ({ controller }) => {
    const floatElementList = useSyncExternalStore(
      floatElementStore.subscribe,
      floatElementStore.getSnapshot,
    );
    const [activeUuid, setActiveUuid] = useState('');
    return (
      <Fragment>
        <div
          className={classnames(styles['float-element-mask'], {
            [styles['active']]: !!activeUuid,
          })}
          onPointerDown={() => {
            setActiveUuid('');
          }}
        />
        {floatElementList.map((v) => (
          <FloatElement
            {...v}
            key={v.uuid}
            active={v.uuid === activeUuid}
            controller={controller}
            setActiveUuid={setActiveUuid}
          />
        ))}
      </Fragment>
    );
  },
);

export { InsertFloatingPicture, InsertChart } from './Toolbar';

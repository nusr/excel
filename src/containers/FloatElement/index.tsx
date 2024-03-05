import React, { useSyncExternalStore, Fragment, memo, useState } from 'react';
import { IController } from '@/types';
import { floatElementStore } from '@/containers/store';
import { FloatElement } from './FloatElement';
import { theme, classnames } from '@/util';
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
    const [moveUuid, setMoveUuid] = useState('');
    return (
      <Fragment>
        <div
          className={classnames(styles['float-element-mask'], {
            [styles['active']]: !!moveUuid,
          })}
        ></div>
        {floatElementList.map((v) => (
          <FloatElement
            key={v.uuid}
            {...v}
            zIndex={v.uuid === moveUuid ? theme.middleZIndex : theme.lowZIndex}
            controller={controller}
            setMoveUuid={(uuid: string) => setMoveUuid(uuid)}
          />
        ))}
      </Fragment>
    );
  },
);

export { InsertFloatingPicture, InsertChart } from './Toolbar';

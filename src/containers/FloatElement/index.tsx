import React, { useSyncExternalStore, Fragment, memo } from 'react';
import { IController } from '@/types';
import { floatElementStore } from '@/containers/store';
import { FloatElement } from './FloatElement';

interface Props {
  controller: IController;
}

export const FloatElementContainer: React.FunctionComponent<Props> = memo(
  ({ controller }) => {
    const floatElementList = useSyncExternalStore(
      floatElementStore.subscribe,
      floatElementStore.getSnapshot,
    );
    return (
      <Fragment>
        {floatElementList.map((v) => (
          <FloatElement key={v.uuid} {...v} controller={controller} />
        ))}
      </Fragment>
    );
  },
);

export { InsertFloatingPicture, InsertChart } from './Toolbar';

import React, { useSyncExternalStore, Fragment } from 'react';
import { IController } from '@/types';
import { floatElementStore } from '@/containers/store';
import { FloatElement } from './FloatElement';

interface Props {
  controller: IController;
}

export const FloatElementContainer: React.FunctionComponent<Props> = ({
  controller,
}) => {
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
};

export { InsertFloatingPicture, InsertChart } from './Toolbar';

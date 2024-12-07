import { createContext, useContext } from 'react';
import { IController } from '../../types';
import { CollaborationProvider } from '../../collaboration';

export type StateContextValue = {
  controller: IController;
  provider?: CollaborationProvider;
};

export const StateContext = createContext<StateContextValue | undefined>(
  undefined,
);

export function useExcel() {
  const state = useContext(StateContext);
  if (state === undefined) {
    throw new Error(`must use StateContext.Provider before`);
  }
  return state;
}

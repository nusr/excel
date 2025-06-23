import { createContext, useContext } from 'react';
import { IController, ICollaborationProvider } from '../../types';
import { type Awareness } from 'y-protocols/awareness';

export type StateContextValue = {
  controller: IController;
  provider?: Partial<ICollaborationProvider>;
  awareness?: Awareness;
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

import { createContext, useContext } from 'react';
import { StateContextValue } from '@excel/shared';

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

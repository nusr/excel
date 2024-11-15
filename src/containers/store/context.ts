import { createContext } from 'react';
import { StateContextValue } from '@/types';

export const StateContext = createContext<StateContextValue>({
  isServer: false,
  controller: null,
});


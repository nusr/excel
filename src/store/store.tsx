import React, { memo, useContext, FunctionComponent, Dispatch } from "react";
import { pick } from "lodash-es";
import { useImmerReducer } from "use-immer";
import { reducer, initialState } from "./reducer";
import { Action, ControllerState, State } from "@/types";
const storeContext = React.createContext(initialState);
const dispatchContext = React.createContext((() => 0) as Dispatch<Action>);
type Props = {
  children: React.ReactNode;
};
export const StoreProvider: FunctionComponent<Props> = memo((props) => {
  const { children } = props;
  const [state, dispatch] = useImmerReducer<State, Action>(
    reducer,
    initialState
  );
  return (
    <dispatchContext.Provider value={dispatch}>
      <storeContext.Provider value={state}>{children}</storeContext.Provider>
    </dispatchContext.Provider>
  );
});

StoreProvider.displayName = "StoreProvider";

export const useDispatch = (): Dispatch<Action> => {
  return useContext(dispatchContext);
};
export function useControllerState<k extends keyof ControllerState>(
  pickStr: Array<k>
): Pick<ControllerState, k> {
  const cache = useContext(storeContext);
  return pick(cache.controller, pickStr);
}

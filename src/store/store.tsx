import React, {
  memo,
  useContext,
  FunctionComponent,
  Dispatch,
  useMemo,
  useReducer,
} from "react";
import { pick } from "lodash";
import produce, { Draft } from "immer";
import { reducer, initialState } from "./reducer";
import { Action, State } from "@/types";

type ImmerReducer = (draftState: Draft<State>, action: Action) => State;

function useImmerReducer(reducer: ImmerReducer, initialState: State) {
  const cachedReducer = useMemo(() => produce(reducer), [reducer]);
  return useReducer(cachedReducer, initialState);
}

const storeContext = React.createContext(initialState);
const dispatchContext = React.createContext((() => 0) as Dispatch<Action>);
type Props = {
  children: React.ReactNode;
};
export const StoreProvider: FunctionComponent<Props> = memo((props) => {
  const { children } = props;
  const [state, dispatch] = useImmerReducer(reducer, initialState);
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
export function useSelector<k extends keyof State>(
  pickStr: Array<k>
): Pick<State, k> {
  const cache = useContext(storeContext);
  return pick(cache, pickStr);
}

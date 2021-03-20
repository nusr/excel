import React, {
  memo,
  useContext,
  FunctionComponent,
  Dispatch,
  useMemo,
  useReducer,
} from "react";
import { pick } from "@/lodash";
import produce, { Draft } from "immer";
import { reducer, initialState } from "./reducer";
import { Action, State } from "@/types";
import { Controller } from "@/controller";

type Reducer = (draftState: Draft<State>, action: Action) => State;

function useCustomReducer(reducer: Reducer, initialState: State) {
  const cachedReducer = useMemo(() => produce(reducer), [reducer]);
  return useReducer(cachedReducer, initialState);
}
const controller = Controller.createController();
const controllerContext = React.createContext(controller);
const storeContext = React.createContext(initialState);
const dispatchContext = React.createContext((() => 0) as Dispatch<Action>);
type Props = {
  children: React.ReactNode;
};
export const StoreProvider: FunctionComponent<Props> = memo((props) => {
  const { children } = props;
  const [state, dispatch] = useCustomReducer(reducer, initialState);
  return (
    <controllerContext.Provider value={controller}>
      <dispatchContext.Provider value={dispatch}>
        <storeContext.Provider value={state}>{children}</storeContext.Provider>
      </dispatchContext.Provider>
    </controllerContext.Provider>
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

export const useController = (): Controller => {
  return useContext(controllerContext);
};

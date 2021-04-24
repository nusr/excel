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

type ConstantState = {
  controller: Controller;
  dispatch: React.Dispatch<Action>;
};

function useCustomReducer(reducer: Reducer, initialState: State) {
  const cachedReducer = useMemo(() => produce(reducer), [reducer]);
  return useReducer(cachedReducer, initialState);
}
const controller = Controller.createController();
const constantContext = React.createContext<ConstantState>({
  controller,
  dispatch: (action: Action) => action,
});
const storeContext = React.createContext<State>(initialState);
type Props = {
  children: React.ReactNode;
};
export const StoreProvider: FunctionComponent<Props> = memo((props) => {
  const { children } = props;
  const [state, dispatch] = useCustomReducer(reducer, initialState);
  const constantState = useMemo(() => {
    return { dispatch, controller };
  }, [dispatch]);
  return (
    <constantContext.Provider value={constantState}>
      <storeContext.Provider value={state}>{children}</storeContext.Provider>
    </constantContext.Provider>
  );
});

StoreProvider.displayName = "StoreProvider";

export const useDispatch = (): Dispatch<Action> => {
  const temp = useContext(constantContext);
  return temp.dispatch;
};
export function useSelector<k extends keyof State>(
  pickStr: Array<k>
): Pick<State, k> {
  const cache = useContext(storeContext);
  return pick(cache, pickStr);
}

export const useController = (): Controller => {
  const temp = useContext(constantContext);
  return temp.controller;
};

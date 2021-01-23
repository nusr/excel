import { Action, CellInfo } from "./store";
export type ChangeEventType = "contentChange" | "selectionChange";

export type IWindowSize = {
  width: number;
  height: number;
};

export type EventType = {
  dispatch: Action;
  change: {
    changeSet: Array<ChangeEventType>;
    payload?: CellInfo;
  };
};

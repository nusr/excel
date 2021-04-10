import { CellInfo } from "./store";
export type ChangeEventType = "contentChange" | "selectionChange";

export type IWindowSize = {
  width: number;
  height: number;
};

export type EventType = {
  change: {
    changeSet: Set<ChangeEventType>;
    payload?: CellInfo;
  };
};

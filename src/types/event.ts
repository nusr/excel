import { Action } from "./store";
export type ChangeEventType = "contentChange" | "selectionChange";

export type EventType = {
  dispatch: Action;
  change: {
    changeSet: Array<ChangeEventType>;
  };
};

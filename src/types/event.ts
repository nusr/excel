export type ChangeEventType = "content" | "selection";

export type IWindowSize = {
  width: number;
  height: number;
};

export type EventType = {
  changeSet: Set<ChangeEventType>;
};

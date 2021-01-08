function handleEvent(data?: any): void {
  console.log(data);
}
export type EventHandler = typeof handleEvent;

export interface IEventEmitter {
  on(name: string, callback: EventHandler): EventHandler;
  emit(name: string, data?: unknown): void;
  emitAsync(name: string, data?: unknown): void;
  off(name: string, callback?: EventHandler): void;
  offAll(): void;
  once(name: string, callback: EventHandler): EventHandler;
}

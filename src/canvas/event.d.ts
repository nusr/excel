import { IController, ChangeEventType } from '@/types';
export declare function registerGlobalEvent(controller: IController, resizeWindow: (changeSet: Set<ChangeEventType>) => void): () => void;

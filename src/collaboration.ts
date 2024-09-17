import { IController, EventEmitterType } from '@/types'
import { eventEmitter } from '@/util'

export function initCollaboration(controller: IController) {
  const broadcastChannel = new BroadcastChannel("excel");

  eventEmitter.on("modelChange", (result) => {
    broadcastChannel.postMessage(result);
  })

  broadcastChannel.onmessage = (event: MessageEvent<EventEmitterType['modelChange']>) => {
    controller.applyCommandList(event.data);
  };
}

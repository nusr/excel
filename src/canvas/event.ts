import { IController, KeyboardEventItem, EditorStatus } from '@/types';
import { throttle } from '@/util';
import { keyboardEventList, scrollBar } from './shortcut';
import { coreStore } from '@/containers/store';

function isInputEvent(event: any): boolean {
  const name = (event?.target?.tagName || '').toLowerCase();
  return name === 'input' || name === 'textarea';
}

export function registerGlobalEvent(
  controller: IController,
  resizeWindow: () => void,
) {
  function handleKeydown(event: KeyboardEvent) {
    if (isInputEvent(event)) {
      return;
    }
    const list = keyboardEventList.filter((v) => v.key === event.key);
    list.sort((a, b) => b.modifierKey.length - a.modifierKey.length);
    let temp: KeyboardEventItem | null = null;
    for (const item of list) {
      if (item.modifierKey.length > 0) {
        if (item.modifierKey.some((v) => event[`${v}Key`])) {
          temp = item;
          break;
        }
      } else {
        temp = item;
        break;
      }
    }
    if (temp) {
      event.preventDefault();
      temp.handler(controller);
      return;
    }
    if (event.metaKey || event.ctrlKey) {
      return;
    }
    coreStore.mergeState({
      editorStatus: EditorStatus.EDIT_CELL,
    });
  }

  const handleWheel = throttle((event: WheelEvent) => {
    scrollBar(controller, event.deltaX, event.deltaY);
  }, 1000 / 60);

  function handlePaste(event: ClipboardEvent) {
    if (isInputEvent(event)) {
      return;
    }
    event.preventDefault();
    controller.paste(event);
  }

  function handleCopy(event: ClipboardEvent) {
    if (isInputEvent(event)) {
      return;
    }

    event.preventDefault();
    controller.copy(event);
  }

  function handleCut(event: ClipboardEvent) {
    if (isInputEvent(event)) {
      return;
    }
    event.preventDefault();
    controller.cut(event);
  }

  window.addEventListener('resize', resizeWindow);
  document.body.addEventListener('keydown', handleKeydown);
  document.body.addEventListener('wheel', handleWheel);
  document.body.addEventListener('paste', handlePaste);
  document.body.addEventListener('copy', handleCopy);
  document.body.addEventListener('cut', handleCut);

  return () => {
    window.removeEventListener('resize', resizeWindow);
    document.body.removeEventListener('keydown', handleKeydown);
    document.body.removeEventListener('wheel', handleWheel);
    document.body.removeEventListener('paste', handlePaste);
    document.body.removeEventListener('copy', handleCopy);
    document.body.removeEventListener('cut', handleCut);
  };
}

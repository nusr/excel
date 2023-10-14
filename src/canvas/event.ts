import { IController, KeyboardEventItem, ChangeEventType } from '@/types';
import { debounce } from '@/util';
import { keyboardEventList, scrollBar } from './shortcut';
import { coreStore } from '@/containers/store';

function isInputEvent(event: any): boolean {
  const name = (event?.target?.tagName || '').toLowerCase();
  return name === 'input' || name === 'textarea';
}

export function registerGlobalEvent(
  controller: IController,
  resizeWindow: (changeSet: Set<ChangeEventType>) => void,
) {
  function handleKeydown(event: KeyboardEvent) {
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
    if (isInputEvent(event)) {
      return;
    }

    coreStore.mergeState({
      isCellEditing: true,
    });
    controller.getMainDom().input!.focus();
  }

  const handleWheel = debounce(function (event: WheelEvent) {
    if (event.target !== controller.getMainDom().canvas!) {
      return;
    }
    scrollBar(controller, event.deltaX, event.deltaY);
  });

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

  function handleResize() {
    resizeWindow(new Set<ChangeEventType>(['content', 'setActiveCell']));
  }

  window.addEventListener('resize', handleResize);
  window.addEventListener('keydown', handleKeydown);
  window.addEventListener('wheel', handleWheel);
  document.body.addEventListener('paste', handlePaste);
  document.body.addEventListener('copy', handleCopy);
  document.body.addEventListener('cut', handleCut);

  return () => {
    window.removeEventListener('resize', handleResize);
    window.removeEventListener('keydown', handleKeydown);
    window.removeEventListener('wheel', handleWheel);
    document.body.removeEventListener('paste', handlePaste);
    document.body.removeEventListener('copy', handleCopy);
    document.body.removeEventListener('cut', handleCut);
  };
}

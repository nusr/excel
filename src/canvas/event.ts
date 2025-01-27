import { IController, KeyboardEventItem, EditorStatus, IRange } from '../types';
import {
  isTestEnv,
  throttle,
  CUSTOM_FORMAT,
  deepEqual,
  paste,
  reactLog,
} from '../util';
import { keyboardEventList, scrollBar } from './shortcut';
import { useCoreStore } from '../containers/store';

type EventType = {
  target?: {
    tagName?: string;
  };
};

function isInputEvent(event: any): boolean {
  const targetName = event?.target?.tagName || '';
  const currentTargetName = event?.currentTarget?.tagName || '';
  return (
    ['INPUT', 'TEXTAREA'].includes(targetName) ||
    ['INPUT', 'TEXTAREA'].includes(currentTargetName)
  );
}

export function registerGlobalEvent(
  controller: IController,
  resizeWindow: () => void,
) {
  function handleKeydown(event: KeyboardEvent) {
    if (isInputEvent(event)) {
      return;
    }
    reactLog('keydown:', event);
    const list = keyboardEventList.filter((v) => v.key === event.key);
    list.sort((a, b) => b.modifierKey.length - a.modifierKey.length);
    let temp: KeyboardEventItem | undefined = undefined;
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
    useCoreStore.getState().setEditorStatus(EditorStatus.EDIT_CELL);
  }

  const handleWheel = throttle((event: WheelEvent) => {
    const tagName = (event as EventType)?.target?.tagName?.toLowerCase();
    if (tagName === 'canvas' || isTestEnv()) {
      scrollBar(controller, event.deltaX, event.deltaY);
    }
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

  function handleFocus(event: FocusEvent) {
    if (isInputEvent(event)) {
      return;
    }
    paste().then((result) => {
      const oldRange = controller.getCopyRange();
      let newRange: IRange | undefined = undefined;
      if (result[CUSTOM_FORMAT]) {
        const data = result[CUSTOM_FORMAT];
        newRange =
          !data.floatElementUuid && data.range ? data.range : undefined;
        controller.setFloatElementUuid(data.floatElementUuid);
      } else {
        controller.setFloatElementUuid('');
      }
      if (!deepEqual(newRange, oldRange)) {
        controller.setCopyRange(newRange);
        controller.emit('renderChange', {
          changeSet: new Set(['cellStyle']),
        });
      }
    });
  }

  window.addEventListener('resize', resizeWindow);
  document.body.addEventListener('keydown', handleKeydown);
  document.body.addEventListener('wheel', handleWheel);
  document.body.addEventListener('paste', handlePaste);
  document.body.addEventListener('copy', handleCopy);
  document.body.addEventListener('cut', handleCut);
  window.addEventListener('focus', handleFocus);

  return () => {
    window.removeEventListener('resize', resizeWindow);
    document.body.removeEventListener('keydown', handleKeydown);
    document.body.removeEventListener('wheel', handleWheel);
    document.body.removeEventListener('paste', handlePaste);
    document.body.removeEventListener('copy', handleCopy);
    document.body.removeEventListener('cut', handleCut);
    window.removeEventListener('focus', handleFocus);
  };
}

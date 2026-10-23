import { vi } from 'vitest';
import { registerGlobalEvent } from '../event';
import { useCoreStore } from '../../containers/store';
import { EditorStatus, type IController } from '../../types';

describe('global keyboard editor activation', () => {
  let cleanup: () => void;

  beforeEach(() => {
    useCoreStore.getState().setEditorStatus(EditorStatus.NONE);
    cleanup = registerGlobalEvent({} as IController, vi.fn());
  });

  afterEach(() => {
    cleanup();
    useCoreStore.getState().setEditorStatus(EditorStatus.NONE);
  });

  test.each(['Shift', 'Control', 'Alt', 'Escape', 'F1'])('%s does not start editing', (key) => {
    document.body.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
    expect(useCoreStore.getState().editorStatus).toBe(EditorStatus.NONE);
  });

  test('a printable character starts editing', () => {
    const event = new KeyboardEvent('keydown', {
      key: 'a',
      bubbles: true,
      cancelable: true,
    });
    document.body.dispatchEvent(event);
    expect(useCoreStore.getState().editorStatus).toBe(EditorStatus.EDIT_CELL);
    expect(useCoreStore.getState().editorInitialValue).toBe('a');
    expect(event.defaultPrevented).toBe(true);
    useCoreStore.getState().setEditorStatus(EditorStatus.NONE);
    expect(useCoreStore.getState().editorInitialValue).toBeUndefined();
  });

  test('detached listeners no longer start editing', () => {
    cleanup();
    document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', bubbles: true }));
    expect(useCoreStore.getState().editorStatus).toBe(EditorStatus.NONE);
  });
});

import { vi } from 'vitest';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Image } from '../FloatElement/Image';
import { Theme } from '../MenuBar/Theme';
import { MultipleLineEditor } from '../FormulaBar/FormulaEditor';
import { InsertFloatingPicture } from '../FloatElement/Toolbar';
import { FloatElementContextMenu } from '../FloatElement/ContextMenu';
import { StateContext, useCoreStore } from '../store';
import FormulaBarContainer from '../FormulaBar';
import { registerGlobalEvent } from '../../canvas/event';
import { EditorStatus } from '../../types';
import { initController } from '../../controller';
import * as utils from '../../util';
import { queue } from '../../component/Toast';
import '../../__tests__/global.mock';

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason: Error) => void;
  const promise = new Promise<T>((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}

const controllers: ReturnType<typeof initController>[] = [];
function controller() {
  const value = initController();
  value.addFirstSheet();
  controllers.push(value);
  return value;
}

afterEach(() => {
  for (const value of controllers.splice(0)) {
    value.destroy();
    value.getHooks().doc.destroy();
  }
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

test('obsolete image downloads cannot replace a newer source', async () => {
  const first = deferred<string>();
  const second = deferred<string>();
  const downloadFile = vi.fn()
    .mockReturnValueOnce(first.promise)
    .mockReturnValueOnce(second.promise);
  const value = { controller: controller(), provider: { downloadFile } };
  const view = render(
    <StateContext.Provider value={value}>
      <Image imageSrc="first" title="picture" uuid="image" />
    </StateContext.Provider>,
  );
  await waitFor(() => expect(downloadFile).toHaveBeenCalledTimes(1));
  view.rerender(
    <StateContext.Provider value={value}>
      <Image imageSrc="second" title="picture" uuid="image" />
    </StateContext.Provider>,
  );
  await waitFor(() => expect(downloadFile).toHaveBeenCalledTimes(2));
  await act(async () => { second.resolve('data:image/png;base64,new'); });
  expect(screen.getByRole('img').getAttribute('src')).toBe('data:image/png;base64,new');
  await act(async () => { first.resolve('data:image/png;base64,old'); });
  expect(screen.getByRole('img').getAttribute('src')).toBe('data:image/png;base64,new');
});

test('failed image downloads show an error instead of loading forever', async () => {
  const downloadFile = vi.fn().mockRejectedValue(new Error('download unavailable'));
  render(
    <StateContext.Provider value={{ controller: controller(), provider: { downloadFile } }}>
      <Image imageSrc="missing" title="picture" uuid="image" />
    </StateContext.Provider>,
  );
  expect(await screen.findByRole('alert')).toHaveTextContent('download unavailable');
  expect(screen.queryByLabelText('Loading image')).not.toBeInTheDocument();
});

test('image upload failures are handled without inserting a drawing', async () => {
  vi.spyOn(utils, 'convertFileToTextOrBase64').mockResolvedValue('data:image/png;base64,image');
  vi.spyOn(utils, 'getImageSize').mockResolvedValue({ width: 10, height: 10 });
  const notify = vi.spyOn(queue, 'add');
  const uploadFile = vi.fn().mockRejectedValue(new Error('upload unavailable'));
  const value = controller();
  render(
    <StateContext.Provider value={{ controller: value, provider: { uploadFile } }}>
      <InsertFloatingPicture />
    </StateContext.Provider>,
  );
  fireEvent.change(screen.getByTestId('toolbar-floating-picture-input'), {
    target: { files: [new File(['image'], 'photo.jpeg', { type: 'image/jpeg' })] },
  });
  await waitFor(() => expect(notify).toHaveBeenCalledWith({
    title: expect.stringContaining('upload unavailable'),
  }));
  expect(value.getDrawingList()).toHaveLength(0);
});

test('a slow image upload retains its original sheet and full file title', async () => {
  vi.spyOn(utils, 'convertFileToTextOrBase64').mockResolvedValue('data:image/png;base64,image');
  vi.spyOn(utils, 'getImageSize').mockResolvedValue({ width: 10, height: 10 });
  const pending = deferred<string>();
  const uploadFile = vi.fn(() => pending.promise);
  const value = controller();
  const first = value.getCurrentSheetId();
  render(
    <StateContext.Provider value={{ controller: value, provider: { uploadFile } }}>
      <InsertFloatingPicture />
    </StateContext.Provider>,
  );
  fireEvent.change(screen.getByTestId('toolbar-floating-picture-input'), {
    target: { files: [new File(['image'], 'photo.jpeg', { type: 'image/jpeg' })] },
  });
  await waitFor(() => expect(uploadFile).toHaveBeenCalledOnce());
  act(() => { value.addSheet(); });
  await act(async () => { pending.resolve('stored-image'); });
  expect(value.getDrawingList(first)[0]).toMatchObject({ title: 'photo', sheetId: first });
  expect(value.getDrawingList()).toHaveLength(0);
});

test('an open drawing menu updates reset-size availability after resizing', () => {
  const value = controller();
  const props = {
    uuid: 'image', type: 'floating-picture' as const, title: 'picture',
    width: 100, height: 100, originWidth: 100, originHeight: 100,
    top: 0, left: 0, fromRow: 0, fromCol: 0, marginX: 0, marginY: 0,
    sheetId: value.getCurrentSheetId(), labels: [], datasets: [],
    menuLeft: 0, menuTop: 0, hideContextMenu: vi.fn(), resetResize: vi.fn(),
  };
  const view = render(
    <StateContext.Provider value={{ controller: value }}>
      <FloatElementContextMenu {...props} />
    </StateContext.Provider>,
  );
  expect(screen.getByTestId('float-element-context-menu-reset-size')).toHaveAttribute('aria-disabled', 'true');
  view.rerender(
    <StateContext.Provider value={{ controller: value }}>
      <FloatElementContextMenu {...props} width={120} />
    </StateContext.Provider>,
  );
  expect(screen.getByTestId('float-element-context-menu-reset-size')).not.toHaveAttribute('aria-disabled', 'true');
});

test('theme removes its system preference listener on unmount', () => {
  const media = { addEventListener: vi.fn(), removeEventListener: vi.fn() };
  vi.stubGlobal('matchMedia', vi.fn(() => media));
  const view = render(
    <StateContext.Provider value={{ controller: controller() }}><Theme /></StateContext.Provider>,
  );
  const handler = media.addEventListener.mock.calls[0][1];
  view.unmount();
  expect(media.removeEventListener).toHaveBeenCalledWith('change', handler);
});

test.each(['Enter', 'Tab'])('formula editor prevents the native %s action after committing', (key) => {
  const value = controller();
  render(
    <StateContext.Provider value={{ controller: value }}>
      <MultipleLineEditor initValue="hello" isMergeCell={false} style={undefined} testId="editor" />
    </StateContext.Provider>,
  );
  expect(fireEvent.keyDown(screen.getByTestId('editor'), { key })).toBe(false);
  expect(value.getCell({ row: 0, col: 0, rowCount: 1, colCount: 1, sheetId: '' })?.value).toBe('hello');
});

test('keyboard activation focuses the editor with its first character before later input', () => {
  const value = controller();
  useCoreStore.getState().setEditorStatus(EditorStatus.NONE);
  const cleanup = registerGlobalEvent(value, vi.fn());
  try {
    render(
      <StateContext.Provider value={{ controller: value }}>
        <FormulaBarContainer />
      </StateContext.Provider>,
    );
    expect(fireEvent.keyDown(document.body, { key: 'H' })).toBe(false);
    const editor = screen.getByTestId('formula-editor');
    expect(editor).toHaveFocus();
    expect(editor).toHaveValue('H');
    expect(editor).toHaveProperty('selectionStart', 1);
    expect(editor).toHaveProperty('selectionEnd', 1);
    fireEvent.input(editor, { target: { value: 'Hello' } });
    fireEvent.keyDown(editor, { key: 'Enter' });
    expect(value.getCell({
      row: 0, col: 0, rowCount: 1, colCount: 1, sheetId: '',
    })?.value).toBe('Hello');
    expect(useCoreStore.getState().editorInitialValue).toBeUndefined();
  } finally {
    cleanup();
    useCoreStore.getState().setEditorStatus(EditorStatus.NONE);
  }
});

test('IME composition Enter does not commit a partially composed value', () => {
  const value = controller();
  render(
    <StateContext.Provider value={{ controller: value }}>
      <MultipleLineEditor initValue="composing" isMergeCell={false} style={undefined} testId="editor" />
    </StateContext.Provider>,
  );
  fireEvent.keyDown(screen.getByTestId('editor'), { key: 'Enter', isComposing: true });
  expect(value.getCell(value.getActiveRange().range)?.value).toBeUndefined();
});

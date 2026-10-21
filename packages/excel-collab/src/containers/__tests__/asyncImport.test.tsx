import { vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import MenuBar from '../MenuBar';
import { StateContext } from '../store';
import { initController } from '../../controller';
import type { ModelJSON } from '../../types';
import '../../__tests__/global.mock';

const { importExcel } = vi.hoisted(() => ({ importExcel: vi.fn() }));
vi.mock('../Excel', async (original) => ({
  ...await original<typeof import('../Excel')>(),
  importExcel,
}));

function deferred() {
  let resolve!: (value: ModelJSON) => void;
  const promise = new Promise<ModelJSON>((done) => { resolve = done; });
  return { promise, resolve };
}

afterEach(() => {
  importExcel.mockReset();
  vi.restoreAllMocks();
});

test('a slow previous import cannot replace a newer workbook', async () => {
  const controller = initController();
  const fromJSON = vi.spyOn(controller, 'fromJSON').mockImplementation(() => {});
  const first = deferred();
  const second = deferred();
  importExcel.mockReturnValueOnce(first.promise).mockReturnValueOnce(second.promise);
  const view = render(
    <StateContext.Provider value={{ controller }}><MenuBar /></StateContext.Provider>,
  );
  fireEvent.click(screen.getByTestId('menubar-excel-trigger'));
  const input = screen.getByTestId('menubar-import-input');
  fireEvent.change(input, { target: { files: [new File(['first'], 'first.xlsx')] } });
  fireEvent.change(input, { target: { files: [new File(['second'], 'second.xlsx')] } });
  const latest = controller.toJSON();
  await act(async () => { second.resolve(latest); });
  await act(async () => { first.resolve(controller.toJSON()); });
  expect(fromJSON).toHaveBeenCalledExactlyOnceWith(latest);
  view.unmount();
  controller.destroy();
  controller.getHooks().doc.destroy();
});

test('an import finishing after unmount cannot mutate the controller', async () => {
  const controller = initController();
  const fromJSON = vi.spyOn(controller, 'fromJSON').mockImplementation(() => {});
  const pending = deferred();
  importExcel.mockReturnValueOnce(pending.promise);
  const view = render(
    <StateContext.Provider value={{ controller }}><MenuBar /></StateContext.Provider>,
  );
  fireEvent.click(screen.getByTestId('menubar-excel-trigger'));
  fireEvent.change(screen.getByTestId('menubar-import-input'), {
    target: { files: [new File(['first'], 'first.xlsx')] },
  });
  view.unmount();
  await act(async () => { pending.resolve(controller.toJSON()); });
  expect(fromJSON).not.toHaveBeenCalled();
  controller.destroy();
  controller.getHooks().doc.destroy();
});

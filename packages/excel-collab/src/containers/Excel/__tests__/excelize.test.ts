import { vi } from 'vitest';
import { initController } from '../../../controller';

const { init } = vi.hoisted(() => ({ init: vi.fn() }));
vi.mock('excelize-wasm', () => ({ init }));

beforeEach(() => {
  vi.resetModules();
  init.mockReset();
});

test('importing the editor helpers and using CSV does not initialize WASM', async () => {
  const { importExcel, exportToCsv } = await import('../index');
  const controller = initController();
  controller.addSheet();
  expect(exportToCsv(controller)).toBe('');
  const model = await importExcel(new File(['hello,42'], 'data.csv'));
  expect(Object.values(model.worksheets).map((cell) => cell.value)).toEqual(['hello', 42]);
  expect(init).not.toHaveBeenCalled();
});

test('concurrent requests share one lazy initialization', async () => {
  const api = { NewFile: vi.fn() };
  init.mockResolvedValue(api);
  const { loadExcelize } = await import('../excelize');
  const first = loadExcelize();
  const second = loadExcelize();
  expect(first).toBe(second);
  expect(await first).toBe(api);
  expect(await loadExcelize()).toBe(api);
  expect(init).toHaveBeenCalledTimes(1);
  expect(init).toHaveBeenCalledWith(expect.stringContaining('excelize.wasm.gz'));
});

test('initialization failures are surfaced and can be retried', async () => {
  const failure = new Error('WASM download failed');
  const api = { NewFile: vi.fn() };
  init.mockRejectedValueOnce(failure).mockResolvedValueOnce(api);
  const { loadExcelize } = await import('../excelize');
  await expect(loadExcelize()).rejects.toBe(failure);
  await expect(loadExcelize()).resolves.toBe(api);
  expect(init).toHaveBeenCalledTimes(2);
});

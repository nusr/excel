import { vi, type MockInstance } from 'vitest';
import { saveAs } from '../saveAs';

describe('saveAs', () => {
  let createElementSpy: MockInstance<typeof document.createElement>;

  beforeEach(() => {
    createElementSpy = vi.spyOn(document, 'createElement');
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it.each([false, true])(
    'releases owned object URLs after download even if dispatch fails (%s)',
    (fails) => {
      vi.useFakeTimers();
      const revokeObjectURL = vi.fn();
      vi.stubGlobal('URL', { createObjectURL: vi.fn(() => 'blob:download'), revokeObjectURL });
      const link = document.createElement('a');
      createElementSpy.mockReturnValue(link);
      vi.spyOn(link, 'dispatchEvent').mockImplementation(() => {
        if (fails) throw new Error('dispatch failed');
        return true;
      });
      const download = () => saveAs(new Blob(['content']), 'download.txt');
      if (fails) expect(download).toThrow('dispatch failed');
      else download();
      expect(revokeObjectURL).not.toHaveBeenCalled();
      vi.advanceTimersByTime(40_000);
      expect(revokeObjectURL).toHaveBeenCalledExactlyOnceWith('blob:download');
    },
  );

  it('does not revoke URLs owned by callers', () => {
    vi.useFakeTimers();
    const revokeObjectURL = vi.fn();
    vi.stubGlobal('URL', { revokeObjectURL });
    const link = document.createElement('a');
    createElementSpy.mockReturnValue(link);
    vi.spyOn(link, 'dispatchEvent').mockReturnValue(true);
    saveAs('blob:external', 'download.txt');
    vi.advanceTimersByTime(40_000);
    expect(revokeObjectURL).not.toHaveBeenCalled();
  });

  it('should create a link element with correct properties', () => {
    const link = document.createElement('a');
    createElementSpy.mockReturnValue(link);

    saveAs('blob', 'file.txt');

    expect(createElementSpy).toHaveBeenCalledWith('a');
    expect(link.download).toEqual('file.txt');
    expect(link.rel).toEqual('noopener');
    expect(link.target).toEqual('_blank');
    expect(link.getAttribute('data-testid')).toEqual('save-as-link');
  });

  it('should set href to blob URL if blob is a string', () => {
    const link = document.createElement('a');
    createElementSpy.mockReturnValue(link);

    saveAs('blob', 'file.txt');

    expect(link.href).toEqual('http://localhost/blob');
  });

  it('should set href to object URL if blob is a Blob', () => {
    const blob = new Blob(['content'], { type: 'text/plain' });
    const link = document.createElement('a');
    createElementSpy.mockReturnValue(link);

    saveAs(blob, 'file.txt');

    expect(link.href).toEqual(expect.stringContaining('blob:'));
  });

  it('should dispatch a click event on the link element', () => {
    const link = document.createElement('a');
    createElementSpy.mockReturnValue(link);
    const dispatchEventSpy = vi.spyOn(link, 'dispatchEvent');

    saveAs('blob', 'file.txt');

    expect(dispatchEventSpy).toHaveBeenCalledTimes(1);
  });
});

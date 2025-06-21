import { saveAs } from '../saveAs';

describe('saveAs', () => {
  let createElementSpy: jest.SpyInstance;

  beforeEach(() => {
    createElementSpy = jest.spyOn(document, 'createElement');
  });

  afterEach(() => {
    jest.restoreAllMocks();
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
    const dispatchEventSpy = jest.spyOn(link, 'dispatchEvent');

    saveAs('blob', 'file.txt');

    expect(dispatchEventSpy).toHaveBeenCalledTimes(1);
  });
});

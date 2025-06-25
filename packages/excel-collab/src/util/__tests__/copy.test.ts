import {
  generateHTML,
  extractCustomData,
  formatCustomData,
  paste,
  PLAIN_FORMAT,
  HTML_FORMAT,
  CUSTOM_FORMAT,
  copyOrCut,
  IMAGE_FORMAT,
} from '../copy';

describe('generateHTML', () => {
  it('should generate HTML with given style and content', () => {
    const style = 'body { background-color: red; }';
    const content = '<tr><td>Test</td></tr>';
    const result = generateHTML(style, content);

    expect(result).toContain('<style>body { background-color: red; }</style>');
    expect(result).toContain('<table><tr><td>Test</td></tr></table>');
  });

  it('should include custom data if provided', () => {
    const style = 'body { background-color: red; }';
    const content = '<tr><td>Test</td></tr>';
    const customData = JSON.stringify({
      range: { row: 1, col: 1, colCount: 1, rowCount: 1, sheetId: 'test' },
      type: 'cut',
    });
    const result = generateHTML(style, content, formatCustomData(customData));

    expect(result).toContain(
      '<caption>{"range":{"row":1,"col":1,"colCount":1,"rowCount":1,"sheetId":"test"},"type":"cut"}</caption>',
    );
  });

  it('should not include custom data if not provided', () => {
    const style = 'body { background-color: red; }';
    const content = '<tr><td>Test</td></tr>';
    const result = generateHTML(style, content);

    expect(result).not.toContain('<caption>');
    expect(result).not.toContain('</caption>');
  });

  it('should generate valid HTML structure', () => {
    const style = 'body { background-color: red; }';
    const content = '<tr><td>Test</td></tr>';
    const result = generateHTML(style, content);

    expect(result).toContain('<html');
    expect(result).toContain('</html>');
    expect(result).toContain('<head>');
    expect(result).toContain('</head>');
    expect(result).toContain('<body>');
    expect(result).toContain('</body>');
  });
});

describe('extractCustomData', () => {
  it('should extract custom data from HTML', () => {
    const html =
      '<html><caption>{"range":{"row":1,"col":1,"colCount":1,"rowCount":1,"sheetId":"test"},"type":"cut"}</caption></html>';
    const result = extractCustomData(html);
    expect(result).toEqual({
      range: { row: 1, col: 1, colCount: 1, rowCount: 1, sheetId: 'test' },
      type: 'cut',
    });
  });

  it('should return null if custom data start flag is missing', () => {
    const html = '<html></caption></html>';
    const result = extractCustomData(html);
    expect(result).toBeNull();
  });

  it('should return null if custom data end flag is missing', () => {
    const html =
      '<html><caption>{"range":{"row":1,"col":1,"colCount":1,"rowCount":1,"sheetId":"test"},"type":"cut"}</html>';
    const result = extractCustomData(html);
    expect(result).toBeNull();
  });

  it('should return null if custom data flags are not in correct order', () => {
    const html =
      '<html></caption><caption>{"range":{"row":1,"col":1,"colCount":1,"rowCount":1,"sheetId":"test"},"type":"cut"}</html>';
    const result = extractCustomData(html);
    expect(result).toBeNull();
  });

  it('should return null if custom data is empty', () => {
    const html = '<html><caption></caption></html>';
    const result = extractCustomData(html);
    expect(result).toBeNull();
  });

  it('should return null if custom data is invalid JSON', () => {
    const html = '<html><caption>invalid json</caption></html>';
    const result = extractCustomData(html);
    expect(result).toBeNull();
  });
});

describe('paste', () => {
  beforeEach(() => {
    // @ts-ignore
    jest.spyOn(global, 'Blob').mockImplementation((data: string[]) => {
      return { text: () => Promise.resolve(data[0]) };
    });
  });
  test('empty', async () => {
    const result = await paste();
    expect(result).toEqual({
      [PLAIN_FORMAT]: '',
      [HTML_FORMAT]: '',
      [CUSTOM_FORMAT]: null,
      [IMAGE_FORMAT]: null,
    });
  });
  test('extract', async () => {
    await copyOrCut(
      {
        [PLAIN_FORMAT]: 'plain',
        [HTML_FORMAT]:
          '<caption>{"range":{"row":1,"col":1,"colCount":1,"rowCount":1,"sheetId":"test"},"type":"cut"}</caption>',
        [CUSTOM_FORMAT]: null,
        [IMAGE_FORMAT]: null,
      },
      'copy',
    );
    const result = await paste();
    expect(result).toEqual({
      [PLAIN_FORMAT]: 'plain',
      [HTML_FORMAT]:
        '<caption>{"range":{"row":1,"col":1,"colCount":1,"rowCount":1,"sheetId":"test"},"type":"cut"}</caption>',
      [CUSTOM_FORMAT]: {
        range: { row: 1, col: 1, colCount: 1, rowCount: 1, sheetId: 'test' },
        type: 'cut',
      },
      [IMAGE_FORMAT]: null,
    });
  });
});

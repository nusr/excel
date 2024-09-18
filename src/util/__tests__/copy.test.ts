
import { generateHTML, extractCustomData, paste, PLAIN_FORMAT, HTML_FORMAT, CUSTOM_FORMAT, copyOrCut, IMAGE_FORMAT } from '../copy';

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
    const customData = JSON.stringify({ range: { row: 1, col: 1, colCount: 1, rowCount: 1, sheetId: 'test' }, type: 'cut' });
    const result = generateHTML(style, content, customData);

    expect(result).toContain('<!-- __custom_clipboard__start{"range":{"row":1,"col":1,"colCount":1,"rowCount":1,"sheetId":"test"},"type":"cut"}__custom_clipboard__end -->');
  });

  it('should not include custom data if not provided', () => {
    const style = 'body { background-color: red; }';
    const content = '<tr><td>Test</td></tr>';
    const result = generateHTML(style, content);

    expect(result).not.toContain('<!-- __custom_clipboard__start');
    expect(result).not.toContain('__custom_clipboard__end -->');
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
    const html = '<html><!-- __custom_clipboard__start custom data __custom_clipboard__end --></html>';
    const result = extractCustomData(html);
    expect(result).toBe('custom data');
  });

  it('should return empty string if custom data start flag is missing', () => {
    const html = '<html>__custom_clipboard__end --></html>';
    const result = extractCustomData(html);
    expect(result).toBe('');
  });

  it('should return empty string if custom data end flag is missing', () => {
    const html = '<html><!-- __custom_clipboard__start custom data</html>';
    const result = extractCustomData(html);
    expect(result).toBe('');
  });

  it('should return empty string if custom data flags are not in correct order', () => {
    const html = '<html>__custom_clipboard__end --><!-- __custom_clipboard__start custom data</html>';
    const result = extractCustomData(html);
    expect(result).toBe('');
  });

  it('should return empty string if custom data is empty', () => {
    const html = '<html><!-- __custom_clipboard__start__custom_clipboard__end --></html>';
    const result = extractCustomData(html);
    expect(result).toBe('');
  });
});

describe('paste', () => {
  beforeEach(() => {
    // @ts-ignore
    jest.spyOn(global, 'Blob').mockImplementation((data: string[]) => {
      return { text: () => Promise.resolve(data[0]) }
    })
  })
  test('empty', async () => {
    const result = await paste();
    expect(result).toEqual({ [PLAIN_FORMAT]: '', [HTML_FORMAT]: '', [CUSTOM_FORMAT]: '', [IMAGE_FORMAT]: null });
  })
  test('extract', async () => {
    await copyOrCut({ [PLAIN_FORMAT]: 'plain', [HTML_FORMAT]: '<!-- __custom_clipboard__start{"range":{"row":1,"col":1,"colCount":1,"rowCount":1,"sheetId":"test"},"type":"cut"}__custom_clipboard__end -->', [CUSTOM_FORMAT]: 'custom', [IMAGE_FORMAT]: null });
    const result = await paste();
    expect(result).toEqual({ [PLAIN_FORMAT]: 'plain', [HTML_FORMAT]: '<!-- __custom_clipboard__start{"range":{"row":1,"col":1,"colCount":1,"rowCount":1,"sheetId":"test"},"type":"cut"}__custom_clipboard__end -->', [CUSTOM_FORMAT]: '{"range":{"row":1,"col":1,"colCount":1,"rowCount":1,"sheetId":"test"},"type":"cut"}', [IMAGE_FORMAT]: null });
  })
})

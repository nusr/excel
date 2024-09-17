import type { ClipboardData } from '@/types';

export const PLAIN_FORMAT = 'text/plain';
export const HTML_FORMAT = 'text/html';
export const CUSTOM_FORMAT = 'custom/model';

const CUSTOM_START_FLAG = '<!-- __custom_clipboard__start'
const CUSTOM_END_FLAG = '__custom_clipboard__end -->'

export function copyOrCut(textData: ClipboardData): Promise<void> {
  if (typeof ClipboardItem !== 'function') {
    return Promise.resolve();
  }
  const text = new Blob([textData[PLAIN_FORMAT]], { type: PLAIN_FORMAT });
  const html = new Blob([textData[HTML_FORMAT]], { type: HTML_FORMAT });
  const result: ClipboardItem[] = [
    new ClipboardItem({ [text.type]: text }),
    new ClipboardItem({ [html.type]: html }),
  ]
  return navigator?.clipboard?.write(result);
}

export async function paste(): Promise<ClipboardData> {
  const result: ClipboardData = {
    [HTML_FORMAT]: '',
    [PLAIN_FORMAT]: '',
    [CUSTOM_FORMAT]: '',
    images: []
  };
  const list = (await navigator?.clipboard?.read()) || [];
  for (const item of list) {
    if (item.types.includes(PLAIN_FORMAT)) {
      const buf = await item.getType(PLAIN_FORMAT);
      result[PLAIN_FORMAT] = await buf?.text();
    }
    if (item.types.includes(HTML_FORMAT)) {
      const buf = await item.getType(HTML_FORMAT);
      result[HTML_FORMAT] = await buf?.text();
    }
    if (item.types.includes(CUSTOM_FORMAT)) {
      const buf = await item.getType(CUSTOM_FORMAT);
      result[CUSTOM_FORMAT] = await buf?.text();
    }
  }
  result[CUSTOM_FORMAT] = result[CUSTOM_FORMAT] || extractCustomData(result[HTML_FORMAT]);
  return result;
}

export function generateHTML(style: string, content: string, customData: string = ''): string {
  return `<html
  xmlns:v="urn:schemas-microsoft-com:vml"
  xmlns:o="urn:schemas-microsoft-com:office:office"
  xmlns:x="urn:schemas-microsoft-com:office:excel"
  xmlns="http://www.w3.org/TR/REC-html40">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="ProgId" content="Excel.Sheet" />
    <meta name="Generator" content="Microsoft Excel 15" />
    ${customData ? `${CUSTOM_START_FLAG}${customData}${CUSTOM_END_FLAG}` : ''}
    <style>${style}</style>
  </head>
  <body>
    <table>${content}</table>
  </body>
</html>`;
}

export function extractCustomData(html: string) {
  const start = html.indexOf(CUSTOM_START_FLAG);
  const end = html.indexOf(CUSTOM_END_FLAG);
  if (start >= 0 && end >= 0) {
    return html.slice(start + CUSTOM_START_FLAG.length, end).trim();
  }
  return ''
}

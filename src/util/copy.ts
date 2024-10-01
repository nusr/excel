import type { ClipboardData, CustomClipboardData } from '@/types';

export const PLAIN_FORMAT = 'text/plain';
export const HTML_FORMAT = 'text/html';
export const CUSTOM_FORMAT = 'custom/model';
export const IMAGE_FORMAT = 'image/png';

const CUSTOM_START_FLAG = '<caption>';
const CUSTOM_END_FLAG = '</caption>';

export async function copyOrCut(textData: ClipboardData): Promise<void> {
  const text = new Blob([textData[PLAIN_FORMAT]], { type: PLAIN_FORMAT });
  const html = new Blob([textData[HTML_FORMAT]], { type: HTML_FORMAT });
  const result: Record<string, Blob> = {
    [PLAIN_FORMAT]: text,
    [HTML_FORMAT]: html,
  };
  if (textData[IMAGE_FORMAT]) {
    result[IMAGE_FORMAT] = textData[IMAGE_FORMAT];
  }

  await navigator?.clipboard?.write([new ClipboardItem(result)]);
}

export async function paste(): Promise<ClipboardData> {
  const result: ClipboardData = {
    [HTML_FORMAT]: '',
    [PLAIN_FORMAT]: '',
    [CUSTOM_FORMAT]: null,
    [IMAGE_FORMAT]: null,
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
    if (item.types.includes(IMAGE_FORMAT)) {
      const buf = await item.getType(IMAGE_FORMAT);
      result[IMAGE_FORMAT] = buf;
    }
  }

  result[CUSTOM_FORMAT] =
    result[CUSTOM_FORMAT] || extractCustomData(result[HTML_FORMAT]);
  return result;
}

export function generateHTML(
  style: string,
  content: string,
  customData: string = '',
): string {
  const result = `
<html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="ProgId" content="Excel.Sheet" />
    <meta name="Generator" content="Microsoft Excel 15" />
    <style>${style}</style>
  </head>
    <body>
      <table>${customData}${content}</table>
    </body>
  </html>`;

  return result.replaceAll('\n', '')
}

export function formatCustomData(customData: string) {
  return customData ? `${CUSTOM_START_FLAG}${customData}${CUSTOM_END_FLAG}` : ''
}
export function extractCustomData(html: string): CustomClipboardData | null {
  const start = html.indexOf(CUSTOM_START_FLAG);
  const end = html.indexOf(CUSTOM_END_FLAG);
  if (start >= 0 && end >= 0) {
    const t = html.slice(start + CUSTOM_START_FLAG.length, end).trim();
    if (!t || t[0] !== '{' || t[t.length - 1] !== '}') {
      return null
    }
    try {
      return JSON.parse(t)
    } catch (error) {
      console.log(error)
      return null
    }
  }
  return null
}

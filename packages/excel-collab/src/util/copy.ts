import DOMPurify from 'dompurify';
import type { ClipboardData, CustomClipboardData } from '../types';

export const PLAIN_FORMAT = 'text/plain';
export const HTML_FORMAT = 'text/html';
export const CUSTOM_FORMAT = 'custom/model';
export const IMAGE_FORMAT = 'image/png';

const CUSTOM_START_FLAG = '<caption>';
const CUSTOM_END_FLAG = '</caption>';
const CLIPBOARD_HTML_CONFIG = {
  ALLOWED_TAGS: [
    'a',
    'b',
    'br',
    'caption',
    'col',
    'colgroup',
    'div',
    'em',
    'i',
    'p',
    's',
    'span',
    'strong',
    'table',
    'tbody',
    'td',
    'tfoot',
    'th',
    'thead',
    'tr',
    'u',
  ],
  ALLOWED_ATTR: [
    'align',
    'border',
    'cellpadding',
    'cellspacing',
    'class',
    'colspan',
    'height',
    'href',
    'rowspan',
    'scope',
    'style',
    'valign',
    'width',
  ],
  ALLOW_DATA_ATTR: false,
};

function select(element: HTMLTextAreaElement) {
  const isReadOnly = element.hasAttribute('readonly');
  if (!isReadOnly) {
    element.setAttribute('readonly', '');
  }
  element.select();
  element.setSelectionRange(0, element.value.length);

  if (!isReadOnly) {
    element.removeAttribute('readonly');
  }
  return element.value;
}

function createFakeElement(value: string) {
  const isRTL = document.documentElement.getAttribute('dir') === 'rtl';
  const fakeElement = document.createElement('textarea');
  // Prevent zooming on iOS
  fakeElement.style.fontSize = '12pt';
  // Reset box model
  fakeElement.style.border = '0';
  fakeElement.style.padding = '0';
  fakeElement.style.margin = '0';
  // Move element out of screen horizontally
  fakeElement.style.position = 'absolute';
  fakeElement.style[isRTL ? 'right' : 'left'] = '-9999px';
  // Move element to the same position vertically
  const yPosition = window.pageYOffset || document.documentElement.scrollTop;
  fakeElement.style.top = `${yPosition}px`;

  fakeElement.setAttribute('readonly', '');
  fakeElement.value = value;

  return fakeElement;
}

function defaultCopy(value: string) {
  const activeElement = document.activeElement;
  const selection = document.getSelection();
  const ranges = selection
    ? Array.from({ length: selection.rangeCount }, (_, index) =>
        selection.getRangeAt(index).cloneRange(),
      )
    : [];
  const fakeElement = createFakeElement(value);
  document.body.appendChild(fakeElement);
  try {
    select(fakeElement);
    // Cutting worksheet cells is handled by the controller, not this readonly textarea.
    if (typeof document.execCommand !== 'function' || !document.execCommand('copy')) {
      throw new Error('Clipboard copying failed');
    }
  } finally {
    fakeElement.remove();
    if (activeElement instanceof HTMLElement) activeElement.focus({ preventScroll: true });
    if (selection) {
      selection.removeAllRanges();
      ranges.forEach((range) => selection.addRange(range));
    }
  }
}

async function copy(textData: ClipboardData) {
  if (!navigator.clipboard?.write) {
    throw new Error('Clipboard writing is unavailable');
  }
  const text = new Blob([textData[PLAIN_FORMAT]], { type: PLAIN_FORMAT });
  const html = new Blob([textData[HTML_FORMAT]], { type: HTML_FORMAT });
  const result: Record<string, Blob> = {
    [PLAIN_FORMAT]: text,
    [HTML_FORMAT]: html,
  };
  if (textData[IMAGE_FORMAT]) {
    result[IMAGE_FORMAT] = textData[IMAGE_FORMAT];
  }
  await navigator.clipboard.write([new ClipboardItem(result)]);
}

/**
 * Writes clipboard data for either operation; the controller handles removing cut cells.
 * Falls back to plain text and logs clipboard write failures.
 */
export async function copyOrCut(textData: ClipboardData): Promise<void> {
  try {
    await copy(textData);
    return;
  } catch (error) {
    console.log(error);
  }
  try {
    defaultCopy(textData[PLAIN_FORMAT]);
  } catch (error) {
    console.log(error);
  }
}

async function pasteRichText() {
  const result: ClipboardData = {
    [HTML_FORMAT]: '',
    [PLAIN_FORMAT]: '',
    [CUSTOM_FORMAT]: null,
    [IMAGE_FORMAT]: null,
  };
  const list = (await navigator?.clipboard?.read()) || [];
  for (const item of list) {
    for (const type of [PLAIN_FORMAT, HTML_FORMAT, IMAGE_FORMAT] as const) {
      if (!item.types.includes(type)) continue;
      try {
        const buf = await item.getType(type);
        if (type === IMAGE_FORMAT) {
          result[type] = buf;
        } else {
          result[type] = await buf.text();
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  result[CUSTOM_FORMAT] = extractCustomData(result[HTML_FORMAT]);
  return result;
}

export async function paste(): Promise<ClipboardData> {
  let result: ClipboardData = {
    [HTML_FORMAT]: '',
    [PLAIN_FORMAT]: '',
    [CUSTOM_FORMAT]: null,
    [IMAGE_FORMAT]: null,
  };
  try {
    result = await pasteRichText();
  } catch (error) {
    console.log(error);
  }
  if (!result[HTML_FORMAT] && !result[PLAIN_FORMAT] && !result[IMAGE_FORMAT]) {
    try {
      result[PLAIN_FORMAT] = (await navigator.clipboard?.readText?.()) || '';
    } catch (error) {
      console.log(error);
    }
  }
  return result;
}

/**
 * Sanitizes clipboard markup and embeds CSS as text, not HTML.
 * CSS rules are preserved; this does not sanitize the stylesheet itself.
 */
export function generateHTML(style: string, content: string, customData: string = ''): string {
  const safeTable = DOMPurify.sanitize(`<table>${customData}${content}</table>`, {
    ...CLIPBOARD_HTML_CONFIG,
    RETURN_DOM_FRAGMENT: true,
  });
  const htmlDocument = new DOMParser().parseFromString(
    `
<html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="ProgId" content="Excel.Sheet" />
    <meta name="Generator" content="Microsoft Excel 15" />
  </head>
  <body></body>
</html>`,
    HTML_FORMAT,
  );
  const styleElement = htmlDocument.createElement('style');
  // Style text is serialized verbatim, so escape HTML delimiters before serialization.
  styleElement.textContent = style.replaceAll('<', '\\3c ');
  htmlDocument.head.appendChild(styleElement);
  htmlDocument.body.appendChild(safeTable);

  return htmlDocument.documentElement.outerHTML;
}

export function formatCustomData(customData: string) {
  const element = document.createElement('span');
  element.textContent = customData;
  return customData ? `${CUSTOM_START_FLAG}${element.innerHTML}${CUSTOM_END_FLAG}` : '';
}
export function extractCustomData(html: string): CustomClipboardData | null {
  const start = html.indexOf(CUSTOM_START_FLAG);
  const end = html.indexOf(CUSTOM_END_FLAG);
  if (start < 0 || end < 0 || end <= start) return null;

  const captionHtml = html.slice(start, end + CUSTOM_END_FLAG.length);
  const fragment = DOMPurify.sanitize(`<table>${captionHtml}</table>`, {
    ALLOWED_TAGS: ['caption', 'table'],
    ALLOWED_ATTR: [],
    RETURN_DOM_FRAGMENT: true,
  });
  const caption = fragment.querySelector('caption');
  if (!caption) return null;
  const text = caption.textContent?.trim() || '';
  if (!text || text[0] !== '{' || text[text.length - 1] !== '}') return null;
  return parseCustomData(text);
}

export function parseCustomData(text: string): CustomClipboardData | null {
  try {
    const data: Partial<CustomClipboardData> | null = JSON.parse(text);
    if (!data || (data.type !== 'copy' && data.type !== 'cut')) return null;
    const range = data.range;
    if (
      !range ||
      typeof range.sheetId !== 'string' ||
      ![range.row, range.col, range.rowCount, range.colCount].every(
        (value) => Number.isSafeInteger(value) && value >= 0,
      ) ||
      (data.floatElementUuid !== undefined && typeof data.floatElementUuid !== 'string') ||
      (data.clipboardId !== undefined && typeof data.clipboardId !== 'string')
    ) {
      return null;
    }
    return data as CustomClipboardData;
  } catch {
    return null;
  }
}

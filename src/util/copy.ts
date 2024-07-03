import type { ClipboardType, ClipboardData } from '@/types';

export const PLAIN_FORMAT = 'text/plain';
export const HTML_FORMAT = 'text/html';

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

function writeDataToClipboard(textData: ClipboardData) {
  if (typeof ClipboardItem !== 'function') {
    return;
  }
  const result: Record<string, Blob> = {};
  const keyList = Object.keys(textData) as ClipboardType[];
  for (const key of keyList) {
    result[key] = new Blob([textData[key]], { type: key });
  }
  const data = [new ClipboardItem(result)];
  return navigator?.clipboard?.write(data);
}

async function readDataFromClipboard(): Promise<ClipboardData> {
  const result: ClipboardData = {
    [HTML_FORMAT]: '',
    [PLAIN_FORMAT]: '',
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
  }
  return result;
}

export const fakeCopyAction = (
  value: string,
  container: HTMLElement,
  type: 'copy' | 'cut',
) => {
  let fakeElement: HTMLTextAreaElement | undefined = createFakeElement(value);
  container.appendChild(fakeElement);
  const selectedText = select(fakeElement);
  if (typeof document.execCommand === 'function') {
    document.execCommand(type);
  }
  fakeElement.remove();
  fakeElement = undefined;
  return selectedText;
};

export async function copyOrCut(
  textData: ClipboardData,
  type: 'cut' | 'copy',
): Promise<string> {
  try {
    await writeDataToClipboard(textData);
    return textData[PLAIN_FORMAT];
  } catch (error) {
    console.error(error);
    return fakeCopyAction(textData[PLAIN_FORMAT], document.body, type);
  }
}

export async function paste(): Promise<ClipboardData> {
  try {
    return readDataFromClipboard();
  } catch (error) {
    console.error(error);
    const result = (await navigator?.clipboard?.readText()) || '';
    return {
      [HTML_FORMAT]: '',
      [PLAIN_FORMAT]: result,
    };
  }
}

export function generateHTML(style: string, content: string): string {
  return `<html
  xmlns:v="urn:schemas-microsoft-com:vml"
  xmlns:o="urn:schemas-microsoft-com:office:office"
  xmlns:x="urn:schemas-microsoft-com:office:excel"
  xmlns="http://www.w3.org/TR/REC-html40">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="ProgId" content="Excel.Sheet" />
    <meta name="Generator" content="Microsoft Excel 15" />
    <style>
      ${style}
    </style>
  </head>
  <body>
    <table>
      ${content}
    </table>
  </body>
</html>`;
}

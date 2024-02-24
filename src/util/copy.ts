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
      result[PLAIN_FORMAT] = await buf.text();
    }
    if (item.types.includes(HTML_FORMAT)) {
      const buf = await item.getType(HTML_FORMAT);
      result[HTML_FORMAT] = await buf.text();
    }
  }
  return result;
}

const fakeCopyAction = (
  value: string,
  container: HTMLElement,
  type: 'copy' | 'cut',
) => {
  const fakeElement = createFakeElement(value);
  container.appendChild(fakeElement);
  const selectedText = select(fakeElement);
  document.execCommand(type);
  fakeElement.remove();

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
  xmlns="http://www.w3.org/TR/REC-html40"
>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="ProgId" content="Excel.Sheet" />
    <meta name="Generator" content="Microsoft Excel 15" />
    <style>
       {
        mso-displayed-decimal-separator: '.';
        mso-displayed-thousand-separator: ',';
      }
      @page {
        margin: 0.75in 0.7in 0.75in 0.7in;
        mso-header-margin: 0.3in;
        mso-footer-margin: 0.3in;
      }
      .font5 {
        color: windowtext;
        font-size: 9pt;
        font-weight: 400;
        font-style: normal;
        text-decoration: none;
        font-family: 等线;
        mso-generic-font-family: auto;
        mso-font-charset: 134;
      }
      tr {
        mso-height-source: auto;
        mso-ruby-visibility: none;
      }
      col {
        mso-width-source: auto;
        mso-ruby-visibility: none;
      }
      br {
        mso-data-placement: same-cell;
      }
      td {
        padding-top: 1px;
        padding-right: 1px;
        padding-left: 1px;
        mso-ignore: padding;
        color: black;
        font-size: 11pt;
        font-weight: 400;
        font-style: normal;
        text-decoration: none;
        font-family: 等线;
        mso-generic-font-family: auto;
        mso-font-charset: 134;
        mso-number-format: General;
        text-align: general;
        vertical-align: middle;
        border: none;
        mso-background-source: auto;
        mso-pattern: auto;
        mso-protection: locked visible;
        white-space: nowrap;
        mso-rotate: 0;
      }
      ${style}
      ruby {
        ruby-align: left;
      }
      rt {
        color: windowtext;
        font-size: 9pt;
        font-weight: 400;
        font-style: normal;
        text-decoration: none;
        font-family: 等线;
        mso-generic-font-family: auto;
        mso-font-charset: 134;
        mso-char-type: none;
        display: none;
      }
    </style>
  </head>

  <body link="#0563C1" vlink="#954F72">
    <table
      border="0"
      cellpadding="0"
      cellspacing="0"
      width="103"
      style="border-collapse: collapse; width: 77pt"
    >
      <col
        width="103"
        style="mso-width-source: userset; mso-width-alt: 3515; width: 77pt"
      />
      ${content}
    </table>
  </body>
</html>`;
}

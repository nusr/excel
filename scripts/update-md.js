const fs = require('fs');
const path = require('path');

const FORMULA_DIR = path.join(
  __dirname,
  '../packages/excel-collab/src/formula/formula',
);
const PREFIX_TEXT = 'const formulas = ';
const FORMULA_TAG = '## Supported Formulas';

function getFormulas() {
  if (!fs.existsSync(FORMULA_DIR)) {
    console.error('not found formula directory:', FORMULA_DIR);
    return;
  }
  const fileList = fs.readdirSync(FORMULA_DIR);
  /** @type Record<string,string[]> */
  const formulaMap = {};

  for (const item of fileList) {
    const filePath = path.join(FORMULA_DIR, item);
    const text = fs.readFileSync(filePath, 'utf-8');
    let start = text.indexOf(PREFIX_TEXT);
    if (start <= 0) {
      continue;
    }
    while (start < text.length && text[start] !== '{') {
      start++;
    }
    const fileName = path.basename(item, path.extname(item)).toLowerCase();

    let end = start;
    while (end < text.length && text[end] !== '}') {
      end++;
    }
    const temp = text.slice(start + 1, end);
    const keyList = temp
      .trim()
      .split('\n')
      .map((item) => {
        const t = item.trim();
        if (t.startsWith('// ')) {
          return '';
        }
        const list = /[A-Z0-9]+/g.exec(t) || [];
        return list[0] || '';
      })
      .filter((v) => v);
    keyList.sort((a, b) => a.localeCompare(b));
    formulaMap[fileName] = keyList;
  }
  const keyList = Object.keys(formulaMap);
  keyList.sort((a, b) => a.localeCompare(b));
  const list = [];
  for (const key of keyList) {
    const t = key[0].toUpperCase() + key.slice(1);
    const v = formulaMap[key].map((item) => `- [x] ${item}`).join('\n');
    list.push(`### ${t}\n\n${v}`);
  }
  return list.join('\n\n');
}

/**
 *
 * @param {string} filePath
 * @param {string | undefined} content
 */
function updateFile(filePath, content) {
  if (!content) {
    console.error('no content to update:', filePath);
    return;
  }
  const oldText = fs.readFileSync(filePath, 'utf-8');
  const index = oldText.indexOf(FORMULA_TAG);
  const mdText = `${oldText.slice(
    0,
    index + FORMULA_TAG.length,
  )}\n\n${content}\n`;
  fs.writeFileSync(filePath, mdText);
}
function init() {
  const content = getFormulas();
  updateFile(path.join(process.cwd(), 'README.md'), content);
  updateFile(path.join(process.cwd(), 'README_zh.md'), content);
}

init();

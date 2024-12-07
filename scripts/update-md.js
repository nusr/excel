const fs = require('fs');
const path = require('path');

const FORMULA_DIR = path.join(process.cwd(), './packages/formula/src/formula');
const PREFIX_TEXT = 'const formulas:';
const FORMULA_TAG = '## Supported Formulas';
const MD_PATH = path.join(process.cwd(), 'README.md');
const ENCODE = 'utf-8';

function updateFormula() {
  if (!fs.existsSync(FORMULA_DIR)) {
    return;
  }
  const fileList = fs.readdirSync(FORMULA_DIR);
  /** @type Record<string,string[]> */
  const formulaMap = {};

  for (const item of fileList) {
    const filePath = path.join(FORMULA_DIR, item);
    const result = fs.lstatSync(filePath);
    if (result.isDirectory()) {
      continue;
    }
    const text = fs.readFileSync(filePath, ENCODE);
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
        const list = /[A-Z0-9]+/g.exec(item.trim()) || [];
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
  const oldText = fs.readFileSync(MD_PATH, ENCODE);
  const index = oldText.indexOf(FORMULA_TAG);
  const mdText = `${oldText.slice(
    0,
    index + FORMULA_TAG.length,
  )}\n\n${list.join('\n\n')}\n`;
  fs.writeFileSync(MD_PATH, mdText);
}

updateFormula();

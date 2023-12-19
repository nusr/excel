import * as fs from 'fs';
import * as path from 'path';

const FORMULA_DIR = path.join(process.cwd(), 'dist/src/formula/formula');
const PREFIX_TEXT = 'const formulas = {';
const END_TEXT = '}';
const FORMULA_TAG = '### Supported Formulas';
const MD_PATH = path.join(process.cwd(), 'README.md');
const ENCODE = 'utf-8';

function updateMarkdown() {
  if (!fs.existsSync(FORMULA_DIR)) {
    return;
  }
  const list = fs.readdirSync(FORMULA_DIR);
  let formulaNames: string[] = [];

  for (const item of list) {
    const filePath = path.join(FORMULA_DIR, item);
    const result = fs.lstatSync(filePath);
    if (!result.isDirectory()) {
      const text = fs.readFileSync(filePath, ENCODE);
      const start = text.indexOf(PREFIX_TEXT);
      if (start <= 0) {
        continue;
      }
      let end = start;
      while (end < text.length && text[end] !== END_TEXT) {
        end++;
      }
      const temp = text.slice(start + PREFIX_TEXT.length, end);
      const keyList = temp
        .trim()
        .split('\n')
        .map((item) => {
          const list = /[A-Z0-9]+/g.exec(item.trim());
          return list![0];
        })
        .filter((v) => v);
      formulaNames = formulaNames.concat(keyList);
    }
  }
  formulaNames = Array.from(new Set(formulaNames));
  formulaNames.sort((a, b) => a.localeCompare(b));
  const result = formulaNames.map((item) => `- [x] ${item}`).join('\n');
  const oldText = fs.readFileSync(MD_PATH, ENCODE);
  const index = oldText.indexOf(FORMULA_TAG);
  const mdText = `${oldText.slice(
    0,
    index + FORMULA_TAG.length,
  )}\n\n${result}\n`;
  fs.writeFileSync(MD_PATH, mdText);
}

updateMarkdown();

/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");
const path = require("path");
const assert = require("assert").strict;
const svgParser = require("svg-parser");
const cwd = process.cwd();
const ENCODING = "utf8";
const SVG_SYMBOL_TAG = "__SVG_SYMBOL_NODE__";
function parseSVGFile(text, fileName) {
  assert(text.length > 0);
  const data = svgParser.parse(text);
  const pathList = data.children[0].children.filter(
    (v) => v.tagName === "path"
  );
  assert(pathList && pathList.length > 0, "svg path length should not empty");
  return pathList
    .map((item) => {
      const { properties, tagName } = item;
      const temp = Object.entries(properties)
        .map((v) => `${v[0]}="${v[1]}"`)
        .join(" ");
      return `
    <symbol
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 1024 1024"
      id="icon-${fileName}"
    >
      <${tagName} ${temp}></${tagName}>
    </symbol>`;
    })
    .join("");
}

let isOutput = false;

async function handleSVGFiles() {
  const dir = path.join(cwd, "icons");
  const files = fs.readdirSync(dir);
  const svgList = [];
  const fileNameList = [];
  for (const item of files) {
    const [fileName] = item.split(".");
    const filePath = path.join(dir, item);
    const text = await fs.promises.readFile(filePath, ENCODING);
    svgList.push(parseSVGFile(text, fileName));
    fileNameList.push(fileName);
  }
  if (!isOutput) {
    isOutput = true;
    console.log(
      `export type BaseIconName = ${fileNameList
        .map((item) => `"${item}"`)
        .join(" | ")}`
    );
  }
  const svg = `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      style="position: absolute; width: 0; height: 0"
      id="${SVG_SYMBOL_TAG}"
    >
      ${svgList.join("\n\t\t\t\t")}
    </svg>`;
  const htmlPath = path.join(cwd, "dist", "index.html");
  const htmlStr = await fs.promises.readFile(htmlPath, ENCODING);
  const result = htmlStr.replace(`<!--${SVG_SYMBOL_TAG}-->`, svg);
  await fs.promises.writeFile(htmlPath, result, ENCODING);
}
module.exports = {
  handleSVGFiles,
};

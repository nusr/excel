/* 
MIT License

Copyright (c) 2020 Steve Xu

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
 
*/(function (global, factory) {
            typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
            typeof define === 'function' && define.amd ? define(['exports'], factory) :
              (global = global || self, factory(global.excel = {}));
       })(this, (function (exports) { 'use strict';
"use strict";
var __export__ = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
  var __publicField = (obj, key, value) => {
    __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
    return value;
  };

  // src/index.ts
  var src_exports = {};
  __export(src_exports, {
    initExcel: () => initExcel
  });

  // src/util/dpr.ts
  function dpr(data = window.devicePixelRatio) {
    return Math.max(Math.floor(data || 1), 1);
  }
  function npx(px) {
    return Math.floor(px * dpr());
  }
  function thinLineWidth() {
    return 1;
  }
  function isMac() {
    return navigator.userAgent.indexOf("Mac OS X") > -1;
  }

  // src/util/style.ts
  var DEFAULT_FONT_SIZE = 11;
  var DEFAULT_FONT_COLOR = "#333333";
  var ERROR_FORMULA_COLOR = "#ff0000";
  var MUST_FONT_FAMILY = "sans-serif";
  var FONT_SIZE_LIST = [
    6,
    8,
    9,
    10,
    DEFAULT_FONT_SIZE,
    12,
    14,
    16,
    18,
    20,
    22,
    24,
    26,
    28,
    36,
    48,
    72
  ];
  function makeFont(fontStyle = "normal", fontWeight = "normal", fontSize = 12, fontFamily = "") {
    const temp = `${fontStyle} ${fontWeight} ${fontSize}px `;
    if (!fontFamily) {
      return temp + MUST_FONT_FAMILY;
    }
    return `${temp}${fontFamily},${MUST_FONT_FAMILY}`;
  }
  var DEFAULT_FONT_CONFIG = makeFont(
    void 0,
    "500",
    npx(DEFAULT_FONT_SIZE)
  );
  function convertCanvasStyleToString(style) {
    let result = "";
    if (style.fontColor) {
      result += `color:${style.fontColor};`;
    }
    if (style.fillColor) {
      result += `background-color:${style.fillColor};`;
    }
    if (style.fontSize) {
      result += `font-size:${style.fontSize}pt;`;
    }
    if (style.fontFamily) {
      result += `font-family:${style.fontFamily};`;
    }
    if (style.isItalic) {
      result += `font-style:italic;`;
    }
    if (style.isBold) {
      result += `font-weight:700;`;
    }
    if (style.isWrapText) {
      result += `white-space:normal;`;
    }
    if (style.underline) {
      result += "text-decoration:underline;";
      if (style.underline === 2 /* DOUBLE */) {
        result += "text-decoration-style: double;";
      } else {
        result += "text-decoration-style: single;";
      }
    }
    return result;
  }
  function convertCSSStyleToCanvasStyle(style, selectorCSSText) {
    const {
      color: color2,
      backgroundColor,
      fontSize,
      fontFamily,
      fontStyle,
      fontWeight,
      whiteSpace,
      textDecoration
    } = style;
    const result = {};
    if (color2) {
      result.fontColor = color2;
    }
    if (backgroundColor) {
      result.fillColor = backgroundColor;
    }
    if (fontSize) {
      const size2 = parseInt(fontSize, 10);
      if (!isNaN(size2)) {
        result.fontSize = size2;
      }
    }
    if (fontFamily) {
      result.fontFamily = fontFamily;
    }
    if (fontStyle === "italic") {
      result.isItalic = true;
    }
    if (fontWeight && ["700", "800", "900", "bold"].includes(fontWeight)) {
      result.isBold = true;
    }
    if (whiteSpace && [
      "normal",
      "pre-wrap",
      "pre-line",
      "break-spaces",
      "revert",
      "unset"
    ].includes(whiteSpace)) {
      result.isWrapText = true;
    }
    if (textDecoration === "underline") {
      result.underline = 1 /* SINGLE */;
      if (selectorCSSText.includes("text-underline-style:double")) {
        result.underline = 2 /* DOUBLE */;
      }
    }
    return result;
  }
  function parseStyle(styleList, selector) {
    for (const item of styleList) {
      if (!item.sheet?.cssRules) {
        continue;
      }
      const cssText = item.textContent || "";
      for (const rule of item.sheet?.cssRules) {
        if (rule instanceof CSSStyleRule && rule.selectorText === selector) {
          const startIndex = cssText.indexOf(selector);
          let endIndex = startIndex;
          while (cssText[endIndex] !== "}" && endIndex < cssText.length) {
            endIndex++;
          }
          let plainText = "";
          if (startIndex >= 0) {
            plainText = cssText.slice(startIndex + selector.length, endIndex).replace(/\s/g, "");
          }
          return convertCSSStyleToCanvasStyle(rule.style, plainText);
        }
      }
    }
    return {};
  }

  // src/util/assert.ts
  function assert(condition, message = "assert error", env = "production") {
    if (!condition) {
      if (env === "production") {
        console.error(message);
        return;
      }
      throw new Error(message);
    }
  }

  // src/util/constant.ts
  var SHEET_NAME_PREFIX = "Sheet";
  var DEFAULT_ROW_COUNT = 200;
  var DEFAULT_COL_COUNT = 30;
  var SCROLL_SIZE = 30;
  var BOTTOM_BUFF = 200;
  var DEBUG_COLOR_LIST = [
    "#0000CC",
    "#0000FF",
    "#0033CC",
    "#0033FF",
    "#0066CC",
    "#0066FF",
    "#0099CC",
    "#0099FF",
    "#00CC00",
    "#00CC33",
    "#00CC66",
    "#00CC99",
    "#00CCCC",
    "#00CCFF",
    "#3300CC",
    "#3300FF",
    "#3333CC",
    "#3333FF",
    "#3366CC",
    "#3366FF",
    "#3399CC",
    "#3399FF",
    "#33CC00",
    "#33CC33",
    "#33CC66",
    "#33CC99",
    "#33CCCC",
    "#33CCFF",
    "#6600CC",
    "#6600FF",
    "#6633CC",
    "#6633FF",
    "#66CC00",
    "#66CC33",
    "#9900CC",
    "#9900FF",
    "#9933CC",
    "#9933FF",
    "#99CC00",
    "#99CC33",
    "#CC0000",
    "#CC0033",
    "#CC0066",
    "#CC0099",
    "#CC00CC",
    "#CC00FF",
    "#CC3300",
    "#CC3333",
    "#CC3366",
    "#CC3399",
    "#CC33CC",
    "#CC33FF",
    "#CC6600",
    "#CC6633",
    "#CC9900",
    "#CC9933",
    "#CCCC00",
    "#CCCC33",
    "#FF0000",
    "#FF0033",
    "#FF0066",
    "#FF0099",
    "#FF00CC",
    "#FF00FF",
    "#FF3300",
    "#FF3333",
    "#FF3366",
    "#FF3399",
    "#FF33CC",
    "#FF33FF",
    "#FF6600",
    "#FF6633",
    "#FF9900",
    "#FF9933",
    "#FFCC00",
    "#FFCC33"
  ];
  var MAX_PARAMS_COUNT = 256;
  var ERROR_SET = /* @__PURE__ */ new Set([
    "#ERROR!",
    "#DIV/0!",
    "#NULL!",
    "#NUM!",
    "#REF!",
    "#VALUE!",
    "#N/A",
    "#NAME?"
  ]);
  var DEFAULT_STORE_VALUE = {
    sheetList: [],
    currentSheetId: "",
    isCellEditing: false,
    activeCell: {
      value: "",
      style: {},
      row: 0,
      col: 0
    },
    cellPosition: {
      left: -999,
      top: -999,
      width: 0,
      height: 0
    },
    fontFamilyList: [],
    contextMenuPosition: void 0,
    scrollLeft: 0,
    scrollTop: 0,
    headerSize: {
      width: 0,
      height: 0
    },
    scrollStatus: 0 /* NONE */,
    canRedo: false,
    canUndo: false
  };

  // src/util/util.ts
  function isNumber(value) {
    if (typeof value === "number" && !window.isNaN(value)) {
      return true;
    }
    if (typeof value !== "string") {
      return false;
    }
    const temp = parseFloat(value);
    return !window.isNaN(temp) && temp === Number(value);
  }
  function parseNumber(value) {
    if (isNumber(value)) {
      return Number(value);
    }
    return 0;
  }
  function parseNumberArray(list) {
    const result = [];
    for (let i = 0; i < list.length; i++) {
      const temp = parseNumber(list[i]);
      if (!window.isNaN(temp)) {
        result.push(temp);
      }
    }
    return result;
  }
  function getListMaxNum(list = [], prefix = "") {
    const idList = list.map((item) => {
      if (isNumber(item) || prefix.length === 0) {
        return parseInt(item, 10);
      }
      return parseInt(
        item.includes(prefix) ? item.slice(prefix.length) : item,
        10
      );
    }).filter((v) => !isNaN(v));
    return Math.max(Math.max(...idList), 0);
  }
  function getDefaultSheetInfo(list = []) {
    const sheetNum = getListMaxNum(
      list.map((item) => item.name),
      SHEET_NAME_PREFIX
    );
    const sheetId = getListMaxNum(list.map((item) => item.sheetId)) + 1;
    return {
      name: `${SHEET_NAME_PREFIX}${sheetNum + 1}`,
      sheetId: String(sheetId)
    };
  }
  function isTestEnv() {
    return false;
  }

  // src/util/convert.ts
  function columnNameToInt(columnName = "") {
    const temp = columnName.toUpperCase();
    let num = 0;
    for (let i = 0; i < temp.length; i++) {
      num = temp.charCodeAt(i) - 64 + num * 26;
    }
    return num - 1;
  }
  function intToColumnName(temp) {
    const num = temp + 1;
    let columnName = "";
    let dividend = Math.floor(Math.abs(num));
    let rest;
    while (dividend > 0) {
      rest = (dividend - 1) % 26;
      columnName = String.fromCharCode(65 + rest) + columnName;
      dividend = Math.floor((dividend - rest) / 26);
    }
    return columnName.toUpperCase();
  }
  function rowLabelToInt(label) {
    let result = parseInt(label, 10);
    if (window.isNaN(result)) {
      result = -1;
    } else {
      result = Math.max(result - 1, -1);
    }
    return result;
  }

  // src/util/classnames.ts
  function classnames(...rest) {
    let result = "";
    for (const temp of rest) {
      if (typeof temp === "string" && temp) {
        result += `${temp} `;
      }
      if (typeof temp === "object") {
        for (const key of Object.keys(temp)) {
          if (temp[key]) {
            result += `${key} `;
          }
        }
      }
    }
    return result.trim();
  }

  // src/util/range.ts
  function isSheet(range) {
    return isRow(range) && isCol(range);
  }
  function isRow(range) {
    return range.col === range.rowCount && range.rowCount === 0;
  }
  function isCol(range) {
    return range.row === range.colCount && range.colCount === 0;
  }
  function isSameRange(oldRange, newRange) {
    if (!oldRange || !newRange) {
      return false;
    }
    return oldRange.col === newRange.col && oldRange.row === newRange.row && oldRange.colCount === newRange.colCount && oldRange.rowCount === newRange.rowCount && oldRange.sheetId === newRange.sheetId;
  }
  var Range = class {
    row = 0;
    col = 0;
    colCount = 0;
    rowCount = 0;
    sheetId = "";
    constructor(row, col, rowCount, colCount, sheetId) {
      this.row = row;
      this.col = col;
      this.colCount = colCount;
      this.rowCount = rowCount;
      this.sheetId = sheetId;
    }
    isValid() {
      return this.row >= 0 && this.col >= 0 && this.colCount >= 0 && this.rowCount >= 0;
    }
    static makeRange(range) {
      return new Range(
        range.row,
        range.col,
        range.rowCount,
        range.colCount,
        range.sheetId
      );
    }
  };

  // src/util/reference.ts
  var isCharacter = (char) => char >= "a" && char <= "z" || char >= "A" && char <= "Z";
  var isNum = (char) => char >= "0" && char <= "9";
  function convertSheetNameToSheetId(value) {
    return value;
  }
  function parseCell(ref, convertSheetName = convertSheetNameToSheetId) {
    if (typeof ref !== "string" || !ref) {
      return null;
    }
    const realRef = ref.trim();
    let [sheetName, other = ""] = realRef.split("!");
    if (!realRef.includes("!")) {
      sheetName = "";
      other = realRef;
    }
    let i = 0;
    let rowText = "";
    let colText = "";
    if (other[i] === "$") {
      i++;
    }
    while (isCharacter(other[i])) {
      colText += other[i++];
    }
    if (other[i] === "$") {
      i++;
    }
    while (isNum(other[i])) {
      rowText += other[i++];
    }
    if (i !== other.length) {
      return null;
    }
    if (!rowText && !colText) {
      return null;
    }
    let rowCount = 1;
    let colCount = 1;
    let row = 0;
    let col = 0;
    if (rowText === "") {
      colCount = 0;
      rowCount = DEFAULT_ROW_COUNT;
    } else {
      row = rowLabelToInt(rowText);
    }
    if (colText === "") {
      colCount = DEFAULT_COL_COUNT;
      rowCount = 0;
    } else {
      col = columnNameToInt(colText);
    }
    if (row === -1 || col === -1) {
      return null;
    }
    const range = new Range(
      row,
      col,
      rowCount,
      colCount,
      convertSheetName(sheetName)
    );
    return range;
  }
  function mergeRange(start, end) {
    if (start.sheetId !== end.sheetId) {
      return null;
    }
    const rowCount = Math.abs(start.row - end.row) + 1;
    const colCount = Math.abs(start.col - end.col) + 1;
    const row = start.row < end.row ? start.row : end.row;
    const col = start.col < end.col ? start.col : end.col;
    return new Range(row, col, rowCount, colCount, start.sheetId);
  }

  // src/util/debug.ts
  var _Debug = class {
    namespace;
    constructor(namespace) {
      this.namespace = namespace;
    }
    init = () => {
      this.setColor();
      return this.log;
    };
    log = (...rest) => {
      if (!this.enable()) {
        return;
      }
      const { namespace } = this;
      const color2 = _Debug.colorMap.get(namespace);
      const result = [`%c ${namespace}:`, `color:${color2};`, ...rest];
      console.log(...result);
    };
    getRandomColor = () => {
      const index = Math.floor(Math.random() * DEBUG_COLOR_LIST.length);
      assert(index >= 0 && index < DEBUG_COLOR_LIST.length, String(index));
      return DEBUG_COLOR_LIST[index];
    };
    enable() {
      return this.checkEnable() && _Debug.enableMap.get(this.namespace) !== false;
    }
    checkEnable(storage = window.localStorage) {
      return storage.getItem("debug") === "*";
    }
    setColor() {
      if (!_Debug.colorMap.has(this.namespace)) {
        _Debug.colorMap.set(this.namespace, this.getRandomColor());
      }
    }
  };
  var Debug = _Debug;
  __publicField(Debug, "colorMap", /* @__PURE__ */ new Map());
  __publicField(Debug, "enableMap", /* @__PURE__ */ new Map([]));
  var reactLog = new Debug("react").init();
  var controllerLog = new Debug("controller").init();
  var canvasLog = new Debug("canvas").init();
  var modelLog = new Debug("model").init();

  // src/util/isSupportFontFamily.ts
  function SupportFontFamilyFactory(body = document.body) {
    const monoFont = "monospace";
    const serifFont = "serif";
    const container = document.createElement("span");
    container.innerHTML = "\u6D4B\u8BD5a11";
    container.style.cssText = [
      "position:absolute",
      "width:auto",
      "font-size:128px",
      "left:-99999px"
    ].join(" !important;");
    const getWidth = function(fontFamily) {
      container.style.fontFamily = fontFamily;
      body.appendChild(container);
      const width = container.clientWidth;
      body.removeChild(container);
      return width;
    };
    const monoWidth = getWidth(monoFont);
    const serifWidth = getWidth(serifFont);
    const sansWidth = getWidth(MUST_FONT_FAMILY);
    const isSupportFontFamily2 = function(fontFamily) {
      return monoWidth !== getWidth(`${fontFamily},${monoFont}`) || sansWidth !== getWidth(`${fontFamily},${MUST_FONT_FAMILY}`) || serifWidth !== getWidth(`${fontFamily},${serifFont}`);
    };
    return isSupportFontFamily2;
  }
  var isSupportFontFamily = SupportFontFamilyFactory();

  // src/util/copy.ts
  var PLAIN_FORMAT = "text/plain";
  var HTML_FORMAT = "text/html";
  function select(element) {
    const isReadOnly = element.hasAttribute("readonly");
    if (!isReadOnly) {
      element.setAttribute("readonly", "");
    }
    element.select();
    element.setSelectionRange(0, element.value.length);
    if (!isReadOnly) {
      element.removeAttribute("readonly");
    }
    return element.value;
  }
  function createFakeElement(value) {
    const isRTL = document.documentElement.getAttribute("dir") === "rtl";
    const fakeElement = document.createElement("textarea");
    fakeElement.style.fontSize = "12pt";
    fakeElement.style.border = "0";
    fakeElement.style.padding = "0";
    fakeElement.style.margin = "0";
    fakeElement.style.position = "absolute";
    fakeElement.style[isRTL ? "right" : "left"] = "-9999px";
    let yPosition = window.pageYOffset || document.documentElement.scrollTop;
    fakeElement.style.top = `${yPosition}px`;
    fakeElement.setAttribute("readonly", "");
    fakeElement.value = value;
    return fakeElement;
  }
  function writeDataToClipboard(textData) {
    const result = {};
    const keyList = Object.keys(textData);
    for (const key of keyList) {
      result[key] = new Blob([textData[key]], { type: key });
    }
    const data = [new ClipboardItem(result)];
    return navigator.clipboard.write(data);
  }
  async function readDataFromClipboard() {
    const result = {
      [HTML_FORMAT]: "",
      [PLAIN_FORMAT]: ""
    };
    const list = await navigator.clipboard.read();
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
  var fakeCopyAction = (value, container, type) => {
    const fakeElement = createFakeElement(value);
    container.appendChild(fakeElement);
    const selectedText = select(fakeElement);
    document.execCommand(type);
    fakeElement.remove();
    return selectedText;
  };
  async function copy(textData) {
    try {
      await writeDataToClipboard(textData);
      return textData[PLAIN_FORMAT];
    } catch (error) {
      console.error(error);
      return fakeCopyAction(textData[PLAIN_FORMAT], document.body, "copy");
    }
  }
  async function cut(textData) {
    try {
      await writeDataToClipboard(textData);
      return textData[PLAIN_FORMAT];
    } catch (error) {
      console.error(error);
      return fakeCopyAction(textData[PLAIN_FORMAT], document.body, "cut");
    }
  }
  async function paste() {
    try {
      return readDataFromClipboard();
    } catch (error) {
      console.error(error);
      const result = await navigator.clipboard.readText();
      return {
        [HTML_FORMAT]: "",
        [PLAIN_FORMAT]: result
      };
    }
  }
  function generateHTML(style, content) {
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
        font-family: \u7B49\u7EBF;
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
        font-family: \u7B49\u7EBF;
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
        font-family: \u7B49\u7EBF;
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

  // src/util/lodash.ts
  function debounce(fn) {
    let timer;
    return (...rest) => {
      cancelAnimationFrame(timer);
      timer = requestAnimationFrame(() => {
        fn(...rest);
      });
    };
  }
  function get(obj, path, defaultValue) {
    const result = obj == null ? void 0 : path.replace(/\[/g, ".").replace(/\]/g, "").split(".").reduce((res, key) => {
      return res == null ? res : res[key];
    }, obj);
    return result === void 0 ? defaultValue : result;
  }
  function isEmpty(value) {
    const temp = value || {};
    return [Object, Array].includes(temp.constructor) && !Object.entries(temp).length;
  }
  function setWith(obj, path, value) {
    if (obj == null || typeof obj !== "object") {
      return obj;
    }
    path.replace(/\[/g, ".").replace(/\]/g, "").split(".").reduce((res, key, index, arr) => {
      if (index === arr.length - 1) {
        res[key] = value;
      } else {
        if (res[key] == null) {
          res[key] = {};
        }
      }
      return res[key];
    }, obj);
    return obj;
  }

  // src/util/theme/size.ts
  var size = {
    smallFont: "10px",
    font: "12px",
    largeFont: "14px",
    padding: "12px",
    lineHeight: "1.5",
    mediumPadding: "8px",
    borderRadius: "4px",
    tinyPadding: "4px"
  };
  var size_default = size;

  // src/util/theme/color.ts
  var color = {
    primaryColor: "#217346",
    buttonActiveColor: "rgb(198,198,198)",
    selectionColor: "rgba(198,198,198,0.3)",
    backgroundColor: "#e6e6e6",
    white: "#ffffff",
    black: "#000000",
    gridStrokeColor: "#d4d4d4",
    triangleFillColor: "#b4b4b4",
    contentColor: DEFAULT_FONT_COLOR,
    borderColor: "#cccccc",
    activeBorderColor: "#808080",
    disabledColor: "#ccc"
  };
  var color_default = color;

  // src/util/theme/index.ts
  var theme = {
    ...size_default,
    ...color_default
  };

  // src/util/font.ts
  var FONT_FAMILY_LIST = [
    "\u7B49\u7EBF",
    "\u7B49\u7EBF Light",
    "\u65B9\u6B63\u8212\u4F53",
    "\u65B9\u6B63\u59DA\u4F53",
    "\u4EFF\u5B8B",
    "\u9ED1\u4F53",
    "\u534E\u6587\u5F69\u4E91",
    "\u534E\u6587\u4EFF\u5B8B",
    "\u534E\u6587\u7425\u73C0",
    "\u534E\u6587\u6977\u4F53",
    "\u534E\u6587\u96B6\u4E66",
    "\u534E\u6587\u5B8B\u4F53",
    "\u534E\u6587\u7EC6\u9ED1",
    "\u534E\u6587\u65B0\u9B4F",
    "\u534E\u6587\u884C\u6977",
    "\u534E\u6587\u4E2D\u5B8B",
    "\u6977\u4F53",
    "\u96B6\u4E66",
    "\u5B8B\u4F53",
    "\u5FAE\u8F6F\u96C5\u9ED1",
    "\u5FAE\u8F6F\u96C5\u9ED1 Light",
    "\u65B0\u5B8B\u4F53",
    "\u5E7C\u5706",
    "Agency FB",
    "Algerian",
    "Arial",
    "Arial Narrow",
    "Bahnschrift",
    "Bahnschrift Condensed",
    "Bahnschrift Light",
    "Bahnschrift SemiBold",
    "Bahnschrift SemiCondensed",
    "Baskerville Old Face",
    "Bauhaus 93",
    "Bell MT",
    "Berlin Sans FB",
    "Book Antiqua",
    "Bookman Old Style",
    "Bookshelf Symbol 7",
    "Calibri",
    "Calibri Light",
    "Californian FB",
    "Calisto MT",
    "Cambria",
    "Cambria Math",
    "Candara",
    "Candara Light",
    "Cascadia Code",
    "Cascadia Code",
    "Cascadia Code ExtraLight",
    "Cascadia Code ExtraLight",
    "Cascadia Code Light",
    "Cascadia Code Light",
    "Cascadia Code PL",
    "Cascadia Code PL ExtraLight",
    "Cascadia Code PL Light",
    "Cascadia Code PL SemiBold",
    "Cascadia Code SemiBold",
    "Cascadia Code SemiBold",
    "Cascadia Mono",
    "Cascadia Mono",
    "Cascadia Mono ExtraLight",
    "Cascadia Mono ExtraLight",
    "Cascadia Mono Light",
    "Cascadia Mono Light",
    "Cascadia Mono PL",
    "Cascadia Mono PL ExtraLight",
    "Cascadia Mono PL Light",
    "Cascadia Mono PL SemiBold",
    "Cascadia Mono SemiBold",
    "Cascadia Mono SemiBold",
    "Castellar",
    "Centaur",
    "Century",
    "Century Gothic",
    "Century Schoolbook",
    "Colonna MT",
    "Comic Sans MS",
    "Consolas",
    "Constantia",
    "Cooper Black",
    "Copperplate Gothic Light",
    "Corbel",
    "Corbel Light",
    "Courier New",
    "Dubai Light",
    "Dubai Medium",
    "Dubai Regular",
    "Ebrima",
    "Elephant",
    "Engravers MT",
    "Felix Titling",
    "Footlight MT Light",
    "Franklin Gothic Book",
    "Franklin Gothic Heavy",
    "Franklin Gothic Medium",
    "Leelawadee UI",
    "Lucida Bright",
    "Lucida Bright Demibold",
    "Lucida Console",
    "Lucida Fax",
    "Lucida Sans",
    "Lucida Sans Typewriter",
    "Lucida Sans Unicode",
    "Maiandra GD",
    "Malgun Gothic",
    "Microsoft JhengHei",
    "Microsoft JhengHei Light",
    "Microsoft JhengHei UI",
    "Microsoft JhengHei UI Light",
    "Microsoft New Tai Lue",
    "Microsoft PhagsPa",
    "Microsoft Sans Serif",
    "Microsoft Tai Le",
    "Microsoft Yahei UI",
    "Microsoft YaHei UI Light",
    "Microsoft Yi Baiti",
    "Modern No. 20",
    "Mongolian Baiti",
    "MS Gothic",
    "MS PGothic",
    "MS Reference Sans Serif",
    "MS UI Gothic",
    "Rockwell",
    "Rockwell Condensed",
    "Segoe Print",
    "Segoe Script",
    "Segoe UI",
    "Segoe UI Black",
    "Segoe UI Emoji",
    "Segoe UI Historic",
    "Segoe UI Light",
    "Segoe UI Semibold",
    "Segoe UI Symbol",
    "Segoe UI Variable Display",
    "Segoe UI Variable Display Light",
    "Segoe UI Variable Display Semibold",
    "Segoe UI Variable Small",
    "Segoe UI Variable Small Light",
    "Segoe UI Variable Small Semibold",
    "Segoe UI Variable Text",
    "Segoe UI Variable Text Light",
    "Segoe UI Variable Text Semibold",
    "SimSun-ExtB",
    "Sitka Banner",
    "Sitka Banner Semibold",
    "Sitka Display",
    "Sitka Display Semibold",
    "Sitka Heading",
    "Sitka Heading Semibold",
    "Sitka Small",
    "Sitka Small Semibold",
    "Sitka Subheading",
    "Sitka Subheading Semibold",
    "Sitka Text",
    "Sitka Text Semibold",
    "Times New Roman",
    "Trebuchet MS",
    "Verdana",
    "Wide Latin",
    "Wingdings 2",
    "Wingdings 3",
    "Yu Gothic Light",
    "Yu Gothic Medium",
    "Yu Gothic Regular",
    "Yu Gothic UI Light",
    "Yu Gothic UI Regular",
    "Yu Gothic UI Semibold"
  ];

  // src/react/dom.ts
  function createElement(tagName, options) {
    reactLog("createElement");
    return document.createElement(tagName, options);
  }
  function createElementNS(namespaceURI, qualifiedName, options) {
    reactLog("createElementNS");
    return document.createElementNS(namespaceURI, qualifiedName, options);
  }
  function createTextNode(text) {
    reactLog("createTextNode");
    return document.createTextNode(text);
  }
  function insertBefore(parentNode2, newNode, referenceNode) {
    parentNode2.insertBefore(newNode, referenceNode);
  }
  function removeChild(node, child) {
    node.removeChild(child);
  }
  function appendChild(node, child) {
    node.appendChild(child);
  }
  function parentNode(node) {
    return node.parentNode;
  }
  function nextSibling(node) {
    return node.nextSibling;
  }
  function setTextContent(node, text) {
    node.textContent = text;
  }
  function isElement(node) {
    return node.nodeType === 1;
  }
  var htmlDomApi = {
    createElement,
    createElementNS,
    createTextNode,
    insertBefore,
    removeChild,
    appendChild,
    parentNode,
    nextSibling,
    setTextContent,
    isElement
  };

  // src/react/h.ts
  var SVG_NS = "http://www.w3.org/2000/svg";
  function addNs(node) {
    node.data.ns = SVG_NS;
    if (node.data?.props) {
      node.data.attrs = Object.assign(
        node.data.props || {},
        node.data?.attrs || {}
      );
      node.data.props = void 0;
    } else {
      node.data.attrs = {};
    }
    node.data.attrs.class = node.data.className || "";
    node.data.className = void 0;
    if (node.children) {
      for (const item of node.children) {
        if (item) {
          addNs(item);
        }
      }
    }
  }
  function h(sel, data, ...children) {
    const key = data.key === void 0 ? void 0 : data.key;
    const nodeData = {
      hook: data.hook,
      style: data.style,
      key: data.key,
      className: data.className
    };
    const nodeList = [];
    const textList = [];
    const list = children || [];
    for (const item of list) {
      if (typeof item === "string" || typeof item === "number") {
        const t = String(item);
        if (t) {
          textList.push(t);
        }
      } else if (item && typeof item === "object") {
        nodeList.push(item);
      }
    }
    const keyList = Object.keys(data);
    for (const key2 of keyList) {
      if (["className", "style", "key", "ns", "is"].includes(key2)) {
        continue;
      }
      const item = data[key2];
      if (key2 === "data-testId") {
        if (!nodeData.dataset) {
          nodeData.dataset = {};
        }
        nodeData.dataset[key2.slice(5)] = item;
      } else if (key2.startsWith("on")) {
        if (!nodeData.on) {
          nodeData.on = {};
        }
        nodeData.on[key2.slice(2)] = item;
      } else {
        if (!nodeData.props) {
          nodeData.props = {};
        }
        nodeData.props[key2] = item;
      }
    }
    const result = {
      sel,
      data: nodeData,
      key,
      elm: void 0,
      children: [],
      text: void 0
    };
    if (textList.length > 0 && nodeList.length > 0) {
      throw new Error("error node");
    }
    if (textList.length > 0) {
      result.text = textList.join(" ");
    }
    if (nodeList.length > 0) {
      result.children = nodeList;
    }
    if (result.sel === "svg") {
      addNs(result);
    }
    return result;
  }

  // src/react/init.ts
  function isUndef(s) {
    return s === void 0;
  }
  function isDef(s) {
    return s !== void 0;
  }
  var emptyNode = h("", {});
  function sameVNode(vNode1, vNode2) {
    const isSameKey = vNode1.key === vNode2.key;
    const isSameIs = vNode1.data?.is === vNode2.data?.is;
    const isSameSel = vNode1.sel === vNode2.sel;
    const isSameTextOrFragment = !vNode1.sel && vNode1.sel === vNode2.sel ? typeof vNode1.text === typeof vNode2.text : true;
    return isSameSel && isSameKey && isSameIs && isSameTextOrFragment;
  }
  function isElement2(api, vNode) {
    return api.isElement(vNode);
  }
  function createKeyToOldIdx(children, beginIdx, endIdx) {
    const map = {};
    for (let i = beginIdx; i <= endIdx; ++i) {
      const key = children[i]?.key;
      if (key !== void 0) {
        map[key] = i;
      }
    }
    return map;
  }
  var hooks = [
    "create",
    "update",
    "remove",
    "destroy",
    "pre",
    "post"
  ];
  function init(modules, domApi) {
    const cbs = {
      create: [],
      update: [],
      remove: [],
      destroy: [],
      pre: [],
      post: []
    };
    const api = domApi !== void 0 ? domApi : htmlDomApi;
    for (const hook of hooks) {
      for (const module of modules) {
        const currentHook = module[hook];
        if (currentHook !== void 0) {
          cbs[hook].push(currentHook);
        }
      }
    }
    function createRmCb(childElm, listeners) {
      return function rmCb() {
        if (--listeners === 0) {
          const parent = api.parentNode(childElm);
          api.removeChild(parent, childElm);
        }
      };
    }
    function createElm(vNode, insertedVNodeQueue) {
      let i;
      let data = vNode.data;
      if (data !== void 0) {
        const init2 = data.hook?.init;
        if (init2) {
          init2(vNode);
          data = vNode.data;
        }
      }
      const children = vNode.children;
      const sel = vNode.sel;
      if (sel !== void 0) {
        const elm = vNode.elm = isDef(data) && isDef(i = data.ns) ? api.createElementNS(i, sel, data) : api.createElement(sel, data);
        for (i = 0; i < cbs.create.length; ++i)
          cbs.create[i](emptyNode, vNode);
        if (Array.isArray(children) && children.length > 0) {
          for (i = 0; i < children.length; ++i) {
            const ch = children[i];
            if (ch != null) {
              api.appendChild(elm, createElm(ch, insertedVNodeQueue));
            }
          }
        } else if (typeof vNode.text === "string" || typeof vNode.text === "number") {
          api.appendChild(elm, api.createTextNode(vNode.text));
        }
        const hook = vNode.data.hook;
        if (isDef(hook)) {
          hook.create?.(emptyNode, vNode);
          if (hook.insert) {
            insertedVNodeQueue.push(vNode);
          }
        }
      } else {
        vNode.elm = api.createTextNode(vNode.text);
      }
      return vNode.elm;
    }
    function addVNodes(parentElm, before, vNodes, startIdx, endIdx, insertedVNodeQueue) {
      for (; startIdx <= endIdx; ++startIdx) {
        const ch = vNodes[startIdx];
        if (ch != null) {
          api.insertBefore(parentElm, createElm(ch, insertedVNodeQueue), before);
        }
      }
    }
    function invokeDestroyHook(vNode) {
      const data = vNode.data;
      if (data !== void 0) {
        data?.hook?.destroy?.(vNode);
        for (let i = 0; i < cbs.destroy.length; ++i)
          cbs.destroy[i](vNode);
        if (vNode.children !== void 0) {
          for (let j = 0; j < vNode.children.length; ++j) {
            const child = vNode.children[j];
            if (child != null && typeof child !== "string") {
              invokeDestroyHook(child);
            }
          }
        }
      }
    }
    function removeVNodes(parentElm, vNodes, startIdx, endIdx) {
      for (; startIdx <= endIdx; ++startIdx) {
        let listeners;
        let rm;
        const ch = vNodes[startIdx];
        if (ch != null) {
          if (isDef(ch.sel)) {
            invokeDestroyHook(ch);
            listeners = cbs.remove.length + 1;
            rm = createRmCb(ch.elm, listeners);
            for (let i = 0; i < cbs.remove.length; ++i)
              cbs.remove[i](ch, rm);
            const removeHook = ch?.data?.hook?.remove;
            if (isDef(removeHook)) {
              removeHook(ch, rm);
            } else {
              rm();
            }
          } else if (ch.children) {
            invokeDestroyHook(ch);
            removeVNodes(
              parentElm,
              ch.children,
              0,
              ch.children.length - 1
            );
          } else {
            api.removeChild(parentElm, ch.elm);
          }
        }
      }
    }
    function updateChildren(parentElm, oldCh, newCh, insertedVNodeQueue) {
      let oldStartIdx = 0;
      let newStartIdx = 0;
      let oldEndIdx = oldCh.length - 1;
      let oldStartVNode = oldCh[0];
      let oldEndVNode = oldCh[oldEndIdx];
      let newEndIdx = newCh.length - 1;
      let newStartVNode = newCh[0];
      let newEndVNode = newCh[newEndIdx];
      let oldKeyToIdx;
      let idxInOld;
      let elmToMove;
      let before;
      while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
        if (oldStartVNode == null) {
          oldStartVNode = oldCh[++oldStartIdx];
        } else if (oldEndVNode == null) {
          oldEndVNode = oldCh[--oldEndIdx];
        } else if (newStartVNode == null) {
          newStartVNode = newCh[++newStartIdx];
        } else if (newEndVNode == null) {
          newEndVNode = newCh[--newEndIdx];
        } else if (sameVNode(oldStartVNode, newStartVNode)) {
          patchVNode(oldStartVNode, newStartVNode, insertedVNodeQueue);
          oldStartVNode = oldCh[++oldStartIdx];
          newStartVNode = newCh[++newStartIdx];
        } else if (sameVNode(oldEndVNode, newEndVNode)) {
          patchVNode(oldEndVNode, newEndVNode, insertedVNodeQueue);
          oldEndVNode = oldCh[--oldEndIdx];
          newEndVNode = newCh[--newEndIdx];
        } else if (sameVNode(oldStartVNode, newEndVNode)) {
          patchVNode(oldStartVNode, newEndVNode, insertedVNodeQueue);
          api.insertBefore(
            parentElm,
            oldStartVNode.elm,
            api.nextSibling(oldEndVNode.elm)
          );
          oldStartVNode = oldCh[++oldStartIdx];
          newEndVNode = newCh[--newEndIdx];
        } else if (sameVNode(oldEndVNode, newStartVNode)) {
          patchVNode(oldEndVNode, newStartVNode, insertedVNodeQueue);
          api.insertBefore(parentElm, oldEndVNode.elm, oldStartVNode.elm);
          oldEndVNode = oldCh[--oldEndIdx];
          newStartVNode = newCh[++newStartIdx];
        } else {
          if (oldKeyToIdx === void 0) {
            oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
          }
          idxInOld = oldKeyToIdx[newStartVNode.key];
          if (isUndef(idxInOld)) {
            api.insertBefore(
              parentElm,
              createElm(newStartVNode, insertedVNodeQueue),
              oldStartVNode.elm
            );
          } else {
            elmToMove = oldCh[idxInOld];
            if (elmToMove.sel !== newStartVNode.sel) {
              api.insertBefore(
                parentElm,
                createElm(newStartVNode, insertedVNodeQueue),
                oldStartVNode.elm
              );
            } else {
              patchVNode(elmToMove, newStartVNode, insertedVNodeQueue);
              oldCh[idxInOld] = void 0;
              api.insertBefore(parentElm, elmToMove.elm, oldStartVNode.elm);
            }
          }
          newStartVNode = newCh[++newStartIdx];
        }
      }
      if (newStartIdx <= newEndIdx) {
        before = newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].elm;
        addVNodes(
          parentElm,
          before,
          newCh,
          newStartIdx,
          newEndIdx,
          insertedVNodeQueue
        );
      }
      if (oldStartIdx <= oldEndIdx) {
        removeVNodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
      }
    }
    function patchVNode(oldVNode, vNode, insertedVNodeQueue) {
      const hook = vNode.data?.hook;
      hook?.prePatch?.(oldVNode, vNode);
      const elm = vNode.elm = oldVNode.elm;
      if (oldVNode === vNode)
        return;
      if (vNode.data !== void 0 || isDef(vNode.text) && vNode.text !== oldVNode.text) {
        vNode.data ??= {};
        oldVNode.data ??= {};
        for (let i = 0; i < cbs.update.length; ++i)
          cbs.update[i](oldVNode, vNode);
        vNode.data?.hook?.update?.(oldVNode, vNode);
      }
      const oldCh = oldVNode.children;
      const ch = vNode.children;
      if (isUndef(vNode.text)) {
        if (isDef(oldCh) && isDef(ch)) {
          if (oldCh !== ch)
            updateChildren(elm, oldCh, ch, insertedVNodeQueue);
        } else if (isDef(ch)) {
          if (isDef(oldVNode.text))
            api.setTextContent(elm, "");
          addVNodes(elm, null, ch, 0, ch.length - 1, insertedVNodeQueue);
        } else if (isDef(oldCh)) {
          removeVNodes(elm, oldCh, 0, oldCh.length - 1);
        } else if (isDef(oldVNode.text)) {
          api.setTextContent(elm, "");
        }
      } else if (oldVNode.text !== vNode.text) {
        if (isDef(oldCh)) {
          removeVNodes(elm, oldCh, 0, oldCh.length - 1);
        }
        api.setTextContent(elm, vNode.text);
      }
      hook?.postPatch?.(oldVNode, vNode);
      if (hook?.ref) {
        hook?.ref(vNode.elm);
      }
    }
    function patch2(oldVNode, vNode) {
      let i, elm, parent;
      const insertedVNodeQueue = [];
      for (i = 0; i < cbs.pre.length; ++i)
        cbs.pre[i]();
      if (isElement2(api, oldVNode)) {
        createElm(vNode, insertedVNodeQueue);
        api.appendChild(oldVNode, vNode.elm);
        return vNode;
      }
      if (sameVNode(oldVNode, vNode)) {
        patchVNode(oldVNode, vNode, insertedVNodeQueue);
      } else {
        elm = oldVNode.elm;
        parent = api.parentNode(elm);
        createElm(vNode, insertedVNodeQueue);
        if (parent !== null) {
          api.insertBefore(parent, vNode.elm, api.nextSibling(elm));
          removeVNodes(parent, [oldVNode], 0, 0);
        }
      }
      for (i = 0; i < insertedVNodeQueue.length; ++i) {
        insertedVNodeQueue[i].data.hook.insert(insertedVNodeQueue[i]);
      }
      for (i = 0; i < cbs.post.length; ++i)
        cbs.post[i]();
      return vNode;
    }
    return patch2;
  }

  // src/react/modules/attributes.ts
  var xLinkNS = "http://www.w3.org/1999/xlink";
  var xmlNS = "http://www.w3.org/XML/1998/namespace";
  var colonChar = 58;
  var xChar = 120;
  function updateAttrs(oldVNode, vNode) {
    let key;
    const elm = vNode.elm;
    let oldAttrs = oldVNode.data.attrs;
    let attrs = vNode.data.attrs;
    if (!oldAttrs && !attrs)
      return;
    if (oldAttrs === attrs)
      return;
    oldAttrs = oldAttrs || {};
    attrs = attrs || {};
    for (key in attrs) {
      const cur = attrs[key];
      const old = oldAttrs[key];
      if (old !== cur) {
        if (cur === true) {
          elm.setAttribute(key, "");
        } else if (cur === false) {
          elm.removeAttribute(key);
        } else {
          if (key.charCodeAt(0) !== xChar) {
            elm.setAttribute(key, cur);
          } else if (key.charCodeAt(3) === colonChar) {
            elm.setAttributeNS(xmlNS, key, cur);
          } else if (key.charCodeAt(5) === colonChar) {
            elm.setAttributeNS(xLinkNS, key, cur);
          } else {
            elm.setAttribute(key, cur);
          }
        }
      }
    }
    for (key in oldAttrs) {
      if (!(key in attrs)) {
        elm.removeAttribute(key);
      }
    }
  }
  var attributesModule = {
    create: updateAttrs,
    update: updateAttrs
  };

  // src/react/modules/class.ts
  function updateClass(oldVNode, vNode) {
    const elm = vNode.elm;
    const oldClass = oldVNode.data.className;
    const newClass = vNode.data.className;
    if (oldClass === newClass)
      return;
    elm.className = newClass || "";
  }
  var classModule = { create: updateClass, update: updateClass };

  // src/react/modules/dataset.ts
  var CAPS_REGEX = /[A-Z]/g;
  function updateDataset(oldVNode, vNode) {
    const elm = vNode.elm;
    let oldDataset = oldVNode.data.dataset;
    let dataset = vNode.data.dataset;
    let key;
    if (!oldDataset && !dataset)
      return;
    if (oldDataset === dataset)
      return;
    oldDataset = oldDataset || {};
    dataset = dataset || {};
    const d = elm.dataset;
    for (key in oldDataset) {
      if (!dataset[key]) {
        if (d) {
          if (key in d) {
            delete d[key];
          }
        } else {
          elm.removeAttribute(
            "data-" + key.replace(CAPS_REGEX, "-$&").toLowerCase()
          );
        }
      }
    }
    for (key in dataset) {
      if (oldDataset[key] !== dataset[key]) {
        if (d) {
          d[key] = dataset[key];
        } else {
          elm.setAttribute(
            "data-" + key.replace(CAPS_REGEX, "-$&").toLowerCase(),
            dataset[key]
          );
        }
      }
    }
  }
  var datasetModule = {
    create: updateDataset,
    update: updateDataset
  };

  // src/react/modules/event.ts
  function invokeHandler(handler, vNode, event) {
    if (typeof handler === "function") {
      const temp = event || {};
      handler.call(vNode, temp, vNode);
    } else if (typeof handler === "object") {
      for (let i = 0; i < handler.length; i++) {
        invokeHandler(handler[i], vNode, event);
      }
    }
  }
  function handleEvent(event, vNode) {
    const name = event.type;
    const on = vNode.data?.on;
    if (on && on[name]) {
      invokeHandler(on[name], vNode, event);
    }
  }
  function createListener() {
    return function handler(event) {
      handleEvent(event, handler.vNode);
    };
  }
  function updateEventListeners(oldVNode, vNode) {
    const oldOn = oldVNode.data?.on;
    const oldListener = oldVNode.listener;
    const oldElm = oldVNode.elm;
    const on = vNode?.data?.on;
    const elm = vNode && vNode.elm;
    let name;
    if (oldOn === on) {
      return;
    }
    if (oldOn && oldListener) {
      if (!on) {
        for (name in oldOn) {
          oldElm.removeEventListener(name, oldListener, false);
        }
      } else {
        for (name in oldOn) {
          if (!on[name]) {
            oldElm.removeEventListener(name, oldListener, false);
          }
        }
      }
    }
    if (on) {
      const listener = vNode.listener = oldVNode.listener || createListener();
      listener.vNode = vNode;
      if (!oldOn) {
        for (name in on) {
          elm.addEventListener(name, listener, false);
        }
      } else {
        for (name in on) {
          if (!oldOn[name]) {
            elm.addEventListener(name, listener, false);
          }
        }
      }
    }
  }
  var eventListenersModule = {
    create: updateEventListeners,
    update: updateEventListeners,
    destroy: updateEventListeners
  };

  // src/react/modules/props.ts
  function updateProps(oldVNode, vNode) {
    let key;
    let cur;
    let old;
    const elm = vNode.elm;
    let oldProps = oldVNode.data.props;
    let props = vNode.data.props;
    if (!oldProps && !props)
      return;
    if (oldProps === props)
      return;
    oldProps = oldProps || {};
    props = props || {};
    for (key in props) {
      cur = props[key];
      old = oldProps[key];
      if (old !== cur && (key !== "value" || elm[key] !== cur)) {
        elm[key] = cur;
      }
    }
  }
  var propsModule = { create: updateProps, update: updateProps };

  // src/react/modules/style.ts
  var convertKey = (key) => key.replace(CAPS_REGEX, "-$&").toLowerCase();
  function updateStyle(oldVNode, vNode) {
    let name;
    const elm = vNode.elm;
    let oldStyle = oldVNode.data.style;
    let style = vNode.data.style;
    if (!oldStyle && !style)
      return;
    if (oldStyle === style)
      return;
    oldStyle = oldStyle || {};
    style = style || {};
    for (name in oldStyle) {
      if (!style[name]) {
        if (name.slice(0, 2) === "--") {
          elm.style.removeProperty(name);
        } else {
          elm.style[convertKey(name)] = "";
        }
      }
    }
    for (name in style) {
      if (style[name] !== oldStyle[name]) {
        if (name.slice(0, 2) === "--") {
          elm.style.setProperty(name, style[name]);
        } else {
          const key = convertKey(name);
          const t = style[name];
          if (typeof t === "number") {
            elm.style[key] = t + "px";
          } else {
            elm.style[key] = t;
          }
        }
      }
    }
  }
  var styleModule = {
    create: updateStyle,
    update: updateStyle
  };

  // src/react/index.ts
  var patch = init(
    [
      attributesModule,
      classModule,
      datasetModule,
      eventListenersModule,
      propsModule,
      styleModule
    ],
    htmlDomApi
  );
  function render(container, vNode) {
    const dom = container;
    let temp;
    if (dom.vDom) {
      temp = patch(dom.vDom, vNode);
    } else {
      temp = patch(dom, vNode);
    }
    dom.vDom = temp;
    return temp;
  }

  // src/canvas/util.ts
  var measureTextMap = /* @__PURE__ */ new Map();
  function measureText(ctx, char) {
    const mapKey = `${char}__${ctx.font}`;
    let temp = measureTextMap.get(mapKey);
    if (!temp) {
      const { actualBoundingBoxDescent, actualBoundingBoxAscent, width } = ctx.measureText(char);
      const result = {
        width: Math.ceil(width / dpr()),
        height: Math.ceil(
          (actualBoundingBoxDescent + actualBoundingBoxAscent) / dpr()
        )
      };
      measureTextMap.set(mapKey, result);
      temp = result;
    }
    return temp;
  }
  function fillRect(ctx, x, y, width, height) {
    ctx.fillRect(npx(x), npx(y), npx(width), npx(height));
  }
  function strokeRect(ctx, x, y, width, height) {
    ctx.strokeRect(npx(x), npx(y), npx(width), npx(height));
  }
  function clearRect(ctx, x, y, width, height) {
    ctx.clearRect(npx(x), npx(y), npx(width), npx(height));
  }
  function fillText(ctx, text, x, y) {
    ctx.fillText(text, npx(x), npx(y));
  }
  function convertValueToString(value) {
    let text = String(value);
    if (typeof value === "boolean" || ["TRUE", "FALSE"].includes(text.toUpperCase())) {
      text = text.toUpperCase();
    } else if (value === void 0 || value === null) {
      text = "";
    }
    return text;
  }
  function renderCell(ctx, cellInfo) {
    const { style, value, left, top, width, height } = cellInfo;
    const isNum2 = isNumber(value);
    let font = DEFAULT_FONT_CONFIG;
    let fillStyle = DEFAULT_FONT_COLOR;
    if (!isEmpty(style)) {
      const fontSize = style?.fontSize ? style.fontSize : DEFAULT_FONT_SIZE;
      font = makeFont(
        style?.isItalic ? "italic" : "normal",
        style?.isBold ? "bold" : "500",
        npx(fontSize),
        style?.fontFamily
      );
      fillStyle = style?.fontColor || DEFAULT_FONT_COLOR;
      if (style?.fillColor) {
        ctx.fillStyle = style?.fillColor;
        fillRect(ctx, left, top, width, height);
      }
    }
    const text = convertValueToString(value);
    if (ERROR_SET.has(text)) {
      fillStyle = ERROR_FORMULA_COLOR;
    }
    const result = {};
    const texts = [...text];
    if (texts.length === 0) {
      return result;
    }
    ctx.textAlign = isNum2 ? "right" : "left";
    ctx.font = font;
    ctx.fillStyle = fillStyle;
    ctx.textBaseline = "middle";
    const textItemList = [];
    for (const char of texts) {
      if (char) {
        const t = measureText(ctx, char);
        textItemList.push({
          ...t,
          char
        });
      }
    }
    if (textItemList.length === 0) {
      return result;
    }
    const x = left + (isNum2 ? width : 0);
    if (style?.underline) {
      ctx.strokeStyle = fillStyle;
    }
    if (style?.isWrapText) {
      let y = top;
      const offset = 4;
      for (let i = 0; i < textItemList.length; ) {
        let t = width;
        const lastIndex = i;
        while (i < textItemList.length && textItemList[i].width < t) {
          t -= textItemList[i].width;
          i++;
        }
        if (lastIndex !== i) {
          let textHeight = 0;
          const textData = [];
          for (let k = lastIndex; k < i; k++) {
            if (textItemList[k].height > textHeight) {
              textHeight = textItemList[k].height;
            }
            textData.push(textItemList[k].char);
          }
          result.fontSizeHeight = Math.max(
            result.fontSizeHeight || 0,
            textHeight
          );
          y = y + Math.floor(textHeight / 2) + offset;
          const b = textData.join("");
          fillText(ctx, b, x, y);
          if (style?.underline) {
            const t2 = Math.floor(y + textHeight / 2);
            let pointList = [];
            if (!isNum2) {
              pointList = [
                [x, t2],
                [x + width, t2]
              ];
            } else {
              pointList = [
                [left, t2],
                [left + width, t2]
              ];
            }
            drawUnderline(ctx, pointList, style?.underline);
          }
          y = y + Math.floor(textHeight / 2);
        }
      }
      y += offset;
      result.wrapHeight = y - top;
    } else {
      const textHeight = Math.max(...textItemList.map((v) => v.height), 0);
      result.fontSizeHeight = textHeight;
      const offset = Math.max(0, Math.floor(height - textHeight) / 2);
      const y = Math.floor(top + textHeight / 2 + offset);
      let textWidth = 0;
      const textData = [];
      let t = width;
      for (let i = 0; i < textItemList.length; i++) {
        if (textItemList[i].width < t) {
          t -= textItemList[i].width;
          textData.push(textItemList[i].char);
          textWidth += textItemList[i].width;
        }
      }
      fillText(ctx, textData.join(""), x, y);
      if (style?.underline) {
        const t2 = Math.floor(y + textHeight / 2);
        let pointList = [];
        if (!isNum2) {
          pointList = [
            [x, t2],
            [x + textWidth, t2]
          ];
        } else {
          pointList = [
            [left, t2],
            [left + textWidth, t2]
          ];
        }
        drawUnderline(ctx, pointList, style?.underline);
      }
    }
    return result;
  }
  function drawLines(ctx, pointList) {
    assert(pointList.length > 0);
    ctx.beginPath();
    for (let i = 0; i < pointList.length; i += 2) {
      const first = pointList[i];
      const second = pointList[i + 1];
      ctx.moveTo(npx(first[0]), npx(first[1]));
      ctx.lineTo(npx(second[0]), npx(second[1]));
    }
    ctx.stroke();
  }
  function drawTriangle(ctx, point1, point2, point3) {
    ctx.beginPath();
    ctx.moveTo(npx(point1[0]), npx(point1[1]));
    ctx.lineTo(npx(point2[0]), npx(point2[1]));
    ctx.lineTo(npx(point3[0]), npx(point3[1]));
    ctx.fill();
  }
  function drawAntLine(ctx, x, y, width, height) {
    const oldDash = ctx.getLineDash();
    ctx.setLineDash([npx(8), npx(6)]);
    const offset = dpr() / 2;
    strokeRect(
      ctx,
      x + offset,
      y + offset,
      width - offset * 2,
      height - offset * 2
    );
    ctx.setLineDash(oldDash);
  }
  function drawUnderline(ctx, pointList, underline) {
    const [start, end] = pointList;
    const offset = dpr();
    const list = [
      [start[0], start[1] - offset],
      [end[0], end[1] - offset]
    ];
    if (underline === 2 /* DOUBLE */) {
      const t = offset * 2;
      list.push([start[0], start[1] - t], [end[0], end[1] - t]);
    }
    drawLines(ctx, list);
  }
  function resizeCanvas(canvas, width, height) {
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    const realWidth = npx(width);
    const realHeight = npx(height);
    canvas.width = realWidth;
    canvas.height = realHeight;
  }

  // src/canvas/Main.ts
  var MainCanvas = class {
    ctx;
    content;
    canvas;
    controller;
    constructor(controller, content) {
      const canvas = controller.getMainDom().canvas;
      this.canvas = canvas;
      this.controller = controller;
      this.ctx = canvas.getContext("2d");
      this.content = content;
      const size2 = dpr();
      this.ctx.scale(size2, size2);
    }
    resize() {
      const { width, height } = this.controller.getDomRect();
      resizeCanvas(this.canvas, width, height);
      this.content.resize();
    }
    clear() {
      const { width, height } = this.controller.getDomRect();
      this.ctx.clearRect(0, 0, npx(width), npx(height));
    }
    render = (params) => {
      if (params.changeSet.size === 0) {
        return;
      }
      this.content.render(params);
      this.clear();
      this.ctx.drawImage(this.content.getCanvas(), 0, 0);
      const result = this.renderSelection();
      this.renderAntLine(result);
    };
    renderAntLine(position) {
      const { controller } = this;
      const ranges = controller.getCopyRanges();
      if (ranges.length === 0) {
        return;
      }
      const [range] = ranges;
      if (range.sheetId !== controller.getCurrentSheetId()) {
        return;
      }
      this.ctx.strokeStyle = theme.primaryColor;
      this.ctx.lineWidth = dpr();
      drawAntLine(
        this.ctx,
        position.left,
        position.top,
        position.width,
        position.height
      );
    }
    renderSelection() {
      const { controller } = this;
      const range = controller.getActiveCell();
      if (isSheet(range)) {
        return this.renderSelectAll();
      }
      if (isCol(range)) {
        return this.renderSelectCol();
      }
      if (isRow(range)) {
        return this.renderSelectRow();
      }
      return this.renderSelectRange();
    }
    renderActiveCell() {
      const { controller } = this;
      const cellData = controller.getCell(controller.getActiveCell());
      const activeCell = controller.computeCellPosition(
        cellData.row,
        cellData.col
      );
      clearRect(
        this.ctx,
        activeCell.left,
        activeCell.top,
        activeCell.width,
        activeCell.height
      );
      renderCell(
        this.ctx,
        { ...cellData, ...activeCell }
      );
    }
    renderSelectRange() {
      const { controller } = this;
      const headerSize = controller.getHeaderSize();
      const range = controller.getActiveCell();
      const activeCell = controller.computeCellPosition(range.row, range.col);
      const endCellRow = range.row + range.rowCount - 1;
      const endCellCol = range.col + range.colCount - 1;
      const endCell = controller.computeCellPosition(endCellRow, endCellCol);
      const width = endCell.left + endCell.width - activeCell.left;
      const height = endCell.top + endCell.height - activeCell.top;
      this.ctx.fillStyle = theme.selectionColor;
      fillRect(this.ctx, activeCell.left, 0, width, headerSize.height);
      fillRect(this.ctx, 0, activeCell.top, headerSize.width, height);
      const check = range.rowCount > 1 || range.colCount > 1;
      if (check) {
        fillRect(this.ctx, activeCell.left, activeCell.top, width, height);
      }
      this.ctx.strokeStyle = theme.primaryColor;
      this.ctx.lineWidth = dpr();
      const list = [
        [activeCell.left, headerSize.height],
        [activeCell.left + width, headerSize.height]
      ];
      list.push(
        [headerSize.width, activeCell.top],
        [headerSize.width, activeCell.top + height]
      );
      drawLines(this.ctx, list);
      if (check) {
        this.renderActiveCell();
      }
      strokeRect(this.ctx, activeCell.left, activeCell.top, width, height);
      return {
        left: activeCell.left,
        top: activeCell.top,
        width,
        height
      };
    }
    renderSelectAll() {
      const { controller } = this;
      const { width, height } = this.controller.getDomRect();
      this.ctx.fillStyle = theme.selectionColor;
      fillRect(this.ctx, 0, 0, width, height);
      const headerSize = controller.getHeaderSize();
      this.ctx.strokeStyle = theme.primaryColor;
      this.ctx.lineWidth = dpr();
      this.renderActiveCell();
      strokeRect(
        this.ctx,
        headerSize.width,
        headerSize.height,
        width - headerSize.width,
        height - headerSize.height
      );
      return {
        left: headerSize.width,
        top: headerSize.height,
        width: width - headerSize.width,
        height: height - headerSize.height
      };
    }
    renderSelectCol() {
      const { controller } = this;
      const headerSize = controller.getHeaderSize();
      const range = controller.getActiveCell();
      const { height } = controller.getDomRect();
      this.ctx.fillStyle = theme.selectionColor;
      const activeCell = controller.computeCellPosition(range.row, range.col);
      fillRect(this.ctx, activeCell.left, 0, activeCell.width, headerSize.height);
      fillRect(this.ctx, 0, activeCell.top, headerSize.width, height);
      fillRect(
        this.ctx,
        activeCell.left,
        activeCell.top + activeCell.height,
        activeCell.width,
        height - activeCell.height
      );
      this.ctx.strokeStyle = theme.primaryColor;
      this.ctx.lineWidth = dpr();
      const list = [
        [headerSize.width, headerSize.height],
        [headerSize.width, height - headerSize.height]
      ];
      drawLines(this.ctx, list);
      strokeRect(
        this.ctx,
        activeCell.left,
        activeCell.top,
        activeCell.width,
        height
      );
      return {
        left: activeCell.left,
        top: activeCell.top,
        width: activeCell.width,
        height
      };
    }
    renderSelectRow() {
      const { controller } = this;
      const headerSize = controller.getHeaderSize();
      const range = controller.getActiveCell();
      const { width } = controller.getDomRect();
      this.ctx.fillStyle = theme.selectionColor;
      const activeCell = controller.computeCellPosition(range.row, range.col);
      fillRect(this.ctx, activeCell.left, 0, width, headerSize.height);
      fillRect(this.ctx, 0, activeCell.top, headerSize.width, activeCell.height);
      fillRect(
        this.ctx,
        activeCell.left + activeCell.width,
        activeCell.top,
        width - activeCell.width,
        activeCell.height
      );
      this.ctx.strokeStyle = theme.primaryColor;
      this.ctx.lineWidth = dpr();
      const list = [
        [activeCell.left, headerSize.height],
        [width - headerSize.width, headerSize.height]
      ];
      drawLines(this.ctx, list);
      strokeRect(
        this.ctx,
        activeCell.left,
        activeCell.top,
        width,
        activeCell.height
      );
      return {
        left: activeCell.left,
        top: activeCell.top,
        width,
        height: activeCell.height
      };
    }
  };

  // src/canvas/shortcut.ts
  function computeScrollRowAndCol(controller, left, top) {
    const oldScroll = controller.getScroll();
    let { row, col } = oldScroll;
    if (oldScroll.top !== top) {
      row = 0;
      let t = top;
      while (t > 0) {
        const a = controller.getRowHeight(row);
        if (a > t) {
          break;
        }
        t -= a;
        row++;
      }
    }
    if (oldScroll.left !== left) {
      col = 0;
      let t = left;
      while (t > 0) {
        const a = controller.getColWidth(col);
        if (a > t) {
          break;
        }
        t -= a;
        col++;
      }
    }
    return {
      row,
      col
    };
  }
  function computeScrollPosition(controller, left, top) {
    const headerSize = controller.getHeaderSize();
    const canvasRect = controller.getDomRect();
    const viewSize = controller.getViewSize();
    const maxHeight = viewSize.height - canvasRect.height + BOTTOM_BUFF;
    const maxWidth = viewSize.width - canvasRect.width + BOTTOM_BUFF;
    const maxScrollHeight = canvasRect.height - headerSize.height - SCROLL_SIZE * 1.5;
    const maxScrollWidth = canvasRect.width - headerSize.width - SCROLL_SIZE * 1.5;
    const scrollTop = Math.floor(top * maxScrollHeight / maxHeight);
    const scrollLeft = Math.floor(left * maxScrollWidth / maxWidth);
    return {
      maxHeight,
      maxWidth,
      maxScrollHeight,
      maxScrollWidth,
      scrollTop,
      scrollLeft
    };
  }
  function scrollBar(controller, scrollX, scrollY) {
    const oldScroll = controller.getScroll();
    const { maxHeight, maxWidth, maxScrollHeight, maxScrollWidth } = computeScrollPosition(controller, oldScroll.left, oldScroll.top);
    let top = oldScroll.top + Math.ceil(scrollY);
    if (top < 0) {
      top = 0;
    } else if (top > maxHeight) {
      top = maxHeight;
    }
    let left = oldScroll.left + Math.ceil(scrollX);
    if (left < 0) {
      left = 0;
    } else if (left > maxWidth) {
      left = maxWidth;
    }
    const { row, col } = computeScrollRowAndCol(controller, left, top);
    const scrollTop = Math.floor(top * maxScrollHeight / maxHeight);
    const scrollLeft = Math.floor(left * maxScrollWidth / maxWidth);
    controller.setScroll({
      row,
      col,
      top,
      left,
      scrollTop,
      scrollLeft
    });
  }
  function recalculateScroll(controller) {
    const activeCell = controller.getActiveCell();
    const position = controller.computeCellPosition(
      activeCell.row,
      activeCell.col
    );
    const domRect = controller.getDomRect();
    const oldScroll = controller.getScroll();
    const sheetInfo = controller.getSheetInfo(controller.getCurrentSheetId());
    const headerSize = controller.getHeaderSize();
    const buff = 5;
    const { maxHeight, maxWidth, maxScrollHeight, maxScrollWidth } = computeScrollPosition(controller, oldScroll.left, oldScroll.top);
    if (position.left + position.width + buff > domRect.width) {
      if (oldScroll.col <= sheetInfo.colCount - 2) {
        const col = oldScroll.col + 1;
        const left = oldScroll.left + controller.getColWidth(oldScroll.col);
        const scrollLeft = Math.floor(left * maxScrollWidth / maxWidth);
        controller.setScroll({
          ...oldScroll,
          col,
          left,
          scrollLeft
        });
      }
    }
    if (position.left - headerSize.width < domRect.left + buff) {
      if (oldScroll.col >= 1) {
        const col = oldScroll.col - 1;
        const left = oldScroll.left - controller.getColWidth(oldScroll.col);
        const scrollLeft = Math.floor(left * maxScrollWidth / maxWidth);
        controller.setScroll({
          ...oldScroll,
          col,
          left,
          scrollLeft
        });
      }
    }
    if (position.top + position.height + buff > domRect.height) {
      if (oldScroll.row <= sheetInfo.rowCount - 2) {
        const row = oldScroll.row + 1;
        const top = oldScroll.top + controller.getRowHeight(oldScroll.row);
        const scrollTop = Math.floor(top * maxScrollHeight / maxHeight);
        controller.setScroll({
          ...oldScroll,
          row,
          top,
          scrollTop
        });
      }
    }
    if (position.top - headerSize.height < domRect.top + buff) {
      if (oldScroll.row >= 1) {
        const row = oldScroll.row - 1;
        const top = oldScroll.top - controller.getRowHeight(oldScroll.row);
        const scrollTop = Math.floor(top * maxScrollHeight / maxHeight);
        controller.setScroll({
          ...oldScroll,
          row,
          top,
          scrollTop
        });
      }
    }
  }
  function checkActiveElement(controller) {
    const inputDom = controller.getMainDom().input;
    const isInputFocus = document.activeElement === inputDom;
    if (isInputFocus) {
      controller.setCellValues(
        [[inputDom.value]],
        [],
        [controller.getActiveCell()]
      );
      inputDom.value = "";
      inputDom.blur();
    }
  }
  var keyboardEventList = [
    {
      key: "Enter",
      modifierKey: [],
      handler: (controller) => {
        checkActiveElement(controller);
        const activeCell = controller.getActiveCell();
        controller.setActiveCell({
          row: activeCell.row + 1,
          col: activeCell.col,
          rowCount: 1,
          colCount: 1,
          sheetId: ""
        });
      }
    },
    {
      key: "Tab",
      modifierKey: [],
      handler: (controller) => {
        checkActiveElement(controller);
        const activeCell = controller.getActiveCell();
        controller.setActiveCell({
          row: activeCell.row,
          col: activeCell.col + 1,
          rowCount: 1,
          colCount: 1,
          sheetId: ""
        });
      }
    },
    {
      key: "ArrowDown",
      modifierKey: [isMac() ? "meta" : "ctrl"],
      handler: (controller) => {
        checkActiveElement(controller);
        const viewSize = controller.getViewSize();
        scrollBar(controller, 0, viewSize.height);
      }
    },
    {
      key: "ArrowUp",
      modifierKey: [isMac() ? "meta" : "ctrl"],
      handler: (controller) => {
        checkActiveElement(controller);
        const viewSize = controller.getViewSize();
        scrollBar(controller, 0, -viewSize.height);
      }
    },
    {
      key: "ArrowRight",
      modifierKey: [isMac() ? "meta" : "ctrl"],
      handler: (controller) => {
        checkActiveElement(controller);
        const viewSize = controller.getViewSize();
        scrollBar(controller, viewSize.width, 0);
      }
    },
    {
      key: "ArrowLeft",
      modifierKey: [isMac() ? "meta" : "ctrl"],
      handler: (controller) => {
        checkActiveElement(controller);
        const viewSize = controller.getViewSize();
        scrollBar(controller, -viewSize.width, 0);
      }
    },
    {
      key: "ArrowDown",
      modifierKey: [],
      handler: (controller) => {
        checkActiveElement(controller);
        const activeCell = controller.getActiveCell();
        controller.setActiveCell({
          row: activeCell.row + 1,
          col: activeCell.col,
          rowCount: 1,
          colCount: 1,
          sheetId: ""
        });
        recalculateScroll(controller);
      }
    },
    {
      key: "ArrowUp",
      modifierKey: [],
      handler: (controller) => {
        checkActiveElement(controller);
        const activeCell = controller.getActiveCell();
        controller.setActiveCell({
          row: activeCell.row - 1,
          col: activeCell.col,
          rowCount: 1,
          colCount: 1,
          sheetId: ""
        });
        recalculateScroll(controller);
      }
    },
    {
      key: "ArrowRight",
      modifierKey: [],
      handler: (controller) => {
        checkActiveElement(controller);
        const activeCell = controller.getActiveCell();
        controller.setActiveCell({
          row: activeCell.row,
          col: activeCell.col + 1,
          rowCount: 1,
          colCount: 1,
          sheetId: ""
        });
        recalculateScroll(controller);
      }
    },
    {
      key: "ArrowLeft",
      modifierKey: [],
      handler: (controller) => {
        checkActiveElement(controller);
        const activeCell = controller.getActiveCell();
        controller.setActiveCell({
          row: activeCell.row,
          col: activeCell.col - 1,
          rowCount: 1,
          colCount: 1,
          sheetId: ""
        });
        recalculateScroll(controller);
      }
    },
    {
      key: "b",
      modifierKey: [isMac() ? "meta" : "ctrl"],
      handler: (controller) => {
        const cellData = controller.getCell(controller.getActiveCell());
        const style = cellData.style || {};
        style.isBold = !style.isBold;
        controller.setCellStyle(style, [controller.getActiveCell()]);
      }
    },
    {
      key: "i",
      modifierKey: [isMac() ? "meta" : "ctrl"],
      handler: (controller) => {
        const cellData = controller.getCell(controller.getActiveCell());
        const style = cellData.style || {};
        style.isItalic = !style.isItalic;
        controller.setCellStyle(style, [controller.getActiveCell()]);
      }
    },
    {
      key: "u",
      modifierKey: [isMac() ? "meta" : "ctrl"],
      handler: (controller) => {
        const cellData = controller.getCell(controller.getActiveCell());
        const style = cellData.style || {};
        if (style.underline === void 0 || style.underline === 0 /* NONE */) {
          style.underline = 1 /* SINGLE */;
        } else {
          style.underline = 0 /* NONE */;
        }
        controller.setCellStyle(style, [controller.getActiveCell()]);
      }
    }
  ];

  // src/canvas/event.ts
  var DOUBLE_CLICK_TIME = 300;
  function getHitInfo(event, controller) {
    const canvasSize = controller.getDomRect();
    const scroll = controller.getScroll();
    const sheetInfo = controller.getSheetInfo(controller.getCurrentSheetId());
    const headerSize = controller.getHeaderSize();
    const { pageX, pageY } = event;
    const x = pageX - canvasSize.left;
    const y = pageY - canvasSize.top;
    let resultX = headerSize.width;
    let resultY = headerSize.height;
    let row = scroll.row;
    let col = scroll.col;
    while (resultX + controller.getColWidth(col) <= x) {
      resultX += controller.getColWidth(col);
      col++;
    }
    while (resultY + controller.getRowHeight(row) <= y) {
      resultY += controller.getRowHeight(row);
      row++;
    }
    if (row >= sheetInfo.rowCount || col >= sheetInfo.colCount) {
      return null;
    }
    const cellSize = controller.getCellSize(row, col);
    return { ...cellSize, row, col, pageY, pageX, x, y };
  }
  function isInputEvent(event) {
    const name = (event?.target?.tagName || "").toLowerCase();
    return name === "input" || name === "textarea";
  }
  function registerEvents(stateValue, controller, resizeWindow) {
    const canvas = controller.getMainDom().canvas;
    let lastTimeStamp = 0;
    window.addEventListener("resize", function() {
      resizeWindow();
    });
    window.addEventListener("keydown", function(event) {
      const list = keyboardEventList.filter((v) => v.key === event.key);
      list.sort((a, b) => b.modifierKey.length - a.modifierKey.length);
      let temp = null;
      for (const item of list) {
        if (item.modifierKey.length > 0) {
          if (item.modifierKey.some((v) => event[`${v}Key`])) {
            temp = item;
            break;
          }
        } else {
          temp = item;
          break;
        }
      }
      if (temp) {
        event.preventDefault();
        temp.handler(controller);
        return;
      }
      if (event.metaKey || event.ctrlKey) {
        console.log(event.key);
        return;
      }
      if (isInputEvent(event)) {
        return;
      }
      stateValue.isCellEditing = true;
      controller.getMainDom().input.focus();
    });
    window.addEventListener(
      "wheel",
      debounce(function(event) {
        if (event.target !== canvas) {
          return;
        }
        scrollBar(controller, event.deltaX, event.deltaY);
      })
    );
    document.body.addEventListener("paste", function(event) {
      if (isInputEvent(event)) {
        return;
      }
      event.preventDefault();
      controller.paste(event);
    });
    document.body.addEventListener("copy", function(event) {
      if (isInputEvent(event)) {
        return;
      }
      event.preventDefault();
      controller.copy(event);
    });
    document.body.addEventListener("cut", function(event) {
      if (isInputEvent(event)) {
        return;
      }
      event.preventDefault();
      controller.cut(event);
    });
    canvas.addEventListener("mousedown", function(event) {
      stateValue.contextMenuPosition = void 0;
      const headerSize = controller.getHeaderSize();
      const canvasRect = controller.getDomRect();
      const { timeStamp, clientX, clientY } = event;
      const x = clientX - canvasRect.left;
      const y = clientY - canvasRect.top;
      const position = getHitInfo(event, controller);
      if (!position) {
        return;
      }
      if (headerSize.width > x && headerSize.height > y) {
        controller.setActiveCell({
          row: 0,
          col: 0,
          colCount: 0,
          rowCount: 0,
          sheetId: ""
        });
        return;
      }
      if (headerSize.width > x && headerSize.height <= y) {
        const sheetInfo = controller.getSheetInfo(controller.getCurrentSheetId());
        controller.setActiveCell({
          row: position.row,
          col: position.col,
          rowCount: 0,
          colCount: sheetInfo.colCount,
          sheetId: ""
        });
        return;
      }
      if (headerSize.width <= x && headerSize.height > y) {
        const sheetInfo = controller.getSheetInfo(controller.getCurrentSheetId());
        controller.setActiveCell({
          row: position.row,
          col: position.col,
          rowCount: sheetInfo.rowCount,
          colCount: 0,
          sheetId: ""
        });
        return;
      }
      const activeCell = controller.getActiveCell();
      const check = activeCell.row >= 0 && activeCell.row === position.row && activeCell.col === position.col;
      if (!check) {
        const inputDom = controller.getMainDom().input;
        const isInputFocus = document.activeElement === inputDom;
        if (isInputFocus) {
          const value = inputDom.value;
          controller.setCellValues([[value]], [], [controller.getActiveCell()]);
          stateValue.isCellEditing = false;
          inputDom.value = "";
        }
        controller.setActiveCell({
          row: position.row,
          col: position.col,
          rowCount: 1,
          colCount: 1,
          sheetId: ""
        });
      } else {
        const delay = timeStamp - lastTimeStamp;
        if (delay < DOUBLE_CLICK_TIME) {
          stateValue.isCellEditing = true;
        }
      }
      lastTimeStamp = timeStamp;
    });
    canvas.addEventListener("mousemove", function(event) {
      const headerSize = controller.getHeaderSize();
      const rect = controller.getDomRect();
      const { clientX, clientY } = event;
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      if (event.buttons === 1) {
        if (x > headerSize.width && y > headerSize.height) {
          const position = getHitInfo(event, controller);
          if (!position) {
            return;
          }
          const activeCell = controller.getActiveCell();
          if (activeCell.row === position.row && activeCell.col === position.col) {
            return;
          }
          const colCount = Math.abs(position.col - activeCell.col) + 1;
          const rowCount = Math.abs(position.row - activeCell.row) + 1;
          controller.setActiveCell({
            row: Math.min(position.row, activeCell.row),
            col: Math.min(position.col, activeCell.col),
            rowCount,
            colCount,
            sheetId: ""
          });
        }
      }
    });
    canvas.addEventListener("contextmenu", function(event) {
      event.preventDefault();
      stateValue.contextMenuPosition = {
        top: event.clientY,
        left: event.clientX,
        width: 100,
        height: 100
      };
      return false;
    });
  }

  // src/canvas/constant.ts
  var HEADER_STYLE = {
    textAlign: "center",
    textBaseline: "middle",
    font: DEFAULT_FONT_CONFIG,
    fillStyle: theme.black,
    lineWidth: thinLineWidth(),
    strokeStyle: theme.gridStrokeColor
  };

  // src/canvas/Content.ts
  var Content = class {
    canvas;
    ctx;
    controller;
    constructor(controller, canvas) {
      this.controller = controller;
      this.canvas = canvas;
      const ctx = this.canvas.getContext("2d");
      this.ctx = ctx;
      const size2 = dpr();
      this.ctx.scale(size2, size2);
    }
    getCanvas() {
      return this.canvas;
    }
    resize() {
      const { width, height } = this.controller.getDomRect();
      resizeCanvas(this.canvas, width, height);
    }
    clear() {
      const { width, height } = this.controller.getDomRect();
      this.ctx.clearRect(0, 0, npx(width), npx(height));
    }
    render({ changeSet }) {
      if (changeSet.size === 0 || !changeSet.has("content")) {
        return;
      }
      const { width, height } = this.controller.getDomRect();
      const headerSize = this.controller.getHeaderSize();
      this.clear();
      const contentWidth = width - headerSize.width;
      const contentHeight = height - headerSize.height;
      this.renderGrid(contentWidth, contentHeight);
      this.renderRowsHeader(contentHeight);
      this.renderColsHeader(contentWidth);
      this.renderTriangle();
      this.renderContent();
    }
    renderContent() {
      const { controller } = this;
      const { width, height } = this.controller.getDomRect();
      const currentSheetId = controller.getCurrentSheetId();
      const data = controller.getCellsContent(currentSheetId);
      if (isEmpty(data)) {
        return;
      }
      this.ctx.save();
      const { row: rowIndex, col: colIndex } = controller.getScroll();
      for (const item of data) {
        const { row, col } = item;
        if (row < rowIndex || col < colIndex) {
          continue;
        }
        const result = controller.computeCellPosition(row, col);
        if (result.top > height || result.left > width) {
          continue;
        }
        const cellInfo = this.controller.getCell(
          new Range(row, col, 1, 1, currentSheetId)
        );
        const { wrapHeight = 0, fontSizeHeight = 0 } = renderCell(this.ctx, {
          ...cellInfo,
          ...result
        });
        const t = Math.max(wrapHeight, fontSizeHeight);
        if (t > result.height) {
          controller.setRowHeight(row, t);
        }
      }
      this.ctx.restore();
    }
    renderTriangle() {
      if (isTestEnv()) {
        return;
      }
      const headerSize = this.controller.getHeaderSize();
      this.ctx.save();
      this.ctx.fillStyle = theme.backgroundColor;
      fillRect(this.ctx, 0, 0, headerSize.width, headerSize.height);
      this.ctx.fillStyle = theme.triangleFillColor;
      const offset = 2;
      drawTriangle(
        this.ctx,
        [headerSize.width / 2 - offset, headerSize.height - offset],
        [headerSize.width - offset, headerSize.height - offset],
        [headerSize.width - offset, offset]
      );
      this.ctx.restore();
    }
    renderGrid(width, height) {
      const { controller } = this;
      const headerSize = controller.getHeaderSize();
      const { row: rowIndex, col: colIndex } = controller.getScroll();
      const { rowCount, colCount } = this.controller.getSheetInfo(
        this.controller.getCurrentSheetId()
      );
      const lineWidth = thinLineWidth();
      this.ctx.save();
      this.ctx.fillStyle = theme.white;
      this.ctx.lineWidth = lineWidth;
      this.ctx.strokeStyle = theme.gridStrokeColor;
      this.ctx.translate(npx(headerSize.width), npx(headerSize.height));
      const pointList = [];
      let y = 0;
      let x = 0;
      let maxX = 0;
      for (let i = colIndex; i < colCount; i++) {
        maxX += controller.getColWidth(i);
        if (maxX > width) {
          break;
        }
      }
      const realWidth = Math.min(maxX, width);
      for (let i = rowIndex; i < rowCount; i++) {
        pointList.push([0, y], [realWidth, y]);
        y += controller.getRowHeight(i);
        if (y > height) {
          break;
        }
      }
      for (let i = colIndex; i < colCount; i++) {
        pointList.push([x, 0], [x, y]);
        x += controller.getColWidth(i);
        if (x > realWidth) {
          break;
        }
      }
      pointList.push([0, y], [x, y]);
      pointList.push([x, 0], [x, y]);
      drawLines(this.ctx, pointList);
      this.ctx.restore();
    }
    fillRowText(row, rowWidth, y) {
      this.ctx.fillStyle = theme.black;
      fillText(this.ctx, String(row), rowWidth / 2, y);
    }
    fillColText(colText, x, colHeight) {
      this.ctx.fillStyle = theme.black;
      fillText(this.ctx, colText, x, colHeight / 2 + dpr());
    }
    renderRowsHeader(height) {
      const { controller } = this;
      const { row: rowIndex } = controller.getScroll();
      const headerSize = controller.getHeaderSize();
      const { rowCount } = controller.getSheetInfo(
        controller.getCurrentSheetId()
      );
      this.ctx.save();
      this.ctx.fillStyle = theme.backgroundColor;
      fillRect(this.ctx, 0, headerSize.height, headerSize.width, height);
      Object.assign(this.ctx, HEADER_STYLE);
      const pointList = [];
      let y = headerSize.height;
      let i = rowIndex;
      for (; i < rowCount; i++) {
        const rowHeight = controller.getRowHeight(i);
        let temp = y;
        if (i === rowIndex) {
          temp += thinLineWidth() / 2;
        }
        pointList.push([0, temp], [headerSize.width, temp]);
        this.fillRowText(i + 1, headerSize.width, temp + rowHeight / 2);
        y += rowHeight;
        if (y > height) {
          break;
        }
      }
      pointList.push([0, y], [headerSize.width, y]);
      pointList.push([0, 0], [0, y]);
      drawLines(this.ctx, pointList);
      this.ctx.restore();
    }
    renderColsHeader(width) {
      const { controller } = this;
      const { col: colIndex } = controller.getScroll();
      const headerSize = controller.getHeaderSize();
      const { colCount } = controller.getSheetInfo(
        controller.getCurrentSheetId()
      );
      const pointList = [];
      this.ctx.save();
      this.ctx.fillStyle = theme.backgroundColor;
      fillRect(this.ctx, headerSize.width, 0, width, headerSize.height);
      Object.assign(this.ctx, HEADER_STYLE);
      let x = headerSize.width;
      let i = colIndex;
      for (; i < colCount; i++) {
        const colWidth = controller.getColWidth(i);
        let temp = x;
        if (i === colIndex) {
          temp += thinLineWidth() / 2;
        }
        pointList.push([temp, 0], [temp, headerSize.height]);
        this.fillColText(
          intToColumnName(i),
          temp + colWidth / 2,
          headerSize.height
        );
        x += colWidth;
        if (x > width) {
          break;
        }
      }
      pointList.push([x, 0], [x, headerSize.height]);
      pointList.push([0, 0], [x, 0]);
      drawLines(this.ctx, pointList);
      this.ctx.restore();
    }
  };

  // src/containers/canvas/index.ts
  function scrollBar2(controller, scrollX, scrollY) {
    const oldScroll = controller.getScroll();
    const { maxHeight, maxScrollHeight, maxScrollWidth, maxWidth } = computeScrollPosition(controller, oldScroll.left, oldScroll.top);
    let scrollTop = oldScroll.scrollTop + Math.ceil(scrollY);
    let scrollLeft = oldScroll.scrollLeft + Math.ceil(scrollX);
    if (scrollTop < 0) {
      scrollTop = 0;
    } else if (scrollTop > maxScrollHeight) {
      scrollTop = maxScrollHeight;
    }
    if (scrollLeft < 0) {
      scrollLeft = 0;
    } else if (scrollLeft > maxScrollWidth) {
      scrollLeft = maxScrollWidth;
    }
    const top = Math.floor(maxHeight * scrollTop / maxScrollHeight);
    const left = Math.floor(maxWidth * scrollLeft / maxScrollWidth);
    const { row, col } = computeScrollRowAndCol(controller, left, top);
    controller.setScroll({
      top,
      left,
      row,
      col,
      scrollLeft,
      scrollTop
    });
  }
  var prevPageY = 0;
  var prevPageX = 0;
  var scrollStatus = 0 /* NONE */;
  var CanvasContainer = (state, controller) => {
    const { headerSize } = state;
    function handleDrag(event) {
      event.stopPropagation();
      if (scrollStatus === 1 /* VERTICAL */) {
        if (prevPageY) {
          scrollBar2(controller, 0, event.pageY - prevPageY);
        }
        prevPageY = event.pageY;
      } else if (scrollStatus === 2 /* HORIZONTAL */) {
        if (prevPageX) {
          scrollBar2(controller, event.pageX - prevPageX, 0);
        }
        prevPageX = event.pageX;
      }
    }
    function handleDragEnd() {
      scrollStatus = 0 /* NONE */;
      prevPageY = 0;
      prevPageX = 0;
      tearDown();
    }
    function tearDown() {
      document.removeEventListener("mousemove", handleDrag);
      document.removeEventListener("mouseup", handleDragEnd);
    }
    function register() {
      document.addEventListener("mousemove", handleDrag);
      document.addEventListener("mouseup", handleDragEnd);
    }
    return h(
      "div",
      {
        className: "relative canvas-container"
      },
      h("canvas", {
        className: "full canvas-content",
        hook: {
          ref(dom) {
            const canvas = dom;
            controller.setMainDom({ canvas });
          }
        }
      }),
      h(
        "div",
        {
          className: "vertical-scroll-bar",
          style: {
            top: headerSize.height
          },
          onmouseleave() {
            handleDragEnd();
          },
          onmousedown() {
            if (scrollStatus) {
              return;
            }
            scrollStatus = 1 /* VERTICAL */;
            register();
          }
        },
        h("div", {
          className: "vertical-scroll-bar-content",
          style: {
            height: SCROLL_SIZE,
            transform: `translateY(${state.scrollTop}px)`
          }
        })
      ),
      h(
        "div",
        {
          className: "horizontal-scroll-bar",
          style: {
            left: headerSize.width
          },
          onmouseleave() {
            handleDragEnd();
          },
          onmousedown() {
            if (scrollStatus) {
              return;
            }
            scrollStatus = 2 /* HORIZONTAL */;
            register();
          }
        },
        h("div", {
          className: "horizontal-scroll-bar-content",
          style: {
            width: SCROLL_SIZE,
            transform: `translateX(${state.scrollLeft}px)`
          }
        })
      )
    );
  };
  CanvasContainer.displayName = "CanvasContainer";

  // src/containers/FormulaBar/FormulaEditor.ts
  function getEditorStyle(style, cellPosition) {
    if (isEmpty(style)) {
      return cellPosition;
    }
    const font = makeFont(
      style?.isItalic ? "italic" : "normal",
      style?.isBold ? "bold" : "500",
      style?.fontSize || DEFAULT_FONT_SIZE,
      style?.fontFamily
    );
    return {
      ...cellPosition,
      backgroundColor: style?.fillColor || "inherit",
      color: style?.fontColor || DEFAULT_FONT_COLOR,
      font
    };
  }
  var FormulaEditor = (state, controller) => {
    const { activeCell, isCellEditing, cellPosition } = state;
    const initValue = activeCell.formula || String(activeCell.value || "");
    let inputDom;
    const ref = (element) => {
      inputDom = element;
      controller.setMainDom({ input: inputDom });
    };
    return h("input", {
      className: "base-editor",
      value: initValue,
      style: isCellEditing ? getEditorStyle(activeCell.style, cellPosition) : void 0,
      hook: {
        ref
      },
      onfocus: () => {
        if (!isCellEditing) {
          return;
        }
        state.isCellEditing = true;
      },
      onkeydown: (event) => {
        if (isCellEditing) {
          inputDom.nextSibling.textContent = event.currentTarget.value;
        }
      }
    });
  };
  FormulaEditor.displayName = "FormulaEditor";

  // src/containers/FormulaBar/index.tsx
  var FormulaBarContainer = (state, controller) => {
    const { activeCell } = state;
    return h(
      "div",
      {
        className: "formula-bar-wrapper"
      },
      h(
        "div",
        { className: "formula-bar-name" },
        `${intToColumnName(activeCell.col)}${activeCell.row + 1}`
      ),
      h(
        "div",
        { className: "formula-bar-editor-wrapper" },
        FormulaEditor(state, controller),
        h("div", {
          className: classnames("formula-bar-value", {
            show: state.isCellEditing
          })
        }, activeCell.formula || String(activeCell.value || ""))
      )
    );
  };
  FormulaBarContainer.displayName = "FormulaBarContainer";

  // src/components/Button/index.tsx
  var defaultClick = () => {
    console.log("add click event");
  };
  var Button = (props, ...children) => {
    const {
      className = "",
      onClick = defaultClick,
      disabled = false,
      active = false,
      type = "normal",
      style = {},
      testId = void 0,
      title = ""
    } = props;
    return h(
      "div",
      {
        onclick: onClick,
        className: classnames("button-wrapper", className, {
          disabled,
          active,
          circle: type === "circle"
        }),
        style,
        title,
        "data-testId": testId
      },
      ...children
    );
  };
  Button.displayName = "Button";

  // src/components/Github/index.ts
  var pathStyle = {
    "transform-origin": "130px 106px"
  };
  var Github = () => {
    return h(
      "a",
      {
        href: "https://github.com/nusr/excel",
        "aria-label": "View source on Github",
        target: "_blank",
        rel: "noreferrer",
        title: "github link"
      },
      h(
        "svg",
        {
          className: "github-wrapper",
          viewBox: "0 0 250 250",
          "aria-hidden": true
        },
        h("path", {
          d: "M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"
        }),
        h("path", {
          d: "M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2",
          fill: "currentColor",
          style: pathStyle
        }),
        h("path", {
          style: pathStyle,
          fill: "currentColor",
          d: "M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z"
        })
      )
    );
  };
  Github.displayName = "Github";

  // src/components/BaseIcon/icon.ts
  var icon = {
    alignCenter: [
      "M142.2 227.6h739.6v56.9H142.2zM142.2 568.9h739.6v56.9H142.2zM256 398.2h512v56.9H256zM256 739.6h512v56.9H256z"
    ],
    alignLeft: [
      "M627.712 788.48c11.305 0 20.48-9.155 20.48-20.48s-9.175-20.48-20.48-20.48H218.46c-11.305 0-20.48 9.155-20.48 20.48s9.175 20.48 20.48 20.48h409.252zM832.86 583.68h-614.4c-11.305 0-20.48 9.155-20.48 20.48s9.175 20.48 20.48 20.48h614.4c11.305 0 20.48-9.155 20.48-20.48s-9.175-20.48-20.48-20.48zM832.86 256h-614.4c-11.305 0-20.48 9.155-20.48 20.48s9.175 20.48 20.48 20.48h614.4c11.305 0 20.48-9.155 20.48-20.48S844.165 256 832.86 256zM218.46 460.8h409.252c11.305 0 20.48-9.155 20.48-20.48s-9.175-20.48-20.48-20.48H218.46c-11.305 0-20.48 9.155-20.48 20.48s9.155 20.48 20.48 20.48z"
    ],
    alignRight: [
      "M832.86 747.52H423.588a20.48 20.48 0 1 0 0 40.96H832.84a20.48 20.48 0 0 0 0.02-40.96z m20.48-143.36a20.48 20.48 0 0 0-20.48-20.48h-614.4a20.48 20.48 0 1 0 0 40.96h614.4a20.48 20.48 0 0 0 20.48-20.48zM832.86 256h-614.4a20.48 20.48 0 1 0 0 40.96h614.4a20.48 20.48 0 1 0 0-40.96z m0 163.84H423.588a20.48 20.48 0 1 0 0 40.96H832.84a20.48 20.48 0 0 0 0.02-40.96z"
    ],
    bold: [
      "M724.342857 477.028571c38.4-40 61.942857-94.057143 61.942857-153.485714v-11.657143C786.285714 188.914286 685.6 89.142857 561.485714 89.142857H223.314286c-17.257143 0-31.314286 14.057143-31.314286 31.314286v776.114286c0 18.628571 15.085714 33.714286 33.714286 33.714285h364.228571c133.714286 0 242.057143-107.657143 242.057143-240.571428v-12.571429c0-83.428571-42.742857-156.914286-107.657143-200.114286zM301.714286 198.857143h256.8c65.257143 0 118.057143 50.742857 118.057143 113.485714v10.857143c0 62.628571-52.914286 113.485714-118.057143 113.485714H301.714286V198.857143z m418.971428 490.742857c0 71.885714-59.085714 130.171429-132 130.171429H301.714286V547.085714h286.971428c72.914286 0 132 58.285714 132 130.171429v12.342857z"
    ],
    fontColor: [
      "M650.496 597.333333H373.504l-68.266667 170.666667H213.333333l256-640h85.333334l256 640h-91.904l-68.266667-170.666667z m-34.133333-85.333333L512 251.093333 407.637333 512h208.725334zM128 853.333333h768v85.333334H128v-85.333334z"
    ],
    italic: [
      "M219.428571 949.714286l9.714286-48.571429q3.428571-1.142857 46.571429-12.285714t63.714286-21.428571q16-20 23.428571-57.714286 0.571429-4 35.428571-165.142857t65.142857-310.571429 29.714286-169.428571l0-14.285714q-13.714286-7.428571-31.142857-10.571429t-39.714286-4.571429-33.142857-3.142857l10.857143-58.857143q18.857143 1.142857 68.571429 3.714286t85.428571 4 68.857143 1.428571q27.428571 0 56.285714-1.428571t69.142857-4 56.285714-3.714286q-2.857143 22.285714-10.857143 50.857143-17.142857 5.714286-58 16.285714t-62 19.142857q-4.571429 10.857143-8 24.285714t-5.142857 22.857143-4.285714 26-3.714286 24q-15.428571 84.571429-50 239.714286t-44.285714 203.142857q-1.142857 5.142857-7.428571 33.142857t-11.428571 51.428571-9.142857 47.714286-3.428571 32.857143l0.571429 10.285714q9.714286 2.285714 105.714286 17.714286-1.714286 25.142857-9.142857 56.571429-6.285714 0-18.571429 0.857143t-18.571429 0.857143q-16.571429 0-49.714286-5.714286t-49.142857-5.714286q-78.857143-1.142857-117.714286-1.142857-29.142857 0-81.714286 5.142857t-69.142857 6.285714z"
    ],
    middleAlign: [
      "M740.43392 788.48c11.30496 0 20.48-9.15456 20.48-20.48s-9.17504-20.48-20.48-20.48L331.18208 747.52c-11.30496 0-20.48 9.15456-20.48 20.48s9.17504 20.48 20.48 20.48L740.43392 788.48zM863.49824 604.16c0-11.32544-9.17504-20.48-20.48-20.48l-614.4 0c-11.30496 0-20.48 9.15456-20.48 20.48s9.17504 20.48 20.48 20.48l614.4 0C854.3232 624.64 863.49824 615.48544 863.49824 604.16zM208.13824 276.48c0 11.32544 9.17504 20.48 20.48 20.48l614.4 0c11.30496 0 20.48-9.15456 20.48-20.48s-9.17504-20.48-20.48-20.48l-614.4 0C217.2928 256 208.13824 265.15456 208.13824 276.48zM740.43392 460.8c11.30496 0 20.48-9.15456 20.48-20.48s-9.17504-20.48-20.48-20.48L331.18208 419.84c-11.30496 0-20.48 9.15456-20.48 20.48s9.17504 20.48 20.48 20.48L740.43392 460.8z"
    ],
    plus: [
      "M896 468.571429H555.428571V100.571429h-86.857142v368H128c-5.028571 0-9.142857 4.114286-9.142857 9.142857v68.571428c0 5.028571 4.114286 9.142857 9.142857 9.142857h340.571429v368h86.857142V555.428571h340.571429c5.028571 0 9.142857-4.114286 9.142857-9.142857v-68.571428c0-5.028571-4.114286-9.142857-9.142857-9.142857z"
    ],
    redo: [
      "M611.783111 569.344L549.622519 644.740741h284.444444l-65.498074-265.481482-59.922963 72.666074c-35.422815-28.48237-108.278519-68.342519-238.667852-68.342518-202.827852 0-280.651852 206.01363-280.651852 206.013629s116.318815-132.778667 246.215111-132.778666c97.204148-0.037926 153.865481 74.827852 176.241778 112.526222z"
    ],
    underline: [
      "M512 725.333333c166.4 0 298.666667-132.266667 298.666667-298.666666V128c0-25.6-17.066667-42.666667-42.666667-42.666667s-42.666667 17.066667-42.666667 42.666667v298.666667c0 119.466667-93.866667 213.333333-213.333333 213.333333s-213.333333-93.866667-213.333333-213.333333V128c0-25.6-17.066667-42.666667-42.666667-42.666667s-42.666667 17.066667-42.666667 42.666667v298.666667c0 166.4 132.266667 298.666667 298.666667 298.666666zM853.333333 853.333333H170.666667c-25.6 0-42.666667 17.066667-42.666667 42.666667s17.066667 42.666667 42.666667 42.666667h682.666666c25.6 0 42.666667-17.066667 42.666667-42.666667s-17.066667-42.666667-42.666667-42.666667z"
    ],
    undo: [
      "M489.244444 568.888889l60.681482 75.851852H265.481481l64.474075-265.481482 60.681481 72.05926c34.133333-30.340741 109.985185-68.266667 238.933333-68.266667 201.007407 0 280.651852 204.8 280.651852 204.8S792.651852 455.111111 663.703704 455.111111c-98.607407 0-155.496296 75.851852-174.45926 113.777778z"
    ]
  };
  var icon_default = icon;

  // src/components/BaseIcon/BaseIcon.ts
  var BaseIcon = ({
    className = "",
    paths = []
  }) => {
    return h(
      "svg",
      {
        className: classnames("base-icon", className),
        viewBox: "0 0 1137 1024",
        "aria-hidden": true
      },
      ...paths.map((item) => h("path", item))
    );
  };
  BaseIcon.displayName = "BaseIcon";

  // src/components/BaseIcon/FillColorIcon.ts
  var FillColorIcon = () => {
    return BaseIcon({
      paths: [
        {
          d: "M0 0h1024v1024H0z",
          "fill-opacity": ".01"
        },
        {
          d: "M496.512 32a128 128 0 0 1 127.84 121.6l0.16 6.4-0.032 113.504 264.256 264.256a32 32 0 0 1-8.16 51.2l-144.064 72.96-269.12 269.12a64 64 0 0 1-90.496 0l-294.144-294.176a64 64 0 0 1 0-90.496l286.016-286.08-0.192-2.048-0.064-2.08V160a128 128 0 0 1 128-128z m-6.464 197.568L128 591.616l294.144 294.144 276.32-276.32 113.792-57.632-187.776-187.776V416a32 32 0 0 1-28.256 31.776l-3.712 0.224a32 32 0 0 1-31.808-28.256L560.512 416l-0.032-115.968-70.432-70.464z m402.016 395.936l1.792 2.24 5.472 8.416c30.112 46.752 45.184 80.032 45.184 99.84a64 64 0 1 1-128 0c0-20.96 16.864-57.024 50.624-108.224a16 16 0 0 1 24.928-2.24zM496.512 96a64 64 0 0 0-63.84 59.2l-0.16 4.8-0.032 36.576 34.944-34.88a32 32 0 0 1 45.248 0l47.808 47.808V160a64 64 0 0 0-59.2-63.84L496.48 96z"
        }
      ]
    });
  };
  FillColorIcon.displayName = "FillColorIcon";

  // src/components/BaseIcon/index.ts
  var Icon = ({ name, className = "" }) => {
    const paths = icon_default[name].map((item) => ({ d: item }));
    return BaseIcon({ className, paths });
  };
  Icon.displayName = "Icon";

  // src/components/Select/index.ts
  var Select = (props) => {
    const {
      data,
      value: activeValue,
      style = {},
      onChange,
      getItemStyle = () => ({}),
      title = ""
    } = props;
    const handleChange = (event) => {
      const { value } = event.target;
      onChange(value);
    };
    return h(
      "select",
      {
        onchange: handleChange,
        value: activeValue,
        style,
        name: "select",
        className: "select-list",
        title
      },
      ...data.map((item) => {
        const value = typeof item === "object" ? item.value : item;
        const label = typeof item === "object" ? item.label : item;
        const disabled = typeof item === "object" ? item.disabled : false;
        const itemStyle = getItemStyle(value);
        return h(
          "option",
          {
            key: value,
            value,
            style: itemStyle,
            disabled: !!disabled,
            className: classnames("select-item", { disabled })
          },
          label
        );
      })
    );
  };
  Select.displayName = "Select";

  // src/components/ColorPicker/index.tsx
  var NO_FILL = "No Fill";
  var COLOR_LIST = [
    "#4D4D4D",
    "#999999",
    "#FFFFFF",
    "#F44E3B",
    "#FE9200",
    "#FCDC00",
    "#DBDF00",
    "#A4DD00",
    "#68CCCA",
    "#73D8FF",
    "#AEA1FF",
    "#FDA1FF",
    "#333333",
    "#808080",
    "#cccccc",
    "#D33115",
    "#E27300",
    "#FCC400",
    "#B0BC00",
    "#68BC00",
    "#16A5A5",
    "#009CE0",
    "#7B64FF",
    "#FA28FF",
    "#000000",
    "#666666",
    "#B3B3B3",
    "#9F0500",
    "#C45100",
    "#FB9E00",
    "#808900",
    "#194D33",
    "#0C797D",
    "#0062B1",
    "#653294",
    "#AB149E",
    NO_FILL
  ];
  var baseClassName = "color-picker-wrapper";
  var ColorPicker = (props, ...children) => {
    const { color: color2, style = {}, onChange, key } = props;
    let ref;
    const toggleVisible = (value) => {
      let className = baseClassName;
      if (value) {
        className = className + " show";
      }
      ref.className = className;
    };
    return h(
      "div",
      {
        className: "relative color-picker",
        key,
        style
      },
      h(
        "div",
        {
          className: "color-picker-trigger",
          style: {
            color: color2
          },
          onclick: () => {
            toggleVisible(true);
          }
        },
        ...children
      ),
      h(
        "div",
        {
          className: baseClassName,
          hook: {
            ref: (dom) => {
              ref = dom;
            }
          },
          onmouseleave() {
            toggleVisible(false);
          }
        },
        h(
          "div",
          {
            className: "color-picker-list"
          },
          ...COLOR_LIST.map(
            (item) => h(
              "div",
              {
                key: item,
                className: classnames("color-picker-item", {
                  "no-fill": item === NO_FILL
                }),
                style: {
                  backgroundColor: item
                },
                onclick: () => {
                  toggleVisible(false);
                  onChange(item === NO_FILL ? "" : item);
                }
              },
              item === NO_FILL ? NO_FILL : ""
            )
          )
        )
      )
    );
  };
  ColorPicker.displayName = "ColorPicker";

  // src/containers/ToolBar/index.ts
  var underlineList = [
    {
      value: 0 /* NONE */,
      label: "none"
    },
    {
      value: 1 /* SINGLE */,
      label: "single underline"
    },
    {
      value: 2 /* DOUBLE */,
      label: "double underline"
    }
  ];
  var ToolbarContainer = (state, controller) => {
    const getItemStyle = (value) => {
      return {
        "font-family": String(value),
        "font-size": "16px"
      };
    };
    const setCellStyle = (value) => {
      const cellData = controller.getCell(controller.getActiveCell());
      const styleData = cellData.style || {};
      Object.assign(styleData, value);
      controller.setCellStyle(styleData, [controller.getActiveCell()]);
    };
    const { activeCell, fontFamilyList, canRedo, canUndo } = state;
    const { style = {} } = activeCell;
    const {
      isBold = false,
      isItalic = false,
      fontSize = DEFAULT_FONT_SIZE,
      fontColor = DEFAULT_FONT_COLOR,
      fillColor = "",
      isWrapText = false,
      underline = 0 /* NONE */,
      fontFamily = ""
    } = style;
    return h(
      "div",
      {
        className: "toolbar-wrapper"
      },
      Button(
        {
          disabled: !canUndo,
          onClick() {
            controller.undo();
          },
          testId: "toolbar-undo"
        },
        Icon({ name: "undo" })
      ),
      Button(
        {
          disabled: !canRedo,
          onClick() {
            controller.redo();
          },
          testId: "toolbar-redo"
        },
        Icon({ name: "redo" })
      ),
      Select({
        data: fontFamilyList,
        value: fontFamily,
        style: {
          width: "140px"
        },
        getItemStyle,
        onChange: (value) => {
          setCellStyle({ fontFamily: String(value) });
        }
      }),
      Select({
        data: FONT_SIZE_LIST,
        value: fontSize,
        onChange: (value) => {
          setCellStyle({ fontSize: Number(value) });
        }
      }),
      Button(
        {
          active: isBold,
          onClick: () => {
            setCellStyle({
              isBold: !isBold
            });
          },
          testId: "toolbar-bold",
          title: "Bold"
        },
        Icon({ name: "bold" })
      ),
      Button(
        {
          active: isItalic,
          onClick: () => {
            setCellStyle({
              isItalic: !isItalic
            });
          },
          testId: "toolbar-italic",
          title: "Italic"
        },
        Icon({ name: "italic" })
      ),
      Select({
        data: underlineList,
        value: underline,
        style: {
          width: "130px"
        },
        title: "Underline",
        onChange: (value) => {
          setCellStyle({ underline: Number(value) });
        }
      }),
      ColorPicker(
        {
          key: "fill-color",
          color: fillColor,
          onChange: (value) => {
            setCellStyle({ fillColor: value });
          }
        },
        FillColorIcon({})
      ),
      ColorPicker(
        {
          color: fontColor,
          onChange: (value) => {
            setCellStyle({ fontColor: value });
          },
          key: "font-color"
        },
        Icon({ name: "fontColor" })
      ),
      Button(
        {
          onClick: () => {
            setCellStyle({ isWrapText: !isWrapText });
          },
          active: isWrapText,
          testId: "toolbar-wrap-text"
        },
        "Wrap Text"
      ),
      Github({})
    );
  };
  ToolbarContainer.displayName = "ToolbarContainer";

  // src/containers/SheetBar/index.ts
  var SheetBarContainer = (state, controller) => {
    return h(
      "div",
      {
        className: "sheet-bar-wrapper"
      },
      h(
        "div",
        {
          className: "sheet-bar-list"
        },
        ...state.sheetList.map((item) => {
          return h(
            "div",
            {
              key: item.sheetId,
              className: classnames("sheet-bar-item", {
                active: state.currentSheetId === item.sheetId
              }),
              onclick: () => {
                controller.setCurrentSheetId(item.sheetId);
              }
            },
            item.name
          );
        })
      ),
      h(
        "div",
        {
          className: "sheet-bar-add"
        },
        Button(
          {
            onClick: () => {
              controller.addSheet();
            },
            type: "circle",
            style: {
              backgroundColor: theme.buttonActiveColor
            }
          },
          Icon({
            name: "plus"
          })
        )
      )
    );
  };
  SheetBarContainer.displayName = "SheetBarContainer";

  // src/containers/ContextMenu/index.ts
  var defaultStyle = {
    display: "none"
  };
  var ContextMenuContainer = (state, controller) => {
    const { contextMenuPosition } = state;
    const style = contextMenuPosition === void 0 ? defaultStyle : {
      top: contextMenuPosition.top,
      left: contextMenuPosition.left
    };
    const hideContextMenu = () => {
      state.contextMenuPosition = void 0;
    };
    return h(
      "div",
      {
        className: "context-menu",
        style
      },
      Button(
        {
          onClick() {
            controller.addCol(controller.getActiveCell().col, 1);
            hideContextMenu();
          }
        },
        "add a column"
      ),
      Button(
        {
          onClick() {
            controller.deleteCol(controller.getActiveCell().col, 1);
            hideContextMenu();
          }
        },
        "delete a column"
      ),
      Button(
        {
          onClick() {
            controller.addRow(controller.getActiveCell().row, 1);
            hideContextMenu();
          }
        },
        "add a row"
      ),
      Button(
        {
          onClick() {
            controller.deleteRow(controller.getActiveCell().row, 1);
            hideContextMenu();
          }
        },
        "delete a row"
      ),
      Button(
        {
          onClick() {
            controller.copy();
            hideContextMenu();
          }
        },
        "copy"
      ),
      Button(
        {
          onClick() {
            controller.cut();
            hideContextMenu();
          }
        },
        "cut"
      ),
      Button(
        {
          onClick() {
            controller.paste();
            hideContextMenu();
          }
        },
        "paste"
      )
    );
  };
  ContextMenuContainer.displayName = "ContextMenuContainer";

  // src/App.ts
  var App = (state, controller) => {
    return h(
      "div",
      {
        className: "app-container"
      },
      ToolbarContainer(state, controller),
      FormulaBarContainer(state, controller),
      CanvasContainer(state, controller),
      SheetBarContainer(state, controller),
      ContextMenuContainer(state, controller)
    );
  };
  App.displayName = "App";

  // src/controller/Controller.ts
  var ROW_TITLE_HEIGHT = 19;
  var COL_TITLE_WIDTH = 34;
  var defaultScrollValue = {
    top: 0,
    left: 0,
    row: 0,
    col: 0,
    scrollLeft: 0,
    scrollTop: 0
  };
  var Controller = class {
    scrollValue = {};
    model;
    changeSet = /* @__PURE__ */ new Set();
    copyRanges = [];
    cutRanges = [];
    hooks = {
      modelChange() {
      },
      async cut() {
        return "";
      },
      async copy() {
        return "";
      },
      async paste() {
        return {
          [HTML_FORMAT]: "",
          [PLAIN_FORMAT]: ""
        };
      }
    };
    // sheet size
    viewSize = {
      width: 0,
      height: 0
    };
    headerSize = {
      width: COL_TITLE_WIDTH,
      height: ROW_TITLE_HEIGHT
    };
    mainDom = {};
    constructor(model) {
      this.model = model;
    }
    getCurrentSheetId() {
      return this.model.getCurrentSheetId();
    }
    getSheetList() {
      return this.model.getSheetList();
    }
    getCellsContent(sheetId) {
      return this.model.getCellsContent(sheetId);
    }
    getSheetInfo(sheetId) {
      return this.model.getSheetInfo(sheetId);
    }
    setHooks(hooks2) {
      this.hooks = hooks2;
    }
    emitChange() {
      controllerLog("emitChange", this.changeSet);
      this.hooks.modelChange(this.changeSet);
      this.changeSet = /* @__PURE__ */ new Set();
      this.model.record();
    }
    getActiveCell() {
      const currentSheetId = this.model.getCurrentSheetId();
      const { activeCell } = this.getSheetInfo(currentSheetId);
      return {
        ...activeCell,
        sheetId: activeCell.sheetId || currentSheetId
      };
    }
    setSheetCell(range) {
      const { row, col, sheetId } = range;
      const id = sheetId || this.model.getCurrentSheetId();
      const sheetInfo = this.model.getSheetInfo(id);
      if (row < 0 || col < 0 || row >= sheetInfo.rowCount || col >= sheetInfo.colCount) {
        return false;
      }
      range.sheetId = id;
      this.model.setActiveCell(range);
      return true;
    }
    setActiveCell(range) {
      if (!this.setSheetCell(range)) {
        return;
      }
      this.changeSet.add("selection");
      this.emitChange();
    }
    setCurrentSheetId(id) {
      if (id === this.getCurrentSheetId()) {
        return;
      }
      this.model.setCurrentSheetId(id);
      const pos = this.getActiveCell();
      this.setSheetCell(pos);
      this.computeViewSize();
      this.setScroll(this.getScroll());
    }
    addSheet() {
      this.model.addSheet();
      this.setSheetCell({
        row: 0,
        col: 0,
        rowCount: 1,
        colCount: 1,
        sheetId: ""
      });
      this.computeViewSize();
      this.setScroll({
        top: 0,
        left: 0,
        row: 0,
        col: 0,
        scrollLeft: 0,
        scrollTop: 0
      });
    }
    fromJSON(json) {
      controllerLog("loadJSON", json);
      this.model.fromJSON(json);
      const activeCell = this.getActiveCell();
      this.setSheetCell(activeCell);
      this.computeViewSize();
      this.changeSet.add("content");
      this.emitChange();
    }
    toJSON() {
      return this.model.toJSON();
    }
    setCellValues(value, style, ranges) {
      controllerLog("setCellValue", value);
      this.model.setCellValues(value, style, ranges);
      this.changeSet.add("content");
      this.emitChange();
    }
    setCellStyle(style, ranges) {
      if (isEmpty(style)) {
        return;
      }
      this.model.setCellStyle(style, ranges);
      this.changeSet.add("content");
      this.emitChange();
    }
    getCell = (range) => {
      const result = this.model.getCell(range);
      return result;
    };
    canRedo() {
      return this.model.canRedo();
    }
    canUndo() {
      return this.model.canUndo();
    }
    undo() {
      this.model.undo();
      this.changeSet.add("content");
      this.emitChange();
    }
    redo() {
      this.model.redo();
      this.changeSet.add("content");
      this.emitChange();
    }
    getColWidth(col) {
      return this.model.getColWidth(col);
    }
    setColWidth(col, width) {
      this.model.setColWidth(col, width);
      this.computeViewSize();
      this.changeSet.add("content");
    }
    getRowHeight(row) {
      return this.model.getRowHeight(row);
    }
    setRowHeight(row, height) {
      this.model.setRowHeight(row, height);
      this.computeViewSize();
      this.changeSet.add("content");
    }
    computeViewSize() {
      const headerSize = this.getHeaderSize();
      const sheetInfo = this.model.getSheetInfo(this.model.getCurrentSheetId());
      let width = headerSize.width;
      let height = headerSize.height;
      for (let i = 0; i < sheetInfo.colCount; i++) {
        width += this.getColWidth(i);
      }
      for (let i = 0; i < sheetInfo.rowCount; i++) {
        height += this.getRowHeight(i);
      }
      this.viewSize = {
        width,
        height
      };
    }
    getViewSize() {
      return {
        ...this.viewSize
      };
    }
    getCellSize(row, col) {
      return { width: this.getColWidth(col), height: this.getRowHeight(row) };
    }
    getHeaderSize() {
      return {
        ...this.headerSize
      };
    }
    computeCellPosition(row, col) {
      const size2 = this.getHeaderSize();
      const scroll = this.getScroll();
      let resultX = size2.width;
      let resultY = size2.height;
      let r = scroll.row;
      let c = scroll.col;
      while (c < col) {
        resultX += this.getColWidth(c);
        c++;
      }
      while (r < row) {
        resultY += this.getRowHeight(r);
        r++;
      }
      const cellSize = this.getCellSize(row, col);
      return { ...cellSize, top: resultY, left: resultX };
    }
    addRow(rowIndex, count) {
      this.model.addRow(rowIndex, count);
      this.changeSet.add("content");
      this.emitChange();
    }
    addCol(colIndex, count) {
      this.model.addCol(colIndex, count);
      this.changeSet.add("content");
      this.emitChange();
    }
    deleteCol(colIndex, count) {
      this.model.deleteCol(colIndex, count);
      this.changeSet.add("content");
      this.emitChange();
    }
    deleteRow(rowIndex, count) {
      this.model.deleteRow(rowIndex, count);
      this.changeSet.add("content");
      this.emitChange();
    }
    getChangeSet() {
      const result = this.changeSet;
      this.changeSet = /* @__PURE__ */ new Set();
      return result;
    }
    getScroll() {
      const sheetId = this.model.getCurrentSheetId();
      const result = this.scrollValue[sheetId] || defaultScrollValue;
      return result;
    }
    setScroll(data) {
      const sheetId = this.model.getCurrentSheetId();
      this.scrollValue[sheetId] = {
        ...data
      };
      if (data.row > 9999) {
        this.headerSize = {
          width: Math.floor(COL_TITLE_WIDTH * 2),
          height: ROW_TITLE_HEIGHT
        };
      } else {
        this.headerSize = {
          width: COL_TITLE_WIDTH,
          height: ROW_TITLE_HEIGHT
        };
      }
      this.changeSet.add("content");
      this.emitChange();
    }
    parseText(text) {
      let list;
      if (text.indexOf("\r\n") > -1) {
        list = text.split("\r\n").map((item) => item).map((item) => item.split("	"));
      } else {
        list = text.split("\n").map((item) => item).map((item) => item.split("	"));
      }
      if (list[0].length !== list[list.length - 1].length) {
        const last = list[list.length - 1];
        if (last.length === 1 && !last[0]) {
          list.pop();
        }
      }
      const rowCount = list.length;
      let colCount = 0;
      for (let item of list) {
        if (item.length > colCount) {
          colCount = item.length;
        }
      }
      if (list.length === 0) {
        return;
      }
      const activeCell = this.getActiveCell();
      const range = {
        ...activeCell,
        rowCount,
        colCount
      };
      this.model.setCellValues(list, [], [range]);
      this.changeSet.add("content");
      this.setActiveCell(range);
    }
    parseHTML(htmlString) {
      const parser = new DOMParser();
      const text = htmlString.replace("<style>\r\n<!--table", "<style>").replace("-->\r\n</style>", "</style>");
      const doc = parser.parseFromString(text, "text/html");
      const trList = doc.querySelectorAll("tr");
      const styleList = doc.querySelectorAll("style");
      const result = [];
      const resultStyle = [];
      const rowCount = trList.length;
      let colCount = 0;
      for (const item of trList) {
        const tdList = item.querySelectorAll("td");
        const temp = [];
        const list = [];
        for (const td of tdList) {
          let itemStyle = {};
          if (td.className) {
            itemStyle = parseStyle(styleList, "." + td.className);
          } else {
            itemStyle = parseStyle(styleList, td.tagName.toLowerCase());
          }
          list.push(itemStyle);
          temp.push(td.textContent || "");
        }
        result.push(temp);
        resultStyle.push(list);
        if (temp.length > colCount) {
          colCount = temp.length;
        }
      }
      if (result.length === 0) {
        return;
      }
      const activeCell = this.getActiveCell();
      const range = {
        ...activeCell,
        rowCount,
        colCount
      };
      this.model.setCellValues(result, resultStyle, [range]);
      this.changeSet.add("content");
      this.setActiveCell(range);
    }
    async paste(event) {
      this.copyRanges = [];
      if (this.cutRanges.length > 0) {
        const [range] = this.cutRanges;
        const result = [];
        for (let i = 0; i < range.rowCount; i++) {
          result.push(new Array(range.colCount).fill(""));
        }
        this.model.setCellValues(result, [], this.cutRanges);
      }
      let html = "";
      let text = "";
      if (!event) {
        const data = await this.hooks.paste();
        html = data[HTML_FORMAT];
        text = data[PLAIN_FORMAT];
      } else {
        html = event.clipboardData?.getData(HTML_FORMAT) || "";
        text = event.clipboardData?.getData(PLAIN_FORMAT) || "";
      }
      if (html) {
        this.parseHTML(html);
      } else {
        this.parseText(text);
      }
      if (this.cutRanges.length) {
        this.cutRanges = [];
        this.hooks.copy({
          [PLAIN_FORMAT]: "",
          [HTML_FORMAT]: ""
        });
      }
    }
    getCopyData() {
      const { row, col, rowCount, colCount } = this.getActiveCell();
      const result = [];
      const html = [];
      let index = 1;
      const classList = [];
      const currentSheetId = this.model.getCurrentSheetId();
      for (let r = row, endRow = row + rowCount; r < endRow; r++) {
        const temp = [];
        const t = [];
        for (let c = col, endCol = col + colCount; c < endCol; c++) {
          const a = this.model.getCell(new Range(r, c, 1, 1, currentSheetId));
          const str = String(a.value || "");
          temp.push(str);
          if (a.style) {
            let text2 = convertCanvasStyleToString(a.style);
            if (!str) {
              text2 += "mso-pattern:black none;";
            }
            const className = `xl${index++}`;
            classList.push(`.${className}{${text2}}`);
            t.push(`<td class="${className}"> ${str} </td>`);
          } else {
            t.push(`<td> ${str} </td>`);
          }
        }
        result.push(temp);
        html.push(t);
      }
      const htmlData = generateHTML(
        classList.join("\n"),
        html.map((item) => `<tr>${item.join("\n")}</tr>`).join("\n")
      );
      const text = result.map((item) => item.join("	")).join("\r\n") + "\r\n";
      return {
        [PLAIN_FORMAT]: text,
        [HTML_FORMAT]: htmlData
      };
    }
    copy(event) {
      this.copyRanges = [this.getActiveCell()];
      const data = this.getCopyData();
      if (event) {
        const keyList = Object.keys(data);
        for (const key of keyList) {
          event.clipboardData?.setData(key, data[key]);
        }
      } else {
        this.hooks.copy(data);
      }
      this.changeSet.add("selection");
      this.emitChange();
    }
    cut(event) {
      this.cutRanges = [this.getActiveCell()];
      this.copy(event);
    }
    getCopyRanges() {
      return this.copyRanges.slice();
    }
    getDomRect() {
      const canvas = this.getMainDom().canvas;
      if (!canvas) {
        return {
          top: 0,
          left: 0,
          width: 0,
          height: 0
        };
      }
      const size2 = canvas.parentElement.getBoundingClientRect();
      return {
        top: size2.top,
        left: size2.left,
        width: size2.width,
        height: size2.height
      };
    }
    setMainDom(dom) {
      this.mainDom = Object.assign(this.mainDom, dom);
    }
    getMainDom() {
      return this.mainDom;
    }
  };

  // src/parser/token.ts
  var Token = class {
    type;
    value;
    constructor(type, value) {
      this.type = type;
      this.value = value;
    }
    error() {
      return `type:${this.type},value:${this.value}`;
    }
  };

  // src/parser/formula/error.ts
  var CustomError = class extends Error {
    value;
    constructor(value) {
      super(value);
      this.value = value;
    }
  };
  var paramsError = new CustomError("#VALUE!");
  var resultError = new CustomError("#NUM!");
  function assert2(condition, message = "#VALUE!") {
    if (!condition) {
      throw new CustomError(message);
    }
  }
  function mustOne(list) {
    assert2(list.length === 1);
    const [value] = list;
    return value;
  }
  function mustOneString(list) {
    const value = mustOne(list);
    assert2(typeof value === "string");
    return value;
  }
  function mustOneNumber(list) {
    const value = mustOne(list);
    assert2(typeof value === "number" && !isNaN(value));
    return value;
  }
  function mustEmpty(list) {
    assert2(list.length === 0);
  }

  // src/parser/formula/text.ts
  var T = (...list) => {
    const value = mustOne(list);
    return typeof value === "string" ? value : "";
  };
  var LOWER = (...list) => {
    const value = mustOneString(list);
    return value.toLowerCase();
  };
  var CHAR = (...list) => {
    const value = mustOneNumber(list);
    return String.fromCharCode(value);
  };
  var CODE = (...list) => {
    const value = mustOneString(list);
    return value.charCodeAt(0);
  };
  var LEN = (...list) => {
    const value = mustOneString(list);
    return value.length;
  };
  var SPLIT = (...list) => {
    assert2(list.length === 2);
    const [value, sep] = list;
    assert2(typeof value === "string");
    assert2(typeof sep === "string");
    return value.split(sep);
  };
  var UPPER = (...list) => {
    const value = mustOneString(list);
    return value.toUpperCase();
  };
  var TRIM = (...list) => {
    const value = mustOneString(list);
    return value.replace(/ +/g, " ").trim();
  };
  var CONCAT = (...list) => {
    assert2(list.length <= MAX_PARAMS_COUNT);
    return list.join("");
  };
  var textFormulas = {
    CONCAT,
    CONCATENATE: CONCAT,
    SPLIT,
    CHAR,
    CODE,
    UNICHAR: CHAR,
    UNICODE: CODE,
    LEN,
    LOWER,
    UPPER,
    TRIM,
    T
  };
  var text_default = textFormulas;

  // src/parser/formula/math.ts
  var ABS = (...list) => {
    const data = mustOneNumber(list);
    return Math.abs(data);
  };
  var ACOS = (...list) => {
    const data = mustOneNumber(list);
    return Math.acos(data);
  };
  var ACOSH = (...list) => {
    const data = mustOneNumber(list);
    return Math.log(data + Math.sqrt(data * data - 1));
  };
  var ACOT = (...list) => {
    const data = mustOneNumber(list);
    return Math.atan(1 / data);
  };
  var ACOTH = (...list) => {
    const data = mustOneNumber(list);
    return 0.5 * Math.log((data + 1) / (data - 1));
  };
  var ASIN = (...list) => {
    const data = mustOneNumber(list);
    return Math.asin(data);
  };
  var ASINH = (...list) => {
    const data = mustOneNumber(list);
    return Math.log(data + Math.sqrt(data * data + 1));
  };
  var ATAN = (...list) => {
    const data = mustOneNumber(list);
    return Math.atan(data);
  };
  var ATAN2 = (...list) => {
    assert2(list.length === 2);
    const [x, y] = list;
    assert2(typeof x === "number");
    assert2(typeof y === "number");
    return Math.atan2(x, y);
  };
  var ATANH = (...list) => {
    const data = mustOneNumber(list);
    return Math.log((1 + data) / (data + 1)) / 2;
  };
  var COS = (...list) => {
    const data = mustOneNumber(list);
    return Math.cos(data);
  };
  var COT = (...list) => {
    const data = mustOneNumber(list);
    return 1 / Math.tan(data);
  };
  var EXP = (...list) => {
    const data = mustOneNumber(list);
    return Math.exp(data);
  };
  var INT = (...list) => {
    const data = mustOneNumber(list);
    return Math.floor(data);
  };
  var PI = (...list) => {
    mustEmpty(list);
    return Math.PI;
  };
  var E = (...list) => {
    mustEmpty(list);
    return Math.E;
  };
  var SIN = (...list) => {
    const data = mustOneNumber(list);
    return Math.sin(data);
  };
  var SUM = (...rest) => {
    const list = parseNumberArray(rest);
    assert2(list.length <= MAX_PARAMS_COUNT);
    return list.reduce((sum, cur) => sum + cur, 0);
  };
  var formulas = {
    ABS,
    ACOS,
    ACOSH,
    ACOT,
    ACOTH,
    ASIN,
    ASINH,
    ATAN,
    ATAN2,
    ATANH,
    COT,
    COS,
    EXP,
    INT,
    PI,
    E,
    SIN,
    SUM
  };
  var math_default = formulas;

  // src/parser/formula/index.ts
  var formulas2 = {
    ...text_default,
    ...math_default
  };
  var formula_default = formulas2;

  // src/parser/scanner.ts
  var emptyData = "";
  var identifierMap = /* @__PURE__ */ new Map([
    ["TRUE", 19 /* TRUE */],
    ["FALSE", 20 /* FALSE */]
  ]);
  var Scanner = class {
    list;
    current = 0;
    start = 0;
    tokens = [];
    constructor(source) {
      this.list = [...source];
    }
    scan() {
      while (!this.isAtEnd()) {
        this.start = this.current;
        this.scanToken();
      }
      this.tokens.push(new Token(27 /* EOF */, ""));
      if (this.tokens.length > 0 && this.tokens[0].type === 0 /* EQUAL */) {
        this.tokens.shift();
      }
      return this.tokens;
    }
    peek() {
      if (this.isAtEnd()) {
        return emptyData;
      }
      return this.list[this.current];
    }
    match(text) {
      if (this.peek() !== text) {
        return false;
      }
      this.next();
      return true;
    }
    next() {
      if (this.isAtEnd()) {
        return emptyData;
      }
      return this.list[this.current++];
    }
    isAtEnd() {
      return this.current >= this.list.length;
    }
    addToken(type) {
      const text = this.list.slice(this.start, this.current).join("");
      this.tokens.push(new Token(type, text));
    }
    string(end) {
      while (!this.isAtEnd() && this.peek() !== end) {
        this.next();
      }
      if (this.peek() !== end) {
        throw new CustomError("#VALUE!");
      } else {
        this.next();
      }
      const text = this.list.slice(this.start + 1, this.current - 1).join("");
      this.tokens.push(new Token(17 /* STRING */, text));
    }
    number() {
      while (!this.isAtEnd() && this.isDigit(this.peek())) {
        this.next();
      }
      if (this.match(".")) {
        while (!this.isAtEnd() && this.isDigit(this.peek())) {
          this.next();
        }
      }
      this.addToken(18 /* NUMBER */);
    }
    isDigit(char) {
      return char >= "0" && char <= "9";
    }
    identifier() {
      while (!this.isAtEnd() && this.anyChar(this.peek())) {
        this.next();
      }
      let text = this.list.slice(this.start, this.current).join("");
      const temp = identifierMap.get(text.toUpperCase());
      let type = 16 /* IDENTIFIER */;
      if (temp) {
        text = text.toUpperCase();
        type = temp;
      }
      this.tokens.push(new Token(type, text));
    }
    scanToken() {
      const c = this.next();
      switch (c) {
        case "(":
          this.addToken(21 /* LEFT_BRACKET */);
          break;
        case ")":
          this.addToken(22 /* RIGHT_BRACKET */);
          break;
        case ",":
          this.addToken(11 /* COMMA */);
          break;
        case ":":
          this.addToken(10 /* COLON */);
          break;
        case "=":
          this.addToken(0 /* EQUAL */);
          break;
        case "<":
          if (this.match(">")) {
            this.addToken(1 /* NOT_EQUAL */);
          } else if (this.match("=")) {
            this.addToken(15 /* LESS_EQUAL */);
          } else {
            this.addToken(14 /* LESS */);
          }
          break;
        case ">":
          if (this.match("=")) {
            this.addToken(8 /* GREATER_EQUAL */);
          } else {
            this.addToken(7 /* GREATER */);
          }
          break;
        case "+":
          this.addToken(2 /* PLUS */);
          break;
        case "-":
          this.addToken(3 /* MINUS */);
          break;
        case "*":
          this.addToken(4 /* STAR */);
          break;
        case "/":
          this.addToken(5 /* SLASH */);
          break;
        case "^":
          this.addToken(6 /* EXPONENT */);
          break;
        case "&":
          this.addToken(9 /* CONCATENATE */);
          break;
        case "%":
          this.addToken(13 /* PERCENT */);
          break;
        case '"':
          this.string(c);
          break;
        case "!":
          this.addToken(26 /* EXCLAMATION */);
          break;
        case ";":
          this.addToken(25 /* SEMICOLON */);
          break;
        case "{":
          this.addToken(23 /* lEFT_BRACE */);
          break;
        case "}":
          this.addToken(24 /* RIGHT_BRACE */);
          break;
        case " ":
          break;
        case "\r":
        case "	":
        case "\n":
          break;
        default:
          if (this.isDigit(c)) {
            this.number();
          } else if (this.anyChar(c)) {
            this.identifier();
          } else {
            throw new CustomError("#ERROR!");
          }
          break;
      }
    }
    anyChar(c) {
      const text = '(),:=<>+-*/^&%"{}!';
      return !text.includes(c) && !this.isWhiteSpace(c);
    }
    isWhiteSpace(c) {
      return c === " " || c === "\r" || c === "\n" || c === "	";
    }
  };

  // src/parser/expression.ts
  var BinaryExpression = class {
    left;
    right;
    operator;
    constructor(left, operator, right) {
      this.left = left;
      this.operator = operator;
      this.right = right;
    }
    accept(visitor) {
      return visitor.visitBinaryExpression(this);
    }
    toString() {
      return "";
    }
  };
  var UnaryExpression = class {
    right;
    operator;
    constructor(operator, right) {
      this.operator = operator;
      this.right = right;
    }
    accept(visitor) {
      return visitor.visitUnaryExpression(this);
    }
    toString() {
      return "";
    }
  };
  var PostUnaryExpression = class {
    left;
    operator;
    constructor(operator, left) {
      this.operator = operator;
      this.left = left;
    }
    accept(visitor) {
      return visitor.visitPostUnaryExpression(this);
    }
    toString() {
      return "";
    }
  };
  var LiteralExpression = class {
    value;
    constructor(value) {
      this.value = value;
    }
    accept(visitor) {
      return visitor.visitLiteralExpression(this);
    }
    toString() {
      return "";
    }
  };
  var CellExpression = class {
    value;
    sheetName;
    type;
    constructor(value, type, sheetName) {
      this.value = value;
      this.sheetName = sheetName;
      this.type = type;
    }
    accept(visitor) {
      return visitor.visitCellExpression(this);
    }
    toString() {
      return "";
    }
  };
  var CallExpression = class {
    name;
    params;
    constructor(name, params) {
      this.name = name;
      this.params = params;
    }
    accept(visitor) {
      return visitor.visitCallExpression(this);
    }
    toString() {
      return "";
    }
  };
  var ErrorExpression = class {
    value;
    constructor(value) {
      this.value = value;
    }
    accept(visitor) {
      return visitor.visitErrorExpression(this);
    }
    toString() {
      return "";
    }
  };
  var CellRangeExpression = class {
    left;
    right;
    operator;
    constructor(left, operator, right) {
      this.left = left;
      this.operator = operator;
      this.right = right;
    }
    accept(visitor) {
      return visitor.visitCellRangeExpression(this);
    }
    toString() {
      return "";
    }
  };
  var GroupExpression = class {
    value;
    constructor(value) {
      this.value = value;
    }
    accept(visitor) {
      return visitor.visitGroupExpression(this);
    }
    toString() {
      return "";
    }
  };
  var DefineNameExpression = class {
    value;
    constructor(value) {
      this.value = value;
    }
    accept(visitor) {
      return visitor.visitDefineNameExpression(this);
    }
    toString() {
      return "";
    }
  };

  // src/parser/parser.ts
  var errorSet = /* @__PURE__ */ new Set([
    "#ERROR!",
    "#DIV/0!",
    "#NULL!",
    "#NUM!",
    "#REF!",
    "#VALUE!",
    "#N/A",
    "#NAME?"
  ]);
  var Parser = class {
    tokens;
    current = 0;
    constructor(tokens) {
      this.tokens = tokens;
    }
    parse() {
      const result = [];
      while (!this.isAtEnd()) {
        result.push(this.expression());
      }
      return result;
    }
    expression() {
      return this.comparison();
    }
    comparison() {
      let expr = this.concatenate();
      while (this.match(
        0 /* EQUAL */,
        1 /* NOT_EQUAL */,
        7 /* GREATER */,
        8 /* GREATER_EQUAL */,
        14 /* LESS */,
        15 /* LESS_EQUAL */
      )) {
        const operator = this.previous();
        const right = this.concatenate();
        expr = new BinaryExpression(expr, operator, right);
      }
      return expr;
    }
    concatenate() {
      let expr = this.term();
      while (this.match(9 /* CONCATENATE */)) {
        const operator = this.previous();
        const right = this.term();
        expr = new BinaryExpression(expr, operator, right);
      }
      return expr;
    }
    term() {
      let expr = this.factor();
      while (this.match(2 /* PLUS */, 3 /* MINUS */)) {
        const operator = this.previous();
        const right = this.factor();
        expr = new BinaryExpression(expr, operator, right);
      }
      return expr;
    }
    factor() {
      let expr = this.expo();
      while (this.match(5 /* SLASH */, 4 /* STAR */)) {
        const operator = this.previous();
        const right = this.expo();
        expr = new BinaryExpression(expr, operator, right);
      }
      return expr;
    }
    expo() {
      let expr = this.unary();
      while (this.match(6 /* EXPONENT */)) {
        const operator = this.previous();
        const right = this.unary();
        expr = new BinaryExpression(expr, operator, right);
      }
      return expr;
    }
    unary() {
      if (this.match(2 /* PLUS */, 3 /* MINUS */)) {
        const operator = this.previous();
        const right = this.unary();
        return new UnaryExpression(operator, right);
      }
      return this.postUnary();
    }
    postUnary() {
      let expr = this.spread();
      if (this.match(13 /* PERCENT */)) {
        const operator = this.previous();
        expr = new PostUnaryExpression(operator, expr);
      }
      return expr;
    }
    spread() {
      let expr = this.call();
      while (this.match(10 /* COLON */)) {
        const operator = this.previous();
        const right = this.call();
        expr = new CellRangeExpression(expr, operator, right);
      }
      return expr;
    }
    call() {
      let expr = this.primary();
      if (this.match(21 /* LEFT_BRACKET */)) {
        if (expr instanceof DefineNameExpression) {
          expr = this.finishCall(expr.value);
        } else {
          throw new CustomError("#NAME?");
        }
      }
      return expr;
    }
    finishCall(name) {
      const params = [];
      if (!this.check(22 /* RIGHT_BRACKET */)) {
        do {
          params.push(this.expression());
        } while (this.match(11 /* COMMA */));
      }
      this.expect(22 /* RIGHT_BRACKET */);
      let realName = name;
      if (name.value[0] === "@") {
        realName = new Token(16 /* IDENTIFIER */, name.value.slice(1));
      }
      return new CallExpression(realName, params);
    }
    primary() {
      if (this.match(
        18 /* NUMBER */,
        17 /* STRING */,
        19 /* TRUE */,
        20 /* FALSE */
      )) {
        return new LiteralExpression(this.previous());
      }
      if (this.match(16 /* IDENTIFIER */)) {
        const name = this.previous();
        const { value, type } = name;
        const realValue = value.toUpperCase();
        if (errorSet.has(realValue)) {
          return new ErrorExpression(new Token(type, realValue));
        }
        if (this.match(26 /* EXCLAMATION */)) {
          const expr = this.expression();
          if (expr instanceof CellExpression) {
            return new CellExpression(expr.value, expr.type, name);
          }
          throw new CustomError("#REF!");
        }
        if (/^[a-z]+$/i.test(value)) {
          return new DefineNameExpression(name);
        }
        const newToken = new Token(type, realValue);
        if (/^\$[A-Z]+\$\d+$/.test(realValue) || /^\$[A-Z]+$/.test(realValue) || /^\$\d+$/.test(realValue)) {
          return new CellExpression(newToken, "absolute", null);
        }
        if (/^\$[A-Z]+\d+$/.test(realValue) || /^[A-Z]+\$\d+$/.test(realValue)) {
          return new CellExpression(newToken, "mixed", null);
        }
        if (/^[A-Z]+\d+$/.test(realValue) || /^[A-Z]+$/.test(realValue)) {
          return new CellExpression(newToken, "relative", null);
        }
      }
      if (this.match(21 /* LEFT_BRACKET */)) {
        const value = this.expression();
        this.expect(22 /* RIGHT_BRACKET */);
        return new GroupExpression(value);
      }
      throw new CustomError("#ERROR!");
    }
    match(...types) {
      const type = this.peek().type;
      if (types.includes(type)) {
        this.next();
        return true;
      }
      return false;
    }
    previous() {
      return this.tokens[this.current - 1];
    }
    check(type) {
      return this.peek().type === type;
    }
    expect(type) {
      if (this.check(type)) {
        this.next();
        return this.previous();
      } else {
        throw new CustomError("#ERROR!");
      }
    }
    next() {
      this.current++;
    }
    isAtEnd() {
      return this.peek().type === 27 /* EOF */;
    }
    peek() {
      if (this.current < this.tokens.length) {
        return this.tokens[this.current];
      }
      return new Token(27 /* EOF */, "");
    }
  };

  // src/parser/interpreter.ts
  var Interpreter = class {
    expressions;
    functionMap;
    cellDataMap;
    variableMap;
    constructor(expressions, cellDataMap, variableMap, functionMap) {
      this.expressions = expressions;
      this.functionMap = functionMap;
      this.cellDataMap = cellDataMap;
      this.variableMap = variableMap;
    }
    interpret() {
      const result = [];
      for (const item of this.expressions) {
        result.push(this.evaluate(item));
      }
      if (result.length === 1) {
        return this.getRangeCellValue(result[0]);
      } else {
        throw new CustomError("#ERROR!");
      }
    }
    getRangeCellValue(value) {
      if (value instanceof Range) {
        if (value.colCount === value.rowCount && value.colCount === 1) {
          return this.cellDataMap.get(value.row, value.col, value.sheetId);
        } else {
          throw new CustomError("#REF!");
        }
      }
      return value;
    }
    checkNumber(value) {
      if (typeof value !== "number") {
        throw new CustomError("#VALUE!");
      }
    }
    visitBinaryExpression(data) {
      let left = this.evaluate(data.left);
      let right = this.evaluate(data.right);
      left = this.getRangeCellValue(left);
      right = this.getRangeCellValue(right);
      switch (data.operator.type) {
        case 3 /* MINUS */:
          this.checkNumber(left);
          this.checkNumber(right);
          return left - right;
        case 2 /* PLUS */:
          this.checkNumber(left);
          this.checkNumber(right);
          return left + right;
        case 5 /* SLASH */:
          this.checkNumber(left);
          this.checkNumber(right);
          if (right === 0) {
            throw new CustomError("#DIV/0!");
          }
          return left / right;
        case 4 /* STAR */:
          this.checkNumber(left);
          this.checkNumber(right);
          return left * right;
        case 6 /* EXPONENT */:
          this.checkNumber(left);
          this.checkNumber(right);
          return Math.pow(left, right);
        case 0 /* EQUAL */:
          return left === right;
        case 1 /* NOT_EQUAL */:
          return left !== right;
        case 7 /* GREATER */:
          return left > right;
        case 8 /* GREATER_EQUAL */:
          return left >= right;
        case 14 /* LESS */:
          return left < right;
        case 15 /* LESS_EQUAL */:
          return left <= right;
        case 9 /* CONCATENATE */:
          return `${left}${right}`;
        default:
          throw new CustomError("#VALUE!");
      }
    }
    visitCallExpression(expr) {
      const funcName = expr.name.value.toUpperCase();
      const callee = this.functionMap[funcName];
      if (callee && typeof callee === "function") {
        const params = [];
        for (const item of expr.params) {
          const t = this.evaluate(item);
          if (t instanceof Range) {
            const { row, col, rowCount, colCount, sheetId } = t;
            for (let r = row, endRow = row + rowCount; r < endRow; r++) {
              for (let c = col, endCol = col + colCount; c < endCol; c++) {
                params.push(this.cellDataMap.get(r, c, sheetId));
              }
            }
          } else {
            params.push(t);
          }
        }
        return callee(...params);
      }
      throw new CustomError("#NAME?");
    }
    visitCellExpression(data) {
      let sheetId = "";
      if (data.sheetName) {
        sheetId = this.cellDataMap.convertSheetNameToSheetId(
          data.sheetName.value
        );
      }
      const t = parseCell(data.value.value);
      if (t === null) {
        throw new CustomError("#REF!");
      }
      if (sheetId) {
        t.sheetId = sheetId;
      }
      return t;
    }
    visitErrorExpression(data) {
      throw new CustomError(data.value.value);
    }
    visitLiteralExpression(expr) {
      const { type, value } = expr.value;
      switch (type) {
        case 17 /* STRING */:
          return value;
        case 18 /* NUMBER */:
          return parseFloat(value);
        case 19 /* TRUE */:
          return true;
        case 20 /* FALSE */:
          return false;
        default:
          throw new CustomError("#ERROR!");
      }
    }
    visitDefineNameExpression(expr) {
      if (!this.variableMap.has(expr.value.value)) {
        throw new CustomError("#NAME?");
      }
      const result = this.variableMap.get(expr.value.value);
      return result;
    }
    visitUnaryExpression(data) {
      const value = this.evaluate(data.right);
      switch (data.operator.type) {
        case 3 /* MINUS */:
          return -value;
        case 2 /* PLUS */:
          return value;
        default:
          throw new CustomError("#VALUE!");
      }
    }
    convertToCellExpression(expr) {
      if (expr instanceof CellExpression) {
        return expr;
      }
      if (expr instanceof DefineNameExpression) {
        return new CellExpression(
          new Token(16 /* IDENTIFIER */, expr.value.value.toUpperCase()),
          "relative",
          null
        );
      }
      if (expr instanceof LiteralExpression) {
        if (expr.value.type === 18 /* NUMBER */ && /^\d+$/.test(expr.value.value)) {
          return new CellExpression(
            new Token(16 /* IDENTIFIER */, expr.value.value),
            "relative",
            null
          );
        }
      }
      return null;
    }
    visitCellRangeExpression(expr) {
      switch (expr.operator.type) {
        case 10 /* COLON */: {
          const left = this.convertToCellExpression(expr.left);
          const right = this.convertToCellExpression(expr.right);
          if (left !== null && right !== null) {
            const a = this.visitCellExpression(left);
            const b = this.visitCellExpression(right);
            const result = mergeRange(a, b);
            if (result === null) {
              throw new CustomError("#VALUE!");
            }
            return result;
          } else {
            throw new CustomError("#REF!");
          }
          break;
        }
        default:
          throw new CustomError("#REF!");
      }
    }
    visitGroupExpression(expr) {
      return this.evaluate(expr.value);
    }
    visitPostUnaryExpression(expr) {
      const value = this.evaluate(expr.left);
      switch (expr.operator.type) {
        case 13 /* PERCENT */:
          this.checkNumber(value);
          return value * 0.01;
        default:
          throw new CustomError("#VALUE!");
      }
    }
    evaluate(expr) {
      return expr.accept(this);
    }
  };

  // src/parser/eval.ts
  function parseFormula(source, cellData = new CellDataMapImpl(), variableMap = new VariableMapImpl(), functionMap = formula_default) {
    try {
      const list = new Scanner(source).scan();
      const expressions = new Parser(list).parse();
      const result = new Interpreter(
        expressions,
        cellData,
        variableMap,
        functionMap
      ).interpret();
      return {
        result,
        error: null
      };
    } catch (error) {
      if (error instanceof CustomError) {
        return {
          result: null,
          error: error.value
        };
      }
    }
    return {
      result: null,
      error: "#ERROR!"
    };
  }
  var CellDataMapImpl = class {
    map = /* @__PURE__ */ new Map();
    sheetNameMap = {};
    getKey(row, col, sheetId = "") {
      const key = `${row}_${col}_${sheetId}`;
      return key;
    }
    setSheetNameMap(sheetNameMap) {
      this.sheetNameMap = sheetNameMap;
    }
    set(row, col, sheetId, value) {
      const key = this.getKey(row, col, sheetId);
      this.map.set(key, value);
    }
    get(row, col, sheetId = "") {
      const key = this.getKey(row, col, sheetId);
      return this.map.get(key);
    }
    convertSheetNameToSheetId(sheetName) {
      if (!sheetName) {
        return "";
      }
      return this.sheetNameMap[sheetName] || "";
    }
  };
  var VariableMapImpl = class {
    map = /* @__PURE__ */ new Map();
    set(name, value) {
      this.map.set(name, value);
    }
    get(name) {
      return this.map.get(name);
    }
    has(name) {
      return this.map.has(name);
    }
  };

  // src/model/Model.ts
  var CELL_HEIGHT = 19;
  var CELL_WIDTH = 68;
  var XLSX_MAX_COL_COUNT = 16384;
  var XLSX_MAX_ROW_COUNT = 1048576;
  function convertToNumber(list) {
    const result = list.map((item) => parseInt(item, 10)).filter((v) => !isNaN(v));
    result.sort((a, b) => a - b);
    return result;
  }
  var Model = class {
    currentSheetId = "";
    workbook = [];
    worksheets = {};
    mergeCells = [];
    customHeight = {};
    customWidth = {};
    history;
    constructor(history) {
      this.history = history;
    }
    getSheetList() {
      return this.workbook;
    }
    setActiveCell(range) {
      const index = this.workbook.findIndex((v) => v.sheetId === range.sheetId);
      if (index < 0) {
        return;
      }
      const oldValue = this.workbook[index].activeCell;
      if (isSameRange(oldValue, range)) {
        return;
      }
      const key = `workbook.${index}.activeCell`;
      this.history.pushUndo("set", key, { ...range });
      this.history.pushRedo("set", key, {
        ...oldValue
      });
      setWith(this, key, { ...range });
    }
    addSheet() {
      const item = getDefaultSheetInfo(this.workbook);
      const sheet = {
        ...item,
        colCount: DEFAULT_COL_COUNT,
        rowCount: DEFAULT_ROW_COUNT,
        activeCell: {
          row: 0,
          col: 0,
          rowCount: 1,
          colCount: 1,
          sheetId: item.sheetId
        }
      };
      this.workbook = [...this.workbook, sheet];
      this.currentSheetId = item.sheetId;
    }
    getSheetInfo(id = this.currentSheetId) {
      const item = this.workbook.find((item2) => item2.sheetId === id);
      assert(item !== void 0);
      return item;
    }
    setCurrentSheetId(id) {
      this.currentSheetId = id;
      this.computeAllCell();
    }
    getCurrentSheetId() {
      return this.currentSheetId;
    }
    getCellsContent(sheetId) {
      const sheetData = this.worksheets[sheetId];
      if (isEmpty(sheetData)) {
        return [];
      }
      const result = [];
      const rowKeys = Object.keys(sheetData);
      for (const rowKey of rowKeys) {
        const colKeys = Object.keys(sheetData[rowKey]);
        for (const colKey of colKeys) {
          const row = Number(rowKey);
          const col = Number(colKey);
          result.push({
            row,
            col
          });
        }
      }
      return result;
    }
    fromJSON = (json) => {
      modelLog("fromJSON", json);
      const {
        worksheets = {},
        workbook = [],
        mergeCells = [],
        customHeight = {},
        customWidth = {}
      } = json;
      this.worksheets = worksheets;
      this.workbook = workbook;
      this.currentSheetId = workbook[0].sheetId || this.currentSheetId;
      this.mergeCells = mergeCells;
      this.customWidth = customWidth;
      this.customHeight = customHeight;
      this.computeAllCell();
      this.history.clear();
    };
    toJSON = () => {
      const { worksheets, workbook, mergeCells, customHeight, customWidth } = this;
      return {
        workbook,
        worksheets,
        mergeCells,
        customHeight,
        customWidth
      };
    };
    setCellValue(value, range) {
      const { row, col } = range;
      const key = `worksheets[${this.currentSheetId}][${row}][${col}].value`;
      this.history.pushRedo("set", key, get(this, key, void 0));
      this.history.pushUndo("set", key, value);
      setWith(this, key, value);
    }
    setCellFormula(formula, range) {
      const { row, col } = range;
      const key = `worksheets[${this.currentSheetId}][${row}][${col}].formula`;
      this.history.pushRedo("set", key, get(this, key, void 0));
      this.history.pushUndo("set", key, formula);
      setWith(this, key, formula);
    }
    setCellValues(value, style, ranges) {
      const [range] = ranges;
      const { row, col } = range;
      for (let r = 0; r < value.length; r++) {
        for (let c = 0; c < value[r].length; c++) {
          const t = value[r][c];
          const temp = {
            row: row + r,
            col: col + c
          };
          if (style[r] && style[r][c]) {
            this.setStyle(style[r][c], temp);
          }
          if (t.startsWith("=")) {
            this.setCellFormula(t, temp);
          } else {
            this.setCellFormula("", temp);
            this.setCellValue(t, temp);
          }
        }
      }
      this.computeAllCell();
    }
    setStyle(style, range) {
      const stylePath = `worksheets[${this.currentSheetId}][${range.row}][${range.col}].style`;
      this.history.pushRedo("set", stylePath, get(this, stylePath, {}));
      this.history.pushUndo("set", stylePath, style);
      setWith(this, stylePath, style);
    }
    setCellStyle(style, ranges) {
      const [range] = ranges;
      const { row, col, rowCount, colCount } = range;
      for (let r = row, endRow = row + rowCount; r < endRow; r++) {
        for (let c = col, endCol = col + colCount; c < endCol; c++) {
          this.setStyle(style, { row: r, col: c });
        }
      }
    }
    getCell = (range) => {
      const { row, col, sheetId } = range;
      const realSheetId = sheetId || this.currentSheetId;
      const cellData = get(
        this,
        `worksheets[${realSheetId}][${row}][${col}]`,
        {}
      );
      return {
        ...cellData,
        row,
        col
      };
    };
    computeAllCell() {
      const sheetData = this.worksheets[this.currentSheetId];
      if (isEmpty(sheetData)) {
        return [];
      }
      const rowKeys = Object.keys(sheetData);
      for (const rowKey of rowKeys) {
        const colKeys = Object.keys(sheetData[rowKey]);
        for (const colKey of colKeys) {
          const temp = sheetData[rowKey][colKey];
          if (temp?.formula) {
            temp.value = this.parseFormula(temp.formula);
          }
        }
      }
    }
    parseFormula(formula) {
      const result = parseFormula(formula, {
        get: (row, col, sheetId) => {
          const temp = this.getCell(new Range(row, col, 1, 1, sheetId));
          return temp.value;
        },
        set: () => {
        },
        convertSheetNameToSheetId: (sheetName) => {
          const item = this.workbook.find((v) => v.name === sheetName);
          return item?.sheetId || "";
        }
      });
      return result.error ? result.error : result.result;
    }
    addRow(rowIndex, count) {
      const sheetData = this.worksheets[this.currentSheetId];
      if (isEmpty(sheetData)) {
        return;
      }
      const rowKeys = convertToNumber(Object.keys(sheetData));
      for (let i = rowKeys.length - 1; i >= 0; i--) {
        const rowKey = rowKeys[i];
        if (rowKey < rowIndex) {
          continue;
        }
        const key = String(rowKey + count);
        sheetData[key] = {
          ...sheetData[rowKey]
        };
        sheetData[rowKey] = {};
      }
      const sheetInfo = this.getSheetInfo();
      if (sheetInfo.rowCount >= XLSX_MAX_ROW_COUNT) {
        return;
      }
      sheetInfo.rowCount += count;
    }
    addCol(colIndex, count) {
      const sheetData = this.worksheets[this.currentSheetId];
      if (isEmpty(sheetData)) {
        return;
      }
      const sheetInfo = this.getSheetInfo();
      const rowKeys = Object.keys(sheetData);
      for (const rowKey of rowKeys) {
        const colKeys = convertToNumber(Object.keys(sheetData[rowKey]));
        for (let i = colKeys.length - 1; i >= 0; i--) {
          const colKey = colKeys[i];
          if (colKey < colIndex) {
            continue;
          }
          const key = String(colKey + count);
          sheetData[rowKey][key] = {
            ...sheetData[rowKey][colKey]
          };
          sheetData[rowKey][colKey] = {};
        }
      }
      if (sheetInfo.colCount >= XLSX_MAX_COL_COUNT) {
        return;
      }
      sheetInfo.colCount += count;
    }
    deleteCol(colIndex, count) {
      const sheetData = this.worksheets[this.currentSheetId];
      if (isEmpty(sheetData)) {
        return;
      }
      const sheetInfo = this.getSheetInfo();
      const rowKeys = Object.keys(sheetData);
      for (const rowKey of rowKeys) {
        const colKeys = convertToNumber(Object.keys(sheetData[rowKey]));
        for (let i = 0; i < colKeys.length; i++) {
          const colKey = colKeys[i];
          if (colKey < colIndex) {
            continue;
          }
          const key = String(colKey - count);
          sheetData[rowKey][key] = {
            ...sheetData[rowKey][colKey]
          };
          sheetData[rowKey][colKey] = {};
        }
      }
      sheetInfo.colCount -= count;
    }
    deleteRow(rowIndex, count) {
      const sheetData = this.worksheets[this.currentSheetId];
      if (isEmpty(sheetData)) {
        return;
      }
      const rowKeys = convertToNumber(Object.keys(sheetData));
      for (let i = 0; i < rowKeys.length; i++) {
        const rowKey = rowKeys[i];
        if (rowKey < rowIndex) {
          continue;
        }
        const key = String(rowKey - count);
        sheetData[key] = {
          ...sheetData[rowKey]
        };
        sheetData[rowKey] = {};
      }
      const sheetInfo = this.getSheetInfo();
      sheetInfo.rowCount -= count;
    }
    getColWidth(col) {
      const temp = this.customWidth[this.currentSheetId];
      if (!temp) {
        return CELL_WIDTH;
      }
      if (typeof temp[col] === "number") {
        return temp[col];
      }
      return CELL_WIDTH;
    }
    setColWidth(col, width) {
      this.customWidth[this.currentSheetId] = this.customWidth[this.currentSheetId] || {};
      this.customWidth[this.currentSheetId][col] = width;
    }
    getRowHeight(row) {
      const temp = this.customHeight[this.currentSheetId];
      if (!temp) {
        return CELL_HEIGHT;
      }
      if (typeof temp[row] === "number") {
        return temp[row];
      }
      return CELL_HEIGHT;
    }
    setRowHeight(row, height) {
      this.customHeight[this.currentSheetId] = this.customHeight[this.currentSheetId] || {};
      this.customHeight[this.currentSheetId][row] = height;
    }
    canRedo() {
      return this.history.canRedo();
    }
    canUndo() {
      return this.history.canUndo();
    }
    undo() {
      if (!this.canUndo()) {
        return;
      }
      this.executeOperate(this.history.undo());
    }
    redo() {
      if (!this.canRedo()) {
        return;
      }
      this.executeOperate(this.history.redo());
    }
    record() {
      this.history.onChange();
    }
    executeOperate(list) {
      for (const item of list) {
        const { op, path, value } = item;
        switch (op) {
          case "set": {
            setWith(this, path, value);
            break;
          }
          default:
            console.error(`not support type: ${op}`);
            break;
        }
      }
    }
  };

  // src/model/mockModel.ts
  var MOCK_MODEL = {
    workbook: [
      {
        sheetId: "1",
        name: "Sheet1",
        activeCell: {
          row: 2,
          col: 2,
          rowCount: 1,
          colCount: 1,
          sheetId: ""
        },
        colCount: DEFAULT_COL_COUNT,
        rowCount: DEFAULT_ROW_COUNT
      },
      {
        sheetId: "2",
        name: "test",
        colCount: DEFAULT_COL_COUNT,
        rowCount: DEFAULT_ROW_COUNT,
        activeCell: {
          row: 4,
          col: 4,
          rowCount: 2,
          colCount: 2,
          sheetId: ""
        }
      }
    ],
    worksheets: {
      1: {
        0: {
          0: {
            value: "",
            formula: "=SUM(1, SUM(1,2))",
            style: {
              fontColor: "#ff0000"
            }
          },
          1: {
            value: "",
            formula: "=SUM(1,4)"
          },
          2: {
            value: "",
            formula: "=SUM(A1)"
          },
          3: {
            value: "\u8D85\u5927\u5B57",
            style: {
              fontSize: 36
            }
          },
          4: {
            value: "\u8FD9\u662F\u4E00\u6BB5\u975E\u5E38\u957F\u7684\u6587\u6848\uFF0C\u9700\u8981\u6362\u884C\u5C55\u793A",
            style: {
              isWrapText: true,
              underline: 1 /* SINGLE */
            }
          }
        },
        3: {
          0: {
            style: {
              fillColor: "red"
            }
          },
          1: {
            style: {
              fillColor: "red"
            }
          }
        },
        4: {
          0: {
            style: {
              fillColor: "red"
            }
          },
          1: {
            style: {
              fillColor: "red"
            }
          }
        }
      },
      2: {
        0: {
          0: {
            formula: "=Sheet1!A1"
          }
        }
      }
    },
    mergeCells: [
      {
        row: 7,
        col: 0,
        rowCount: 2,
        colCount: 2,
        sheetId: "1"
      }
    ],
    customHeight: {
      1: {
        1: 100
      }
    },
    customWidth: {
      1: {
        1: 100
      }
    }
  };

  // src/model/History.ts
  var History = class {
    undoList = [];
    redoList = [];
    undoItem = [];
    redoItem = [];
    constructor() {
      this.clear();
    }
    clearItem() {
      this.undoItem = [];
      this.redoItem = [];
    }
    onChange() {
      if (this.undoItem.length > 0) {
        this.undoList.push(this.undoItem.slice());
      }
      if (this.redoItem.length > 0) {
        this.redoList.push(this.redoItem.slice());
      }
      this.clearItem();
    }
    pushRedo(op, key, value) {
      this.redoItem.push({
        op,
        path: key,
        value
      });
    }
    pushUndo(op, key, value) {
      this.undoItem.push({
        op,
        path: key,
        value
      });
    }
    clear() {
      this.undoList = [];
      this.redoList = [];
      this.clearItem();
    }
    canRedo() {
      return this.redoList.length > 0;
    }
    canUndo() {
      return this.undoList.length > 0;
    }
    redo() {
      return this.redoList.pop();
    }
    undo() {
      return this.undoList.pop();
    }
  };

  // src/init.ts
  function initTheme(dom) {
    const keyList = Object.keys(theme);
    for (const key of keyList) {
      dom.style.setProperty(`--${key}`, String(theme[key] || ""));
    }
  }
  function initFontFamilyList(fontList = FONT_FAMILY_LIST) {
    const list = fontList.map((v) => {
      const disabled = !isSupportFontFamily(v);
      return { label: v, value: v, disabled };
    });
    return list;
  }
  function getStoreValue(controller, fontFamilyList) {
    const { top } = controller.getDomRect();
    const { scrollLeft, scrollTop } = controller.getScroll();
    const activeCell = controller.getActiveCell();
    const cell = controller.getCell(activeCell);
    const cellPosition = controller.computeCellPosition(activeCell.row, activeCell.col);
    cellPosition.top = top + cellPosition.top;
    if (!cell.style) {
      cell.style = {};
    }
    if (!cell.style.fontFamily) {
      let defaultFontFamily = "";
      for (const item of fontFamilyList) {
        if (!item.disabled) {
          defaultFontFamily = String(item.value);
          break;
        }
      }
      cell.style.fontFamily = defaultFontFamily;
    }
    const newStateValue = {
      sheetList: controller.getSheetList(),
      currentSheetId: controller.getCurrentSheetId(),
      cellPosition,
      scrollLeft,
      scrollTop,
      headerSize: controller.getHeaderSize(),
      activeCell: cell,
      canRedo: controller.canRedo(),
      canUndo: controller.canUndo()
    };
    return newStateValue;
  }
  function createCanvas() {
    const canvas = document.createElement("canvas");
    canvas.style.display = "none";
    document.body.appendChild(canvas);
    return canvas;
  }
  function initCanvas(stateValue, controller) {
    const mainCanvas = new MainCanvas(
      controller,
      new Content(controller, createCanvas())
    );
    const resize = () => {
      mainCanvas.resize();
      mainCanvas.render({
        changeSet: /* @__PURE__ */ new Set(["content"])
      });
    };
    resize();
    registerEvents(stateValue, controller, resize);
    controller.setHooks({
      copy,
      cut,
      paste,
      modelChange: (changeSet) => {
        const newStateValue = getStoreValue(
          controller,
          stateValue.fontFamilyList
        );
        Object.assign(stateValue, newStateValue);
        mainCanvas.render({ changeSet });
        mainCanvas.render({
          changeSet: controller.getChangeSet()
        });
      }
    });
    controller.fromJSON(MOCK_MODEL);
  }
  function initController() {
    const controller = new Controller(new Model(new History()));
    controller.addSheet();
    window.controller = controller;
    return controller;
  }

  // src/index.ts
  function initExcel(containerDom) {
    const fontFamilyList = initFontFamilyList();
    initTheme(document.documentElement);
    const controller = initController();
    const stateValue = new Proxy(DEFAULT_STORE_VALUE, {
      set(obj, prop, value) {
        const res = Reflect.set(obj, prop, value);
        setState();
        return res;
      }
    });
    const setState = () => {
      render(containerDom, App(stateValue, controller));
    };
    stateValue.fontFamilyList = fontFamilyList;
    setState();
    initCanvas(stateValue, controller);
  }
  return __toCommonJS(src_exports);
})();

    for(var key in __export__) {
            exports[key] = __export__[key]
        }
    }));
//# sourceMappingURL=index.js.map

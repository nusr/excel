# 🌐 Online Collaboration Excel

[![CI](https://github.com/nusr/excel/actions/workflows/main.yml/badge.svg)](https://github.com/nusr/excel/actions/workflows/main.yml)
[![codecov](https://codecov.io/gh/nusr/excel/branch/main/graph/badge.svg?token=ZOC8RHD3Z1)](https://codecov.io/gh/nusr/excel)
![GitHub](https://img.shields.io/github/license/nusr/excel.svg)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/nusr/excel.svg)

English | [中文](./README_zh.md)

[Online Demo](https://nusr.github.io/excel)

![Demo](./scripts/demo.gif)

## 🚀 Installation

```bash
npm i --save excel-collab
```

## 📚 Examples

- [Simple Example](https://stackblitz.com/edit/nusr-excel-simple)
- [Custom Example](https://stackblitz.com/edit/nusr-excel-custom)
- [Collaboration Example](https://stackblitz.com/edit/nusr-excel-collaboration)

## 🛠️ Developing

```bash
git clone https://github.com/nusr/excel.git
cd excel

npm i -g pnpm
pnpm i
cd demo/frontend && pnpm i && cd -
cd demo/backend && pnpm i && cd -
npm run dev
```

## ✨ Supported Features

- [x] Online Collaboration
- [x] Create File
- [x] Change File Name
- [x] Web Worker parse formulas
- [x] OffScreenCanvas Render
- [x] Undo
- [x] Redo
- [x] Copy
- [x] Cut
- [x] Paste
- [x] Formulas
- [x] Font Family
- [x] Font Size
- [x] Font Color
- [x] Fill Color
- [x] Bold
- [x] Italic
- [x] Strike
- [x] Underline
- [x] Border
- [x] Text Vertical Align
- [x] Text Horizontal Align
- [x] Text Wrapping
- [x] Number Format
- [x] AutoFilter
- [x] Merge Cells
- [x] Chart
- [x] Floating Picture
- [x] Define Name
- [x] Insert Row
- [x] Insert Column
- [x] Delete Row
- [x] Delete Column
- [x] Hide Row
- [x] Hide Column
- [x] Row Height
- [x] Column Width
- [x] Insert Sheet
- [x] Delete Sheet
- [x] Rename Sheet
- [x] Hide Sheet
- [x] Unhide Sheet
- [x] Import XLSX
- [x] Export XLSX
- [x] Import CSV
- [x] Export CSV
- [x] Dark Mode
- [x] I18N

## Supported Formulas

### Math

- [x] ABS
- [x] ACOS
- [x] ACOSH
- [x] ACOT
- [x] ACOTH
- [x] ASIN
- [x] ASINH
- [x] ATAN
- [x] ATAN2
- [x] ATANH
- [x] AVERAGE
- [x] COS
- [x] COT
- [x] EXP
- [x] INT
- [x] PI
- [x] SIN
- [x] SUM

### Text

- [x] CHAR
- [x] CODE
- [x] CONCAT
- [x] CONCATENATE
- [x] LEN
- [x] LOWER
- [x] SPLIT
- [x] T
- [x] TEXT
- [x] TRIM
- [x] UNICHAR
- [x] UNICODE
- [x] UPPER

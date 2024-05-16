# Online Excel

[![CI](https://github.com/nusr/excel/actions/workflows/main.yml/badge.svg)](https://github.com/nusr/excel/actions/workflows/main.yml)
[![codecov](https://codecov.io/gh/nusr/excel/branch/main/graph/badge.svg?token=ZOC8RHD3Z1)](https://codecov.io/gh/nusr/excel)
![GitHub](https://img.shields.io/github/license/nusr/excel.svg)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/nusr/excel.svg)

[online demo](https://nusr.github.io/excel/)

![demo](./scripts/demo.png)

## Start

```bash
git clone https://github.com/nusr/excel.git
cd excel

npm i -g pnpm
pnpm i
npm run start
```

## directory description

```bash
src
├── canvas         # two layer canvas
├── components     # basic components
├── containers     # spreadsheet view
│   ├── Excel      # Excel export and import
│   ├── hooks      # common React hooks
│   └── store      # global state management
├── controller     # spreadsheet controller
├── formula        # Recursive descent parser parse Excel formulas
├── i18n           # i18n
├── model          # spreadsheet model
├── types          # TypeScript types
└── util           # common methods
    └── theme      # dark mode
```

## dependencies

- [react](https://github.com/facebook/react) Spreadsheet view
- [jszip](https://github.com/Stuk/jszip) unzip and zip xlsx file
- [chart.js](https://github.com/chartjs/Chart.js) Spreadsheet Chart
- [ssf](https://git.sheetjs.com/sheetjs/sheetjs/src/branch/master/packages/ssf) Spreadsheet Number Formatter

## Supported Features

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
- [x] E
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
- [x] TRIM
- [x] UNICHAR
- [x] UNICODE
- [x] UPPER

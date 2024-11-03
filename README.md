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

npm i -g pnpm jscpd
pnpm i
npm run start
```

## Directory Description

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
├── theme          # dark mode
├── types          # TypeScript types
└── util           # common methods
```

## All Dependencies

- [esbulid](https://github.com/evanw/esbuild)
- [react](https://github.com/facebook/react)
- [jszip](https://github.com/Stuk/jszip)
- [chart.js](https://github.com/chartjs/Chart.js)
- [ssf](https://git.sheetjs.com/sheetjs/sheetjs/src/branch/master/packages/ssf)
- [comlink](https://github.com/GoogleChromeLabs/comlink)

## Supported Features

- [x] Web Worker parse formulas
- [x] OffScreenCanvas Render
- [x] Cross-tab Collaboration
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



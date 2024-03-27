# Online Excel

[![CI](https://github.com/nusr/excel/actions/workflows/main.yml/badge.svg)](https://github.com/nusr/excel/actions/workflows/main.yml)
[![codecov](https://codecov.io/gh/nusr/excel/branch/main/graph/badge.svg?token=ZOC8RHD3Z1)](https://codecov.io/gh/nusr/excel)
![GitHub](https://img.shields.io/github/license/nusr/excel.svg)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/nusr/excel.svg)

[online demo](https://nusr.github.io/excel/)

## Start

```bash
git clone https://github.com/nusr/excel.git
cd excel

npm install
npm run start
```

## directory description

```bash
src
├── canvas         # two layer canvas
├── containers     # spreadsheet view
│   ├── Excel      # Excel export and import
│   ├── components # basic components
│   ├── hooks      # common React hooks
│   └── store      # React store by useSyncExternalStore
├── controller     # spreadsheet controller
├── formula        # Recursive descent parser parsing Excel formulas
├── i18n           # i18n
├── model          # spreadsheet model
├── types          # TypeScript types
└── util           # common methods
    └── theme      # dark mode
```

## Supported Features

- [x] Font
- [x] Font size
- [x] Font bold
- [x] Font italic
- [x] Font strike
- [x] Font underline
- [x] Text color
- [x] Fill color
- [x] Text wrapping
- [x] Formulas
- [x] Define Name
- [x] Insert row, column
- [x] Delete row, column
- [x] Hide row, column
- [x] Change row height
- [x] Change column width
- [x] Insert Sheet
- [x] Delete Sheet
- [x] Rename Sheet
- [x] Hide Sheet
- [x] Unhide Sheet
- [x] Copy
- [x] Cut
- [x] Paste
- [x] Import XLSX
- [x] Export XLSX
- [x] Floating Picture
- [x] Chart
- [x] Undo
- [x] Redo
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

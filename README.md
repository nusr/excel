# Online Collaboration Excel

[![CI](https://github.com/nusr/excel/actions/workflows/main.yml/badge.svg)](https://github.com/nusr/excel/actions/workflows/main.yml)
[![codecov](https://codecov.io/gh/nusr/excel/branch/main/graph/badge.svg?token=ZOC8RHD3Z1)](https://codecov.io/gh/nusr/excel)
![GitHub](https://img.shields.io/github/license/nusr/excel.svg)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/nusr/excel.svg)

[online demo](https://nusr.github.io/excel/)

![demo](./scripts/demo.gif)

## Getting Started

```
npm create vite@latest my-app -- --template react-ts
npm i --save excel-collab
```

```ts
// ./src/main.tsx
import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import {
  initController,
  StateContext,
  initCollaboration,
  initDoc,
  wrap,
  copyOrCut,
  paste,
  type WorkerMethod,
  App,
} from 'excel-collab';
import Worker from './worker?worker';
import 'excel-collab/style.css';

const workerInstance = wrap<WorkerMethod>(new Worker());

const doc = initDoc();
const provider = initCollaboration(doc);
const controller = initController({
  copyOrCut,
  paste,
  worker: workerInstance,
  doc,
});
controller.addFirstSheet()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StateContext value={{ provider, controller }}>
      <App />
    </StateContext>
  </StrictMode>,
);
```

```ts
// ./src/worker.ts
import { workerMethod, expose } from 'excel-collab';
expose(workerMethod);
```

## Examples

[Simple Example](https://github.com/nusr/excel/tree/main/examples/simple)

[Custom Example](https://github.com/nusr/excel/tree/main/examples/custom)

[Collaboration Example](https://github.com/nusr/excel/tree/main/examples/collaboration)

## Developing

```
git clone https://github.com/nusr/excel.git
cd excel

npm i -g pnpm
pnpm i
npm run start
```

## Supported Features

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

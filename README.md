# Online Collaboration Excel

[![CI](https://github.com/nusr/excel/actions/workflows/main.yml/badge.svg)](https://github.com/nusr/excel/actions/workflows/main.yml)
[![codecov](https://codecov.io/gh/nusr/excel/branch/main/graph/badge.svg?token=ZOC8RHD3Z1)](https://codecov.io/gh/nusr/excel)
![GitHub](https://img.shields.io/github/license/nusr/excel.svg)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/nusr/excel.svg)

[online demo](https://nusr.github.io/excel/)

![demo](./scripts/demo.gif)

## Installation

```
npm i --save excel-collab
```

## Examples

[Simple Example](https://stackblitz.com/edit/nusr-excel-simple)

[Custom Example](https://stackblitz.com/edit/nusr-excel-custom)

[Collaboration Example](https://stackblitz.com/edit/nusr-excel-collaboration)

## Developing

```bash
git clone https://github.com/nusr/excel.git
cd excel

npm i -g pnpm
pnpm i
npm run start
```

## Environment

Create an `.env` file and modify it as the `.env.example` file

| Key                    | Required | Description        |
| ---------------------- | -------- | ------------------ |
| VITE_SUPABASE_URL      | optional | Supbase url        |
| VITE_SUPABASE_ANON_KEY | optional | Supbase anon key   |
| VITE_DEFAULT_EXCEL_ID  | optional | default excel uuid |

## Supbase

Collaborative editing uses [Supabase](https://supabase.com/) as backend.
You need to configure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
With Row Level Security (RLS) disabled, anonymous users will be able to read/write data in the table.

```sql
CREATE TABLE IF NOT EXISTS history (
  id SERIAL PRIMARY KEY,
  doc_id UUID,
  update TEXT,
  create_time TIMESTAMP WITH TIME ZONE NULL DEFAULT NOW(),
);

-- document table need to enable real time
CREATE TABLE IF NOT EXISTS document (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(20),
  create_time TIMESTAMP WITH TIME ZONE NULL DEFAULT NOW(),
);
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

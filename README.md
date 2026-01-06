# Online Collaboration Excel

[![CI](https://github.com/nusr/excel/actions/workflows/ci.yml/badge.svg)](https://github.com/nusr/excel/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/nusr/excel/branch/main/graph/badge.svg?token=ZOC8RHD3Z1)](https://codecov.io/gh/nusr/excel)
![GitHub](https://img.shields.io/github/license/nusr/excel.svg)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/nusr/excel.svg)

English | [中文](./README_zh.md)

[Online Demo](https://nusr.github.io/excel)

![Demo](./scripts/demo.gif)

## Installation

```bash
npm i --save excel-collab
```

## Quick Start

1. Create a React app

```bash
npm create vite@latest my-app -- --template react-ts
cd my-app
npm i
```

2. Install the Required Libraries

```bash
npm i --save excel-collab
```

3. Modify the Main File

```ts src/main.tsx
// src/main.tsx
import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import { Excel } from 'excel-collab';
import 'excel-collab/style.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Excel style={{ height: '100vh' }} />
  </StrictMode>,
);
```

4. Start the app

```bash
npm run dev
```

## Examples

- [Simple Example](https://stackblitz.com/edit/nusr-excel-simple)
- [Custom Example](https://stackblitz.com/edit/nusr-excel-custom)

## Collaboration Example

```bash
git clone https://github.com/nusr/excel.git
cd excel

npm i -g yarn
yarn
npm run start
```

## Overview

Excel-collab is a web-based spreadsheet application that supports real-time collaboration, formulas, formatting, and data processing.

### Key Features

- **Real-time Collaboration**: Multiple users can edit the same spreadsheet simultaneously with conflict resolution
- **Comprehensive Formulas**: Support for 400+ Excel functions through FormulaJS integration
- **Rich Formatting**: Fonts, colors, borders, alignment, number formats, and more
- **High Performance**: OffScreenCanvas rendering and Web Worker formula computation
- **File Compatibility**: Import/Export XLSX and CSV formats

## Architecture

The application follows a modular architecture with clear separation of concerns:

```
excel/
├── packages/excel-collab/
│   ├── src/
│   │   ├── canvas/          # Canvas rendering engine
│   │   │   ├── MainCanvas.ts      # Main canvas controller
│   │   │   ├── offScreenWorker.ts # Offscreen canvas worker
│   │   │   └── worker.ts          # Web Worker for heavy computations
│   │   ├── components/      # Reusable UI components
│   │   ├── containers/      # Application containers and business logic
│   │   │   ├── Excel/             # Main editor container
│   │   │   ├── FormulaBar/        # Formula input and editing
│   │   │   ├── CanvasContainer/   # Canvas wrapper
│   │   │   └── store/             # State management
│   │   ├── controller/      # Business logic controller
│   │   │   ├── Controller.ts      # Main controller
│   │   │   └── decorator.ts       # Transaction decorators
│   │   ├── formula/         # Formula parser and evaluator
│   │   │   ├── parser.ts          # Expression parser
│   │   │   ├── scanner.ts         # Token scanner
│   │   │   ├── interpreter.ts     # Expression interpreter
│   │   │   └── eval.ts            # Formula evaluation
│   │   ├── model/           # Data models
│   │   ├── types/           # TypeScript type definitions
│   │   ├── util/            # Utility functions
│   │   └── i18n/            # Internationalization
```

### Core Components

#### Canvas Rendering Engine

The canvas rendering system uses **OffScreenCanvas** for high-performance rendering:

- **MainCanvas**: Bridges React components with the canvas rendering
- **OffScreenWorker**: Handles rendering operations in a separate thread
- **Worker**: Manages communication between main thread and worker thread

This architecture ensures smooth UI interactions even with large spreadsheets.

#### Formula Parser

The formula system implements a classic compiler architecture:

```
Formula String → Scanner → Parser → Interpreter → Result
                ↓           ↓          ↓
            Tokens      AST        Values
```

**Scanner** (`scanner.ts`): Tokenizes formula strings into lexical tokens

- Recognizes numbers, strings, cell references, functions, operators
- Handles Excel error values (#REF!, #NAME?, etc.)
- Supports defined names and R1C1 references

**Parser** (`parser.ts`): Builds Abstract Syntax Tree (AST)

- Implements recursive descent parsing
- Supports operator precedence (exponent → unary → multiplication/division → addition/subtraction)
- Handles function calls with parameters
- Supports cell ranges and array expressions

**Interpreter** (`interpreter.ts`): Evaluates the AST

- Visitor pattern for traversing expression trees
- Resolves cell references and ranges
- Calls Excel functions with proper parameter handling
- Manages circular dependency detection

**Key Formula Features**:

- 400+ functions from FormulaJS
- Array formulas and dynamic ranges
- Defined names and scoped references
- Cross-sheet references
- Error handling and propagation

#### State Management

- **Controller Pattern**: Centralized business logic through `Controller` class
- **Transaction Support**: Batch operations with undo/redo capability
- **Event System**: Event emitter for component communication
- **Immutable Updates**: Ensures predictable state changes

#### Collaboration

Built on **Yjs** for CRDT-based real-time collaboration:

- Conflict-free concurrent editing
- Awareness protocol for user presence
- Offline support and synchronization

## Supported Features

### Editing Operations

- [x] Online Collaboration
- [x] Create File
- [x] Change File Name
- [x] Undo/Redo
- [x] Copy/Cut/Paste
- [x] Find and Replace

### Formulas

- [x] 400+ Excel Functions
- [x] Array Formulas
- [x] Cross-sheet References
- [x] Defined Names
- [x] Circular Reference Detection
- [x] Web Worker Formula Parsing

### Formatting

- [x] Font Family
- [x] Font Size
- [x] Font Color
- [x] Fill Color
- [x] Bold/Italic/Strikethrough/Underline
- [x] Borders
- [x] Text Alignment
- [x] Text Wrapping
- [x] Number Formats
- [x] Date/Time Formats
- [x] Custom Formats

### Data Operations

- [x] AutoFilter
- [x] Sort
- [x] Merge Cells
- [x] Insert Row/Column
- [x] Delete Row/Column
- [x] Hide Row/Column
- [x] Row Height
- [x] Column Width
- [x] Freeze Panes

### Visualization

- [x] Charts
- [x] Floating Pictures
- [x] Sparklines

### Sheet Management

- [x] Insert Sheet
- [x] Delete Sheet
- [x] Rename Sheet
- [x] Hide/Unhide Sheet
- [x] Sheet Color

### Import/Export

- [x] Import XLSX
- [x] Export XLSX
- [x] Import CSV
- [x] Export CSV
- [x] Export PDF

### Other Features

- [x] Dark Mode
- [x] Internationalization (i18n)
- [x] Keyboard Shortcuts
- [x] Context Menu
- [x] Data Validation
- [x] Conditional Formatting

## Performance Optimization

### Web Workers

Formula parsing and evaluation run in Web Workers to prevent blocking the main thread:

- Complex formulas with nested functions
- Bulk formula updates across many cells
- Circular dependency detection

### OffScreenCanvas

Rendering operations are offloaded to OffScreenCanvas:

- Large spreadsheet rendering
- Frequent repaints during scrolling/zooming
- Background rendering operations

### Efficient Updates

- Smart diffing for cell changes
- Debounced renders
- Selective re-rendering of affected areas

## API Reference

### Basic Usage

```tsx
import { Excel } from 'excel-collab';
import 'excel-collab/style.css';

// Simple usage
<Excel style={{ height: '100vh' }} />

// With custom configuration
<Excel
  style={{ height: '100vh' }}
  menubarLeftChildren={<CustomMenu />}
  toolbarChildren={<CustomToolbar />}
  sheetBarChildren={<CustomSheetBar />}
/>
```

### Controller API

Access the controller for programmatic operations:

```tsx
import { useExcel } from 'excel-collab';

// Get controller instance
const { controller } = useExcel();

// Cell operations
controller.setCellValue(range, value);
controller.getCellValue(range);

// Range operations
controller.selectRange(range);
controller.copyRange(range);
controller.pasteRange(range);

// Worksheet operations
controller.addSheet(name);
controller.deleteSheet(sheetId);
controller.renameSheet(sheetId, name);

// Formula operations
controller.setCellFormula(range, formula);
controller.computeFormulas();
```

### Event Handling

```tsx
controller.on('change', (changeSet) => {
  // Handle changes
});

controller.on('save', (json) => {
  // Handle save
});
```

## Acknowledgments

- [FormulaJS](https://github.com/formulajs/formulajs) for formula implementation
- [Yjs](https://github.com/yjs/yjs) for collaboration support

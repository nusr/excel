# excel-collab

React spreadsheet components with formula calculation, file import/export, and
optional Yjs-based real-time collaboration.

## Installation

```bash
npm i --save excel-collab
```

## Quick Start

Excel import/export uses lazily loaded `excelize-wasm`. Import supports XLSX,
XLSM, XLAM, XLTM, XLTX and CSV; downloads support XLSX, XLSM, XLAM, XLTM,
XLTX, CSV and JSON.
CSV/JSON operations do not load WASM. Legacy SheetJS-only formats such as XLS,
XLSB, ODS and DBF are not supported.
CSV downloads use UTF-8 with a BOM and CRLF record separators. Formula-like text
is prefixed to reduce the risk of spreadsheet formula injection.

Deploy the generated `main.js` and `excelize.wasm.gz` assets alongside the
library JavaScript. Vite applications copy these relative assets automatically.
With CSP enabled, permit same-origin modules, WebAssembly compilation
(`'wasm-unsafe-eval'` in `script-src`), and `'self' blob:` in `connect-src`.
Browsers need `CompressionStream` when the server automatically decompresses gzip assets.

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

```tsx
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

## Collaboration

Protocol v3 requires the server and all clients to upgrade together. Existing
coordinate APIs and JSON remain compatible; new sheet IDs are UUIDs. Do not
assume sheet IDs are sequential numbers. Concurrent duplicate sheet names are
projected to deterministic, unique display/export names.

The server must initialize the shared workbook before completing the first
sync. Pass an externally owned Yjs `Doc`, optional Awareness, and a stable
`whenSynced: Promise<void>` that resolves on the provider's first successful
sync. For `y-websocket`:

```tsx
import { WebsocketProvider } from 'y-websocket';

const websocketProvider = new WebsocketProvider(url, roomId, doc, {
  params: { protocol: '3' },
});

const whenSynced = new Promise<void>((resolve) => {
  if (websocketProvider.synced) {
    resolve();
    return;
  }
  const onSync = (synced: boolean) => {
    if (!synced) return;
    websocketProvider.off('sync', onSync);
    resolve();
  };
  websocketProvider.on('sync', onSync);
});

<Excel
  doc={doc}
  awareness={websocketProvider.awareness}
  whenSynced={whenSynced}
  provider={httpProvider}
/>;
```

Create these objects outside render or memoize them. HTTP document content is
used only for standalone initialization, never to overwrite a collaborative Doc.
Document rendering does not require Awareness. The editor cleans up its
Controller, UndoManager, listeners, Worker, and internally created Doc on
unmount; callers remain responsible for destroying external Docs and providers.

The demo WebSocket server rejects missing/incompatible protocol parameters with
close code 1008 before loading a room.

The Node-safe `excel-collab/protocol` entry exports shared schema helpers.
Initialize a new server room once with `initializeEmptyDocument(doc)`, or migrate
legacy coordinate JSON with `hydrateDocument(doc, json)`. Persist
`Y.encodeStateAsUpdate(doc)` and restore with `Y.applyUpdate`; JSON snapshots
alone do not preserve CRDT identities across reconnects. After restoring a v2
binary document, call `upgradeDocument(doc)` before initializing/syncing it;
the demo backend does this automatically and persists the migrated state.
Pre-v2 live Yjs graphs still require JSON export with the old client.

## Formula compatibility

Formulas support arithmetic, comparisons, concatenation, repeated percentages,
scientific notation, Excel-escaped strings and quoted worksheet names, A1/R1C1
references, case-insensitive named ranges, and rectangular array constants such
as `{1,2;3,4}`. Operator precedence follows Excel, including left-associative
exponentiation and unary minus preceding exponentiation.

`IF`, `CHOOSE`, `IFERROR`, and `IFNA` evaluate only the selected branch.
`INDEX` (single-area references or arrays), `OFFSET`, and `INDIRECT` can return
references to other functions or the `:` operator. Range arguments retain their
two-dimensional shape, enabling functions such as `SUMIF` and `VLOOKUP`. Other
functions delegate to FormulaJS, including dotted names such as `NORM.DIST`;
OOXML `_xlfn.` / `_xlws.` prefixes are accepted when the function is implemented.
Date-valued function results are converted to Excel date serials.

Recalculation covers formula cells on all sheets. References are evaluated in
the containing formula cell's sheet and coordinates. Dependency errors propagate,
and circular references produce `#REF!` rather than fabricated zero values.
Unknown functions produce `#NAME?`; malformed expressions produce `#VALUE!`;
non-finite numeric results produce `#NUM!`.

Array constants can be consumed by aggregate/lookup functions, but dynamic
array spilling and element-wise array arithmetic are not implemented. The
`parseFormula` result remains a flat value list, and a worksheet formula stores
its first value. Reference unions/intersections, external workbooks, structured
table references, and iterative circular calculation are not supported.
Calculations operate within the worksheet dimensions and FormulaJS semantics;
this is not a complete implementation of every Excel function/coercion rule.

When calling `parseFormula` with a shared cache, use that cache only for one
immutable calculation snapshot. Cache entries are isolated by data source,
worksheet, cell coordinates, and formula text.

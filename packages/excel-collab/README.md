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

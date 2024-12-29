import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import {
  initController,
  StateContext,
  initCollaboration,
  initDoc,
  wrap,
  type WorkerMethod,
  Excel,
  DEFAULT_EXCEL_ID,
} from '../src';
import Worker from './worker?worker';
import './sentry';

const workerInstance = wrap<WorkerMethod>(new Worker());

const docId = import.meta.env.VITE_DEFAULT_EXCEL_ID || DEFAULT_EXCEL_ID;
location.hash = `#${docId}`;
const doc = initDoc({ guid: docId });

const provider = initCollaboration({
  doc,
  disableIndexDB: Boolean(import.meta.env.VITE_DISABLE_INDEXED_DB),
  indexedBDVersion: parseInt(
    import.meta.env.VITE_INDEXED_DB_VERSION || '1',
    10,
  ),
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  loginRedirectTo: import.meta.env.VITE_LOGIN_REDIRECT_URL,
});

const controller = initController({
  worker: workerInstance,
  doc,
});
(window as any).controller = controller;
(window as any).doc = doc;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StateContext value={{ provider, controller }}>
      <Excel enableLogin={Boolean(import.meta.env.VITE_ENABLE_GITHUB_LOGIN)} />
    </StateContext>
  </StrictMode>,
);

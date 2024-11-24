import { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './data.type';
import { ServerProvider } from './server';
import { LocalProvider } from './local';
import { CollaborationProvider } from '@/types';
import { type Doc } from 'yjs';
import { isTestEnv } from '@/util';

export type ResultData = {
  provider: CollaborationProvider;
  isServer: boolean;
};

export function initProvider(doc: Doc): ResultData {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  let isServer = false;
  let provider: CollaborationProvider;
  if (url && key && !isTestEnv() && !process.env.IS_E2E) {
    const db = new SupabaseClient<Database>(url, key);
    provider = new ServerProvider(db, doc);
    isServer = true;
  } else {
    provider = new LocalProvider(doc);
  }
  return { provider, isServer };
}

import { DocumentItem, HistoryItem } from '../types';
import type { Doc } from 'yjs';

export interface Database {
  public: {
    Tables: {
      document: {
        Row: Required<DocumentItem>;
        Insert: {
          id?: string;
          name: string;
          create_time?: never;
        };
        Update: {
          id?: string;
          name?: string;
          create_time?: never;
        };
      };
      history: {
        Row: Required<HistoryItem>;
        Insert: {
          id?: number;
          doc_id: string;
          update: string;
          create_time?: never;
        };
      };
    };
  };
}

export type CollaborationOptions = {
  doc: Doc;
  disableIndexDB?: boolean;
  // indexedDB version
  dbVersion?: number;
  // Supbase URL
  supabaseUrl?: string;
  // Supabase Anon Key
  supabaseAnonKey?: string;
  loginRedirectTo?: string;
};

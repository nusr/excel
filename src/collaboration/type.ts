import { DocumentItem, HistoryItem } from '../types';

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
  // indexedDB version
  dbVersion?: number;
  // Supbase URL
  supabaseUrl?: string;
  // Supabase Anon Key
  supabaseAnonKey?: string;
};

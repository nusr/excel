import type { HistoryItem } from '@excel/shared';

export type DocumentItem = {
  id: string;
  name: string;
  create_time: string;
};

export interface Database {
  public: {
    Tables: {
      document: {
        Row: DocumentItem;
        Insert: {
          id?: never;
          name: string;
          create_time?: never;
        };
        Update: {
          id?: never;
          name?: string;
          create_time?: never;
        };
      };
      history: {
        Row: HistoryItem;
        Insert: {
          id?: never;
          doc_id: string;
          update: string;
          create_time?: never;
        };
      };
    };
  };
}

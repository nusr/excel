export type DocumentItem = {
  id?: string;
  name: string;
  create_time: string;
  sync?: boolean;
};

export type HistoryItem = {
  id?: number;
  doc_id: string;
  update: string;
  create_time: string;
  sync?: boolean;
};

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
  dbVersion?: number;
  supabaseUrl?: string;
  supabaseAnonKey?: string;
};

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      studio_state: {
        Row: {
          created_at: string;
          key: string;
          owner_id: string;
          payload: Json;
          schema_version: number;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          key: string;
          owner_id?: string;
          payload: Json;
          schema_version?: number;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          key?: string;
          owner_id?: string;
          payload?: Json;
          schema_version?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

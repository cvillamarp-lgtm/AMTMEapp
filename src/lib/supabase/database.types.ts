export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      ai_history: {
        Row: {
          created_at: string;
          id: string;
          owner_id: string;
          payload: Json;
          updated_at: string;
          workspace_key: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          owner_id: string;
          payload: Json;
          updated_at?: string;
          workspace_key?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          owner_id?: string;
          payload?: Json;
          updated_at?: string;
          workspace_key?: string;
        };
        Relationships: [];
      };
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
      episodes: {
        Row: {
          created_at: string;
          id: string;
          owner_id: string;
          payload: Json;
          updated_at: string;
          workspace_key: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          owner_id: string;
          payload: Json;
          updated_at?: string;
          workspace_key?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          owner_id?: string;
          payload?: Json;
          updated_at?: string;
          workspace_key?: string;
        };
        Relationships: [];
      };
      spotify_metric_imports: {
        Row: {
          created_at: string;
          id: string;
          owner_id: string;
          payload: Json;
          updated_at: string;
          workspace_key: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          owner_id: string;
          payload: Json;
          updated_at?: string;
          workspace_key?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          owner_id?: string;
          payload?: Json;
          updated_at?: string;
          workspace_key?: string;
        };
        Relationships: [];
      };
      spotify_episode_metrics: {
        Row: {
          created_at: string;
          id: string;
          owner_id: string;
          payload: Json;
          updated_at: string;
          workspace_key: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          owner_id: string;
          payload: Json;
          updated_at?: string;
          workspace_key?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          owner_id?: string;
          payload?: Json;
          updated_at?: string;
          workspace_key?: string;
        };
        Relationships: [];
      };
      spotify_daily_metrics: {
        Row: {
          created_at: string;
          id: string;
          owner_id: string;
          payload: Json;
          updated_at: string;
          workspace_key: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          owner_id: string;
          payload: Json;
          updated_at?: string;
          workspace_key?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          owner_id?: string;
          payload?: Json;
          updated_at?: string;
          workspace_key?: string;
        };
        Relationships: [];
      };
      spotify_distribution_metrics: {
        Row: {
          created_at: string;
          id: string;
          owner_id: string;
          payload: Json;
          updated_at: string;
          workspace_key: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          owner_id: string;
          payload: Json;
          updated_at?: string;
          workspace_key?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          owner_id?: string;
          payload?: Json;
          updated_at?: string;
          workspace_key?: string;
        };
        Relationships: [];
      };
      amtme_manual_metrics: {
        Row: {
          created_at: string;
          id: string;
          owner_id: string;
          payload: Json;
          updated_at: string;
          workspace_key: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          owner_id: string;
          payload: Json;
          updated_at?: string;
          workspace_key?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          owner_id?: string;
          payload?: Json;
          updated_at?: string;
          workspace_key?: string;
        };
        Relationships: [];
      };
      podcast_strategy_snapshots: {
        Row: {
          created_at: string;
          id: string;
          owner_id: string;
          payload: Json;
          updated_at: string;
          workspace_key: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          owner_id: string;
          payload: Json;
          updated_at?: string;
          workspace_key?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          owner_id?: string;
          payload?: Json;
          updated_at?: string;
          workspace_key?: string;
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

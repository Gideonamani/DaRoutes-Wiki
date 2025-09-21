export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      operators: {
        Row: {
          id: string;
          name: string;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          notes?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      stops: {
        Row: {
          id: string;
          name: string;
          name_aliases: string[];
          lat: number;
          lng: number;
          geom: unknown | null;
          ward: string | null;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          name_aliases?: string[];
          lat: number;
          lng: number;
          geom?: unknown | null;
          ward?: string | null;
          created_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          name_aliases?: string[];
          lat?: number;
          lng?: number;
          geom?: unknown | null;
          ward?: string | null;
          created_by?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'stops_created_by_fkey';
            columns: ['created_by'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
      routes: {
        Row: {
          id: string;
          slug: string;
          display_name: string;
          color: string;
          start_stop_id: string | null;
          end_stop_id: string | null;
          corridors: string[];
          operator_ids: string[];
          est_buses: number | null;
          hours: string | null;
          notes: string | null;
          is_published: boolean;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          display_name: string;
          color?: string;
          start_stop_id?: string | null;
          end_stop_id?: string | null;
          corridors?: string[];
          operator_ids?: string[];
          est_buses?: number | null;
          hours?: string | null;
          notes?: string | null;
          is_published?: boolean;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          display_name?: string;
          color?: string;
          start_stop_id?: string | null;
          end_stop_id?: string | null;
          corridors?: string[];
          operator_ids?: string[];
          est_buses?: number | null;
          hours?: string | null;
          notes?: string | null;
          is_published?: boolean;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'routes_created_by_fkey';
            columns: ['created_by'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'routes_end_stop_id_fkey';
            columns: ['end_stop_id'];
            referencedRelation: 'stops';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'routes_start_stop_id_fkey';
            columns: ['start_stop_id'];
            referencedRelation: 'stops';
            referencedColumns: ['id'];
          }
        ];
      };
      route_stops: {
        Row: {
          route_id: string;
          stop_id: string;
          seq: number;
        };
        Insert: {
          route_id: string;
          stop_id: string;
          seq: number;
        };
        Update: {
          route_id?: string;
          stop_id?: string;
          seq?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'route_stops_route_id_fkey';
            columns: ['route_id'];
            referencedRelation: 'routes';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'route_stops_stop_id_fkey';
            columns: ['stop_id'];
            referencedRelation: 'stops';
            referencedColumns: ['id'];
          }
        ];
      };
      fares: {
        Row: {
          id: string;
          route_id: string;
          from_stop_id: string | null;
          to_stop_id: string | null;
          passenger_type: string;
          price_tzs: number;
          note: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          route_id: string;
          from_stop_id?: string | null;
          to_stop_id?: string | null;
          passenger_type: string;
          price_tzs: number;
          note?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          route_id?: string;
          from_stop_id?: string | null;
          to_stop_id?: string | null;
          passenger_type?: string;
          price_tzs?: number;
          note?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'fares_from_stop_id_fkey';
            columns: ['from_stop_id'];
            referencedRelation: 'stops';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'fares_route_id_fkey';
            columns: ['route_id'];
            referencedRelation: 'routes';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'fares_to_stop_id_fkey';
            columns: ['to_stop_id'];
            referencedRelation: 'stops';
            referencedColumns: ['id'];
          }
        ];
      };
      route_variants: {
        Row: {
          id: string;
          route_id: string;
          name: string;
          active: boolean;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          route_id: string;
          name: string;
          active?: boolean;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          route_id?: string;
          name?: string;
          active?: boolean;
          notes?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'route_variants_route_id_fkey';
            columns: ['route_id'];
            referencedRelation: 'routes';
            referencedColumns: ['id'];
          }
        ];
      };
      attachments: {
        Row: {
          id: string;
          route_id: string;
          file_path: string;
          kind: string;
          caption: string | null;
          uploaded_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          route_id: string;
          file_path: string;
          kind?: string;
          caption?: string | null;
          uploaded_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          route_id?: string;
          file_path?: string;
          kind?: string;
          caption?: string | null;
          uploaded_by?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'attachments_route_id_fkey';
            columns: ['route_id'];
            referencedRelation: 'routes';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'attachments_uploaded_by_fkey';
            columns: ['uploaded_by'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
      audit_log: {
        Row: {
          id: number;
          entity: string;
          entity_id: string;
          action: string;
          diff: Json;
          actor: string | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          entity: string;
          entity_id: string;
          action: string;
          diff: Json;
          actor?: string | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          entity?: string;
          entity_id?: string;
          action?: string;
          diff?: Json;
          actor?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      profile: {
        Row: {
          user_id: string;
          role: 'admin' | 'editor' | 'viewer';
          created_at: string;
        };
        Insert: {
          user_id: string;
          role: 'admin' | 'editor' | 'viewer';
          created_at?: string;
        };
        Update: {
          user_id?: string;
          role?: 'admin' | 'editor' | 'viewer';
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'profile_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      current_profile_role: {
        Args: Record<PropertyKey, never>;
        Returns: string | null;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];
export type TablesInsert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];
export type TablesUpdate<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      events: {
        Row: {
          created_at: string
          datetime_end: string
          datetime_start: string
          description: string
          id: number
          image_bucket_ref: string | null
          is_active: boolean | null
          location: string
          name: string
          organizer_id: string
          token: string
        }
        Insert: {
          created_at?: string
          datetime_end: string
          datetime_start: string
          description: string
          id?: number
          image_bucket_ref?: string | null
          is_active?: boolean | null
          location: string
          name: string
          organizer_id: string
          token?: string
        }
        Update: {
          created_at?: string
          datetime_end?: string
          datetime_start?: string
          description?: string
          id?: number
          image_bucket_ref?: string | null
          is_active?: boolean | null
          location?: string
          name?: string
          organizer_id?: string
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_organizer_id_fkey"
            columns: ["organizer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      events_products: {
        Row: {
          created_at: string
          event_id: number | null
          id: number
          is_active: boolean | null
          price: number | null
          product_id: number | null
          stock: number
        }
        Insert: {
          created_at?: string
          event_id?: number | null
          id?: number
          is_active?: boolean | null
          price?: number | null
          product_id?: number | null
          stock: number
        }
        Update: {
          created_at?: string
          event_id?: number | null
          id?: number
          is_active?: boolean | null
          price?: number | null
          product_id?: number | null
          stock?: number
        }
        Relationships: [
          {
            foreignKeyName: "event_products_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string
          id: number
          image_bucket_ref: string | null
          name: string | null
          order_id: number
          price: number
          qr_code_token: string | null
          redeemed_at: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          image_bucket_ref?: string | null
          name?: string | null
          order_id: number
          price: number
          qr_code_token?: string | null
          redeemed_at?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          image_bucket_ref?: string | null
          name?: string | null
          order_id?: number
          price?: number
          qr_code_token?: string | null
          redeemed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          client_id: string | null
          created_at: string
          event_id: number | null
          id: number
          payment_method: string | null
          status: string | null
          token: string
          total: number | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string
          event_id?: number | null
          id?: number
          payment_method?: string | null
          status?: string | null
          token?: string
          total?: number | null
        }
        Update: {
          client_id?: string | null
          created_at?: string
          event_id?: number | null
          id?: number
          payment_method?: string | null
          status?: string | null
          token?: string
          total?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: string
          created_at: string
          description: string
          id: number
          image_bucket_ref: string | null
          name: string
          organizer_id: string | null
          price: number
          token: string
        }
        Insert: {
          category: string
          created_at?: string
          description: string
          id?: number
          image_bucket_ref?: string | null
          name: string
          organizer_id?: string | null
          price: number
          token?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          id?: number
          image_bucket_ref?: string | null
          name?: string
          organizer_id?: string | null
          price?: number
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_organizer_id_fkey"
            columns: ["organizer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Relationships: []
      }
      staff: {
        Row: {
          created_at: string
          event_id: number | null
          full_name: string | null
          id: number
          password: string | null
          username: string | null
        }
        Insert: {
          created_at?: string
          event_id?: number | null
          full_name?: string | null
          id?: number
          password?: string | null
          username?: string | null
        }
        Update: {
          created_at?: string
          event_id?: number | null
          full_name?: string | null
          id?: number
          password?: string | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "staff_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      decrement_stock_by_event_product_id: {
        Args: { event_product_id: number; amount: number }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

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
      automations: {
        Row: {
          asset_symbol: string
          balance_percentage: number | null
          client_user_id: string
          created_at: string | null
          id: string
          interval_cron: string | null
          is_active: boolean | null
          manager_user_id: string
          parameters: Json | null
          stop_loss_percentage: number | null
          strategy_id: string | null
          strategy_name: string | null
          take_profit_percentage: number | null
          wallet_id: string | null
        }
        Insert: {
          asset_symbol: string
          balance_percentage?: number | null
          client_user_id: string
          created_at?: string | null
          id?: string
          interval_cron?: string | null
          is_active?: boolean | null
          manager_user_id: string
          parameters?: Json | null
          stop_loss_percentage?: number | null
          strategy_id?: string | null
          strategy_name?: string | null
          take_profit_percentage?: number | null
          wallet_id?: string | null
        }
        Update: {
          asset_symbol?: string
          balance_percentage?: number | null
          client_user_id?: string
          created_at?: string | null
          id?: string
          interval_cron?: string | null
          is_active?: boolean | null
          manager_user_id?: string
          parameters?: Json | null
          stop_loss_percentage?: number | null
          strategy_id?: string | null
          strategy_name?: string | null
          take_profit_percentage?: number | null
          wallet_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "automations_strategy_id_fkey"
            columns: ["strategy_id"]
            isOneToOne: false
            referencedRelation: "strategies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "automations_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      margin_calculations: {
        Row: {
          calculated_at: string | null
          free_margin: number
          id: string
          margin_level: number
          position_id: string | null
          required_margin: number
          used_margin: number
          wallet_id: string
        }
        Insert: {
          calculated_at?: string | null
          free_margin: number
          id?: string
          margin_level: number
          position_id?: string | null
          required_margin: number
          used_margin: number
          wallet_id: string
        }
        Update: {
          calculated_at?: string | null
          free_margin?: number
          id?: string
          margin_level?: number
          position_id?: string | null
          required_margin?: number
          used_margin?: number
          wallet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "margin_calculations_position_id_fkey"
            columns: ["position_id"]
            isOneToOne: false
            referencedRelation: "positions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "margin_calculations_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      order_fills: {
        Row: {
          commission: number | null
          created_at: string | null
          id: string
          order_id: string
          price: number
          quantity: number
        }
        Insert: {
          commission?: number | null
          created_at?: string | null
          id?: string
          order_id: string
          price: number
          quantity: number
        }
        Update: {
          commission?: number | null
          created_at?: string | null
          id?: string
          order_id?: string
          price?: number
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_fills_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          asset_symbol: string
          cancelled_at: string | null
          created_at: string | null
          expires_at: string | null
          filled_at: string | null
          filled_quantity: number | null
          id: string
          leverage: number | null
          order_type: Database["public"]["Enums"]["order_type"]
          price: number | null
          quantity: number
          remaining_quantity: number | null
          side: Database["public"]["Enums"]["order_side"]
          status: Database["public"]["Enums"]["order_status"] | null
          stop_loss: number | null
          stop_price: number | null
          take_profit: number | null
          trailing_stop_distance: number | null
          updated_at: string | null
          user_id: string
          wallet_id: string
        }
        Insert: {
          asset_symbol: string
          cancelled_at?: string | null
          created_at?: string | null
          expires_at?: string | null
          filled_at?: string | null
          filled_quantity?: number | null
          id?: string
          leverage?: number | null
          order_type: Database["public"]["Enums"]["order_type"]
          price?: number | null
          quantity: number
          remaining_quantity?: number | null
          side: Database["public"]["Enums"]["order_side"]
          status?: Database["public"]["Enums"]["order_status"] | null
          stop_loss?: number | null
          stop_price?: number | null
          take_profit?: number | null
          trailing_stop_distance?: number | null
          updated_at?: string | null
          user_id: string
          wallet_id: string
        }
        Update: {
          asset_symbol?: string
          cancelled_at?: string | null
          created_at?: string | null
          expires_at?: string | null
          filled_at?: string | null
          filled_quantity?: number | null
          id?: string
          leverage?: number | null
          order_type?: Database["public"]["Enums"]["order_type"]
          price?: number | null
          quantity?: number
          remaining_quantity?: number | null
          side?: Database["public"]["Enums"]["order_side"]
          status?: Database["public"]["Enums"]["order_status"] | null
          stop_loss?: number | null
          stop_price?: number | null
          take_profit?: number | null
          trailing_stop_distance?: number | null
          updated_at?: string | null
          user_id?: string
          wallet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      positions: {
        Row: {
          amount: number
          asset_symbol: string
          automation_id: string | null
          close_price: number | null
          closed_at: string | null
          id: string
          leverage: number | null
          open_price: number
          opened_at: string | null
          pnl: number | null
          status: string | null
          type: string
          user_id: string
          wallet_id: string | null
        }
        Insert: {
          amount: number
          asset_symbol: string
          automation_id?: string | null
          close_price?: number | null
          closed_at?: string | null
          id?: string
          leverage?: number | null
          open_price: number
          opened_at?: string | null
          pnl?: number | null
          status?: string | null
          type: string
          user_id: string
          wallet_id?: string | null
        }
        Update: {
          amount?: number
          asset_symbol?: string
          automation_id?: string | null
          close_price?: number | null
          closed_at?: string | null
          id?: string
          leverage?: number | null
          open_price?: number
          opened_at?: string | null
          pnl?: number | null
          status?: string | null
          type?: string
          user_id?: string
          wallet_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "positions_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          balance: number | null
          company: string | null
          country: string | null
          created_at: string | null
          date_of_birth: string | null
          email: string
          experience_level:
            | Database["public"]["Enums"]["experience_level"]
            | null
          full_name: string | null
          id: string
          investment_goals: string[] | null
          manager_id: string | null
          phone: string | null
          plan: string | null
          risk_profile: Database["public"]["Enums"]["risk_level"] | null
          role: Database["public"]["Enums"]["user_role"] | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          balance?: number | null
          company?: string | null
          country?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email: string
          experience_level?:
            | Database["public"]["Enums"]["experience_level"]
            | null
          full_name?: string | null
          id: string
          investment_goals?: string[] | null
          manager_id?: string | null
          phone?: string | null
          plan?: string | null
          risk_profile?: Database["public"]["Enums"]["risk_level"] | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          balance?: number | null
          company?: string | null
          country?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string
          experience_level?:
            | Database["public"]["Enums"]["experience_level"]
            | null
          full_name?: string | null
          id?: string
          investment_goals?: string[] | null
          manager_id?: string | null
          phone?: string | null
          plan?: string | null
          risk_profile?: Database["public"]["Enums"]["risk_level"] | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      risk_settings: {
        Row: {
          auto_stop_loss: boolean | null
          auto_take_profit: boolean | null
          created_at: string | null
          id: string
          liquidation_threshold: number | null
          margin_call_threshold: number | null
          max_daily_loss: number | null
          max_drawdown: number | null
          max_position_size: number | null
          updated_at: string | null
          wallet_id: string
        }
        Insert: {
          auto_stop_loss?: boolean | null
          auto_take_profit?: boolean | null
          created_at?: string | null
          id?: string
          liquidation_threshold?: number | null
          margin_call_threshold?: number | null
          max_daily_loss?: number | null
          max_drawdown?: number | null
          max_position_size?: number | null
          updated_at?: string | null
          wallet_id: string
        }
        Update: {
          auto_stop_loss?: boolean | null
          auto_take_profit?: boolean | null
          created_at?: string | null
          id?: string
          liquidation_threshold?: number | null
          margin_call_threshold?: number | null
          max_daily_loss?: number | null
          max_drawdown?: number | null
          max_position_size?: number | null
          updated_at?: string | null
          wallet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "risk_settings_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: true
            referencedRelation: "wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      strategies: {
        Row: {
          created_at: string | null
          creator_id: string
          description: string | null
          id: string
          name: string
          parameters: Json | null
        }
        Insert: {
          created_at?: string | null
          creator_id: string
          description?: string | null
          id?: string
          name: string
          parameters?: Json | null
        }
        Update: {
          created_at?: string | null
          creator_id?: string
          description?: string | null
          id?: string
          name?: string
          parameters?: Json | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          created_at: string | null
          description: string | null
          id: string
          position_id: string | null
          type: string
          wallet_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          description?: string | null
          id?: string
          position_id?: string | null
          type: string
          wallet_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          description?: string | null
          id?: string
          position_id?: string | null
          type?: string
          wallet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_position_id_fkey"
            columns: ["position_id"]
            isOneToOne: false
            referencedRelation: "positions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      wallets: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_default: boolean | null
          name: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_default?: boolean | null
          name: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_default?: boolean | null
          name?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      experience_level: "beginner" | "intermediate" | "advanced"
      order_side: "buy" | "sell"
      order_status:
        | "pending"
        | "filled"
        | "partially_filled"
        | "cancelled"
        | "rejected"
      order_type: "market" | "limit" | "stop" | "stop_limit" | "oco"
      risk_level: "low" | "medium" | "high"
      user_role: "trader" | "account_manager" | "admin" | "super_admin"
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
    Enums: {
      experience_level: ["beginner", "intermediate", "advanced"],
      order_side: ["buy", "sell"],
      order_status: [
        "pending",
        "filled",
        "partially_filled",
        "cancelled",
        "rejected",
      ],
      order_type: ["market", "limit", "stop", "stop_limit", "oco"],
      risk_level: ["low", "medium", "high"],
      user_role: ["trader", "account_manager", "admin", "super_admin"],
    },
  },
} as const

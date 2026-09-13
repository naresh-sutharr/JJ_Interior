export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      business_profile: {
        Row: {
          account_number: string | null
          address: string | null
          bank_name: string | null
          business_name: string
          default_gst: number
          email: string | null
          gstin: string | null
          id: string
          ifsc: string | null
          invoice_footer: string | null
          invoice_prefix: string
          logo_url: string | null
          pan: string | null
          payment_terms: string | null
          phone: string | null
          quotation_prefix: string
          signature_name: string | null
          starting_number: number
          tagline: string | null
          terms: string | null
          updated_at: string
          upi_id: string | null
          website: string | null
          whatsapp: string | null
        }
        Insert: {
          account_number?: string | null
          address?: string | null
          bank_name?: string | null
          business_name?: string
          default_gst?: number
          email?: string | null
          gstin?: string | null
          id?: string
          ifsc?: string | null
          invoice_footer?: string | null
          invoice_prefix?: string
          logo_url?: string | null
          pan?: string | null
          payment_terms?: string | null
          phone?: string | null
          quotation_prefix?: string
          signature_name?: string | null
          starting_number?: number
          tagline?: string | null
          terms?: string | null
          updated_at?: string
          upi_id?: string | null
          website?: string | null
          whatsapp?: string | null
        }
        Update: {
          account_number?: string | null
          address?: string | null
          bank_name?: string | null
          business_name?: string
          default_gst?: number
          email?: string | null
          gstin?: string | null
          id?: string
          ifsc?: string | null
          invoice_footer?: string | null
          invoice_prefix?: string
          logo_url?: string | null
          pan?: string | null
          payment_terms?: string | null
          phone?: string | null
          quotation_prefix?: string
          signature_name?: string | null
          starting_number?: number
          tagline?: string | null
          terms?: string | null
          updated_at?: string
          upi_id?: string | null
          website?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      catalog_items: {
        Row: {
          brand: string | null
          category: string | null
          created_at: string
          default_rate: number
          description: string | null
          gst_percent: number
          id: string
          material: string | null
          name: string
          sku: string | null
          unit: string | null
        }
        Insert: {
          brand?: string | null
          category?: string | null
          created_at?: string
          default_rate?: number
          description?: string | null
          gst_percent?: number
          id?: string
          material?: string | null
          name: string
          sku?: string | null
          unit?: string | null
        }
        Update: {
          brand?: string | null
          category?: string | null
          created_at?: string
          default_rate?: number
          description?: string | null
          gst_percent?: number
          id?: string
          material?: string | null
          name?: string
          sku?: string | null
          unit?: string | null
        }
        Relationships: []
      }
      clients: {
        Row: {
          billing_address: string | null
          company: string | null
          created_at: string
          email: string | null
          gstin: string | null
          id: string
          name: string
          notes: string | null
          pan: string | null
          phone: string | null
          project_address: string | null
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          billing_address?: string | null
          company?: string | null
          created_at?: string
          email?: string | null
          gstin?: string | null
          id?: string
          name: string
          notes?: string | null
          pan?: string | null
          phone?: string | null
          project_address?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          billing_address?: string | null
          company?: string | null
          created_at?: string
          email?: string | null
          gstin?: string | null
          id?: string
          name?: string
          notes?: string | null
          pan?: string | null
          phone?: string | null
          project_address?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
      documents: {
        Row: {
          client_id: string | null
          created_at: string
          doc_type: string
          file_name: string | null
          file_path: string
          id: string
          project_id: string | null
          title: string
        }
        Insert: {
          client_id?: string | null
          created_at?: string
          doc_type?: string
          file_name?: string | null
          file_path: string
          id?: string
          project_id?: string | null
          title: string
        }
        Update: {
          client_id?: string | null
          created_at?: string
          doc_type?: string
          file_name?: string | null
          file_path?: string
          id?: string
          project_id?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      expenses: {
        Row: {
          amount: number
          category: string
          created_at: string
          description: string | null
          expense_date: string
          id: string
          method: string | null
          notes: string | null
          project_id: string | null
          receipt_url: string | null
          vendor: string | null
        }
        Insert: {
          amount?: number
          category?: string
          created_at?: string
          description?: string | null
          expense_date?: string
          id?: string
          method?: string | null
          notes?: string | null
          project_id?: string | null
          receipt_url?: string | null
          vendor?: string | null
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          description?: string | null
          expense_date?: string
          id?: string
          method?: string | null
          notes?: string | null
          project_id?: string | null
          receipt_url?: string | null
          vendor?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expenses_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_items: {
        Row: {
          amount: number
          description: string
          discount: number
          gst_percent: number
          id: string
          invoice_id: string
          material: string | null
          position: number
          quantity: number
          rate: number
          room: string | null
          unit: string | null
        }
        Insert: {
          amount?: number
          description?: string
          discount?: number
          gst_percent?: number
          id?: string
          invoice_id: string
          material?: string | null
          position?: number
          quantity?: number
          rate?: number
          room?: string | null
          unit?: string | null
        }
        Update: {
          amount?: number
          description?: string
          discount?: number
          gst_percent?: number
          id?: string
          invoice_id?: string
          material?: string | null
          position?: number
          quantity?: number
          rate?: number
          room?: string | null
          unit?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          amount_paid: number
          cgst: number
          client_id: string | null
          created_at: string
          discount_total: number
          due_date: string | null
          grand_total: number
          id: string
          igst: number
          invoice_date: string
          is_igst: boolean
          notes: string | null
          number: string
          project_address: string | null
          project_id: string | null
          quotation_id: string | null
          round_off: number
          sgst: number
          status: string
          subtotal: number
          taxable_total: number
          terms: string | null
          updated_at: string
        }
        Insert: {
          amount_paid?: number
          cgst?: number
          client_id?: string | null
          created_at?: string
          discount_total?: number
          due_date?: string | null
          grand_total?: number
          id?: string
          igst?: number
          invoice_date?: string
          is_igst?: boolean
          notes?: string | null
          number: string
          project_address?: string | null
          project_id?: string | null
          quotation_id?: string | null
          round_off?: number
          sgst?: number
          status?: string
          subtotal?: number
          taxable_total?: number
          terms?: string | null
          updated_at?: string
        }
        Update: {
          amount_paid?: number
          cgst?: number
          client_id?: string | null
          created_at?: string
          discount_total?: number
          due_date?: string | null
          grand_total?: number
          id?: string
          igst?: number
          invoice_date?: string
          is_igst?: boolean
          notes?: string | null
          number?: string
          project_address?: string | null
          project_id?: string | null
          quotation_id?: string | null
          round_off?: number
          sgst?: number
          status?: string
          subtotal?: number
          taxable_total?: number
          terms?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_quotation_id_fkey"
            columns: ["quotation_id"]
            isOneToOne: false
            referencedRelation: "quotations"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          budget: string | null
          created_at: string
          email: string | null
          id: string
          message: string | null
          name: string
          phone: string | null
          project_type: string | null
          status: string
        }
        Insert: {
          budget?: string | null
          created_at?: string
          email?: string | null
          id?: string
          message?: string | null
          name: string
          phone?: string | null
          project_type?: string | null
          status?: string
        }
        Update: {
          budget?: string | null
          created_at?: string
          email?: string | null
          id?: string
          message?: string | null
          name?: string
          phone?: string | null
          project_type?: string | null
          status?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          client_id: string | null
          created_at: string
          id: string
          invoice_id: string | null
          method: string
          notes: string | null
          payment_date: string
          project_id: string | null
          transaction_id: string | null
        }
        Insert: {
          amount?: number
          client_id?: string | null
          created_at?: string
          id?: string
          invoice_id?: string | null
          method?: string
          notes?: string | null
          payment_date?: string
          project_id?: string | null
          transaction_id?: string | null
        }
        Update: {
          amount?: number
          client_id?: string | null
          created_at?: string
          id?: string
          invoice_id?: string | null
          method?: string
          notes?: string | null
          payment_date?: string
          project_id?: string | null
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          budget: number
          client_id: string | null
          created_at: string
          expected_completion: string | null
          id: string
          location: string | null
          name: string
          notes: string | null
          progress: number
          project_type: string | null
          start_date: string | null
          status: string
          updated_at: string
        }
        Insert: {
          budget?: number
          client_id?: string | null
          created_at?: string
          expected_completion?: string | null
          id?: string
          location?: string | null
          name: string
          notes?: string | null
          progress?: number
          project_type?: string | null
          start_date?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          budget?: number
          client_id?: string | null
          created_at?: string
          expected_completion?: string | null
          id?: string
          location?: string | null
          name?: string
          notes?: string | null
          progress?: number
          project_type?: string | null
          start_date?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      quotation_items: {
        Row: {
          amount: number
          brand: string | null
          category: string | null
          description: string
          discount: number
          gst_percent: number
          id: string
          material: string | null
          position: number
          quantity: number
          quotation_id: string
          rate: number
          room: string | null
          unit: string | null
        }
        Insert: {
          amount?: number
          brand?: string | null
          category?: string | null
          description?: string
          discount?: number
          gst_percent?: number
          id?: string
          material?: string | null
          position?: number
          quantity?: number
          quotation_id: string
          rate?: number
          room?: string | null
          unit?: string | null
        }
        Update: {
          amount?: number
          brand?: string | null
          category?: string | null
          description?: string
          discount?: number
          gst_percent?: number
          id?: string
          material?: string | null
          position?: number
          quantity?: number
          quotation_id?: string
          rate?: number
          room?: string | null
          unit?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quotation_items_quotation_id_fkey"
            columns: ["quotation_id"]
            isOneToOne: false
            referencedRelation: "quotations"
            referencedColumns: ["id"]
          },
        ]
      }
      quotations: {
        Row: {
          client_id: string | null
          created_at: string
          discount_total: number
          grand_total: number
          id: string
          is_igst: boolean
          notes: string | null
          number: string
          project_address: string | null
          project_id: string | null
          quote_date: string
          status: string
          subtotal: number
          tax_total: number
          terms: string | null
          updated_at: string
          valid_until: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string
          discount_total?: number
          grand_total?: number
          id?: string
          is_igst?: boolean
          notes?: string | null
          number: string
          project_address?: string | null
          project_id?: string | null
          quote_date?: string
          status?: string
          subtotal?: number
          tax_total?: number
          terms?: string | null
          updated_at?: string
          valid_until?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string
          discount_total?: number
          grand_total?: number
          id?: string
          is_igst?: boolean
          notes?: string | null
          number?: string
          project_address?: string | null
          project_id?: string | null
          quote_date?: string
          status?: string
          subtotal?: number
          tax_total?: number
          terms?: string | null
          updated_at?: string
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quotations_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "staff"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "staff"],
    },
  },
} as const

/**
 * Generated from the live schema via the Supabase MCP `generate_typescript_types`
 * tool. Regenerate after any migration — do not hand-edit.
 */

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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      destinations: {
        Row: {
          body: string[]
          card_image: string | null
          departure_code: string
          display_order: number
          experiences: Json
          facts: Json
          featured: boolean
          gallery: string[]
          hero_image: string
          ideal_for: string[]
          intro: string
          monthly_climate: Json
          name: string
          places: Json
          region: string
          route_city: string
          seasons: Json
          slug: string
          tagline: string
          tier: string
          updated_at: string
        }
        Insert: {
          body?: string[]
          card_image?: string | null
          departure_code?: string
          display_order?: number
          experiences?: Json
          facts?: Json
          featured?: boolean
          gallery?: string[]
          hero_image: string
          ideal_for?: string[]
          intro: string
          monthly_climate?: Json
          name: string
          places?: Json
          region: string
          route_city?: string
          seasons?: Json
          slug: string
          tagline: string
          tier: string
          updated_at?: string
        }
        Update: {
          body?: string[]
          card_image?: string | null
          departure_code?: string
          display_order?: number
          experiences?: Json
          facts?: Json
          featured?: boolean
          gallery?: string[]
          hero_image?: string
          ideal_for?: string[]
          intro?: string
          monthly_climate?: Json
          name?: string
          places?: Json
          region?: string
          route_city?: string
          seasons?: Json
          slug?: string
          tagline?: string
          tier?: string
          updated_at?: string
        }
        Relationships: []
      }
      faqs: {
        Row: {
          answer: string
          display_order: number
          id: string
          question: string
          updated_at: string
        }
        Insert: {
          answer: string
          display_order?: number
          id?: string
          question: string
          updated_at?: string
        }
        Update: {
          answer?: string
          display_order?: number
          id?: string
          question?: string
          updated_at?: string
        }
        Relationships: []
      }
      landing_poster: {
        Row: {
          active: boolean
          cta_label: string
          ends_at: string | null
          heading: string
          id: boolean
          image_url: string
          starts_at: string | null
          subheading: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          cta_label?: string
          ends_at?: string | null
          heading?: string
          id?: boolean
          image_url?: string
          starts_at?: string | null
          subheading?: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          cta_label?: string
          ends_at?: string | null
          heading?: string
          id?: boolean
          image_url?: string
          starts_at?: string | null
          subheading?: string
          updated_at?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          accommodation: string | null
          adults: number | null
          children: number | null
          destination: string | null
          email: string
          flight_booked: boolean | null
          id: string
          message: string | null
          name: string
          nights: number | null
          notes: string | null
          phone: string
          received_at: string
          source: string
          status: string
          transfers: string | null
          travel_date: string | null
          travel_window: string | null
          travellers: string | null
        }
        Insert: {
          accommodation?: string | null
          adults?: number | null
          children?: number | null
          destination?: string | null
          email: string
          flight_booked?: boolean | null
          id?: string
          message?: string | null
          name: string
          nights?: number | null
          notes?: string | null
          phone: string
          received_at?: string
          source?: string
          status?: string
          transfers?: string | null
          travel_date?: string | null
          travel_window?: string | null
          travellers?: string | null
        }
        Update: {
          accommodation?: string | null
          adults?: number | null
          children?: number | null
          destination?: string | null
          email?: string
          flight_booked?: boolean | null
          id?: string
          message?: string | null
          name?: string
          nights?: number | null
          notes?: string | null
          phone?: string
          received_at?: string
          source?: string
          status?: string
          transfers?: string | null
          travel_date?: string | null
          travel_window?: string | null
          travellers?: string | null
        }
        Relationships: []
      }
      package_departures: {
        Row: {
          departure_date: string
          id: string
          package_slug: string
          price_override: number | null
          seats_left: number
          sold_out: boolean
          updated_at: string
        }
        Insert: {
          departure_date: string
          id?: string
          package_slug: string
          price_override?: number | null
          seats_left?: number
          sold_out?: boolean
          updated_at?: string
        }
        Update: {
          departure_date?: string
          id?: string
          package_slug?: string
          price_override?: number | null
          seats_left?: number
          sold_out?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "package_departures_package_slug_fkey"
            columns: ["package_slug"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["slug"]
          },
        ]
      }
      packages: {
        Row: {
          active: boolean
          base_price: number
          cancellation_terms: string[]
          currency: string
          departure_airport_code: string
          departure_city: string
          departure_code: string
          display_order: number
          exclusions: string[]
          flight_carrier: string
          flights_included: boolean
          hero_image: string
          hotels: Json
          inclusions: string[]
          itinerary: Json
          name: string
          nights_summary: string
          onward_departure_time: string
          onward_flight_number: string
          onward_route: string
          payment_terms: string[]
          return_departure_time: string
          return_flight_number: string
          return_route: string
          route_label: string
          sightseeing: Json
          slug: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          base_price?: number
          cancellation_terms?: string[]
          currency?: string
          departure_airport_code?: string
          departure_city?: string
          departure_code?: string
          display_order?: number
          exclusions?: string[]
          flight_carrier?: string
          flights_included?: boolean
          hero_image?: string
          hotels?: Json
          inclusions?: string[]
          itinerary?: Json
          name: string
          nights_summary?: string
          onward_departure_time?: string
          onward_flight_number?: string
          onward_route?: string
          payment_terms?: string[]
          return_departure_time?: string
          return_flight_number?: string
          return_route?: string
          route_label?: string
          sightseeing?: Json
          slug: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          base_price?: number
          cancellation_terms?: string[]
          currency?: string
          departure_airport_code?: string
          departure_city?: string
          departure_code?: string
          display_order?: number
          exclusions?: string[]
          flight_carrier?: string
          flights_included?: boolean
          hero_image?: string
          hotels?: Json
          inclusions?: string[]
          itinerary?: Json
          name?: string
          nights_summary?: string
          onward_departure_time?: string
          onward_flight_number?: string
          onward_route?: string
          payment_terms?: string[]
          return_departure_time?: string
          return_flight_number?: string
          return_route?: string
          route_label?: string
          sightseeing?: Json
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      promotion: {
        Row: {
          active: boolean
          cta_label: string
          heading: string
          id: boolean
          image_url: string
          subheading: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          cta_label?: string
          heading?: string
          id?: boolean
          image_url?: string
          subheading?: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          cta_label?: string
          heading?: string
          id?: boolean
          image_url?: string
          subheading?: string
          updated_at?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          detail: string
          display_order: number
          icon: string
          image: string | null
          points: string[]
          slug: string
          summary: string
          title: string
          updated_at: string
        }
        Insert: {
          detail: string
          display_order?: number
          icon: string
          image?: string | null
          points?: string[]
          slug: string
          summary: string
          title: string
          updated_at?: string
        }
        Update: {
          detail?: string
          display_order?: number
          icon?: string
          image?: string | null
          points?: string[]
          slug?: string
          summary?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          display_order: number
          id: string
          name: string
          quote: string
          role: string
          trip: string
          updated_at: string
        }
        Insert: {
          display_order?: number
          id?: string
          name: string
          quote: string
          role: string
          trip: string
          updated_at?: string
        }
        Update: {
          display_order?: number
          id?: string
          name?: string
          quote?: string
          role?: string
          trip?: string
          updated_at?: string
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
      [_ in never]: never
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

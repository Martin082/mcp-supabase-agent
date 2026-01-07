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
            album: {
                Row: {
                    album_id: number
                    artist_id: number
                    title: string
                }
                Insert: {
                    album_id: number
                    artist_id: number
                    title: string
                }
                Update: {
                    album_id?: number
                    artist_id?: number
                    title?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "album_artist_id_fkey"
                        columns: ["artist_id"]
                        isOneToOne: false
                        referencedRelation: "artist"
                        referencedColumns: ["artist_id"]
                    },
                ]
            }
            allowed_users: {
                Row: {
                    created_at: string | null
                    email: string
                    first_name: string
                    id: string
                    last_name: string
                    role: string
                }
                Insert: {
                    created_at?: string | null
                    email: string
                    first_name: string
                    id?: string
                    last_name: string
                    role: string
                }
                Update: {
                    created_at?: string | null
                    email?: string
                    first_name?: string
                    id?: string
                    last_name?: string
                    role?: string
                }
                Relationships: []
            }
            api_request_logs: {
                Row: {
                    created_at: string | null
                    id: string
                    ip_address: string
                    path: string
                }
                Insert: {
                    created_at?: string | null
                    id?: string
                    ip_address: string
                    path: string
                }
                Update: {
                    created_at?: string | null
                    id?: string
                    ip_address?: string
                    path?: string
                }
                Relationships: []
            }
            artist: {
                Row: {
                    artist_id: number
                    name: string | null
                }
                Insert: {
                    artist_id: number
                    name?: string | null
                }
                Update: {
                    artist_id?: number
                    name?: string | null
                }
                Relationships: []
            }
            customer: {
                Row: {
                    address: string | null
                    city: string | null
                    company: string | null
                    country: string | null
                    customer_id: number
                    email: string
                    fax: string | null
                    first_name: string
                    last_name: string
                    phone: string | null
                    postal_code: string | null
                    state: string | null
                    support_rep_id: number | null
                }
                Insert: {
                    address?: string | null
                    city?: string | null
                    company?: string | null
                    country?: string | null
                    customer_id: number
                    email: string
                    fax?: string | null
                    first_name: string
                    last_name: string
                    phone?: string | null
                    postal_code?: string | null
                    state?: string | null
                    support_rep_id?: number | null
                }
                Update: {
                    address?: string | null
                    city?: string | null
                    company?: string | null
                    country?: string | null
                    customer_id?: number
                    email?: string
                    fax?: string | null
                    first_name?: string
                    last_name?: string
                    phone?: string | null
                    postal_code?: string | null
                    state?: string | null
                    support_rep_id?: number | null
                }
                Relationships: [
                    {
                        foreignKeyName: "customer_support_rep_id_fkey"
                        columns: ["support_rep_id"]
                        isOneToOne: false
                        referencedRelation: "employee"
                        referencedColumns: ["employee_id"]
                    },
                ]
            }
            employee: {
                Row: {
                    address: string | null
                    birth_date: string | null
                    city: string | null
                    country: string | null
                    email: string | null
                    employee_id: number
                    fax: string | null
                    first_name: string
                    hire_date: string | null
                    last_name: string
                    phone: string | null
                    postal_code: string | null
                    reports_to: number | null
                    state: string | null
                    title: string | null
                }
                Insert: {
                    address?: string | null
                    birth_date?: string | null
                    city?: string | null
                    country?: string | null
                    email?: string | null
                    employee_id: number
                    fax?: string | null
                    first_name: string
                    hire_date?: string | null
                    last_name: string
                    phone?: string | null
                    postal_code?: string | null
                    reports_to?: number | null
                    state?: string | null
                    title?: string | null
                }
                Update: {
                    address?: string | null
                    birth_date?: string | null
                    city?: string | null
                    country?: string | null
                    email?: string | null
                    employee_id?: number
                    fax?: string | null
                    first_name?: string
                    hire_date?: string | null
                    last_name?: string
                    phone?: string | null
                    postal_code?: string | null
                    reports_to?: number | null
                    state?: string | null
                    title?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "employee_reports_to_fkey"
                        columns: ["reports_to"]
                        isOneToOne: false
                        referencedRelation: "employee"
                        referencedColumns: ["employee_id"]
                    },
                ]
            }
            genre: {
                Row: {
                    genre_id: number
                    name: string | null
                }
                Insert: {
                    genre_id: number
                    name?: string | null
                }
                Update: {
                    genre_id?: number
                    name?: string | null
                }
                Relationships: []
            }
            invoice: {
                Row: {
                    billing_address: string | null
                    billing_city: string | null
                    billing_country: string | null
                    billing_postal_code: string | null
                    billing_state: string | null
                    customer_id: number
                    invoice_date: string
                    invoice_id: number
                    total: number
                }
                Insert: {
                    billing_address?: string | null
                    billing_city?: string | null
                    billing_country?: string | null
                    billing_postal_code?: string | null
                    billing_state?: string | null
                    customer_id: number
                    invoice_date: string
                    invoice_id: number
                    total: number
                }
                Update: {
                    billing_address?: string | null
                    billing_city?: string | null
                    billing_country?: string | null
                    billing_postal_code?: string | null
                    billing_state?: string | null
                    customer_id?: number
                    invoice_date?: string
                    invoice_id?: number
                    total?: number
                }
                Relationships: [
                    {
                        foreignKeyName: "invoice_customer_id_fkey"
                        columns: ["customer_id"]
                        isOneToOne: false
                        referencedRelation: "customer"
                        referencedColumns: ["customer_id"]
                    },
                ]
            }
            invoice_line: {
                Row: {
                    invoice_id: number
                    invoice_line_id: number
                    quantity: number
                    track_id: number
                    unit_price: number
                }
                Insert: {
                    invoice_id: number
                    invoice_line_id: number
                    quantity: number
                    track_id: number
                    unit_price: number
                }
                Update: {
                    invoice_id?: number
                    invoice_line_id?: number
                    quantity?: number
                    track_id?: number
                    unit_price?: number
                }
                Relationships: [
                    {
                        foreignKeyName: "invoice_line_invoice_id_fkey"
                        columns: ["invoice_id"]
                        isOneToOne: false
                        referencedRelation: "invoice"
                        referencedColumns: ["invoice_id"]
                    },
                    {
                        foreignKeyName: "invoice_line_track_id_fkey"
                        columns: ["track_id"]
                        isOneToOne: false
                        referencedRelation: "track"
                        referencedColumns: ["track_id"]
                    },
                ]
            }
            media_type: {
                Row: {
                    media_type_id: number
                    name: string | null
                }
                Insert: {
                    media_type_id: number
                    name?: string | null
                }
                Update: {
                    media_type_id?: number
                    name?: string | null
                }
                Relationships: []
            }
            playlist: {
                Row: {
                    name: string | null
                    playlist_id: number
                }
                Insert: {
                    name?: string | null
                    playlist_id: number
                }
                Update: {
                    name?: string | null
                    playlist_id?: number
                }
                Relationships: []
            }
            playlist_track: {
                Row: {
                    playlist_id: number
                    track_id: number
                }
                Insert: {
                    playlist_id: number
                    track_id: number
                }
                Update: {
                    playlist_id?: number
                    track_id?: number
                }
                Relationships: [
                    {
                        foreignKeyName: "playlist_track_playlist_id_fkey"
                        columns: ["playlist_id"]
                        isOneToOne: false
                        referencedRelation: "playlist"
                        referencedColumns: ["playlist_id"]
                    },
                    {
                        foreignKeyName: "playlist_track_track_id_fkey"
                        columns: ["track_id"]
                        isOneToOne: false
                        referencedRelation: "track"
                        referencedColumns: ["track_id"]
                    },
                ]
            }
            schema_table_overview: {
                Row: {
                    columns_with_types_and_fks: string | null
                    table_name: string | null
                }
                Insert: {
                    columns_with_types_and_fks?: string | null
                    table_name?: string | null
                }
                Update: {
                    columns_with_types_and_fks?: string | null
                    table_name?: string | null
                }
                Relationships: []
            }
            track: {
                Row: {
                    album_id: number | null
                    bytes: number | null
                    composer: string | null
                    genre_id: number | null
                    media_type_id: number
                    milliseconds: number
                    name: string
                    track_id: number
                    unit_price: number
                }
                Insert: {
                    album_id?: number | null
                    bytes?: number | null
                    composer?: string | null
                    genre_id?: number | null
                    media_type_id: number
                    milliseconds: number
                    name: string
                    track_id: number
                    unit_price: number
                }
                Update: {
                    album_id?: number | null
                    bytes?: number | null
                    composer?: string | null
                    genre_id?: number | null
                    media_type_id?: number
                    milliseconds?: number
                    name?: string
                    track_id?: number
                    unit_price?: number
                }
                Relationships: [
                    {
                        foreignKeyName: "track_album_id_fkey"
                        columns: ["album_id"]
                        isOneToOne: false
                        referencedRelation: "album"
                        referencedColumns: ["album_id"]
                    },
                    {
                        foreignKeyName: "track_genre_id_fkey"
                        columns: ["genre_id"]
                        isOneToOne: false
                        referencedRelation: "genre"
                        referencedColumns: ["genre_id"]
                    },
                    {
                        foreignKeyName: "track_media_type_id_fkey"
                        columns: ["media_type_id"]
                        isOneToOne: false
                        referencedRelation: "media_type"
                        referencedColumns: ["media_type_id"]
                    },
                ]
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            count_estimate: {
                Args: {
                    query: string
                }
                Returns: number
            }
            exec_sql: {
                Args: {
                    query: string
                }
                Returns: Json
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

export type Tables<
    PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
            Row: infer R
        }
    ? R
    : never
    : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
        Database["public"]["Views"])
    ? (Database["public"]["Tables"] &
        Database["public"]["Views"])[PublicTableNameOrOptions] extends {
            Row: infer R
        }
    ? R
    : never
    : never

export type TablesInsert<
    PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Insert: infer I
    }
    ? I
    : never
    : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
    }
    ? I
    : never
    : never

export type TablesUpdate<
    PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Update: infer U
    }
    ? U
    : never
    : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
    }
    ? U
    : never
    : never

export type Enums<
    PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
    EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
    ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
    : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
    ? Database["public"]["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
    PublicCompositeTypeNameOrOptions extends
    | keyof Database["public"]["CompositeTypes"]
    | { schema: keyof Database },
    CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
        schema: keyof Database
    }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
    ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
    : PublicCompositeTypeNameOrOptions extends keyof Database["public"]["CompositeTypes"]
    ? Database["public"]["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

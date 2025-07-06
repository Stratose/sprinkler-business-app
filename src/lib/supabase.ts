import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Customer {
  id: string
  user_id: string
  first_name: string
  last_name: string
  phone: string
  address: string
  latitude?: number
  longitude?: number
  created_at: string
  updated_at: string
}

export interface CustomerNote {
  id: string
  customer_id: string
  user_id: string
  content: string
  created_at: string
}

export interface Appointment {
  id: string
  customer_id: string
  user_id: string
  title: string
  description?: string
  scheduled_date: string
  status: 'scheduled' | 'completed' | 'cancelled'
  created_at: string
}

export interface Database {
  public: {
    Tables: {
      customers: {
        Row: Customer
        Insert: Omit<Customer, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Customer, 'id' | 'created_at'>>
      }
      customer_notes: {
        Row: CustomerNote
        Insert: Omit<CustomerNote, 'id' | 'created_at'>
        Update: Partial<Omit<CustomerNote, 'id' | 'created_at'>>
      }
      appointments: {
        Row: Appointment
        Insert: Omit<Appointment, 'id' | 'created_at'>
        Update: Partial<Omit<Appointment, 'id' | 'created_at'>>
      }
    }
  }
}

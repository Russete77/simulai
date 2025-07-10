import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      questoes: {
        Row: {
          id: string
          statement: string
          option_a: string
          option_b: string
          option_c: string
          option_d: string
          correct_answer: string
          explanation: string | null
          subject: string
          year: number | null
          difficulty: 'EASY' | 'MEDIUM' | 'HARD'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          statement: string
          option_a: string
          option_b: string
          option_c: string
          option_d: string
          correct_answer: string
          explanation?: string | null
          subject: string
          year?: number | null
          difficulty?: 'EASY' | 'MEDIUM' | 'HARD'
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          statement?: string
          option_a?: string
          option_b?: string
          option_c?: string
          option_d?: string
          correct_answer?: string
          explanation?: string | null
          subject?: string
          year?: number | null
          difficulty?: 'EASY' | 'MEDIUM' | 'HARD'
          created_at?: string | null
          updated_at?: string | null
        }
      }
      user_answers: {
        Row: {
          id: string
          user_id: string
          question_id: string
          selected_answer: string
          is_correct: boolean
          answered_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          question_id: string
          selected_answer: string
          is_correct: boolean
          answered_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          question_id?: string
          selected_answer?: string
          is_correct?: boolean
          answered_at?: string
        }
      }
      user_profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      questions: {
        Row: {
          id: string
          statement: string
          option_a: string
          option_b: string
          option_c: string
          option_d: string
          correct_answer: string
          explanation: string | null
          subject: string
          year: number | null
          difficulty: 'EASY' | 'MEDIUM' | 'HARD'
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          statement: string
          option_a: string
          option_b: string
          option_c: string
          option_d: string
          correct_answer: string
          explanation?: string | null
          subject: string
          year?: number | null
          difficulty?: 'EASY' | 'MEDIUM' | 'HARD'
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          statement?: string
          option_a?: string
          option_b?: string
          option_c?: string
          option_d?: string
          correct_answer?: string
          explanation?: string | null
          subject?: string
          year?: number | null
          difficulty?: 'EASY' | 'MEDIUM' | 'HARD'
          created_at?: string | null
          updated_at?: string | null
        }
      }
    }
  }
}
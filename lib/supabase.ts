import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database
export type ServiceCategory = 'maid' | 'cook' | 'barber' | 'electrician' | 'plumber' | 'carpenter' | 'other'

export interface Profile {
  id: string
  user_id?: string
  full_name: string
  gender: string
  phone: string
  service: ServiceCategory
  experience: number
  locality: string
  availability: {
    type: 'daily' | 'one-time'
    from?: string
    to?: string
    date?: string
    slot?: string
  }
  skills: string[]
  skill_level: 'Basic' | 'Medium' | 'Premium'
  expected_salary_min: number
  expected_salary_max: number
  description: string
  photo_url?: string
  id_proof_url?: string
  selfie_url?: string
  audio_url?: string
  rating: number
  verification_status: 'pending' | 'verified' | 'rejected'
  is_pro: boolean
  created_at: string
}

export interface EmployerRequest {
  id: string
  requester_user_id?: string
  phone: string
  otp_verified: boolean
  gender_preference?: string
  service: ServiceCategory
  locality: string
  time_pref: {
    type: 'daily' | 'one-time'
    from?: string
    to?: string
    date?: string
    slot?: string
  }
  hire_type: 'one-time' | 'monthly'
  max_salary: number
  skill_level: 'Basic' | 'Medium' | 'Premium'
  extra_filters: Record<string, any>
  created_at: string
}

export interface HireIntent {
  id: string
  employer_name: string
  employer_phone: string
  profile_id: string
  message: string
  created_at: string
}

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Appointment {
  id?: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  appointment_date: string;
  appointment_time: string;
  purpose: string;
  status?: string;
  created_at?: string;
}

export interface Partnership {
  id?: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  business_type: string;
  message: string;
  document_url?: string;
  status?: string;
  created_at?: string;
}

export interface Testimonial {
  id: string;
  client_name: string;
  company: string;
  position: string;
  content: string;
  rating: number;
  image_url?: string;
  is_featured: boolean;
  created_at: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  expertise: string;
  fun_fact: string;
  image_url: string;
  display_order: number;
  created_at: string;
}

export interface CompanyStat {
  id: string;
  label: string;
  value: number;
  suffix: string;
  icon: string;
  display_order: number;
  created_at: string;
}

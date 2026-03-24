import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type JobStatus = "scheduled" | "in_progress" | "complete" | "invoiced" | "paid";
export type JobType = "electrical" | "contractor" | "service_call" | "inspection" | "other";

export interface Job {
  id: string;
  title: string;
  client_name: string;
  client_phone: string | null;
  client_email: string | null;
  address: string;
  job_type: JobType;
  status: JobStatus;
  description: string | null;
  notes: string | null;
  estimated_cost: number | null;
  actual_cost: number | null;
  materials_cost: number | null;
  labor_hours: number | null;
  hourly_rate: number | null;
  scheduled_date: string | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Estimate {
  id: string;
  client_name: string;
  client_phone: string | null;
  client_email: string | null;
  address: string;
  job_type: JobType;
  description: string | null;
  line_items: LineItem[];
  total: number;
  status: "draft" | "sent" | "accepted" | "declined";
  created_at: string;
}

export interface LineItem {
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

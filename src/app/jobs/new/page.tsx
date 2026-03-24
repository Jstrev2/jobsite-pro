"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase, JobType, JobStatus } from "@/lib/supabase";
import { JOB_TYPES } from "@/lib/constants";
import BottomNav from "@/components/BottomNav";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewJobPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    client_name: "",
    client_phone: "",
    client_email: "",
    address: "",
    job_type: "electrical" as JobType,
    status: "scheduled" as JobStatus,
    description: "",
    estimated_cost: "",
    hourly_rate: "85",
    scheduled_date: "",
  });

  const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const { error } = await supabase.from("jobs").insert({
      title: form.title,
      client_name: form.client_name,
      client_phone: form.client_phone || null,
      client_email: form.client_email || null,
      address: form.address,
      job_type: form.job_type,
      status: form.status,
      description: form.description || null,
      estimated_cost: form.estimated_cost ? parseFloat(form.estimated_cost) : null,
      hourly_rate: form.hourly_rate ? parseFloat(form.hourly_rate) : null,
      scheduled_date: form.scheduled_date || null,
    });

    if (!error) {
      router.push("/jobs");
    } else {
      alert("Error saving job: " + error.message);
      setSaving(false);
    }
  };

  const inputClass = "w-full py-2.5 px-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 text-sm";
  const labelClass = "text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1 block";

  return (
    <main className="min-h-screen pb-20 px-4 pt-6 max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/jobs" className="text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-xl font-black">New Job</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelClass}>Job Title *</label>
          <input className={inputClass} placeholder="e.g. Panel Upgrade - Smith Residence" value={form.title} onChange={(e) => update("title", e.target.value)} required />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Job Type</label>
            <select className={inputClass} value={form.job_type} onChange={(e) => update("job_type", e.target.value)}>
              {Object.entries(JOB_TYPES).map(([k, v]) => (
                <option key={k} value={k}>{v.icon} {v.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Status</label>
            <select className={inputClass} value={form.status} onChange={(e) => update("status", e.target.value)}>
              <option value="scheduled">Scheduled</option>
              <option value="in_progress">In Progress</option>
            </select>
          </div>
        </div>

        <div>
          <label className={labelClass}>Client Name *</label>
          <input className={inputClass} placeholder="John Smith" value={form.client_name} onChange={(e) => update("client_name", e.target.value)} required />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Phone</label>
            <input className={inputClass} type="tel" placeholder="(555) 123-4567" value={form.client_phone} onChange={(e) => update("client_phone", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input className={inputClass} type="email" placeholder="client@email.com" value={form.client_email} onChange={(e) => update("client_email", e.target.value)} />
          </div>
        </div>

        <div>
          <label className={labelClass}>Address *</label>
          <input className={inputClass} placeholder="123 Main St, City, ST" value={form.address} onChange={(e) => update("address", e.target.value)} required />
        </div>

        <div>
          <label className={labelClass}>Description</label>
          <textarea className={inputClass + " min-h-[80px]"} placeholder="Scope of work, special notes..." value={form.description} onChange={(e) => update("description", e.target.value)} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Estimated Cost ($)</label>
            <input className={inputClass} type="number" step="0.01" placeholder="0.00" value={form.estimated_cost} onChange={(e) => update("estimated_cost", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Hourly Rate ($)</label>
            <input className={inputClass} type="number" step="0.01" placeholder="85.00" value={form.hourly_rate} onChange={(e) => update("hourly_rate", e.target.value)} />
          </div>
        </div>

        <div>
          <label className={labelClass}>Scheduled Date</label>
          <input className={inputClass} type="date" value={form.scheduled_date} onChange={(e) => update("scheduled_date", e.target.value)} />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-xl transition-all active:scale-95 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Create Job ⚡"}
        </button>
      </form>

      <BottomNav />
    </main>
  );
}

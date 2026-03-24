"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { supabase, Job, JobStatus } from "@/lib/supabase";
import { JOB_STATUS_CONFIG, JOB_TYPES } from "@/lib/constants";
import BottomNav from "@/components/BottomNav";
import { ArrowLeft, Phone, Mail, MapPin, Trash2 } from "lucide-react";
import Link from "next/link";

const STATUS_FLOW: JobStatus[] = ["scheduled", "in_progress", "complete", "invoiced", "paid"];

export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("jobs").select("*").eq("id", id).single();
      if (data) setJob(data);
      setLoading(false);
    }
    load();
  }, [id]);

  const advanceStatus = async () => {
    if (!job) return;
    const currentIdx = STATUS_FLOW.indexOf(job.status);
    if (currentIdx < STATUS_FLOW.length - 1) {
      const nextStatus = STATUS_FLOW[currentIdx + 1];
      const updates: Record<string, unknown> = { status: nextStatus, updated_at: new Date().toISOString() };
      if (nextStatus === "in_progress") updates.started_at = new Date().toISOString();
      if (nextStatus === "complete") updates.completed_at = new Date().toISOString();
      await supabase.from("jobs").update(updates).eq("id", job.id);
      setJob({ ...job, ...updates } as Job);
    }
  };

  const deleteJob = async () => {
    if (!job || !confirm("Delete this job?")) return;
    await supabase.from("jobs").delete().eq("id", job.id);
    router.push("/jobs");
  };

  if (loading) return <main className="min-h-screen flex items-center justify-center text-zinc-500">Loading...</main>;
  if (!job) return <main className="min-h-screen flex items-center justify-center text-zinc-500">Job not found</main>;

  const status = JOB_STATUS_CONFIG[job.status];
  const type = JOB_TYPES[job.job_type];
  const nextIdx = STATUS_FLOW.indexOf(job.status) + 1;
  const nextStatus = nextIdx < STATUS_FLOW.length ? JOB_STATUS_CONFIG[STATUS_FLOW[nextIdx]] : null;

  return (
    <main className="min-h-screen pb-20 px-4 pt-6 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/jobs" className="text-zinc-400 hover:text-white transition-colors"><ArrowLeft size={20} /></Link>
          <div>
            <h1 className="text-lg font-black">{type?.icon} {job.title}</h1>
            <span className="text-xs font-bold tracking-wider px-2 py-0.5 rounded-full" style={{ color: status.color, backgroundColor: status.bg }}>{status.label.toUpperCase()}</span>
          </div>
        </div>
        <button onClick={deleteJob} className="text-zinc-600 hover:text-red-400 transition-colors"><Trash2 size={18} /></button>
      </div>

      <div className="bg-[#12121a] border border-white/10 rounded-xl p-4 mb-4">
        <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Client</h2>
        <p className="font-semibold mb-2">{job.client_name}</p>
        <div className="space-y-1.5 text-sm text-zinc-400">
          {job.address && <a href={`https://maps.google.com/?q=${encodeURIComponent(job.address)}`} target="_blank" rel="noopener" className="flex items-center gap-2 hover:text-amber-400"><MapPin size={14} /> {job.address}</a>}
          {job.client_phone && <a href={`tel:${job.client_phone}`} className="flex items-center gap-2 hover:text-amber-400"><Phone size={14} /> {job.client_phone}</a>}
          {job.client_email && <a href={`mailto:${job.client_email}`} className="flex items-center gap-2 hover:text-amber-400"><Mail size={14} /> {job.client_email}</a>}
        </div>
      </div>

      {job.description && (
        <div className="bg-[#12121a] border border-white/10 rounded-xl p-4 mb-4">
          <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Description</h2>
          <p className="text-sm text-zinc-300 whitespace-pre-wrap">{job.description}</p>
        </div>
      )}

      <div className="bg-[#12121a] border border-white/10 rounded-xl p-4 mb-4">
        <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Financials</h2>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div><p className="text-zinc-500 text-xs">Estimated</p><p className="font-bold">${(job.estimated_cost || 0).toLocaleString()}</p></div>
          <div><p className="text-zinc-500 text-xs">Actual</p><p className="font-bold">${(job.actual_cost || 0).toLocaleString()}</p></div>
          <div><p className="text-zinc-500 text-xs">Materials</p><p className="font-bold">${(job.materials_cost || 0).toLocaleString()}</p></div>
          <div><p className="text-zinc-500 text-xs">Rate</p><p className="font-bold">${job.hourly_rate || 85}/hr</p></div>
        </div>
      </div>

      <div className="bg-[#12121a] border border-white/10 rounded-xl p-4 mb-4">
        <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Progress</h2>
        <div className="flex items-center gap-1">
          {STATUS_FLOW.map((s, i) => {
            const conf = JOB_STATUS_CONFIG[s];
            const reached = STATUS_FLOW.indexOf(job.status) >= i;
            return (
              <div key={s} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full h-2 rounded-full" style={{ backgroundColor: reached ? conf.color : "rgba(255,255,255,0.1)" }} />
                <span className="text-[9px] text-zinc-500">{conf.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {nextStatus && (
        <button onClick={advanceStatus} className="w-full py-3 rounded-xl font-bold text-sm transition-all active:scale-95" style={{ backgroundColor: nextStatus.bg, color: nextStatus.color, border: `1px solid ${nextStatus.color}40` }}>
          Mark as {nextStatus.label} →
        </button>
      )}

      <BottomNav />
    </main>
  );
}

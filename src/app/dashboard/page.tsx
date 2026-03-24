"use client";

import { useState, useEffect } from "react";
import { supabase, Job } from "@/lib/supabase";
import BottomNav from "@/components/BottomNav";
import JobCard from "@/components/JobCard";
import StatCard from "@/components/StatCard";
import { Briefcase, Clock, DollarSign, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("jobs")
        .select("*")
        .order("created_at", { ascending: false });
      if (data) setJobs(data);
      setLoading(false);
    }
    load();
  }, []);

  const activeJobs = jobs.filter((j) => j.status === "in_progress" || j.status === "scheduled");
  const completedThisMonth = jobs.filter((j) => {
    if (j.status !== "complete" && j.status !== "invoiced" && j.status !== "paid") return false;
    const d = new Date(j.completed_at || j.updated_at);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const unpaid = jobs.filter((j) => j.status === "invoiced");
  const revenue = jobs
    .filter((j) => j.status === "paid")
    .reduce((sum, j) => sum + (j.actual_cost || j.estimated_cost || 0), 0);

  return (
    <main className="min-h-screen pb-20 px-4 pt-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black tracking-tight">
          ⚡ Jobsite Pro
        </h1>
        <p className="text-zinc-500 text-sm">Electrician & Contractor Hub</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <StatCard label="Active Jobs" value={activeJobs.length} icon={<Briefcase size={20} />} color="#3b82f6" />
        <StatCard label="This Month" value={completedThisMonth.length} icon={<CheckCircle size={20} />} color="#22c55e" />
        <StatCard label="Awaiting Payment" value={unpaid.length} icon={<Clock size={20} />} color="#a855f7" />
        <StatCard label="Revenue" value={`$${revenue.toLocaleString()}`} icon={<DollarSign size={20} />} color="#14b8a6" />
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2 mb-6">
        <Link href="/jobs/new" className="flex-1 py-3 bg-amber-500/20 border border-amber-500/40 rounded-xl text-center text-sm font-bold text-amber-400 hover:bg-amber-500/30 transition-all active:scale-95">
          + New Job
        </Link>
        <Link href="/estimates/new" className="flex-1 py-3 bg-blue-500/20 border border-blue-500/40 rounded-xl text-center text-sm font-bold text-blue-400 hover:bg-blue-500/30 transition-all active:scale-95">
          + New Estimate
        </Link>
      </div>

      {/* Recent Jobs */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-bold text-sm tracking-wider text-zinc-400 uppercase">Recent Jobs</h2>
        <Link href="/jobs" className="text-xs text-amber-400 hover:underline">View All</Link>
      </div>

      {loading ? (
        <p className="text-zinc-600 text-center py-8">Loading...</p>
      ) : jobs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-zinc-500 mb-2">No jobs yet</p>
          <Link href="/jobs/new" className="text-amber-400 text-sm font-semibold hover:underline">
            Create your first job →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.slice(0, 5).map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}

      <BottomNav />
    </main>
  );
}

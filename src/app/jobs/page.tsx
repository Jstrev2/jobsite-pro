"use client";

import { useState, useEffect } from "react";
import { supabase, Job, JobStatus } from "@/lib/supabase";
import BottomNav from "@/components/BottomNav";
import JobCard from "@/components/JobCard";
import { JOB_STATUS_CONFIG } from "@/lib/constants";
import Link from "next/link";

const STATUSES: (JobStatus | "all")[] = ["all", "scheduled", "in_progress", "complete", "invoiced", "paid"];

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filter, setFilter] = useState<JobStatus | "all">("all");
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

  const filtered = filter === "all" ? jobs : jobs.filter((j) => j.status === filter);

  return (
    <main className="min-h-screen pb-20 px-4 pt-6 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-black">Jobs</h1>
        <Link href="/jobs/new" className="px-3 py-1.5 bg-amber-500/20 border border-amber-500/40 rounded-lg text-sm font-bold text-amber-400 hover:bg-amber-500/30 transition-all">
          + New
        </Link>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1 scrollbar-hide">
        {STATUSES.map((s) => {
          const config = s === "all" ? { label: "All", color: "#e4e4e7", bg: "rgba(228,228,231,0.1)" } : JOB_STATUS_CONFIG[s];
          return (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                filter === s ? "border-2" : "border border-white/10"
              }`}
              style={{
                color: filter === s ? config.color : "#71717a",
                borderColor: filter === s ? config.color : undefined,
                backgroundColor: filter === s ? config.bg : "transparent",
              }}
            >
              {config.label}
            </button>
          );
        })}
      </div>

      {loading ? (
        <p className="text-zinc-600 text-center py-8">Loading...</p>
      ) : filtered.length === 0 ? (
        <p className="text-zinc-500 text-center py-12">No jobs found</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}

      <BottomNav />
    </main>
  );
}

"use client";

import { Job } from "@/lib/supabase";
import { JOB_STATUS_CONFIG, JOB_TYPES } from "@/lib/constants";
import { MapPin, Clock, DollarSign } from "lucide-react";
import Link from "next/link";

export default function JobCard({ job }: { job: Job }) {
  const status = JOB_STATUS_CONFIG[job.status];
  const type = JOB_TYPES[job.job_type];

  return (
    <Link href={`/jobs/${job.id}`}>
      <div className="bg-[#12121a] border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all hover:bg-[#1a1a25] active:scale-[0.98]">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">{type?.icon || "📦"}</span>
            <h3 className="font-bold text-sm">{job.title}</h3>
          </div>
          <span
            className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full"
            style={{ color: status.color, backgroundColor: status.bg }}
          >
            {status.label.toUpperCase()}
          </span>
        </div>

        <p className="text-sm text-zinc-400 mb-2">{job.client_name}</p>

        <div className="flex flex-wrap gap-3 text-xs text-zinc-500">
          <span className="flex items-center gap-1">
            <MapPin size={12} />
            {job.address.length > 30 ? job.address.slice(0, 30) + "..." : job.address}
          </span>
          {job.scheduled_date && (
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {new Date(job.scheduled_date).toLocaleDateString()}
            </span>
          )}
          {(job.estimated_cost || job.actual_cost) && (
            <span className="flex items-center gap-1">
              <DollarSign size={12} />
              ${(job.actual_cost || job.estimated_cost || 0).toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

"use client";

import { useState, useEffect } from "react";
import { supabase, Estimate } from "@/lib/supabase";
import BottomNav from "@/components/BottomNav";
import Link from "next/link";
import { DollarSign, Clock, CheckCircle, XCircle } from "lucide-react";

const STATUS_ICONS = { draft: Clock, sent: Clock, accepted: CheckCircle, declined: XCircle };
const STATUS_COLORS: Record<string, string> = { draft: "#71717a", sent: "#3b82f6", accepted: "#22c55e", declined: "#ef4444" };

export default function EstimatesPage() {
  const [estimates, setEstimates] = useState<Estimate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("estimates").select("*").order("created_at", { ascending: false });
      if (data) setEstimates(data);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <main className="min-h-screen pb-20 px-4 pt-6 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-black">Estimates</h1>
        <Link href="/estimates/new" className="px-3 py-1.5 bg-blue-500/20 border border-blue-500/40 rounded-lg text-sm font-bold text-blue-400 hover:bg-blue-500/30 transition-all">+ New</Link>
      </div>

      {loading ? (
        <p className="text-zinc-600 text-center py-8">Loading...</p>
      ) : estimates.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-zinc-500 mb-2">No estimates yet</p>
          <Link href="/estimates/new" className="text-blue-400 text-sm font-semibold hover:underline">Create your first estimate →</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {estimates.map((est) => {
            const Icon = STATUS_ICONS[est.status] || Clock;
            const color = STATUS_COLORS[est.status] || "#71717a";
            return (
              <div key={est.id} className="bg-[#12121a] border border-white/10 rounded-xl p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-bold text-sm">{est.client_name}</p>
                    <p className="text-xs text-zinc-500">{est.address}</p>
                  </div>
                  <span className="flex items-center gap-1 text-xs font-semibold" style={{ color }}>
                    <Icon size={12} /> {est.status.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-amber-400 font-bold">
                  <DollarSign size={14} /> {est.total.toLocaleString()}
                </div>
              </div>
            );
          })}
        </div>
      )}
      <BottomNav />
    </main>
  );
}

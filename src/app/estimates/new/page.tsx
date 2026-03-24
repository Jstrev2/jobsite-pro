"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase, JobType, LineItem } from "@/lib/supabase";
import { JOB_TYPES, COMMON_ELECTRICAL_TASKS, COMMON_CONTRACTOR_TASKS } from "@/lib/constants";
import BottomNav from "@/components/BottomNav";
import { ArrowLeft, Plus, Trash2, Zap, Hammer } from "lucide-react";
import Link from "next/link";

export default function NewEstimatePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [showTaskLibrary, setShowTaskLibrary] = useState(false);
  const [taskCategory, setTaskCategory] = useState<"electrical" | "contractor">("electrical");
  const [form, setForm] = useState({
    client_name: "",
    client_phone: "",
    client_email: "",
    address: "",
    job_type: "electrical" as JobType,
    description: "",
  });
  const [lineItems, setLineItems] = useState<LineItem[]>([]);

  const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  const addLineItem = (item?: { name: string; laborHrs: number; materialsCost: number; laborRate: number }) => {
    if (item) {
      const laborTotal = item.laborHrs * item.laborRate;
      setLineItems([...lineItems, {
        description: item.name,
        quantity: 1,
        unit_price: laborTotal + item.materialsCost,
        total: laborTotal + item.materialsCost,
      }]);
      setShowTaskLibrary(false);
    } else {
      setLineItems([...lineItems, { description: "", quantity: 1, unit_price: 0, total: 0 }]);
    }
  };

  const updateLineItem = (idx: number, field: keyof LineItem, value: string | number) => {
    const updated = [...lineItems];
    (updated[idx] as unknown as Record<string, unknown>)[field] = value;
    if (field === "quantity" || field === "unit_price") {
      updated[idx].total = updated[idx].quantity * updated[idx].unit_price;
    }
    setLineItems(updated);
  };

  const removeLineItem = (idx: number) => setLineItems(lineItems.filter((_, i) => i !== idx));

  const total = lineItems.reduce((s, li) => s + li.total, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.from("estimates").insert({
      ...form,
      client_phone: form.client_phone || null,
      client_email: form.client_email || null,
      description: form.description || null,
      line_items: lineItems,
      total,
      status: "draft",
    });
    if (!error) router.push("/estimates");
    else { alert("Error: " + error.message); setSaving(false); }
  };

  const inputClass = "w-full py-2.5 px-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 text-sm";
  const labelClass = "text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1 block";
  const tasks = taskCategory === "electrical" ? COMMON_ELECTRICAL_TASKS : COMMON_CONTRACTOR_TASKS;

  return (
    <main className="min-h-screen pb-20 px-4 pt-6 max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/estimates" className="text-zinc-400 hover:text-white"><ArrowLeft size={20} /></Link>
        <h1 className="text-xl font-black">New Estimate</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelClass}>Client Name *</label>
          <input className={inputClass} placeholder="Client name" value={form.client_name} onChange={(e) => update("client_name", e.target.value)} required />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div><label className={labelClass}>Phone</label><input className={inputClass} type="tel" placeholder="(555) 123-4567" value={form.client_phone} onChange={(e) => update("client_phone", e.target.value)} /></div>
          <div><label className={labelClass}>Email</label><input className={inputClass} type="email" placeholder="email" value={form.client_email} onChange={(e) => update("client_email", e.target.value)} /></div>
        </div>

        <div>
          <label className={labelClass}>Address *</label>
          <input className={inputClass} placeholder="Job site address" value={form.address} onChange={(e) => update("address", e.target.value)} required />
        </div>

        <div>
          <label className={labelClass}>Job Type</label>
          <select className={inputClass} value={form.job_type} onChange={(e) => update("job_type", e.target.value)}>
            {Object.entries(JOB_TYPES).map(([k, v]) => <option key={k} value={k}>{v.icon} {v.label}</option>)}
          </select>
        </div>

        <div>
          <label className={labelClass}>Description</label>
          <textarea className={inputClass + " min-h-[60px]"} placeholder="Scope of work" value={form.description} onChange={(e) => update("description", e.target.value)} />
        </div>

        {/* Line Items */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className={labelClass + " mb-0"}>Line Items</label>
            <div className="flex gap-2">
              <button type="button" onClick={() => setShowTaskLibrary(!showTaskLibrary)} className="text-xs text-blue-400 hover:underline">
                📋 Task Library
              </button>
              <button type="button" onClick={() => addLineItem()} className="text-xs text-amber-400 hover:underline">
                <Plus size={12} className="inline" /> Custom
              </button>
            </div>
          </div>

          {/* Task Library Panel */}
          {showTaskLibrary && (
            <div className="bg-[#12121a] border border-white/10 rounded-xl p-3 mb-3 max-h-60 overflow-y-auto">
              <div className="flex gap-2 mb-2">
                <button type="button" onClick={() => setTaskCategory("electrical")}
                  className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold ${taskCategory === "electrical" ? "bg-amber-500/20 text-amber-400 border border-amber-500/40" : "text-zinc-500"}`}>
                  <Zap size={12} /> Electrical
                </button>
                <button type="button" onClick={() => setTaskCategory("contractor")}
                  className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold ${taskCategory === "contractor" ? "bg-blue-500/20 text-blue-400 border border-blue-500/40" : "text-zinc-500"}`}>
                  <Hammer size={12} /> Contractor
                </button>
              </div>
              {tasks.map((task, i) => (
                <button key={i} type="button" onClick={() => addLineItem(task)}
                  className="w-full text-left px-2 py-1.5 hover:bg-white/5 rounded text-sm flex justify-between items-center">
                  <span className="text-zinc-300">{task.name}</span>
                  <span className="text-zinc-500 text-xs">${(task.laborHrs * task.laborRate + task.materialsCost).toFixed(0)}</span>
                </button>
              ))}
            </div>
          )}

          <div className="space-y-2">
            {lineItems.map((li, i) => (
              <div key={i} className="bg-[#12121a] border border-white/10 rounded-xl p-3">
                <div className="flex gap-2 mb-2">
                  <input className={inputClass + " flex-1"} placeholder="Description" value={li.description} onChange={(e) => updateLineItem(i, "description", e.target.value)} />
                  <button type="button" onClick={() => removeLineItem(i)} className="text-zinc-600 hover:text-red-400"><Trash2 size={16} /></button>
                </div>
                <div className="flex gap-2">
                  <div className="w-20"><input className={inputClass} type="number" min={1} value={li.quantity} onChange={(e) => updateLineItem(i, "quantity", parseInt(e.target.value) || 1)} /></div>
                  <div className="flex-1"><input className={inputClass} type="number" step="0.01" placeholder="Unit $" value={li.unit_price || ""} onChange={(e) => updateLineItem(i, "unit_price", parseFloat(e.target.value) || 0)} /></div>
                  <div className="w-24 text-right font-bold text-sm self-center text-amber-400">${li.total.toFixed(2)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Total */}
        <div className="flex justify-between items-center py-3 border-t border-white/10">
          <span className="font-bold text-zinc-400">TOTAL</span>
          <span className="text-2xl font-black text-amber-400">${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>

        <button type="submit" disabled={saving} className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-xl transition-all active:scale-95 disabled:opacity-50">
          {saving ? "Saving..." : "Create Estimate ⚡"}
        </button>
      </form>

      <BottomNav />
    </main>
  );
}

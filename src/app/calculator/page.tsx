"use client";

import { useState } from "react";
import { WIRE_GAUGE_CHART } from "@/lib/constants";
import BottomNav from "@/components/BottomNav";
import { Zap } from "lucide-react";

export default function CalculatorPage() {
  const [amps, setAmps] = useState("");
  const [distance, setDistance] = useState("");
  const [voltage, setVoltage] = useState("120");

  const ampVal = parseFloat(amps) || 0;
  const distVal = parseFloat(distance) || 0;

  // Find recommended wire gauge
  const recommended = WIRE_GAUGE_CHART.find((w) => w.amps >= ampVal);

  // Voltage drop calculation (copper, single phase)
  const resistivity = 10.8; // ohms per cmil/ft for copper
  const voltageDrop = voltage && ampVal && distVal
    ? (2 * distVal * ampVal * resistivity) / (voltage === "240" ? 66360 : 16510)
    : 0;
  const dropPercent = parseFloat(voltage) ? (voltageDrop / parseFloat(voltage)) * 100 : 0;

  return (
    <main className="min-h-screen pb-20 px-4 pt-6 max-w-lg mx-auto">
      <h1 className="text-xl font-black mb-1">⚡ Electrical Calculator</h1>
      <p className="text-zinc-500 text-sm mb-6">Wire sizing, voltage drop & reference</p>

      {/* Wire Size Calculator */}
      <div className="bg-[#12121a] border border-white/10 rounded-xl p-4 mb-4">
        <h2 className="text-sm font-bold mb-3 flex items-center gap-2"><Zap size={16} className="text-amber-400" /> Wire Size Calculator</h2>
        <div className="grid grid-cols-3 gap-3 mb-3">
          <div>
            <label className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold block mb-1">Amps</label>
            <input className="w-full py-2 px-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500/50" type="number" placeholder="20" value={amps} onChange={(e) => setAmps(e.target.value)} />
          </div>
          <div>
            <label className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold block mb-1">Distance (ft)</label>
            <input className="w-full py-2 px-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500/50" type="number" placeholder="50" value={distance} onChange={(e) => setDistance(e.target.value)} />
          </div>
          <div>
            <label className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold block mb-1">Voltage</label>
            <select className="w-full py-2 px-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none" value={voltage} onChange={(e) => setVoltage(e.target.value)}>
              <option value="120">120V</option>
              <option value="240">240V</option>
            </select>
          </div>
        </div>

        {recommended && ampVal > 0 && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
            <p className="text-sm"><span className="text-amber-400 font-bold">{recommended.gauge}</span> — {recommended.breaker} breaker</p>
            <p className="text-xs text-zinc-400 mt-1">Common use: {recommended.commonUse}</p>
            {distVal > 0 && (
              <p className={`text-xs mt-1 ${dropPercent > 3 ? "text-red-400" : "text-green-400"}`}>
                Voltage drop: {voltageDrop.toFixed(1)}V ({dropPercent.toFixed(1)}%) {dropPercent > 3 ? "⚠️ Consider upsizing" : "✓ OK"}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Wire Gauge Reference */}
      <div className="bg-[#12121a] border border-white/10 rounded-xl p-4">
        <h2 className="text-sm font-bold mb-3">Wire Gauge Reference</h2>
        <div className="space-y-1">
          <div className="grid grid-cols-4 gap-2 text-[10px] text-zinc-500 uppercase tracking-wider font-semibold pb-1 border-b border-white/10">
            <span>Amps</span><span>Gauge</span><span>Breaker</span><span>Use</span>
          </div>
          {WIRE_GAUGE_CHART.map((row) => (
            <div key={row.amps} className="grid grid-cols-4 gap-2 text-xs text-zinc-300 py-1.5 border-b border-white/5">
              <span className="font-bold text-amber-400">{row.amps}A</span>
              <span>{row.gauge}</span>
              <span>{row.breaker}</span>
              <span className="text-zinc-500">{row.commonUse}</span>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </main>
  );
}

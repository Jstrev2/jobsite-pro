"use client";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

export default function StatCard({ label, value, icon, color }: StatCardProps) {
  return (
    <div
      className="bg-[#12121a] border border-white/10 rounded-xl p-4 flex items-center gap-3"
      style={{ borderLeftColor: color, borderLeftWidth: 3 }}
    >
      <div className="text-2xl" style={{ color }}>{icon}</div>
      <div>
        <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">{label}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import BottomNav from "@/components/BottomNav";
import Link from "next/link";

const ANNOYANCE_LEVELS = [
  { min: 0, max: 10, label: "Zen Master", emoji: "🧘", desc: "Joe is at peace. The wire is straight. The conduit is bent perfectly.", color: "#22c55e" },
  { min: 11, max: 25, label: "Mildly Irritated", emoji: "😤", desc: "Someone left the PVC glue open again.", color: "#84cc16" },
  { min: 26, max: 40, label: "Eye Twitching", emoji: "🫠", desc: "The apprentice just asked what a Phillips head is. FOR THE THIRD TIME.", color: "#eab308" },
  { min: 41, max: 55, label: "Internal Screaming", emoji: "😶", desc: "GC changed the plans. Again. During lunch. MY lunch.", color: "#f59e0b" },
  { min: 56, max: 70, label: "Passive Aggressive", emoji: "🙃", desc: "\"No yeah, that's fine. I'll just rewire the ENTIRE panel. No big deal.\"", color: "#f97316" },
  { min: 71, max: 85, label: "Openly Hostile", emoji: "😡", desc: "Joe is now communicating exclusively through aggressive wire stripping.", color: "#ef4444" },
  { min: 86, max: 95, label: "Nuclear", emoji: "🤬", desc: "Somebody hid his linemans. SOMEBODY. HID. HIS. LINEMANS.", color: "#dc2626" },
  { min: 96, max: 100, label: "Gone Fishing", emoji: "🎣", desc: "Joe left. His truck is gone. His tools are gone. Only his hard hat remains on a nail.", color: "#7f1d1d" },
];

const DAILY_QUOTES = [
  "\"It's not a code violation if the inspector doesn't see it.\" — Ancient Electrician Proverb",
  "\"I didn't go to school for 4 years to be called a 'handyman'.\" — Every Electrician Ever",
  "\"The wire doesn't care about your feelings.\" — Joe, probably",
  "\"If it's stupid but it works, it's still stupid. But it works.\" — Jobsite Philosophy",
  "\"I am not 'playing with wires'. I am a licensed professional playing with wires.\"",
  "\"The only thing I'm overloading is this burrito at lunch.\"",
  "\"Ground it, bond it, send it.\" — The Electrician's Motto",
  "\"I don't always test my circuits, but when I do, I do it live.\"",
  "\"An apprentice and a hammer walk onto a jobsite... the drywall didn't survive.\"",
  "\"My rates? Cheap. My callback rates? Expensive. My 'why did you do it yourself first' rate? Priceless.\"",
  "\"Home Depot employee: 'Can I help you?' Me: 'Can you pull 200 feet of 6/3 Romex? No? Then no.'\"",
  "\"Plumbers look down on us. We look down on plumbers. HVAC guys look down on everyone from the roof.\"",
];

export default function HomePage() {
  const [annoyance, setAnnoyance] = useState(15);
  const [quote, setQuote] = useState("");
  const [beerCount, setBeerCount] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem("joe_annoyance");
    if (saved) setAnnoyance(parseInt(saved));
    const savedBeers = localStorage.getItem("joe_beers");
    if (savedBeers) setBeerCount(parseInt(savedBeers));
    setQuote(DAILY_QUOTES[Math.floor(Math.random() * DAILY_QUOTES.length)]);
  }, []);

  const updateAnnoyance = (val: number) => {
    setAnnoyance(val);
    localStorage.setItem("joe_annoyance", String(val));
  };

  const level = ANNOYANCE_LEVELS.find((l) => annoyance >= l.min && annoyance <= l.max) || ANNOYANCE_LEVELS[0];

  return (
    <main className="min-h-screen pb-20 px-4 pt-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-black">⚡ Jobsite Pro</h1>
        <p className="text-zinc-500 text-sm">Work hard. Complain harder.</p>
      </div>

      {/* Daily Quote */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#12121a] border border-white/10 rounded-xl p-4 mb-4 text-center"
      >
        <p className="text-xs text-zinc-500 uppercase tracking-wider font-bold mb-2">💬 Daily Wisdom</p>
        <p className="text-sm text-zinc-300 italic">{quote}</p>
      </motion.div>

      {/* Annoyance Meter */}
      <div className="bg-[#12121a] border rounded-2xl p-5 mb-4" style={{ borderColor: `${level.color}30` }}>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-black uppercase tracking-wider text-zinc-400">🔥 Employee Annoyance Meter</h2>
          <span className="text-2xl">{level.emoji}</span>
        </div>

        <div className="text-center mb-3">
          <motion.span
            key={level.label}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-xl font-black"
            style={{ color: level.color }}
          >
            {level.label}
          </motion.span>
          <p className="text-xs text-zinc-500 mt-1 italic">{level.desc}</p>
        </div>

        {/* Slider */}
        <div className="relative mb-2">
          <input
            type="range"
            min={0}
            max={100}
            value={annoyance}
            onChange={(e) => updateAnnoyance(parseInt(e.target.value))}
            className="w-full h-3 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #22c55e 0%, #eab308 40%, #ef4444 70%, #7f1d1d 100%)`,
            }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-zinc-600">
          <span>Chill 🧊</span>
          <span className="font-bold text-zinc-400">{annoyance}%</span>
          <span>Quitting 🔥</span>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <Link href="/joe">
          <div className="bg-[#12121a] border border-white/10 rounded-xl p-4 text-center hover:bg-[#1a1a25] transition-all active:scale-95">
            <span className="text-3xl block mb-1">🍺</span>
            <p className="font-bold text-xs">Joe&apos;s Bar</p>
            <p className="text-[10px] text-zinc-500 mt-0.5">
              {beerCount > 0 ? `${beerCount} deep` : "Sober"}
            </p>
          </div>
        </Link>
        <Link href="/meals">
          <div className="bg-[#12121a] border border-white/10 rounded-xl p-4 text-center hover:bg-[#1a1a25] transition-all active:scale-95">
            <span className="text-3xl block mb-1">🥗</span>
            <p className="font-bold text-xs">Joe&apos;s Meals</p>
            <p className="text-[10px] text-zinc-500 mt-0.5">Eat clean</p>
          </div>
        </Link>
        <Link href="/videos">
          <div className="bg-[#12121a] border border-white/10 rounded-xl p-4 text-center hover:bg-[#1a1a25] transition-all active:scale-95">
            <span className="text-3xl block mb-1">📺</span>
            <p className="font-bold text-xs">Break Room</p>
            <p className="text-[10px] text-zinc-500 mt-0.5">Time wasters</p>
          </div>
        </Link>
      </div>

      {/* Jobsite Dashboard Link */}
      <Link href="/dashboard">
        <div className="bg-[#12121a] border border-amber-500/20 rounded-xl p-4 flex items-center justify-between hover:bg-[#1a1a25] transition-all active:scale-[0.98]">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏗️</span>
            <div>
              <p className="font-bold text-sm">Jobsite Dashboard</p>
              <p className="text-[10px] text-zinc-500">The boring stuff (jobs, estimates, calculator)</p>
            </div>
          </div>
          <span className="text-zinc-500">→</span>
        </div>
      </Link>

      {/* Footer joke */}
      <p className="text-center text-[10px] text-zinc-700 mt-6">
        Built with ⚡ and questionable life choices
      </p>

      <BottomNav />
    </main>
  );
}

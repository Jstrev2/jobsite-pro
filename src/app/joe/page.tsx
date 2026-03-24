"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BottomNav from "@/components/BottomNav";

const DRUNK_STAGES = [
  { min: 0, max: 0, face: "😐", label: "Sober Joe", desc: "Just clocked out. Staring at the wall.", color: "#71717a" },
  { min: 1, max: 1, face: "😊", label: "First Sip Joe", desc: "\"Ahh... that hits different after pulling wire all day.\"", color: "#22c55e" },
  { min: 2, max: 2, face: "😄", label: "Happy Joe", desc: "\"You know what? The foreman ain't THAT bad.\"", color: "#22c55e" },
  { min: 3, max: 3, face: "😁", label: "Social Joe", desc: "\"Let me tell you about the time I wired a whole house backwards...\"", color: "#eab308" },
  { min: 4, max: 4, face: "🤪", label: "Storyteller Joe", desc: "\"So there I was, 20 feet up, no harness, holding a live wire with my TEETH...\"", color: "#eab308" },
  { min: 5, max: 5, face: "😂", label: "Laughing Joe", desc: "\"HAHAHAHA BRO PULL MY FINGER. Seriously. PULL IT.\"", color: "#f59e0b" },
  { min: 6, max: 6, face: "🥴", label: "Wobbly Joe", desc: "\"I could totally still bend conduit right now. Watch. WATCH.\"", color: "#f97316" },
  { min: 7, max: 7, face: "😵", label: "Philosophical Joe", desc: "\"Bro... what if WE'RE the ones living in the conduit, man?\"", color: "#ef4444" },
  { min: 8, max: 8, face: "🤮", label: "Danger Zone Joe", desc: "\"I'm fine. I'm fine. The room is just... rotating. For fun.\"", color: "#ef4444" },
  { min: 9, max: 9, face: "💀", label: "Flatline Joe", desc: "Joe is now one with the barstool. He IS the barstool.", color: "#dc2626" },
  { min: 10, max: 99, face: "☠️", label: "CALL 911", desc: "Joe has transcended the mortal plane. His hard hat remains.", color: "#7f1d1d" },
];

const BEER_RESPONSES = [
  "🍺 *crack* \"Thanks, brother.\"",
  "🍺 \"Now THAT'S what I'm talking about!\"",
  "🍺 \"You're a real one. A REAL one.\"",
  "🍺 \"This round's on the... wait you're buying? Even better.\"",
  "🍺 \"Pour it. POUR IT. Don't be shy with it.\"",
  "🍺 \"Is this craft? I don't care. Give it.\"",
  "🍺 \"My wife's gonna kill me. Worth it.\"",
  "🍺 \"One more can't hurt. That's science.\"",
];

const CUTOFF_RESPONSES = [
  "🚫 The bartender is giving you a LOOK.",
  "🚫 Joe's wife just called. She knows.",
  "🚫 Joe tried to tip with a wire nut. He's done.",
  "🚫 OSHA has entered the chat.",
  "🚫 Joe just called the foreman to say he loves him. CUT. HIM. OFF.",
  "🚫 Joe is trying to wire the jukebox. Someone stop him.",
  "🚫 He's arm wrestling himself. And losing.",
];

export default function JoesBar() {
  const [beers, setBeers] = useState(0);
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [beerHistory, setBeerHistory] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("joe_beers");
    if (saved) setBeers(parseInt(saved));
  }, []);

  const stage = DRUNK_STAGES.find((s) => beers >= s.min && beers <= s.max) || DRUNK_STAGES[DRUNK_STAGES.length - 1];

  const giveBeer = () => {
    if (beers >= 10) {
      const msg = CUTOFF_RESPONSES[Math.floor(Math.random() * CUTOFF_RESPONSES.length)];
      setMessage(msg);
      setShowMessage(true);
      setBeerHistory((h) => [msg, ...h].slice(0, 10));
      setTimeout(() => setShowMessage(false), 3000);
      return;
    }

    const newCount = beers + 1;
    setBeers(newCount);
    localStorage.setItem("joe_beers", String(newCount));

    const msg = BEER_RESPONSES[Math.floor(Math.random() * BEER_RESPONSES.length)];
    setMessage(msg);
    setShowMessage(true);
    setBeerHistory((h) => [msg, ...h].slice(0, 10));
    setTimeout(() => setShowMessage(false), 3000);
  };

  const resetJoe = () => {
    setBeers(0);
    localStorage.setItem("joe_beers", "0");
    setMessage("☀️ *Joe wakes up on the couch* \"What happened? Why is my hard hat on the dog?\"");
    setShowMessage(true);
    setBeerHistory([]);
    setTimeout(() => setShowMessage(false), 4000);
  };

  return (
    <main className="min-h-screen pb-20 px-4 pt-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-black">🍻 Joe&apos;s Bar</h1>
        <p className="text-zinc-500 text-sm">After-hours refreshment station</p>
      </div>

      {/* Joe's State */}
      <motion.div
        className="bg-[#12121a] border rounded-2xl p-6 text-center mb-4"
        style={{ borderColor: `${stage.color}40` }}
        animate={{ boxShadow: `0 0 30px ${stage.color}20` }}
      >
        <motion.div
          className="text-7xl mb-3"
          animate={beers > 5 ? { rotate: [0, -5, 5, -3, 3, 0] } : {}}
          transition={beers > 5 ? { duration: 2, repeat: Infinity } : {}}
        >
          {stage.face}
        </motion.div>
        <h2 className="text-xl font-black mb-1" style={{ color: stage.color }}>
          {stage.label}
        </h2>
        <p className="text-sm text-zinc-400 italic mb-3">{stage.desc}</p>

        {/* Beer count */}
        <div className="flex items-center justify-center gap-1 mb-4 flex-wrap">
          {Array.from({ length: Math.min(beers, 15) }).map((_, i) => (
            <motion.span
              key={i}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: beers > 6 ? Math.random() * 30 - 15 : 0 }}
              className="text-2xl"
            >
              🍺
            </motion.span>
          ))}
          {beers === 0 && <span className="text-zinc-600 text-sm">No beers yet. Joe is disappointed.</span>}
        </div>

        {/* Beer counter */}
        <div className="text-4xl font-black mb-4" style={{ color: stage.color }}>
          {beers} <span className="text-lg text-zinc-500">beer{beers !== 1 ? "s" : ""}</span>
        </div>

        {/* Give beer button */}
        <motion.button
          onClick={giveBeer}
          whileTap={{ scale: 0.9 }}
          className="px-8 py-4 bg-amber-500 hover:bg-amber-600 text-black font-black text-lg rounded-2xl transition-all shadow-lg shadow-amber-500/20"
        >
          🍺 Give Joe a Beer
        </motion.button>

        {beers > 0 && (
          <button
            onClick={resetJoe}
            className="block mx-auto mt-3 text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
          >
            ☀️ Next morning (reset)
          </button>
        )}
      </motion.div>

      {/* Response message */}
      <AnimatePresence>
        {showMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-[#1a1a25] border border-white/10 rounded-xl p-4 text-center text-sm mb-4"
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Drink log */}
      {beerHistory.length > 0 && (
        <div className="bg-[#12121a] border border-white/10 rounded-xl p-4">
          <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Bar Tab History</h3>
          <div className="space-y-1.5 max-h-40 overflow-y-auto">
            {beerHistory.map((msg, i) => (
              <p key={i} className="text-xs text-zinc-400">{msg}</p>
            ))}
          </div>
        </div>
      )}

      <BottomNav />
    </main>
  );
}

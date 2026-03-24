"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BottomNav from "@/components/BottomNav";

const RAGE_STAGES = [
  { min: 0, max: 0, face: "😴", label: "Pre-Caffeine Joe", desc: "Joe hasn't had anything yet. He's basically furniture.", color: "#71717a", bg: "#71717a" },
  { min: 1, max: 1, face: "😐", label: "One Sip In", desc: "\"...don't talk to me yet.\"", color: "#84cc16", bg: "#84cc16" },
  { min: 2, max: 2, face: "😤", label: "Waking Up Angry", desc: "\"Why is the apprentice already asking questions? It's 6AM.\"", color: "#22c55e", bg: "#22c55e" },
  { min: 3, max: 3, face: "🤨", label: "Suspiciously Focused", desc: "Joe just organized his entire truck in 4 minutes. His eye is twitching.", color: "#eab308", bg: "#eab308" },
  { min: 4, max: 4, face: "😠", label: "Caffeinated & Combative", desc: "\"WHO MOVED MY CHANNEL LOCKS? I WILL END DYNASTIES.\"", color: "#f59e0b", bg: "#f59e0b" },
  { min: 5, max: 5, face: "🤬", label: "Full Send Mode", desc: "Joe just bent a stick of 3/4\" EMT with his bare hands. Out of spite.", color: "#f97316", bg: "#f97316" },
  { min: 6, max: 6, face: "👹", label: "Demon Mode", desc: "The apprentice is hiding in the port-a-john. The GC left the site. Joe is alone with the wire. The wire is afraid.", color: "#ef4444", bg: "#ef4444" },
  { min: 7, max: 7, face: "💀", label: "Heart Attack Territory", desc: "Joe can hear colors and see sounds. His blood is 40% taurine. His resting heart rate is a drum solo.", color: "#dc2626", bg: "#dc2626" },
  { min: 8, max: 99, face: "☢️", label: "HAZMAT SITUATION", desc: "Joe has achieved a state of pure energy. He no longer needs tools. He IS the tool. OSHA has been notified. His wife has been notified. God has been notified.", color: "#7f1d1d", bg: "#7f1d1d" },
];

const ENERGY_DRINKS = [
  { name: "Monster", emoji: "🟢", color: "#22c55e" },
  { name: "Red Bull", emoji: "🔵", color: "#3b82f6" },
  { name: "Bang", emoji: "💥", color: "#f59e0b" },
  { name: "Celsius", emoji: "🔥", color: "#ef4444" },
  { name: "Reign", emoji: "👑", color: "#a855f7" },
  { name: "C4", emoji: "💣", color: "#f97316" },
];

const DRINK_RESPONSES = [
  "Joe chugged that like it owed him money.",
  "He didn't even taste it. Just absorbed it through his skin.",
  "The can crumpled in his hand. He didn't even squeeze.",
  "\"ANOTHER.\" — Joe, channeling Thor",
  "His left eye is now twitching independently of his right eye.",
  "Joe just speed-walked to the panel and back for no reason.",
  "The apprentice felt a chill down his spine. He doesn't know why.",
  "Joe's heart rate just set a new personal record.",
  "\"I CAN FEEL MY TEETH.\" — Joe, vibrating",
  "He's now talking at 2x speed. Nobody can understand him.",
];

const CUTOFF_RESPONSES = [
  "⚠️ The gas station clerk is REFUSING to sell him more.",
  "⚠️ His Fitbit just sent an automated 911 alert.",
  "⚠️ Joe's blood type is now \"Monster Ultra.\"",
  "⚠️ He's vibrating at a frequency that's disrupting the job site WiFi.",
  "⚠️ The energy drink companies have issued a joint statement: \"Please stop.\"",
  "⚠️ Joe tried to fight a breaker box. The breaker box lost.",
  "⚠️ His pee is now fluorescent. Literally glowing.",
];

export default function RageOMeter() {
  const [drinks, setDrinks] = useState(0);
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [lastDrink, setLastDrink] = useState("");
  const [drinkLog, setDrinkLog] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("joe_energy_drinks");
    if (saved) setDrinks(parseInt(saved));
  }, []);

  const stage = RAGE_STAGES.find((s) => drinks >= s.min && drinks <= s.max) || RAGE_STAGES[RAGE_STAGES.length - 1];

  const giveDrink = (drink: typeof ENERGY_DRINKS[0]) => {
    if (drinks >= 8) {
      const msg = CUTOFF_RESPONSES[Math.floor(Math.random() * CUTOFF_RESPONSES.length)];
      setMessage(msg);
      setShowMessage(true);
      setDrinkLog((h) => [`${drink.emoji} ${drink.name}: ${msg}`, ...h].slice(0, 15));
      setTimeout(() => setShowMessage(false), 3000);
      return;
    }

    const newCount = drinks + 1;
    setDrinks(newCount);
    setLastDrink(drink.name);
    localStorage.setItem("joe_energy_drinks", String(newCount));

    const response = DRINK_RESPONSES[Math.floor(Math.random() * DRINK_RESPONSES.length)];
    const msg = `${drink.emoji} ${drink.name}: ${response}`;
    setMessage(msg);
    setShowMessage(true);
    setDrinkLog((h) => [msg, ...h].slice(0, 15));
    setTimeout(() => setShowMessage(false), 3000);
  };

  const crashJoe = () => {
    setDrinks(0);
    localStorage.setItem("joe_energy_drinks", "0");
    setMessage("💤 Joe just crashed HARD. Found him asleep in the back of his truck with 6 empty cans as a pillow. He'll be back tomorrow.");
    setShowMessage(true);
    setDrinkLog([]);
    setTimeout(() => setShowMessage(false), 5000);
  };

  return (
    <main className="min-h-screen pb-20 px-4 pt-6 max-w-lg mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-black">⚡ Rage-O-Meter</h1>
        <p className="text-zinc-500 text-sm">Fueled by caffeine. Powered by anger.</p>
      </div>

      {/* Rage State */}
      <motion.div
        className="bg-[#12121a] border rounded-2xl p-6 text-center mb-4"
        style={{ borderColor: `${stage.color}40` }}
        animate={{
          boxShadow: drinks > 4
            ? [`0 0 20px ${stage.color}20`, `0 0 40px ${stage.color}40`, `0 0 20px ${stage.color}20`]
            : `0 0 20px ${stage.color}15`,
        }}
        transition={drinks > 4 ? { duration: 0.5, repeat: Infinity } : {}}
      >
        <motion.div
          className="text-7xl mb-3"
          animate={
            drinks > 5
              ? { rotate: [0, -10, 10, -10, 10, 0], scale: [1, 1.1, 1, 1.1, 1] }
              : drinks > 3
              ? { rotate: [0, -3, 3, -3, 3, 0] }
              : {}
          }
          transition={drinks > 3 ? { duration: drinks > 5 ? 0.3 : 1, repeat: Infinity } : {}}
        >
          {stage.face}
        </motion.div>

        <h2 className="text-xl font-black mb-1" style={{ color: stage.color }}>
          {stage.label}
        </h2>
        <p className="text-sm text-zinc-400 italic mb-4">{stage.desc}</p>

        {/* Energy drink cans */}
        <div className="flex items-center justify-center gap-1 mb-3 flex-wrap">
          {Array.from({ length: Math.min(drinks, 12) }).map((_, i) => (
            <motion.span
              key={i}
              initial={{ scale: 0, rotate: -180 }}
              animate={{
                scale: 1,
                rotate: drinks > 5 ? Math.random() * 60 - 30 : 0,
              }}
              className="text-xl"
            >
              🥫
            </motion.span>
          ))}
          {drinks === 0 && <span className="text-zinc-600 text-sm">No energy drinks yet. Joe is dangerously calm.</span>}
        </div>

        {/* Counter */}
        <motion.div
          className="text-4xl font-black mb-2"
          style={{ color: stage.color }}
          animate={drinks > 5 ? { scale: [1, 1.05, 1] } : {}}
          transition={drinks > 5 ? { duration: 0.5, repeat: Infinity } : {}}
        >
          {drinks} <span className="text-lg text-zinc-500">can{drinks !== 1 ? "s" : ""}</span>
        </motion.div>

        {lastDrink && drinks > 0 && (
          <p className="text-xs text-zinc-600 mb-4">Last drink: {lastDrink}</p>
        )}

        {/* Energy Drink Buttons */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          {ENERGY_DRINKS.map((drink) => (
            <motion.button
              key={drink.name}
              whileTap={{ scale: 0.9 }}
              onClick={() => giveDrink(drink)}
              className="py-2.5 px-2 rounded-xl font-bold text-xs transition-all border"
              style={{
                backgroundColor: `${drink.color}15`,
                borderColor: `${drink.color}30`,
                color: drink.color,
              }}
            >
              {drink.emoji} {drink.name}
            </motion.button>
          ))}
        </div>

        {drinks > 0 && (
          <button
            onClick={crashJoe}
            className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors mt-2"
          >
            💤 Caffeine crash (reset)
          </button>
        )}
      </motion.div>

      {/* Response */}
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
      {drinkLog.length > 0 && (
        <div className="bg-[#12121a] border border-white/10 rounded-xl p-4">
          <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">⚡ Caffeine Log</h3>
          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {drinkLog.map((msg, i) => (
              <p key={i} className="text-xs text-zinc-400">{msg}</p>
            ))}
          </div>
        </div>
      )}

      <BottomNav />
    </main>
  );
}

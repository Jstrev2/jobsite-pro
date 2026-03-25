"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BottomNav from "@/components/BottomNav";

// --- GAME CONFIG ---
interface EnergyDrink {
  name: string;
  emoji: string;
  color: string;
  energy: number;   // how much energy it gives
  rage: number;     // how much rage it adds
  cost: number;     // $ cost
}

const DRINKS: EnergyDrink[] = [
  { name: "Monster", emoji: "🟢", color: "#22c55e", energy: 15, rage: 8, cost: 3 },
  { name: "Red Bull", emoji: "🔵", color: "#3b82f6", energy: 10, rage: 5, cost: 4 },
  { name: "Bang", emoji: "💥", color: "#f59e0b", energy: 25, rage: 15, cost: 5 },
  { name: "Celsius", emoji: "🔥", color: "#ef4444", energy: 20, rage: 12, cost: 4 },
  { name: "Reign", emoji: "👑", color: "#a855f7", energy: 22, rage: 14, cost: 5 },
  { name: "C4", emoji: "💣", color: "#f97316", energy: 30, rage: 20, cost: 6 },
];

interface Task {
  id: number;
  name: string;
  emoji: string;
  energyCost: number;
  reward: number;
  timeLimit: number; // seconds to complete
  startedAt: number;
}

const TASK_TEMPLATES = [
  { name: "Wire an outlet", emoji: "🔌", energyCost: 8, reward: 15, timeLimit: 8 },
  { name: "Bend conduit", emoji: "🔧", energyCost: 12, reward: 20, timeLimit: 7 },
  { name: "Pull wire", emoji: "🧵", energyCost: 15, reward: 25, timeLimit: 9 },
  { name: "Install breaker", emoji: "⚡", energyCost: 10, reward: 18, timeLimit: 6 },
  { name: "Fix junction box", emoji: "📦", energyCost: 8, reward: 12, timeLimit: 5 },
  { name: "Mount panel", emoji: "🏗️", energyCost: 20, reward: 35, timeLimit: 10 },
  { name: "Troubleshoot circuit", emoji: "🔍", energyCost: 18, reward: 30, timeLimit: 12 },
  { name: "Run romex", emoji: "🏠", energyCost: 14, reward: 22, timeLimit: 8 },
  { name: "Install ceiling fan", emoji: "💨", energyCost: 16, reward: 28, timeLimit: 9 },
  { name: "Swap light fixture", emoji: "💡", energyCost: 6, reward: 10, timeLimit: 5 },
  { name: "EV charger install", emoji: "🚗", energyCost: 25, reward: 45, timeLimit: 12 },
  { name: "Panel upgrade", emoji: "🔋", energyCost: 30, reward: 55, timeLimit: 15 },
  { name: "Find the short", emoji: "😤", energyCost: 22, reward: 40, timeLimit: 10 },
  { name: "Argue with GC", emoji: "🤬", energyCost: 5, reward: 0, timeLimit: 3 },
  { name: "Teach apprentice", emoji: "👶", energyCost: 10, reward: 8, timeLimit: 6 },
  { name: "Dig trench", emoji: "🕳️", energyCost: 20, reward: 15, timeLimit: 10 },
];

type GameState = "menu" | "playing" | "gameover";

const RAGE_FACES = ["😐", "😤", "😠", "🤬", "👹", "☢️", "💀"];

function getRageFace(rage: number): string {
  const idx = Math.min(Math.floor(rage / 15), RAGE_FACES.length - 1);
  return RAGE_FACES[idx];
}

function getRageLabel(rage: number): string {
  if (rage < 15) return "Chill";
  if (rage < 30) return "Irritated";
  if (rage < 50) return "Heated";
  if (rage < 70) return "Furious";
  if (rage < 85) return "Unhinged";
  if (rage < 95) return "DEMON MODE";
  return "☢️ MELTDOWN";
}

function getRageColor(rage: number): string {
  if (rage < 25) return "#22c55e";
  if (rage < 50) return "#eab308";
  if (rage < 75) return "#f97316";
  return "#ef4444";
}

export default function RageGame() {
  const [gameState, setGameState] = useState<GameState>("menu");
  const [energy, setEnergy] = useState(50);
  const [rage, setRage] = useState(0);
  const [money, setMoney] = useState(20);
  const [score, setScore] = useState(0);
  const [tasksCompleted, setTasksCompleted] = useState(0);
  const [activeTasks, setActiveTasks] = useState<Task[]>([]);
  const [gameTime, setGameTime] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [feedMsg, setFeedMsg] = useState("");
  const [shiftOver, setShiftOver] = useState(false);
  const taskIdRef = useRef(0);
  const gameLoopRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const taskSpawnRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load high score
  useEffect(() => {
    const saved = localStorage.getItem("rage_highscore");
    if (saved) setHighScore(parseInt(saved));
  }, []);

  const endGame = useCallback((reason: string) => {
    setGameState("gameover");
    setFeedMsg(reason);
    if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    if (taskSpawnRef.current) clearInterval(taskSpawnRef.current);

    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem("rage_highscore", String(score));
    }
  }, [score, highScore]);

  // Game loop
  useEffect(() => {
    if (gameState !== "playing") return;

    gameLoopRef.current = setInterval(() => {
      setGameTime((t) => t + 1);

      // Energy drains over time
      setEnergy((e) => {
        const newE = Math.max(0, e - 0.8);
        if (newE <= 0) {
          endGame("💤 Joe fell asleep on the job! Zero energy. The foreman found him cuddling a wire spool.");
        }
        return newE;
      });

      // Rage slowly decays
      setRage((r) => Math.max(0, r - 0.3));

      // Check expired tasks
      setActiveTasks((tasks) => {
        const now = Date.now();
        const expired = tasks.filter((t) => now - t.startedAt > t.timeLimit * 1000);
        if (expired.length > 0) {
          setRage((r) => {
            const newR = Math.min(100, r + expired.length * 5);
            return newR;
          });
        }
        return tasks.filter((t) => now - t.startedAt <= t.timeLimit * 1000);
      });
    }, 500);

    return () => { if (gameLoopRef.current) clearInterval(gameLoopRef.current); };
  }, [gameState, endGame]);

  // Spawn tasks
  useEffect(() => {
    if (gameState !== "playing") return;

    const spawnTask = () => {
      const template = TASK_TEMPLATES[Math.floor(Math.random() * TASK_TEMPLATES.length)];
      const difficulty = 1 + Math.floor(gameTime / 30) * 0.3; // gets harder over time
      const newTask: Task = {
        id: taskIdRef.current++,
        ...template,
        energyCost: Math.round(template.energyCost * difficulty),
        reward: Math.round(template.reward * difficulty),
        timeLimit: Math.max(3, Math.round(template.timeLimit / difficulty)),
        startedAt: Date.now(),
      };
      setActiveTasks((tasks) => {
        if (tasks.length >= 5) return tasks; // max 5 active
        return [...tasks, newTask];
      });
    };

    // Spawn faster as game progresses
    const interval = Math.max(2000, 5000 - gameTime * 30);
    taskSpawnRef.current = setInterval(spawnTask, interval);
    spawnTask(); // spawn one immediately

    return () => { if (taskSpawnRef.current) clearInterval(taskSpawnRef.current); };
  }, [gameState, gameTime]);

  // Check rage game over
  useEffect(() => {
    if (gameState === "playing" && rage >= 100) {
      endGame("🤬 JOE SNAPPED! He threw his linemans at the GC, flipped a panel box, and drove off in a cloud of dust. Legend says he's still screaming.");
    }
  }, [rage, gameState, endGame]);

  const startGame = () => {
    setGameState("playing");
    setEnergy(50);
    setRage(0);
    setMoney(20);
    setScore(0);
    setTasksCompleted(0);
    setActiveTasks([]);
    setGameTime(0);
    setShiftOver(false);
    setFeedMsg("");
    taskIdRef.current = 0;
  };

  const buyDrink = (drink: EnergyDrink) => {
    if (money < drink.cost) {
      setFeedMsg(`Broke! Need $${drink.cost} for ${drink.name}`);
      return;
    }
    setMoney((m) => m - drink.cost);
    setEnergy((e) => Math.min(100, e + drink.energy));
    setRage((r) => {
      const newR = Math.min(100, r + drink.rage);
      return newR;
    });
    setFeedMsg(`${drink.emoji} CHUGGED ${drink.name}! +${drink.energy}⚡ +${drink.rage}🔥`);
  };

  const completeTask = (task: Task) => {
    if (energy < task.energyCost) {
      setFeedMsg("Not enough energy! Grab a drink! ⚡");
      return;
    }
    setEnergy((e) => e - task.energyCost);
    setMoney((m) => m + task.reward);
    setScore((s) => s + task.reward);
    setTasksCompleted((t) => t + 1);
    setActiveTasks((tasks) => tasks.filter((t) => t.id !== task.id));
    setFeedMsg(`✅ ${task.emoji} ${task.name} done! +$${task.reward}`);

    // Check shift end (every 10 tasks, option to end shift)
    if ((tasksCompleted + 1) % 10 === 0 && tasksCompleted > 0) {
      setShiftOver(true);
    }
  };

  const endShift = () => {
    endGame(`🏁 Joe clocked out after ${tasksCompleted + 1} tasks! A solid day's work. His wife is only mildly concerned.`);
  };

  // -- RENDER --

  if (gameState === "menu") {
    return (
      <main className="min-h-screen pb-20 px-4 pt-6 max-w-lg mx-auto">
        <div className="text-center mt-12 mb-8">
          <motion.div
            className="text-7xl mb-4"
            animate={{ rotate: [0, -5, 5, -5, 0], scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ⚡
          </motion.div>
          <h1 className="text-4xl font-black mb-2">RAGE-O-METER</h1>
          <p className="text-zinc-500 text-sm mb-1">The Energy Drink Survival Game</p>
          <p className="text-zinc-600 text-xs">Keep Joe caffeinated. Keep him working. Don&apos;t let him snap.</p>
        </div>

        <div className="bg-[#12121a] border border-white/10 rounded-xl p-4 mb-6 text-sm text-zinc-400 space-y-2">
          <p>⚡ <span className="text-white font-semibold">Energy</span> drains constantly — buy drinks to refuel</p>
          <p>🔥 <span className="text-white font-semibold">Rage</span> builds with each drink — hit 100 and Joe SNAPS</p>
          <p>📋 <span className="text-white font-semibold">Tasks</span> appear — complete them for cash before they expire</p>
          <p>💰 <span className="text-white font-semibold">Cash</span> = your score. Spend it on drinks or let it stack</p>
          <p>⏱️ Tasks get harder and faster over time. Survive the shift!</p>
        </div>

        {highScore > 0 && (
          <p className="text-center text-sm text-amber-400 mb-4">🏆 High Score: ${highScore}</p>
        )}

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={startGame}
          className="w-full py-4 bg-gradient-to-r from-amber-500 to-red-500 text-black font-black text-xl rounded-2xl shadow-lg shadow-amber-500/30"
        >
          🏗️ START SHIFT
        </motion.button>

        <BottomNav />
      </main>
    );
  }

  if (gameState === "gameover") {
    return (
      <main className="min-h-screen pb-20 px-4 pt-6 max-w-lg mx-auto">
        <div className="text-center mt-12 mb-6">
          <div className="text-7xl mb-4">{rage >= 100 ? "🤬" : energy <= 0 ? "💤" : "🏁"}</div>
          <h1 className="text-3xl font-black mb-2">SHIFT OVER</h1>
          <p className="text-sm text-zinc-400 italic mb-6 px-4">{feedMsg}</p>
        </div>

        <div className="bg-[#12121a] border border-white/10 rounded-xl p-4 mb-6 space-y-3">
          <div className="flex justify-between">
            <span className="text-zinc-500 text-sm">💰 Money Earned</span>
            <span className="text-amber-400 font-black text-lg">${score}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500 text-sm">📋 Tasks Completed</span>
            <span className="font-bold">{tasksCompleted}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500 text-sm">⏱️ Time Survived</span>
            <span className="font-bold">{Math.floor(gameTime / 2)}s</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500 text-sm">🏆 High Score</span>
            <span className="text-amber-400 font-bold">${highScore}</span>
          </div>
          {score >= highScore && score > 0 && (
            <p className="text-center text-green-400 font-bold text-sm">🎉 NEW HIGH SCORE!</p>
          )}
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={startGame}
          className="w-full py-4 bg-gradient-to-r from-amber-500 to-red-500 text-black font-black text-lg rounded-2xl shadow-lg shadow-amber-500/30 mb-3"
        >
          🔄 Another Shift
        </motion.button>

        <button onClick={() => setGameState("menu")} className="w-full py-2 text-zinc-500 text-sm hover:text-zinc-300 transition-colors">
          Back to Menu
        </button>

        <BottomNav />
      </main>
    );
  }

  // PLAYING STATE
  const rageColor = getRageColor(rage);

  return (
    <main className="min-h-screen pb-20 px-4 pt-2 max-w-lg mx-auto">
      {/* Status Bars */}
      <div className="space-y-2 mb-3">
        {/* Energy */}
        <div>
          <div className="flex justify-between text-[10px] mb-0.5">
            <span className="text-blue-400 font-bold">⚡ ENERGY</span>
            <span className="text-zinc-500">{Math.round(energy)}%</span>
          </div>
          <div className="h-4 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400"
              animate={{ width: `${energy}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Rage */}
        <div>
          <div className="flex justify-between text-[10px] mb-0.5">
            <span className="font-bold" style={{ color: rageColor }}>🔥 RAGE — {getRageFace(rage)} {getRageLabel(rage)}</span>
            <span className="text-zinc-500">{Math.round(rage)}%</span>
          </div>
          <div className="h-4 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: `linear-gradient(to right, #eab308, ${rageColor})` }}
              animate={{ width: `${rage}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>

      {/* Score Bar */}
      <div className="flex justify-between items-center mb-3 bg-[#12121a] border border-white/10 rounded-lg px-3 py-2">
        <span className="text-amber-400 font-black">💰 ${money}</span>
        <span className="text-zinc-500 text-xs">Score: ${score}</span>
        <span className="text-zinc-500 text-xs">📋 {tasksCompleted}</span>
        <span className="text-zinc-500 text-xs">⏱️ {Math.floor(gameTime / 2)}s</span>
      </div>

      {/* Feed message */}
      <AnimatePresence>
        {feedMsg && (
          <motion.p
            key={feedMsg}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-xs text-center text-zinc-400 mb-2 h-4"
          >
            {feedMsg}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Energy Drinks */}
      <div className="mb-3">
        <p className="text-[10px] text-zinc-600 uppercase tracking-wider font-bold mb-1.5">⚡ Buy Drinks</p>
        <div className="grid grid-cols-3 gap-1.5">
          {DRINKS.map((d) => (
            <motion.button
              key={d.name}
              whileTap={{ scale: 0.9 }}
              onClick={() => buyDrink(d)}
              disabled={money < d.cost}
              className="py-2 px-1 rounded-lg font-bold text-[11px] border transition-all disabled:opacity-30"
              style={{ backgroundColor: `${d.color}10`, borderColor: `${d.color}30`, color: d.color }}
            >
              {d.emoji} {d.name}<br />
              <span className="text-[9px] opacity-70">${d.cost} | +{d.energy}⚡ +{d.rage}🔥</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Active Tasks */}
      <div className="mb-3">
        <p className="text-[10px] text-zinc-600 uppercase tracking-wider font-bold mb-1.5">📋 Tasks (tap to complete)</p>
        <div className="space-y-2">
          <AnimatePresence>
            {activeTasks.map((task) => (
              <TaskCard key={task.id} task={task} energy={energy} onComplete={() => completeTask(task)} />
            ))}
          </AnimatePresence>
          {activeTasks.length === 0 && (
            <p className="text-xs text-zinc-600 text-center py-4">Waiting for tasks...</p>
          )}
        </div>
      </div>

      {/* End Shift option */}
      {shiftOver && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-green-500/10 border border-green-500/30 rounded-xl p-3 text-center mb-3"
        >
          <p className="text-sm text-green-400 font-bold mb-2">🏁 Shift milestone! Clock out?</p>
          <div className="flex gap-2">
            <button onClick={endShift} className="flex-1 py-2 bg-green-500/20 border border-green-500/40 rounded-lg text-green-400 font-bold text-sm">Clock Out 🏠</button>
            <button onClick={() => setShiftOver(false)} className="flex-1 py-2 bg-white/5 border border-white/10 rounded-lg text-zinc-400 font-bold text-sm">Keep Going 💪</button>
          </div>
        </motion.div>
      )}

      <BottomNav />
    </main>
  );
}

// Task card with countdown
function TaskCard({ task, energy, onComplete }: { task: Task; energy: number; onComplete: () => void }) {
  const [timeLeft, setTimeLeft] = useState(task.timeLimit);

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = task.timeLimit - (Date.now() - task.startedAt) / 1000;
      setTimeLeft(Math.max(0, remaining));
    }, 100);
    return () => clearInterval(interval);
  }, [task]);

  const progress = timeLeft / task.timeLimit;
  const urgent = progress < 0.3;
  const canAfford = energy >= task.energyCost;

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0, scale: urgent ? [1, 1.02, 1] : 1 }}
      exit={{ opacity: 0, x: -50 }}
      transition={urgent ? { scale: { duration: 0.5, repeat: Infinity } } : {}}
      onClick={canAfford ? onComplete : undefined}
      className={`bg-[#12121a] border rounded-xl p-3 ${canAfford ? "cursor-pointer active:scale-95" : "opacity-60"} transition-all`}
      style={{ borderColor: urgent ? "#ef444460" : "rgba(255,255,255,0.1)" }}
    >
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <span className="text-lg">{task.emoji}</span>
          <div>
            <p className="font-bold text-xs">{task.name}</p>
            <p className="text-[10px] text-zinc-500">-{task.energyCost}⚡ → +${task.reward}</p>
          </div>
        </div>
        <span className={`text-xs font-mono font-bold ${urgent ? "text-red-400" : "text-zinc-400"}`}>
          {timeLeft.toFixed(1)}s
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-100"
          style={{
            width: `${progress * 100}%`,
            backgroundColor: urgent ? "#ef4444" : progress < 0.5 ? "#eab308" : "#22c55e",
          }}
        />
      </div>
    </motion.div>
  );
}

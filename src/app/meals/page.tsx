"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BottomNav from "@/components/BottomNav";

type MealTime = "breakfast" | "lunch" | "dinner";

interface Meal {
  name: string;
  desc: string;
  items: string[];
  joeQuote: string;
}

const MEALS: Record<MealTime, Meal[]> = {
  breakfast: [
    { name: "The Early Bird", desc: "For when the alarm wins", items: ["Scrambled eggs (3)", "Avocado slices", "Sautéed spinach", "Mixed berries", "Black coffee ☕"], joeQuote: "\"Eggs and coffee. That's the foundation. Everything else is trim work.\"" },
    { name: "The Sunrise Hustle", desc: "Fuel for a 6AM start", items: ["Greek yogurt parfait", "Sliced banana & strawberries", "Handful of almonds", "Drizzle of honey", "Green tea"], joeQuote: "\"Yogurt? Yeah I eat yogurt. You got a problem with that?\"" },
    { name: "The Foreman's Plate", desc: "Big energy, no crash", items: ["Turkey sausage links (3)", "Tomato & cucumber slices", "Hard boiled eggs (2)", "Cantaloupe wedges", "Water with lemon"], joeQuote: "\"You eat garbage for breakfast, you wire garbage all day. That's science.\"" },
    { name: "The Green Machine", desc: "Suspiciously healthy", items: ["Smoothie: spinach, banana, protein powder, almond milk", "Apple slices with almond butter", "Handful of walnuts"], joeQuote: "\"Don't tell the guys I drink green smoothies. I have a reputation.\"" },
    { name: "The Protein Stack", desc: "When you're pulling wire all morning", items: ["Egg white omelette with peppers & onions", "Cottage cheese", "Blueberries & raspberries", "Sliced turkey breast"], joeQuote: "\"Carbs are for people who sit at desks. We're ATHLETES.\"" },
  ],
  lunch: [
    { name: "The Jobsite Salad", desc: "Looks weird in a hard hat, tastes great", items: ["Grilled chicken breast (sliced)", "Mixed greens & arugula", "Cherry tomatoes, cucumbers, red onion", "Avocado chunks", "Olive oil & lemon dressing"], joeQuote: "\"Yeah the guys laughed at my salad. Then I outworked all of them by 2PM.\"" },
    { name: "The Toolbox Bowl", desc: "Everything but the kitchen sink", items: ["Grilled salmon fillet", "Roasted sweet potato cubes", "Steamed broccoli & snap peas", "Drizzle of tahini"], joeQuote: "\"This bowl has more organization than the GC's plans.\"" },
    { name: "The Break Room Special", desc: "Quick, clean, no microwave needed", items: ["Turkey & lettuce wraps (butter lettuce cups)", "Sliced bell peppers & hummus", "Grape tomatoes", "Mixed nuts", "Apple"], joeQuote: "\"Lettuce wraps. No bread. I'm not an animal. Wait—\"" },
    { name: "The Steak & Greens", desc: "For when you earned it", items: ["Flank steak strips (grilled)", "Caesar salad (no croutons)", "Roasted zucchini", "Handful of blackberries"], joeQuote: "\"Steak for lunch on a Tuesday? That's called WINNING.\"" },
    { name: "The Shrimp Situation", desc: "Fancy for a Tuesday", items: ["Grilled shrimp skewers", "Mango & avocado salad", "Cucumber ribbons", "Lime vinaigrette", "Sparkling water"], joeQuote: "\"Shrimp on the jobsite. The apprentice thought I was management.\"" },
  ],
  dinner: [
    { name: "The Clock Out Classic", desc: "You survived another day", items: ["Grilled chicken thighs (herb marinated)", "Roasted asparagus", "Sweet potato mash (no butter, just a little olive oil)", "Side salad with balsamic"], joeQuote: "\"After 10 hours of pulling wire, this is what heaven looks like.\"" },
    { name: "The Salmon Sunset", desc: "Heart-healthy, soul-heavy", items: ["Baked salmon with lemon & dill", "Sautéed green beans & mushrooms", "Roasted Brussels sprouts", "Mixed berry bowl for dessert"], joeQuote: "\"My doctor said eat more fish. So I eat fish. And I complain about it. Balance.\"" },
    { name: "The Grill Master", desc: "Joe + fire = dinner", items: ["Grilled ribeye (lean cut)", "Grilled portobello mushrooms", "Charred bell peppers & onions", "Watermelon & feta salad"], joeQuote: "\"I wire houses AND I grill. I'm basically a renaissance man.\"" },
    { name: "The Turkey Situation", desc: "Clean eating, dirty jokes", items: ["Ground turkey stuffed peppers", "Side of guacamole", "Roasted cauliflower", "Sliced mango"], joeQuote: "\"Stuffed peppers are just edible conduit. Think about it.\"" },
    { name: "The Stir Fry (No Rice Edition)", desc: "All the flavor, none of the filler", items: ["Chicken & shrimp stir fry", "Broccoli, snap peas, water chestnuts, bell peppers", "Cauliflower rice base", "Coconut aminos sauce", "Sliced pineapple"], joeQuote: "\"Cauliflower rice isn't real rice. But it's close enough when you're hungry enough.\"" },
    { name: "The Recovery Meal", desc: "After a ROUGH one", items: ["Baked cod with garlic & herbs", "Steamed spinach & kale", "Roasted beets & carrots", "Fresh fruit salad (mango, kiwi, berries)"], joeQuote: "\"Some days you need steak. Some days you need to apologize to your body. This is the apology.\"" },
  ],
};

const MEAL_CONFIG: Record<MealTime, { icon: string; label: string; color: string; time: string }> = {
  breakfast: { icon: "🌅", label: "Breakfast", color: "#f59e0b", time: "5-8 AM" },
  lunch: { icon: "☀️", label: "Lunch", color: "#22c55e", time: "11 AM-1 PM" },
  dinner: { icon: "🌙", label: "Dinner", color: "#8b5cf6", time: "6-8 PM" },
};

export default function MealsPage() {
  const [mealTime, setMealTime] = useState<MealTime>("lunch");
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [shuffling, setShuffling] = useState(false);

  const shuffle = () => {
    setShuffling(true);
    const meals = MEALS[mealTime];
    const pick = meals[Math.floor(Math.random() * meals.length)];
    setTimeout(() => {
      setSelectedMeal(pick);
      setShuffling(false);
    }, 300);
  };

  const config = MEAL_CONFIG[mealTime];

  return (
    <main className="min-h-screen pb-20 px-4 pt-6 max-w-lg mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-black">🥗 Meals by Joe</h1>
        <p className="text-zinc-500 text-sm">Healthy eats from a guy who wires houses</p>
      </div>

      {/* Meal Time Selector */}
      <div className="flex gap-2 mb-6">
        {(Object.keys(MEAL_CONFIG) as MealTime[]).map((mt) => {
          const c = MEAL_CONFIG[mt];
          const active = mealTime === mt;
          return (
            <button
              key={mt}
              onClick={() => { setMealTime(mt); setSelectedMeal(null); }}
              className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
                active ? "border-2" : "bg-white/5 border border-white/10"
              }`}
              style={active ? { borderColor: c.color, backgroundColor: `${c.color}15`, color: c.color } : {}}
            >
              {c.icon} {c.label}
            </button>
          );
        })}
      </div>

      {/* Shuffle Button */}
      <motion.button
        onClick={shuffle}
        whileTap={{ scale: 0.95 }}
        className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-black text-lg rounded-2xl mb-6 shadow-lg shadow-amber-500/20"
      >
        {shuffling ? "🎰 Picking..." : `🎲 Joe Says Eat This (${config.label})`}
      </motion.button>

      {/* Selected Meal */}
      <AnimatePresence mode="wait">
        {selectedMeal && (
          <motion.div
            key={selectedMeal.name}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-[#12121a] border rounded-2xl overflow-hidden mb-6"
            style={{ borderColor: `${config.color}40` }}
          >
            <div className="px-4 py-2 flex items-center justify-between" style={{ backgroundColor: `${config.color}15` }}>
              <span className="text-xs font-bold tracking-wider uppercase" style={{ color: config.color }}>
                {config.icon} Joe&apos;s Pick
              </span>
              <span className="text-[10px] text-zinc-500">{config.time}</span>
            </div>
            <div className="p-4">
              <h2 className="text-xl font-black mb-0.5">{selectedMeal.name}</h2>
              <p className="text-xs text-zinc-500 mb-3">{selectedMeal.desc}</p>

              <div className="space-y-1.5 mb-4">
                {selectedMeal.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-zinc-300">
                    <span className="text-green-500 text-xs">●</span>
                    {item}
                  </div>
                ))}
              </div>

              <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                <p className="text-xs text-zinc-400 italic">{selectedMeal.joeQuote}</p>
                <p className="text-[10px] text-zinc-600 mt-1 text-right">— Chef Joe 👨‍🍳</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Menu */}
      <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">
        Full {config.label} Menu
      </h2>
      <div className="space-y-3">
        {MEALS[mealTime].map((meal, i) => (
          <motion.div
            key={meal.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => setSelectedMeal(meal)}
            className={`bg-[#12121a] border rounded-xl p-4 cursor-pointer transition-all active:scale-[0.98] ${
              selectedMeal?.name === meal.name ? "border-amber-500/50 bg-amber-500/5" : "border-white/10 hover:border-white/20"
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-sm">{meal.name}</h3>
                <p className="text-xs text-zinc-500">{meal.desc}</p>
              </div>
              <span className="text-zinc-600 text-xs">{meal.items.length} items</span>
            </div>
            <p className="text-[10px] text-zinc-600 italic mt-2 truncate">{meal.joeQuote}</p>
          </motion.div>
        ))}
      </div>

      <BottomNav />
    </main>
  );
}

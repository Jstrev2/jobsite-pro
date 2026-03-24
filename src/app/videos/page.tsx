"use client";

import { useState } from "react";
import BottomNav from "@/components/BottomNav";
import { RefreshCw } from "lucide-react";

const VIDEOS = [
  { id: "dQw4w9WgXcQ", title: "Essential Electrician Training Video", desc: "MANDATORY viewing for all new hires 🎓" },
  { id: "3m5qxZm_JqM", title: "When the apprentice says 'I got this'", desc: "Narrator: He did not, in fact, got this" },
  { id: "EqWRaAF6_WY", title: "OSHA inspector walks onto YOUR jobsite", desc: "POV: You forgot the safety meeting" },
  { id: "ZnHmskwqCCQ", title: "The foreman's motivational speech", desc: "\"We're a family here\" 🤡" },
  { id: "lXMskKTw3Bc", title: "Apprentice vs. 277 volts", desc: "Spoiler: 277 won" },
  { id: "nHc288IRFmo", title: "How contractors actually bid jobs", desc: "Step 1: Make up a number. Step 2: Double it." },
  { id: "HPPj6viIBmU", title: "When the GC says 'small change order'", desc: "It was never small. It was never just one." },
  { id: "oavMtUWDBTM", title: "Electricians explaining why they're late", desc: "\"Traffic\" (was at Home Depot for 2 hours)" },
  { id: "hHZvUeAdzeI", title: "The client's face when you show the invoice", desc: "\"But it's just a few wires!\" 💸" },
  { id: "kfVsfOSbJY0", title: "Friday 2pm on the jobsite", desc: "Tools? Put away. Cooler? Open. Boss? Gone." },
];

export default function VideosPage() {
  const [featured, setFeatured] = useState(() => VIDEOS[Math.floor(Math.random() * VIDEOS.length)]);
  const [playing, setPlaying] = useState<string | null>(null);

  const shuffle = () => {
    const next = VIDEOS[Math.floor(Math.random() * VIDEOS.length)];
    setFeatured(next);
    setPlaying(null);
  };

  return (
    <main className="min-h-screen pb-20 px-4 pt-6 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-black">📺 Break Room TV</h1>
          <p className="text-zinc-500 text-sm">Certified time wasters</p>
        </div>
        <button onClick={shuffle} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-zinc-400 hover:text-white">
          <RefreshCw size={18} />
        </button>
      </div>

      {/* Featured Video */}
      <div className="bg-[#12121a] border border-amber-500/30 rounded-2xl overflow-hidden mb-6">
        <div className="bg-amber-500/10 px-4 py-2 flex items-center gap-2">
          <span className="text-xs font-bold text-amber-400 tracking-wider uppercase">🌟 Featured</span>
        </div>
        {playing === featured.id ? (
          <div className="aspect-video">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${featured.id}?autoplay=1`}
              allow="autoplay; encrypted-media"
              allowFullScreen
              className="border-0"
            />
          </div>
        ) : (
          <div
            className="aspect-video bg-cover bg-center cursor-pointer relative group"
            style={{ backgroundImage: `url(https://img.youtube.com/vi/${featured.id}/maxresdefault.jpg)` }}
            onClick={() => setPlaying(featured.id)}
          >
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-3xl ml-1">▶</span>
              </div>
            </div>
          </div>
        )}
        <div className="p-4">
          <h3 className="font-bold text-sm">{featured.title}</h3>
          <p className="text-xs text-zinc-500 mt-1">{featured.desc}</p>
        </div>
      </div>

      {/* Video List */}
      <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">All Videos</h2>
      <div className="space-y-3">
        {VIDEOS.map((vid) => (
          <div
            key={vid.id}
            className="bg-[#12121a] border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-all"
          >
            {playing === vid.id ? (
              <div className="aspect-video">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${vid.id}?autoplay=1`}
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  className="border-0"
                />
              </div>
            ) : (
              <div
                className="flex gap-3 p-3 cursor-pointer group"
                onClick={() => setPlaying(vid.id)}
              >
                <div
                  className="w-28 h-20 rounded-lg bg-cover bg-center flex-shrink-0 relative"
                  style={{ backgroundImage: `url(https://img.youtube.com/vi/${vid.id}/mqdefault.jpg)` }}
                >
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg group-hover:bg-black/10 transition-colors">
                    <span className="text-lg">▶</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm text-zinc-200 group-hover:text-white transition-colors">{vid.title}</h3>
                  <p className="text-xs text-zinc-500 mt-1">{vid.desc}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <BottomNav />
    </main>
  );
}

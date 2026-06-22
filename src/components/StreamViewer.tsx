"use client";

import { useState } from "react";
import { Camera, Eye, Navigation, User, Radio } from "lucide-react";

const STREAMS = [
  { id: "raw",   label: "Raw Feed",        icon: Camera,     color: "from-slate-500 to-slate-600" },
  { id: "human", label: "Human Detection",  icon: User,       color: "from-violet-500 to-purple-600" },
  { id: "signs", label: "Sign Detection",   icon: Eye,        color: "from-amber-500 to-orange-600" },
  { id: "line",  label: "Line Follower",    icon: Navigation, color: "from-cyan-500 to-blue-600" },
] as const;

export default function StreamViewer() {
  const [activeStream, setActiveStream] = useState("raw");
  const streamUrl = `${process.env.NEXT_PUBLIC_STREAM_API_URL}/stream/${activeStream}`;

  const active = STREAMS.find((s) => s.id === activeStream)!;

  return (
    <div className="card flex flex-col h-full overflow-hidden">
      {/* ── Header ─────────────────────────────────── */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className={`p-1.5 rounded-lg bg-gradient-to-br ${active.color}`}>
            <Camera size={16} className="text-white" />
          </div>
          <span className="section-title">Vision Streams</span>
        </div>

        {/* LIVE badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/15 border border-red-500/30">
          <span className="live-dot block w-1.5 h-1.5 rounded-full bg-red-500" />
          <span className="text-[11px] font-bold tracking-wider text-red-400">LIVE</span>
        </div>
      </div>

      {/* ── Stream tabs ────────────────────────────── */}
      <div className="flex gap-1.5 px-4 py-2.5 overflow-x-auto">
        {STREAMS.map((s) => {
          const Icon = s.icon;
          const isActive = activeStream === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setActiveStream(s.id)}
              className={`
                group relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-[13px] font-medium
                whitespace-nowrap transition-all duration-300 cursor-pointer
                ${isActive
                  ? `bg-gradient-to-br ${s.color} text-white shadow-lg`
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                }
              `}
            >
              <Icon size={15} className={isActive ? "text-white" : "text-slate-500 group-hover:text-slate-300"} />
              {s.label}
              {isActive && (
                <span className="absolute inset-0 rounded-xl ring-1 ring-white/20 pointer-events-none" />
              )}
            </button>
          );
        })}
      </div>

      {/* ── Video frame ────────────────────────────── */}
      <div className="flex-1 mx-4 mb-4 rounded-xl overflow-hidden bg-black/60 border border-white/5 relative min-h-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={streamUrl}
          alt={`${activeStream} stream`}
          className="w-full h-full object-contain"
          onError={(e) => { e.currentTarget.style.display = "none"; }}
          onLoad={(e) => { e.currentTarget.style.display = "block"; }}
        />

        {/* Spinner fallback */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-[1]">
          <div className="flex flex-col items-center gap-3 text-slate-600">
            <Radio size={32} className="animate-pulse" />
            <span className="text-sm tracking-wide">Connecting to camera…</span>
          </div>
        </div>

        {/* Stream label overlay */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-sm border border-white/10 text-xs text-slate-300 font-mono">
          /stream/{activeStream}
        </div>
      </div>
    </div>
  );
}

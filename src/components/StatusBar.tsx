"use client";

import { useEffect, useState } from "react";
import { Cpu, Heart } from "lucide-react";

export default function StatusBar() {
  const [online, setOnline] = useState(false);
  const [ms, setMs] = useState<number | null>(null);

  useEffect(() => {
    const ping = async () => {
      const t0 = performance.now();
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_ROS_API_URL}/healthz`, {
          cache: "no-store",
        });
        if (res.ok) {
          setMs(Math.round(performance.now() - t0));
          setOnline(true);
        } else {
          setOnline(false);
          setMs(null);
        }
      } catch {
        setOnline(false);
        setMs(null);
      }
    };

    ping();
    const id = setInterval(ping, 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="card flex items-center justify-between px-6 py-3">
      {/* Left — brand */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg shadow-blue-600/20">
          <Cpu size={22} className="text-white" />
        </div>
        <div className="leading-tight">
          <h1 className="text-lg font-bold tracking-tight text-white">
            EsiBot{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
              Command Center
            </span>
          </h1>
          <p className="text-[11px] text-slate-500 tracking-wide">
            Vision · ROS · Navigation
          </p>
        </div>
      </div>

      {/* Right — heartbeat */}
      <div className="flex items-center gap-4">
        {ms !== null && (
          <span className="text-[11px] font-mono text-slate-500">
            {ms}ms
          </span>
        )}
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold
            ${online
              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25"
              : "bg-red-500/15 text-red-400 border border-red-500/25"
            }`}
        >
          <Heart
            size={13}
            fill="currentColor"
            className={online ? "animate-pulse" : ""}
          />
          {online ? "Online" : "Offline"}
        </div>
      </div>
    </header>
  );
}

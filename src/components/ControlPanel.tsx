"use client";

import { useState, useCallback } from "react";
import { ArrowUp, ArrowDown, RotateCcw, RotateCw, Gamepad2, CircleStop } from "lucide-react";
import { sendCmdVel, sendStop } from "@/lib/api";

export default function ControlPanel() {
  const [speed, setSpeed] = useState(0.5);
  const [lastCmd, setLastCmd] = useState<string | null>(null);

  const move = useCallback(
    async (linear: number, angular: number, label: string) => {
      setLastCmd(label);
      await sendCmdVel(linear * speed, angular * speed);
    },
    [speed]
  );

  const stop = useCallback(async () => {
    setLastCmd(null);
    await sendStop();
  }, []);

  const btnBase =
    "flex items-center justify-center rounded-xl transition-all duration-200 select-none " +
    "active:scale-95 border border-white/[0.06] cursor-pointer ";

  const dirBtn =
    btnBase +
    "w-14 h-14 bg-white/[0.04] hover:bg-white/[0.08] active:bg-blue-600/40 " +
    "text-slate-300 hover:text-white shadow-md shadow-black/20 ";

  return (
    <div className="card flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-5 py-3 border-b border-white/5">
        <div className="p-1.5 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600">
          <Gamepad2 size={16} className="text-white" />
        </div>
        <span className="section-title">Manual Control</span>
      </div>

      {/* D-Pad */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 py-6 gap-5">
        <div className="grid grid-cols-3 gap-2">
          <div />
          <button
            className={dirBtn}
            onPointerDown={() => move(1, 0, "FWD")}
            onPointerUp={stop}
            onPointerLeave={stop}
          >
            <ArrowUp size={22} />
          </button>
          <div />

          <button
            className={dirBtn}
            onPointerDown={() => move(0, 1, "LEFT")}
            onPointerUp={stop}
            onPointerLeave={stop}
          >
            <RotateCcw size={22} />
          </button>

          {/* STOP */}
          <button
            className={
              btnBase +
              "w-14 h-14 bg-red-500/15 hover:bg-red-500/30 active:bg-red-600 " +
              "text-red-400 hover:text-white border-red-500/30 glow-stop"
            }
            onClick={stop}
          >
            <CircleStop size={24} />
          </button>

          <button
            className={dirBtn}
            onPointerDown={() => move(0, -1, "RIGHT")}
            onPointerUp={stop}
            onPointerLeave={stop}
          >
            <RotateCw size={22} />
          </button>

          <div />
          <button
            className={dirBtn}
            onPointerDown={() => move(-1, 0, "REV")}
            onPointerUp={stop}
            onPointerLeave={stop}
          >
            <ArrowDown size={22} />
          </button>
          <div />
        </div>

        {/* Speed slider */}
        <div className="w-full max-w-[220px] space-y-2">
          <div className="flex justify-between text-xs text-slate-500">
            <span>Speed</span>
            <span className="font-mono text-slate-300">{speed.toFixed(1)} m/s</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="2.0"
            step="0.1"
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Last command indicator */}
        {lastCmd && (
          <div className="text-xs text-blue-400 font-mono tracking-wide animate-pulse">
            ▸ {lastCmd}
          </div>
        )}
      </div>
    </div>
  );
}

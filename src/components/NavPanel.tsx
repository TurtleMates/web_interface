"use client";

import { useState } from "react";
import { Compass, MapPin, Target, Play, Pause, XCircle } from "lucide-react";
import {
  sendNavGoal,
  sendInitialPose,
  resumeExploration,
  cancelNavGoal,
} from "@/lib/api";

export default function NavPanel() {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [yaw, setYaw] = useState(0);
  const [loading, setLoading] = useState(false);
  const [activeGoalId, setActiveGoalId] = useState<string | null>(null);
  const [exploring, setExploring] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const flash = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 2500);
  };

  const handleGoal = async () => {
    setLoading(true);
    const data = await sendNavGoal(x, y, yaw);
    if (data?.id) {
      setActiveGoalId(data.id);
      flash(`Goal sent → ${data.id.slice(0, 8)}`);
    } else {
      flash("Failed to send goal");
    }
    setLoading(false);
  };

  const handleCancelGoal = async () => {
    if (!activeGoalId) return;
    setLoading(true);
    await cancelNavGoal(activeGoalId);
    setActiveGoalId(null);
    flash("Goal cancelled");
    setLoading(false);
  };

  const handlePose = async () => {
    setLoading(true);
    const ok = await sendInitialPose(x, y, yaw);
    flash(ok ? "Pose set" : "Failed");
    setLoading(false);
  };

  const handleExploration = async () => {
    setLoading(true);
    const next = !exploring;
    const ok = await resumeExploration(next);
    if (ok) setExploring(next);
    flash(ok ? (next ? "Exploration started" : "Exploration paused") : "Failed");
    setLoading(false);
  };

  const inputCls =
    "w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm " +
    "font-mono text-slate-200 placeholder-slate-600 " +
    "focus:outline-none focus:border-blue-500/60 focus:bg-white/[0.06] transition-all";

  return (
    <div className="card flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-5 py-3 border-b border-white/5">
        <div className="p-1.5 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600">
          <Compass size={16} className="text-white" />
        </div>
        <span className="section-title">Navigation</span>
      </div>

      <div className="flex-1 px-5 py-4 space-y-4">
        {/* Coordinate inputs */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "X", unit: "m", val: x, set: setX },
            { label: "Y", unit: "m", val: y, set: setY },
            { label: "Yaw", unit: "rad", val: yaw, set: setYaw },
          ].map((f) => (
            <div key={f.label}>
              <label className="text-[11px] font-medium text-slate-500 mb-1.5 block">
                {f.label}{" "}
                <span className="text-slate-600 font-normal">({f.unit})</span>
              </label>
              <input
                type="number"
                value={f.val}
                onChange={(e) => f.set(parseFloat(e.target.value) || 0)}
                className={inputCls}
                step="0.1"
              />
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handlePose}
            disabled={loading}
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium
              bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.08]
              text-slate-300 hover:text-white transition-all disabled:opacity-40 cursor-pointer"
          >
            <MapPin size={15} />
            Set Pose
          </button>
          <button
            onClick={handleGoal}
            disabled={loading}
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium
              bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400
              text-white shadow-lg shadow-blue-600/20 transition-all disabled:opacity-40 cursor-pointer"
          >
            <Target size={15} />
            Send Goal
          </button>
        </div>

        {/* Cancel active goal */}
        {activeGoalId && (
          <button
            onClick={handleCancelGoal}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-sm
              bg-red-500/10 hover:bg-red-500/20 border border-red-500/20
              text-red-400 hover:text-red-300 transition-all disabled:opacity-40 cursor-pointer"
          >
            <XCircle size={15} />
            Cancel Goal
            <span className="font-mono text-[11px] text-red-500/60 ml-1">
              {activeGoalId.slice(0, 8)}
            </span>
          </button>
        )}

        {/* Exploration toggle */}
        <div className="pt-3 border-t border-white/5">
          <button
            onClick={handleExploration}
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2.5 py-3 rounded-xl text-sm font-semibold
              transition-all disabled:opacity-40 cursor-pointer
              ${exploring
                ? "bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-400"
                : "bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white shadow-lg shadow-emerald-600/20"
              }
            `}
          >
            {exploring ? <Pause size={17} /> : <Play size={17} fill="currentColor" />}
            {exploring ? "Pause Exploration" : "Start Exploration"}
          </button>
        </div>

        {/* Feedback toast */}
        {feedback && (
          <div className="text-center text-xs text-emerald-400 font-mono tracking-wide animate-pulse">
            ✓ {feedback}
          </div>
        )}
      </div>
    </div>
  );
}

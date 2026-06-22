"use client";

import { useEffect, useState, useCallback } from "react";
import { Activity, RefreshCw, ChevronDown, ChevronRight, Wifi, WifiOff } from "lucide-react";
import { fetchTopics, fetchTopicSnapshot } from "@/lib/api";

export default function TelemetryPanel() {
  const [topics, setTopics] = useState<string[]>([]);
  const [snapshots, setSnapshots] = useState<Record<string, unknown>>({});
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const list = await fetchTopics();
      if (Array.isArray(list)) {
        setTopics(list);
        setConnected(true);

        const snaps: Record<string, unknown> = {};
        for (const t of list.slice(0, 15)) {
          const snap = await fetchTopicSnapshot(t);
          if (snap) snaps[t] = snap;
        }
        setSnapshots(snaps);
      } else {
        setConnected(false);
      }
    } catch {
      setConnected(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    const id = setInterval(loadData, 5000);
    return () => clearInterval(id);
  }, [loadData]);

  const toggle = (topic: string) =>
    setExpanded((prev) => ({ ...prev, [topic]: !prev[topic] }));

  const shortName = (topic: string) => {
    const parts = topic.split("/").filter(Boolean);
    return parts.length > 1 ? parts.slice(-2).join("/") : topic;
  };

  return (
    <div className="card flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-600">
            <Activity size={16} className="text-white" />
          </div>
          <span className="section-title">Telemetry</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Connection badge */}
          <div
            className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-[11px] font-medium
              ${connected
                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                : "bg-red-500/15 text-red-400 border border-red-500/20"
              }`}
          >
            {connected ? <Wifi size={11} /> : <WifiOff size={11} />}
            {connected ? "ROS" : "OFF"}
          </div>

          <button
            onClick={loadData}
            className="p-1.5 rounded-lg hover:bg-white/5 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Topic list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5 min-h-0">
        {loading && topics.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-slate-600">
            <RefreshCw className="animate-spin" size={24} />
            <span className="text-sm">Connecting to ROS…</span>
          </div>
        ) : topics.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-slate-600">
            <WifiOff size={28} />
            <span className="text-sm">No topics available</span>
            <span className="text-xs text-slate-700">Is the ROS bridge running?</span>
          </div>
        ) : (
          topics.map((topic) => {
            const isOpen = expanded[topic];
            const data = snapshots[topic];
            return (
              <div
                key={topic}
                className="rounded-lg border border-white/[0.04] bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
              >
                <button
                  onClick={() => toggle(topic)}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-left cursor-pointer"
                >
                  {isOpen ? (
                    <ChevronDown size={14} className="text-slate-600 shrink-0" />
                  ) : (
                    <ChevronRight size={14} className="text-slate-600 shrink-0" />
                  )}
                  <span className="text-[12px] font-mono text-blue-400 truncate flex-1">
                    {shortName(topic)}
                  </span>
                  <span
                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                      data ? "bg-emerald-500" : "bg-slate-700"
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-3 pb-3">
                    <pre className="text-[11px] font-mono text-slate-400 bg-black/30 rounded-lg p-3 overflow-x-auto max-h-48 leading-relaxed">
                      {data
                        ? JSON.stringify(data, null, 2)
                        : "Waiting for data…"}
                    </pre>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer count */}
      {topics.length > 0 && (
        <div className="px-5 py-2.5 border-t border-white/5 text-[11px] text-slate-600 font-mono">
          {topics.length} topics · {Object.keys(snapshots).length} active
        </div>
      )}
    </div>
  );
}

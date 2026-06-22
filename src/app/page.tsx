import StreamViewer from "@/components/StreamViewer";
import ControlPanel from "@/components/ControlPanel";
import NavPanel from "@/components/NavPanel";
import TelemetryPanel from "@/components/TelemetryPanel";
import StatusBar from "@/components/StatusBar";

export default function Home() {
  return (
    <div className="h-screen flex flex-col p-3 gap-3 overflow-hidden">
      {/* ── Top bar ─────────────────────────── */}
      <StatusBar />

      {/* ── Main grid ───────────────────────── */}
      <div className="flex-1 grid grid-cols-12 gap-3 min-h-0">
        {/* Left: stream + controls (8 cols) */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-3 min-h-0">
          {/* Stream – takes ~60% of left column */}
          <div className="flex-[3] min-h-0">
            <StreamViewer />
          </div>

          {/* Bottom row: nav + joystick */}
          <div className="flex-[2] grid grid-cols-1 md:grid-cols-2 gap-3 min-h-0">
            <NavPanel />
            <ControlPanel />
          </div>
        </div>

        {/* Right: telemetry (4 cols) */}
        <div className="col-span-12 lg:col-span-4 min-h-0">
          <TelemetryPanel />
        </div>
      </div>
    </div>
  );
}

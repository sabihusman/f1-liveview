import type { Driver, TireStint } from "@/types/f1";
import { ChevronUp, ChevronDown } from "lucide-react";

interface LeaderboardProps {
  drivers: Driver[];
  selectedCode: string;
  onSelect: (code: string) => void;
}

const COMPOUND_COLOR: Record<string, string> = {
  S: "#ef4444", // red
  M: "#facc15", // yellow
  H: "#f3f4f6", // white-ish
  I: "#22c55e", // green (intermediate)
  W: "#3b82f6", // blue (wet)
};

function TireDot({ compound, size = 14 }: { compound: string; size?: number }) {
  return (
    <span
      className="inline-flex items-center justify-center rounded-full border border-gray-700 font-bold text-[9px] text-gray-900"
      style={{
        backgroundColor: COMPOUND_COLOR[compound] ?? "#6b7280",
        width: size,
        height: size,
        lineHeight: `${size}px`,
      }}
    >
      {compound}
    </span>
  );
}

function StintStrip({ stints }: { stints?: TireStint[] }) {
  if (!stints || stints.length === 0) return <span className="text-gray-600">—</span>;
  const total = stints.reduce((acc, s) => acc + s.laps, 0) || 1;
  return (
    <div className="flex items-center gap-1">
      <div className="flex h-2 w-24 overflow-hidden rounded-sm bg-gray-800">
        {stints.map((s, i) => (
          <div
            key={i}
            title={`${s.compound} • ${s.laps} laps`}
            style={{
              width: `${(s.laps / total) * 100}%`,
              backgroundColor: COMPOUND_COLOR[s.compound] ?? "#6b7280",
            }}
          />
        ))}
      </div>
      <div className="flex items-center gap-0.5">
        {stints.map((s, i) => (
          <TireDot key={i} compound={s.compound} size={12} />
        ))}
      </div>
    </div>
  );
}

function lapColor(status?: Driver["lastLapStatus"]) {
  if (status === "purple") return "text-purple-fastest";
  if (status === "green") return "text-emerald-400";
  if (status === "yellow") return "text-yellow-400";
  return "text-white";
}

const HEADERS = [
  { key: "pos", label: "POS", w: "w-12", align: "text-center" },
  { key: "driver", label: "DRIVER", w: "w-44", align: "text-left" },
  { key: "gap", label: "GAP", w: "w-24", align: "text-right" },
  { key: "int", label: "INT", w: "w-20", align: "text-right" },
  { key: "last", label: "LAST LAP", w: "w-28", align: "text-right" },
  { key: "best", label: "BEST LAP", w: "w-28", align: "text-right" },
  { key: "tyre", label: "TYRE", w: "w-20", align: "text-center" },
  { key: "stint", label: "STINTS", w: "w-44", align: "text-left" },
  { key: "pit", label: "PIT", w: "w-12", align: "text-center" },
];

export default function Leaderboard({ drivers, selectedCode, onSelect }: LeaderboardProps) {
  return (
    <div className="flex h-full w-full flex-col bg-gray-950 text-white">
      {/* Header row */}
      <div className="flex h-9 items-center gap-2 border-b border-gray-800 bg-gray-900 px-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">
        {HEADERS.map((h) => (
          <div key={h.key} className={`${h.w} ${h.align} shrink-0`}>
            {h.label}
          </div>
        ))}
      </div>

      {/* Rows */}
      <div className="flex-1 overflow-y-auto">
        {drivers.map((d) => {
          const selected = d.code === selectedCode;
          return (
            <button
              key={d.code}
              onClick={() => onSelect(d.code)}
              className={`flex h-11 w-full items-center gap-2 border-b border-gray-900 px-4 text-left transition ${
                selected ? "bg-gray-800/80" : "hover:bg-gray-900/70"
              }`}
            >
              {/* Position */}
              <div className="w-12 shrink-0 text-center font-mono-tabular text-sm font-bold">
                {d.position}
              </div>

              {/* Driver */}
              <div className="flex w-44 shrink-0 items-center gap-2">
                <div className="h-6 w-1 shrink-0 rounded-sm" style={{ backgroundColor: d.teamColor }} />
                <div className="flex flex-col leading-tight">
                  <span className="font-mono-tabular text-sm font-bold tracking-wider">{d.code}</span>
                  <span className="text-[10px] uppercase tracking-wide text-gray-400">{d.team}</span>
                </div>
                <div className="ml-auto">
                  {d.positionChange === "up" && <ChevronUp className="h-3.5 w-3.5 text-emerald-400" strokeWidth={3} />}
                  {d.positionChange === "down" && <ChevronDown className="h-3.5 w-3.5 text-red-500" strokeWidth={3} />}
                </div>
              </div>

              {/* Gap */}
              <div className={`w-24 shrink-0 text-right font-mono-tabular text-sm ${d.gap === "LEADER" ? "text-purple-fastest font-bold" : "text-gray-200"}`}>
                {d.gap ?? "—"}
              </div>

              {/* Interval */}
              <div className="w-20 shrink-0 text-right font-mono-tabular text-sm text-gray-300">
                {d.interval ?? "—"}
              </div>

              {/* Last lap */}
              <div className={`w-28 shrink-0 text-right font-mono-tabular text-sm ${lapColor(d.lastLapStatus)}`}>
                {d.lastLap ?? "—"}
              </div>

              {/* Best lap */}
              <div className="w-28 shrink-0 text-right font-mono-tabular text-sm text-gray-100">
                {d.bestLap ?? "—"}
              </div>

              {/* Tyre */}
              <div className="flex w-20 shrink-0 items-center justify-center gap-1.5">
                {d.tireCompound && <TireDot compound={d.tireCompound} />}
                <span className="font-mono-tabular text-xs text-gray-400">{d.tireAge ?? 0}L</span>
              </div>

              {/* Stints strip */}
              <div className="w-44 shrink-0">
                <StintStrip stints={d.stints} />
              </div>

              {/* Pit count */}
              <div className="w-12 shrink-0 text-center font-mono-tabular text-sm text-gray-300">
                {d.pitCount ?? 0}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

import type { Driver } from "@/types/f1";
import { X, Swords } from "lucide-react";

interface DriverDetailCardProps {
  driver: Driver;
  onClose?: () => void;
}

function Gauge({ throttle = 0, brake = 0, speed = 0, rpm = 0, gear = 0, drs = false }: {
  throttle?: number; brake?: number; speed?: number; rpm?: number; gear?: number; drs?: boolean;
}) {
  const size = 220;
  const stroke = 14;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  // Half-arc length (180deg)
  const half = c / 2;
  const throttleLen = (throttle / 100) * half;
  const brakeLen = (brake / 100) * half;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background full circle track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#1f2937"
          strokeWidth={stroke}
        />
        {/* Throttle - left half (top going down-left) */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#3b82f6"
          strokeWidth={stroke}
          strokeDasharray={`${throttleLen} ${c}`}
          strokeDashoffset={half}
          strokeLinecap="butt"
          transform={`scale(-1,1) translate(${-size},0)`}
        />
        {/* Brake - right half */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#ef4444"
          strokeWidth={stroke}
          strokeDasharray={`${brakeLen} ${c}`}
          strokeDashoffset={0}
          strokeLinecap="butt"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
        <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Speed</div>
        <div className="text-4xl font-black font-mono-tabular leading-none">{speed}</div>
        <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-0.5">KMH</div>
        <div className="mt-2 text-xs font-mono-tabular text-gray-300">{rpm} RPM</div>
        <div className="mt-1 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider">
          <span className={drs ? "text-green-400" : "text-gray-500"}>DRS</span>
          <span className="text-gray-600">|</span>
          <span className="text-gray-300">GEAR <span className="text-white text-sm font-mono-tabular">{gear}</span></span>
        </div>
      </div>
      {/* Throttle/Brake labels */}
      <div className="absolute left-0 bottom-2 text-[9px] font-bold uppercase tracking-widest text-blue-400">
        Throttle
      </div>
      <div className="absolute right-0 bottom-2 text-[9px] font-bold uppercase tracking-widest text-red-400">
        Brake
      </div>
    </div>
  );
}

const COMPOUND_COLOR: Record<string, string> = {
  S: "border-red-500 text-red-400",
  M: "border-yellow-400 text-yellow-300",
  H: "border-gray-200 text-gray-100",
  I: "border-green-500 text-green-400",
  W: "border-blue-500 text-blue-400",
};

export default function DriverDetailCard({ driver, onClose }: DriverDetailCardProps) {
  return (
    <div className="w-80 shrink-0 bg-gray-900/95 backdrop-blur border border-gray-800 rounded-md shadow-2xl text-white flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 p-3 border-b border-gray-800">
        <div
          className="h-10 w-10 rounded-full bg-gray-700 border-2 shrink-0"
          style={{ borderColor: driver.teamColor }}
        />
        <div className="leading-tight">
          <div className="text-2xl font-black font-mono-tabular">{driver.code}</div>
          <div className="text-[10px] uppercase tracking-widest text-gray-400">{driver.team}</div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="text-right">
            <div className="text-xs font-mono-tabular text-green-400 font-bold">{driver.bestLap}</div>
            <div
              className={`mt-0.5 inline-flex items-center justify-center w-5 h-5 rounded-full border-2 text-[10px] font-bold ${
                COMPOUND_COLOR[driver.tireCompound ?? "M"]
              }`}
            >
              {driver.tireCompound}
            </div>
          </div>
          {onClose && (
            <button onClick={onClose} className="p-1 rounded hover:bg-gray-800 transition">
              <X className="h-4 w-4 text-gray-400" />
            </button>
          )}
        </div>
      </div>

      {/* Gauge */}
      <div className="flex justify-center py-4">
        <Gauge
          throttle={driver.throttle}
          brake={driver.brake}
          speed={driver.speed}
          rpm={driver.rpm}
          gear={driver.gear}
          drs={driver.drs}
        />
      </div>

      {/* Sectors */}
      <div className="grid grid-cols-4 border-t border-gray-800 text-center">
        {[1, 2, 3].map((n) => {
          const s = driver.sectors.find((x) => x.sector === n);
          return (
            <div key={n} className="px-2 py-2 border-r border-gray-800">
              <div className="text-[9px] font-bold uppercase tracking-widest text-gray-500">Sector {n}</div>
              <div className={`text-sm font-mono-tabular font-bold mt-1 ${s?.isFastest ? "text-purple-fastest" : "text-white"}`}>
                {s?.time ?? "—"}
              </div>
            </div>
          );
        })}
        <div className="px-2 py-2">
          <div className="text-[9px] font-bold uppercase tracking-widest text-gray-500">Best Lap</div>
          <div className="text-sm font-mono-tabular font-bold mt-1 text-green-400">{driver.bestLap}</div>
        </div>
      </div>

      {/* Battle mode */}
      <div className="p-3 flex justify-center border-t border-gray-800">
        <button className="group flex items-center gap-2 bg-red-600 hover:bg-red-500 transition rounded-full pl-3 pr-4 py-2 shadow-lg shadow-red-900/50">
          <div className="h-7 w-7 rounded-full bg-white/15 flex items-center justify-center">
            <Swords className="h-4 w-4 text-white" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-white">Enter Battle Mode</span>
        </button>
      </div>
    </div>
  );
}

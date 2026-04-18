import type { Driver } from "@/types/f1";
import { ChevronUp, ChevronDown } from "lucide-react";

interface PositionListProps {
  drivers: Driver[];
  selectedCode: string;
  onSelect: (code: string) => void;
}

export default function PositionList({ drivers, selectedCode, onSelect }: PositionListProps) {
  return (
    <aside className="w-64 shrink-0 bg-gray-950 border-r border-gray-800 flex flex-col">
      <div className="h-9 px-3 flex items-center text-[10px] font-bold uppercase tracking-widest text-gray-400 border-b border-gray-800">
        Position
      </div>
      <div className="flex-1 overflow-y-auto">
        {drivers.map((d) => {
          const selected = d.code === selectedCode;
          return (
            <button
              key={d.code}
              onClick={() => onSelect(d.code)}
              className={`w-full flex items-center gap-2 h-9 pr-2 text-left border-l-2 transition ${
                selected
                  ? "bg-gray-800 border-red-500"
                  : "bg-transparent border-transparent hover:bg-gray-900"
              }`}
            >
              <div className="w-7 text-center text-xs font-mono-tabular text-gray-300">
                {d.position}
              </div>
              <div
                className="w-1 h-6 shrink-0 rounded-sm"
                style={{ backgroundColor: d.teamColor }}
              />
              <div className="text-sm font-bold text-white tracking-wide font-mono-tabular">
                {d.code}
              </div>
              <div className="ml-auto">
                {d.positionChange === "up" && (
                  <ChevronUp className="h-3.5 w-3.5 text-red-500" strokeWidth={3} />
                )}
                {d.positionChange === "down" && (
                  <ChevronDown className="h-3.5 w-3.5 text-red-500" strokeWidth={3} />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}

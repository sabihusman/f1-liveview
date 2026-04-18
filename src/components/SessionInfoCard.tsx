import { Timer, Thermometer } from "lucide-react";

interface SessionInfoCardProps {
  sessionLabel: string;
  timeRemaining: string;
  airTemp: number;
}

export default function SessionInfoCard({ sessionLabel, timeRemaining, airTemp }: SessionInfoCardProps) {
  return (
    <div className="absolute bottom-4 right-4 bg-gray-900/95 backdrop-blur border border-gray-800 rounded-md shadow-2xl text-white p-3 w-64">
      <div className="flex items-center gap-2">
        <span className="bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm">
          {sessionLabel}
        </span>
        <Timer className="h-4 w-4 text-red-500 ml-1" />
        <span className="font-mono-tabular text-base font-bold">{timeRemaining}</span>
      </div>

      <div className="flex items-center gap-2 mt-3 text-xs text-gray-300">
        <Thermometer className="h-4 w-4 text-gray-400" />
        <span className="uppercase tracking-wide">Air Temp</span>
        <span className="ml-auto font-mono-tabular text-white font-bold">{airTemp}°C</span>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-800 flex items-center justify-end">
        <div className="text-[10px] font-serif italic tracking-widest text-gray-400">
          ROLEX
        </div>
      </div>
    </div>
  );
}

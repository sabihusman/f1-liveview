import { Settings, X } from "lucide-react";
import { useState } from "react";
import RaceSelector from "./RaceSelector";
import type { SelectedSession } from "@/types/f1";

interface TopBarProps {
  activeTab: "leaderboard" | "tracker" | "commentary";
  onTabChange: (t: "leaderboard" | "tracker" | "commentary") => void;
  selected: SelectedSession;
  onSelectedChange: (s: SelectedSession) => void;
}

const TABS: { id: TopBarProps["activeTab"]; label: string }[] = [
  { id: "leaderboard", label: "Leaderboard" },
  { id: "tracker", label: "Driver Tracker" },
  { id: "commentary", label: "Commentary" },
];

export default function TopBar({ activeTab, onTabChange, selected, onSelectedChange }: TopBarProps) {
  const [open, setOpen] = useState(false);

  return (
    <header className="relative h-14 bg-red-600 text-white flex items-center px-4 gap-6 z-30">
      {/* Logo + clickable race title */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="font-black italic text-xl tracking-tight select-none">
          <span className="bg-white text-red-600 px-1.5 py-0.5 rounded-sm">F1</span>
        </div>
        <button
          onClick={() => setOpen((v) => !v)}
          className="text-left leading-tight hover:opacity-90 transition"
        >
          <div className="text-sm font-bold uppercase tracking-wide">
            {selected.meeting.country} {selected.year}
          </div>
          <div className="text-[10px] uppercase tracking-widest opacity-90">
            {selected.session.sessionName}
          </div>
        </button>
        {open && (
          <RaceSelector
            selected={selected}
            onApply={(s) => {
              onSelectedChange(s);
              setOpen(false);
            }}
            onClose={() => setOpen(false)}
          />
        )}
      </div>

      {/* Center tabs */}
      <nav className="flex-1 flex items-center justify-center gap-8">
        {TABS.map((t) => {
          const active = t.id === activeTab;
          return (
            <button
              key={t.id}
              onClick={() => onTabChange(t.id)}
              className={`relative h-14 text-sm font-semibold uppercase tracking-wide flex items-center transition ${
                active ? "text-white" : "text-white/70 hover:text-white"
              }`}
            >
              {t.label}
              {active && <span className="absolute bottom-0 left-0 right-0 h-1 bg-white" />}
            </button>
          );
        })}
      </nav>

      {/* Right icons */}
      <div className="flex items-center gap-3 shrink-0">
        <button className="p-1.5 rounded hover:bg-white/10 transition">
          <Settings className="h-5 w-5" />
        </button>
        <button className="p-1.5 rounded hover:bg-white/10 transition">
          <X className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}

interface SubNavProps {
  activeTab: "laps" | "sectors" | "h2h" | "telemetry";
  onTabChange: (t: "laps" | "sectors" | "h2h" | "telemetry") => void;
}

const TABS: { id: SubNavProps["activeTab"]; label: string }[] = [
  { id: "laps", label: "Laps" },
  { id: "sectors", label: "Sectors" },
  { id: "h2h", label: "Head to Head" },
  { id: "telemetry", label: "Telemetry" },
];

export default function SubNav({ activeTab, onTabChange }: SubNavProps) {
  return (
    <div className="h-10 bg-white text-gray-900 flex items-center px-4 border-b border-gray-200">
      <div className="flex items-center gap-2 shrink-0">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inset-0 rounded-full bg-red-600 animate-live-pulse" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-600" />
        </span>
        <span className="text-xs font-bold uppercase tracking-widest text-red-600">Live</span>
      </div>

      <div className="flex-1 flex items-center justify-end gap-6">
        {TABS.map((t) => {
          const active = t.id === activeTab;
          return (
            <button
              key={t.id}
              onClick={() => onTabChange(t.id)}
              className={`relative h-10 text-xs font-semibold uppercase tracking-widest transition ${
                active ? "text-gray-900" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {t.label}
              {active && <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-red-600" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

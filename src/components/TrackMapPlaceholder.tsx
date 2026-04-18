import { Compass, Plus, Minus, Car, Undo2 } from "lucide-react";

interface TrackMapPlaceholderProps {
  circuitName: string;
}

export default function TrackMapPlaceholder({ circuitName }: TrackMapPlaceholderProps) {
  return (
    <div className="absolute inset-0 bg-gray-900">
      {/* faint grid for "broadcast" feel */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Placeholder map area */}
      <div className="absolute inset-8 border border-dashed border-gray-700 rounded-md flex items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="text-xs font-bold uppercase tracking-widest">Track Map</div>
          <div className="text-sm mt-1 font-mono-tabular text-gray-400">
            {circuitName} SVG + driver position markers
          </div>
        </div>
      </div>

      {/* Top-left controls */}
      <div className="absolute top-4 left-4 flex flex-col gap-2">
        <MapBtn><Car className="h-4 w-4" /></MapBtn>
        <MapBtn><Undo2 className="h-4 w-4" /></MapBtn>
      </div>

      {/* Top-right controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <MapBtn><Compass className="h-4 w-4" /></MapBtn>
        <MapBtn><Plus className="h-4 w-4" /></MapBtn>
        <MapBtn><Minus className="h-4 w-4" /></MapBtn>
      </div>
    </div>
  );
}

function MapBtn({ children }: { children: React.ReactNode }) {
  return (
    <button className="h-9 w-9 bg-gray-800/90 hover:bg-gray-700 border border-gray-700 rounded-sm text-white flex items-center justify-center transition">
      {children}
    </button>
  );
}

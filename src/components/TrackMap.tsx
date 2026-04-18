import { useEffect, useMemo, useRef, useState } from "react";
import { Compass, Plus, Minus, Car, Undo2 } from "lucide-react";
import type { Driver } from "@/types/f1";
import { getTrackForCircuit } from "@/data/trackPaths";

interface TrackMapProps {
  circuitName: string;
  drivers: Driver[];
  selectedCode?: string;
  onSelectDriver?: (code: string) => void;
}

const VIEW_W = 1000;
const VIEW_H = 600;

export default function TrackMap({
  circuitName,
  drivers,
  selectedCode,
  onSelectDriver,
}: TrackMapProps) {
  const track = useMemo(() => getTrackForCircuit(circuitName), [circuitName]);
  const pathRef = useRef<SVGPathElement | null>(null);
  const [pathLength, setPathLength] = useState(0);
  const [zoom, setZoom] = useState(1);

  // Measure the path length once it's mounted (and when the circuit changes)
  useEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength());
    }
  }, [track.d]);

  // Per-driver constant offset (spread around the track) and speed factor
  const driverParams = useMemo(() => {
    return drivers.map((d, i) => ({
      // Spread drivers around the lap, leader near start/finish
      baseOffset: (i / drivers.length + track.startOffset) % 1,
      // Slight per-driver speed variation so they shuffle visually
      speedJitter: 0.85 + ((i * 53) % 30) / 100, // 0.85..1.15
    }));
  }, [drivers, track.startOffset]);

  // Animation tick — drives a phase 0..1 used as the global lap progress
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const LAP_MS = 18000; // 18s per virtual lap
    const tick = (now: number) => {
      const t = ((now - start) / LAP_MS) % 1;
      setPhase(track.direction === 1 ? t : 1 - t);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [track.direction]);

  // Compute each driver's point on the path
  const dots = useMemo(() => {
    if (!pathLength || !pathRef.current) return [];
    return drivers.map((d, i) => {
      const { baseOffset, speedJitter } = driverParams[i];
      const u = (baseOffset + phase * speedJitter) % 1;
      const len = u * pathLength;
      const p = pathRef.current!.getPointAtLength(len);
      return { driver: d, x: p.x, y: p.y };
    });
  }, [drivers, driverParams, phase, pathLength]);

  return (
    <div className="absolute inset-0 bg-gray-900 overflow-hidden">
      {/* faint grid */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* The track itself */}
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="xMidYMid meet"
        className="absolute inset-0 w-full h-full"
        style={{ transform: `scale(${zoom})`, transformOrigin: "center" }}
      >
        {/* Track outer glow / shoulder */}
        <path
          d={track.d}
          fill="none"
          stroke="#1f2937"
          strokeWidth={36}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {/* Track surface */}
        <path
          ref={pathRef}
          d={track.d}
          fill="none"
          stroke="#374151"
          strokeWidth={26}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {/* Racing line */}
        <path
          d={track.d}
          fill="none"
          stroke="#9ca3af"
          strokeWidth={1.5}
          strokeDasharray="2 8"
          opacity={0.6}
        />

        {/* Start/finish line marker */}
        {pathLength > 0 && pathRef.current && (() => {
          const p = pathRef.current.getPointAtLength(track.startOffset * pathLength);
          return (
            <g transform={`translate(${p.x}, ${p.y})`}>
              <rect x={-2} y={-18} width={4} height={36} fill="#ffffff" />
            </g>
          );
        })()}

        {/* Driver dots */}
        {dots.map(({ driver, x, y }) => {
          const isSelected = driver.code === selectedCode;
          return (
            <g
              key={driver.code}
              transform={`translate(${x}, ${y})`}
              className="cursor-pointer"
              onClick={() => onSelectDriver?.(driver.code)}
            >
              {isSelected && (
                <circle
                  r={16}
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth={2}
                  opacity={0.9}
                />
              )}
              <circle
                r={isSelected ? 11 : 9}
                fill={driver.teamColor}
                stroke="#0b0f17"
                strokeWidth={2}
              />
              <text
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={9}
                fontWeight={700}
                fill="#ffffff"
                style={{ pointerEvents: "none", fontFamily: "ui-monospace, monospace" }}
              >
                {driver.position}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Circuit label */}
      <div className="absolute bottom-4 left-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">
        {circuitName}
      </div>

      {/* Top-left controls */}
      <div className="absolute top-4 left-4 flex flex-col gap-2">
        <MapBtn><Car className="h-4 w-4" /></MapBtn>
        <MapBtn onClick={() => setZoom(1)}><Undo2 className="h-4 w-4" /></MapBtn>
      </div>

      {/* Top-right controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <MapBtn onClick={() => setZoom(1)}><Compass className="h-4 w-4" /></MapBtn>
        <MapBtn onClick={() => setZoom((z) => Math.min(2.5, z + 0.2))}>
          <Plus className="h-4 w-4" />
        </MapBtn>
        <MapBtn onClick={() => setZoom((z) => Math.max(0.6, z - 0.2))}>
          <Minus className="h-4 w-4" />
        </MapBtn>
      </div>
    </div>
  );
}

function MapBtn({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="h-9 w-9 bg-gray-800/90 hover:bg-gray-700 border border-gray-700 rounded-sm text-white flex items-center justify-center transition"
    >
      {children}
    </button>
  );
}

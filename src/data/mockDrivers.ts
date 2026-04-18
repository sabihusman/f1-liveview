import type { Driver } from "@/types/f1";

const TEAM_COLORS: Record<string, string> = {
  "Red Bull": "#3671C6",
  Ferrari: "#F91536",
  Mercedes: "#6CD3BF",
  McLaren: "#F58020",
  Alpine: "#2293D1",
  AlphaTauri: "#5E8FAA",
  "Aston Martin": "#358C75",
  Williams: "#37BEDD",
  "Alfa Romeo": "#C92D4B",
  Haas: "#B6BABD",
};

type Seed = {
  code: string;
  fullName: string;
  team: keyof typeof TEAM_COLORS;
};

const DRIVER_POOL: Seed[] = [
  { code: "VER", fullName: "Max Verstappen", team: "Red Bull" },
  { code: "PER", fullName: "Sergio Perez", team: "Red Bull" },
  { code: "LEC", fullName: "Charles Leclerc", team: "Ferrari" },
  { code: "SAI", fullName: "Carlos Sainz", team: "Ferrari" },
  { code: "HAM", fullName: "Lewis Hamilton", team: "Mercedes" },
  { code: "RUS", fullName: "George Russell", team: "Mercedes" },
  { code: "NOR", fullName: "Lando Norris", team: "McLaren" },
  { code: "RIC", fullName: "Daniel Ricciardo", team: "McLaren" },
  { code: "ALO", fullName: "Fernando Alonso", team: "Alpine" },
  { code: "OCO", fullName: "Esteban Ocon", team: "Alpine" },
  { code: "GAS", fullName: "Pierre Gasly", team: "AlphaTauri" },
  { code: "TSU", fullName: "Yuki Tsunoda", team: "AlphaTauri" },
  { code: "VET", fullName: "Sebastian Vettel", team: "Aston Martin" },
  { code: "STR", fullName: "Lance Stroll", team: "Aston Martin" },
  { code: "ALB", fullName: "Alexander Albon", team: "Williams" },
  { code: "LAT", fullName: "Nicholas Latifi", team: "Williams" },
  { code: "BOT", fullName: "Valtteri Bottas", team: "Alfa Romeo" },
  { code: "ZHO", fullName: "Guanyu Zhou", team: "Alfa Romeo" },
  { code: "MAG", fullName: "Kevin Magnussen", team: "Haas" },
  { code: "MSC", fullName: "Mick Schumacher", team: "Haas" },
];

// Hungary 2022 Q-style ordering (default)
const DEFAULT_ORDER = [
  "VER", "ALO", "NOR", "RIC", "ZHO", "OCO", "LEC", "BOT", "SAI", "RUS",
  "HAM", "STR", "MAG", "MSC", "PER", "TSU", "ALB", "VET", "GAS", "LAT",
];

function buildDrivers(order: string[]): Driver[] {
  return order.map((code, idx) => {
    const seed = DRIVER_POOL.find((d) => d.code === code)!;
    const position = idx + 1;
    const isAlo = code === "ALO";

    // Gap & interval (cumulative deltas)
    const intervalSec = idx === 0 ? 0 : 0.18 + ((idx * 137) % 900) / 1000;
    const gapSec = idx === 0 ? 0 : intervalSec * idx + ((idx * 53) % 700) / 1000;
    const formatDelta = (s: number) =>
      `+${s.toFixed(3)}`;

    // Last lap (slightly slower than best on average)
    const baseLap = isAlo ? "1:17.904" : `1:${(17 + (idx % 4)).toString().padStart(2, "0")}.${((100 + idx * 37) % 1000).toString().padStart(3, "0")}`;
    const lastLapMs = ((200 + idx * 71) % 900);
    const lastLap = `1:${(17 + ((idx + 1) % 5)).toString().padStart(2, "0")}.${lastLapMs.toString().padStart(3, "0")}`;

    // Tire stints
    const compounds: Array<'S' | 'M' | 'H'> = ["S", "M", "H"];
    const currentCompound = compounds[idx % 3];
    const tireAge = 4 + (idx * 3) % 18;
    const pitCount = idx % 4 === 0 ? 0 : (idx % 3) + 1;
    const stints = [
      ...(pitCount >= 1 ? [{ compound: compounds[(idx + 1) % 3], laps: 8 + (idx * 2) % 12 }] : []),
      ...(pitCount >= 2 ? [{ compound: compounds[(idx + 2) % 3], laps: 6 + (idx * 5) % 10 }] : []),
      ...(pitCount >= 3 ? [{ compound: compounds[(idx) % 3], laps: 5 + idx % 8 }] : []),
      { compound: currentCompound, laps: tireAge },
    ];

    // Last-lap status indicator
    const status: Driver["lastLapStatus"] =
      idx === 0 ? "purple" : idx % 5 === 1 ? "green" : "normal";

    return {
      position,
      code: seed.code,
      fullName: seed.fullName,
      team: seed.team,
      teamColor: TEAM_COLORS[seed.team],
      positionChange: position === 10 ? "up" : position === 11 ? "down" : null,
      bestLap: baseLap,
      sectors: [
        {
          sector: 1,
          time: isAlo ? "36.022" : `36.${((100 + idx * 13) % 900 + 100).toString().padStart(3, "0")}`,
          isFastest: isAlo,
        },
        { sector: 2, time: null },
        { sector: 3, time: null },
      ],
      speed: isAlo ? 139 : 180 + (idx * 7) % 80,
      rpm: isAlo ? 9860 : 10000 + (idx * 113) % 2000,
      gear: isAlo ? 3 : 5 + (idx % 4),
      drs: idx % 3 === 0,
      throttle: isAlo ? 62 : (idx * 17) % 100,
      brake: isAlo ? 18 : (idx * 11) % 60,
      tireCompound: currentCompound,
      gap: idx === 0 ? "LEADER" : formatDelta(gapSec),
      interval: idx === 0 ? "—" : formatDelta(intervalSec),
      lastLap,
      lastLapStatus: status,
      tireAge,
      pitCount,
      stints,
    };
  });
}

export const mockDrivers: Driver[] = buildDrivers(DEFAULT_ORDER);

// Deterministic shuffle so each session feels different but stable
function shuffleSeeded(arr: string[], seed: number): string[] {
  const a = [...arr];
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function getDriversForSession(sessionKey: number): Driver[] {
  if (!sessionKey) return mockDrivers;
  const order = shuffleSeeded(DEFAULT_ORDER, sessionKey);
  return buildDrivers(order);
}

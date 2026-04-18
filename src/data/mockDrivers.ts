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
    return {
      position,
      code: seed.code,
      fullName: seed.fullName,
      team: seed.team,
      teamColor: TEAM_COLORS[seed.team],
      positionChange: position === 10 ? "up" : position === 11 ? "down" : null,
      bestLap: isAlo
        ? "1:17.904"
        : `1:${(17 + (idx % 4)).toString().padStart(2, "0")}.${((100 + idx * 37) % 1000).toString().padStart(3, "0")}`,
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
      tireCompound: (["S", "M", "H"] as const)[idx % 3],
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

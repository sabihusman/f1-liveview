import type { Meeting } from "@/types/f1";

function buildSessions(baseKey: number, weekendStart: string, includeSprint = false): Meeting["sessions"] {
  const start = new Date(weekendStart);
  const day = (offset: number, h = 14) => {
    const d = new Date(start);
    d.setDate(d.getDate() + offset);
    d.setHours(h, 0, 0, 0);
    return d.toISOString();
  };

  if (includeSprint) {
    return [
      { sessionKey: baseKey + 1, sessionName: "Practice 1", sessionType: "Practice", dateStart: day(0, 13) },
      { sessionKey: baseKey + 2, sessionName: "Sprint Qualifying", sessionType: "Qualifying", dateStart: day(0, 17) },
      { sessionKey: baseKey + 3, sessionName: "Sprint", sessionType: "Sprint", dateStart: day(1, 12) },
      { sessionKey: baseKey + 4, sessionName: "Qualifying", sessionType: "Qualifying", dateStart: day(1, 16) },
      { sessionKey: baseKey + 5, sessionName: "Race", sessionType: "Race", dateStart: day(2, 15) },
    ];
  }
  return [
    { sessionKey: baseKey + 1, sessionName: "Practice 1", sessionType: "Practice", dateStart: day(0, 13) },
    { sessionKey: baseKey + 2, sessionName: "Practice 2", sessionType: "Practice", dateStart: day(0, 17) },
    { sessionKey: baseKey + 3, sessionName: "Practice 3", sessionType: "Practice", dateStart: day(1, 12) },
    { sessionKey: baseKey + 4, sessionName: "Qualifying", sessionType: "Qualifying", dateStart: day(1, 16) },
    { sessionKey: baseKey + 5, sessionName: "Race", sessionType: "Race", dateStart: day(2, 15) },
  ];
}

export const mockMeetings: Meeting[] = [
  // 2023
  { year: 2023, meetingKey: 2301, name: "Hungarian Grand Prix", country: "Hungary", circuitShortName: "Hungaroring", sessions: buildSessions(23010, "2023-07-21") },
  { year: 2023, meetingKey: 2302, name: "Belgian Grand Prix", country: "Belgium", circuitShortName: "Spa-Francorchamps", sessions: buildSessions(23020, "2023-07-28", true) },
  { year: 2023, meetingKey: 2303, name: "Italian Grand Prix", country: "Italy", circuitShortName: "Monza", sessions: buildSessions(23030, "2023-09-01") },
  { year: 2023, meetingKey: 2304, name: "Singapore Grand Prix", country: "Singapore", circuitShortName: "Marina Bay", sessions: buildSessions(23040, "2023-09-15") },
  { year: 2023, meetingKey: 2305, name: "Japanese Grand Prix", country: "Japan", circuitShortName: "Suzuka", sessions: buildSessions(23050, "2023-09-22") },

  // 2024
  { year: 2024, meetingKey: 2401, name: "Hungarian Grand Prix", country: "Hungary", circuitShortName: "Hungaroring", sessions: buildSessions(24010, "2024-07-19") },
  { year: 2024, meetingKey: 2402, name: "Belgian Grand Prix", country: "Belgium", circuitShortName: "Spa-Francorchamps", sessions: buildSessions(24020, "2024-07-26") },
  { year: 2024, meetingKey: 2403, name: "Italian Grand Prix", country: "Italy", circuitShortName: "Monza", sessions: buildSessions(24030, "2024-08-30") },
  { year: 2024, meetingKey: 2404, name: "Singapore Grand Prix", country: "Singapore", circuitShortName: "Marina Bay", sessions: buildSessions(24040, "2024-09-20", true) },
  { year: 2024, meetingKey: 2405, name: "Japanese Grand Prix", country: "Japan", circuitShortName: "Suzuka", sessions: buildSessions(24050, "2024-04-05") },

  // 2025 (lighter)
  { year: 2025, meetingKey: 2501, name: "Hungarian Grand Prix", country: "Hungary", circuitShortName: "Hungaroring", sessions: buildSessions(25010, "2025-08-01") },
  { year: 2025, meetingKey: 2502, name: "Italian Grand Prix", country: "Italy", circuitShortName: "Monza", sessions: buildSessions(25020, "2025-09-05") },

  // 2026 placeholder
  { year: 2026, meetingKey: 2601, name: "Hungarian Grand Prix", country: "Hungary", circuitShortName: "Hungaroring", sessions: buildSessions(26010, "2026-08-01") },
];

export function getMeetingsByYear(year: number): Meeting[] {
  return mockMeetings.filter((m) => m.year === year);
}

export const AVAILABLE_YEARS = [2023, 2024, 2025, 2026];

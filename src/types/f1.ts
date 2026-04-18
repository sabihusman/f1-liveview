export interface Driver {
  position: number;
  code: string;
  fullName: string;
  team: string;
  teamColor: string;
  positionChange?: 'up' | 'down' | null;
  bestLap?: string;
  sectors: SectorTime[];
  speed?: number;
  rpm?: number;
  gear?: number;
  drs?: boolean;
  throttle?: number;
  brake?: number;
  tireCompound?: 'S' | 'M' | 'H' | 'I' | 'W';
}

export interface SectorTime {
  sector: 1 | 2 | 3;
  time: string | null;
  isFastest?: boolean;
  isPersonalBest?: boolean;
}

export interface SessionInfo {
  name: string;
  trackName: string;
  country: string;
  sessionType: string;
  airTemp: number;
  trackTemp?: number;
  timeRemaining: string;
  sessionLabel: string;
}

export interface Session {
  sessionKey: number;
  sessionName: string;
  sessionType: 'Practice' | 'Qualifying' | 'Sprint' | 'Race';
  dateStart: string;
}

export interface Meeting {
  year: number;
  meetingKey: number;
  name: string;
  country: string;
  circuitShortName: string;
  sessions: Session[];
}

export interface SelectedSession {
  year: number;
  meeting: Meeting;
  session: Session;
}

import { useEffect, useState } from "react";
import { useMeetings } from "@/hooks/useMeetings";
import { useSessions } from "@/hooks/useSessions";
import { Skeleton } from "@/components/ui/skeleton";
import type { Meeting, Session, SelectedSession } from "@/types/f1";

const AVAILABLE_YEARS = [2024, 2025, 2026, 2023];

interface RaceSelectorProps {
  selected: SelectedSession;
  onApply: (s: SelectedSession) => void;
  onClose: () => void;
}

export default function RaceSelector({ selected, onApply, onClose }: RaceSelectorProps) {
  const [year, setYear] = useState<number>(selected.year);
  const [meetingKey, setMeetingKey] = useState<number>(selected.meeting.meetingKey);
  const [sessionKey, setSessionKey] = useState<number>(selected.session.sessionKey);

  const meetingsQuery = useMeetings(year);
  const sessionsQuery = useSessions(meetingKey);

  const meetings: Meeting[] = meetingsQuery.data?.data ?? [];
  const sessions: Session[] = sessionsQuery.data?.data ?? [];
  const source = meetingsQuery.data?.source ?? sessionsQuery.data?.source;

  const currentMeeting = meetings.find((m) => m.meetingKey === meetingKey) ?? meetings[0];
  const currentSession = sessions.find((s) => s.sessionKey === sessionKey) ?? sessions[0];

  // When meetings load after a year change, reset to first meeting if current is gone
  useEffect(() => {
    if (meetings.length > 0 && !meetings.find((m) => m.meetingKey === meetingKey)) {
      setMeetingKey(meetings[0].meetingKey);
    }
  }, [meetings, meetingKey]);

  // When sessions load after a meeting change, reset to first session if current is gone
  useEffect(() => {
    if (sessions.length > 0 && !sessions.find((s) => s.sessionKey === sessionKey)) {
      setSessionKey(sessions[0].sessionKey);
    }
  }, [sessions, sessionKey]);

  const selectClass =
    "w-full bg-gray-900 border border-gray-700 text-white text-sm rounded-sm px-3 py-2 focus:outline-none focus:border-red-500 font-mono-tabular";

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute top-14 left-2 z-50 w-96 bg-gray-800 border border-gray-700 p-4 rounded-md shadow-2xl text-white">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs uppercase tracking-widest text-gray-400">Select Session</span>
          {source && (
            <span
              className={`text-[10px] uppercase tracking-widest px-1.5 py-0.5 rounded font-mono ${
                source === "cache"
                  ? "bg-gray-700 text-gray-300"
                  : "bg-green-900 text-green-400"
              }`}
            >
              {source === "cache" ? "cached" : "live"}
            </span>
          )}
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1">Year</label>
            <select
              className={selectClass}
              value={year}
              onChange={(e) => {
                setYear(Number(e.target.value));
                setMeetingKey(-1); // will be reset by effect once meetings load
                setSessionKey(-1);
              }}
            >
              {AVAILABLE_YEARS.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1">Event</label>
            {meetingsQuery.isLoading ? (
              <Skeleton className="h-9 w-full rounded-sm bg-gray-700" />
            ) : meetingsQuery.isError ? (
              <div className="text-xs text-red-400 py-2">Failed to load events</div>
            ) : (
              <select
                className={selectClass}
                value={currentMeeting?.meetingKey ?? ""}
                onChange={(e) => {
                  const mk = Number(e.target.value);
                  setMeetingKey(mk);
                  setSessionKey(-1); // will be reset by effect once sessions load
                }}
              >
                {meetings.map((m) => (
                  <option key={m.meetingKey} value={m.meetingKey}>{m.name}</option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1">Session</label>
            {sessionsQuery.isLoading ? (
              <Skeleton className="h-9 w-full rounded-sm bg-gray-700" />
            ) : sessionsQuery.isError ? (
              <div className="text-xs text-red-400 py-2">Failed to load sessions</div>
            ) : (
              <select
                className={selectClass}
                value={currentSession?.sessionKey ?? ""}
                onChange={(e) => setSessionKey(Number(e.target.value))}
              >
                {sessions.map((s) => (
                  <option key={s.sessionKey} value={s.sessionKey}>{s.sessionName}</option>
                ))}
              </select>
            )}
          </div>
        </div>

        <button
          disabled={!currentMeeting || !currentSession}
          onClick={() => {
            if (currentMeeting && currentSession) {
              onApply({ year, meeting: currentMeeting, session: currentSession });
            }
          }}
          className="mt-4 w-full bg-red-600 hover:bg-red-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold uppercase tracking-wider py-2.5 rounded-sm transition"
        >
          Load Session
        </button>
      </div>
    </>
  );
}

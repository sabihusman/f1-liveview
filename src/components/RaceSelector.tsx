import { useMemo, useState } from "react";
import { AVAILABLE_YEARS, getMeetingsByYear } from "@/data/mockMeetings";
import type { SelectedSession } from "@/types/f1";

interface RaceSelectorProps {
  selected: SelectedSession;
  onApply: (s: SelectedSession) => void;
  onClose: () => void;
}

export default function RaceSelector({ selected, onApply, onClose }: RaceSelectorProps) {
  const [year, setYear] = useState<number>(selected.year);
  const [meetingKey, setMeetingKey] = useState<number>(selected.meeting.meetingKey);
  const [sessionKey, setSessionKey] = useState<number>(selected.session.sessionKey);

  const meetings = useMemo(() => getMeetingsByYear(year), [year]);
  const currentMeeting = useMemo(
    () => meetings.find((m) => m.meetingKey === meetingKey) ?? meetings[0],
    [meetings, meetingKey]
  );
  const currentSession = useMemo(
    () => currentMeeting?.sessions.find((s) => s.sessionKey === sessionKey) ?? currentMeeting?.sessions[0],
    [currentMeeting, sessionKey]
  );

  const selectClass =
    "w-full bg-gray-900 border border-gray-700 text-white text-sm rounded-sm px-3 py-2 focus:outline-none focus:border-red-500 font-mono-tabular";

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute top-14 left-2 z-50 w-96 bg-gray-800 border border-gray-700 p-4 rounded-md shadow-2xl text-white">
        <div className="text-xs uppercase tracking-widest text-gray-400 mb-3">Select Session</div>

        <div className="space-y-3">
          <div>
            <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1">Year</label>
            <select
              className={selectClass}
              value={year}
              onChange={(e) => {
                const y = Number(e.target.value);
                setYear(y);
                const first = getMeetingsByYear(y)[0];
                if (first) {
                  setMeetingKey(first.meetingKey);
                  setSessionKey(first.sessions[0].sessionKey);
                }
              }}
            >
              {AVAILABLE_YEARS.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1">Event</label>
            <select
              className={selectClass}
              value={currentMeeting?.meetingKey ?? ""}
              onChange={(e) => {
                const mk = Number(e.target.value);
                setMeetingKey(mk);
                const m = meetings.find((x) => x.meetingKey === mk);
                if (m) setSessionKey(m.sessions[0].sessionKey);
              }}
            >
              {meetings.map((m) => (
                <option key={m.meetingKey} value={m.meetingKey}>{m.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1">Session</label>
            <select
              className={selectClass}
              value={currentSession?.sessionKey ?? ""}
              onChange={(e) => setSessionKey(Number(e.target.value))}
            >
              {currentMeeting?.sessions.map((s) => (
                <option key={s.sessionKey} value={s.sessionKey}>{s.sessionName}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={() => {
            if (currentMeeting && currentSession) {
              onApply({ year, meeting: currentMeeting, session: currentSession });
            }
          }}
          className="mt-4 w-full bg-red-600 hover:bg-red-500 text-white text-sm font-bold uppercase tracking-wider py-2.5 rounded-sm transition"
        >
          Load Session
        </button>
      </div>
    </>
  );
}

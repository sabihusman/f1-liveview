import { supabase } from "@/lib/supabase";
import type { Session } from "@/types/f1";

interface DbSession {
  session_key: number;
  meeting_key: number;
  session_name: string | null;
  session_type: string | null;
  date_start: string | null;
  date_end: string | null;
  gmt_offset: string | null;
  fetched_at: string;
}

export interface FetchSessionsResult {
  data: Session[];
  source: "cache" | "openf1";
}

function mapSessionType(raw: string | null): Session["sessionType"] {
  switch (raw) {
    case "Race": return "Race";
    case "Qualifying": return "Qualifying";
    case "Sprint": return "Sprint";
    default: return "Practice";
  }
}

function mapSession(row: DbSession): Session {
  return {
    sessionKey: row.session_key,
    sessionName: row.session_name ?? `Session ${row.session_key}`,
    sessionType: mapSessionType(row.session_type),
    dateStart: row.date_start ?? "",
  };
}

export async function fetchSessions(meetingKey: number): Promise<FetchSessionsResult> {
  const { data, error } = await supabase.functions.invoke<{
    data: DbSession[];
    source: "cache" | "openf1";
  }>("fetch-sessions", { body: { meeting_key: meetingKey } });

  if (error) throw new Error(error.message);
  if (!data) throw new Error("No response from fetch-sessions");

  return {
    data: data.data.map(mapSession),
    source: data.source,
  };
}

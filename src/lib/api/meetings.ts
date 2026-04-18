import { supabase } from "@/lib/supabase";
import type { Meeting } from "@/types/f1";

interface DbMeeting {
  meeting_key: number;
  year: number;
  country_name: string | null;
  country_code: string | null;
  circuit_short_name: string | null;
  circuit_key: number | null;
  meeting_name: string | null;
  meeting_official_name: string | null;
  location: string | null;
  date_start: string | null;
  gmt_offset: string | null;
  fetched_at: string;
}

export interface FetchMeetingsResult {
  data: Meeting[];
  source: "cache" | "openf1";
}

function mapMeeting(row: DbMeeting): Meeting {
  return {
    year: row.year,
    meetingKey: row.meeting_key,
    name: row.meeting_name ?? `Meeting ${row.meeting_key}`,
    country: row.country_name ?? "",
    circuitShortName: row.circuit_short_name ?? "",
    sessions: [],
  };
}

export async function fetchMeetings(year: number): Promise<FetchMeetingsResult> {
  const { data, error } = await supabase.functions.invoke<{
    data: DbMeeting[];
    source: "cache" | "openf1";
  }>("fetch-meetings", { body: { year } });

  if (error) throw new Error(error.message);
  if (!data) throw new Error("No response from fetch-meetings");

  return {
    data: data.data.map(mapMeeting),
    source: data.source,
  };
}

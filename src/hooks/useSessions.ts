import { useQuery } from "@tanstack/react-query";
import { fetchSessions } from "@/lib/api/sessions";

export function useSessions(meetingKey: number | null) {
  return useQuery({
    queryKey: ["sessions", meetingKey],
    queryFn: () => fetchSessions(meetingKey!),
    enabled: meetingKey != null,
    staleTime: 60 * 60 * 1000,
  });
}

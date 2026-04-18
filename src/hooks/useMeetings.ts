import { useQuery } from "@tanstack/react-query";
import { fetchMeetings } from "@/lib/api/meetings";

export function useMeetings(year: number) {
  return useQuery({
    queryKey: ["meetings", year],
    queryFn: () => fetchMeetings(year),
    staleTime: 60 * 60 * 1000, // 1h — server-side 24h cache handles freshness
  });
}

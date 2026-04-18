import { createClient } from "jsr:@supabase/supabase-js@2";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS });
  }

  const url = new URL(req.url);
  let yearParam = url.searchParams.get("year");

  if (!yearParam) {
    const ct = req.headers.get("content-type") ?? "";
    if (ct.includes("application/json")) {
      const body = await req.json().catch(() => ({}));
      yearParam = body.year != null ? String(body.year) : null;
    }
  }

  if (!yearParam) {
    return new Response(JSON.stringify({ error: "year parameter is required" }), {
      status: 400,
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  }
  const year = parseInt(yearParam, 10);

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  // Check cache: meetings for this year fetched within 24h
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { data: cached } = await supabase
    .from("meetings")
    .select("*")
    .eq("year", year)
    .gt("fetched_at", cutoff);

  if (cached && cached.length > 0) {
    return new Response(JSON.stringify({ data: cached, source: "cache" }), {
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  }

  // Fetch from OpenF1
  const openf1Res = await fetch(`https://api.openf1.org/v1/meetings?year=${year}`);
  if (!openf1Res.ok) {
    return new Response(
      JSON.stringify({ error: `OpenF1 returned ${openf1Res.status}` }),
      { status: 502, headers: { ...CORS, "Content-Type": "application/json" } },
    );
  }

  const meetings = await openf1Res.json();
  if (!Array.isArray(meetings) || meetings.length === 0) {
    return new Response(JSON.stringify({ data: [], source: "openf1" }), {
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  }

  const rows = meetings.map((m: Record<string, unknown>) => ({
    meeting_key: m.meeting_key,
    year: m.year,
    country_name: m.country_name,
    country_code: m.country_code,
    circuit_short_name: m.circuit_short_name,
    circuit_key: m.circuit_key,
    meeting_name: m.meeting_name,
    meeting_official_name: m.meeting_official_name,
    location: m.location,
    date_start: m.date_start,
    gmt_offset: m.gmt_offset,
    fetched_at: new Date().toISOString(),
  }));

  const { data: upserted, error } = await supabase
    .from("meetings")
    .upsert(rows, { onConflict: "meeting_key" })
    .select();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ data: upserted, source: "openf1" }), {
    headers: { ...CORS, "Content-Type": "application/json" },
  });
});

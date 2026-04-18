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
  let meetingKeyParam = url.searchParams.get("meeting_key");

  if (!meetingKeyParam) {
    const ct = req.headers.get("content-type") ?? "";
    if (ct.includes("application/json")) {
      const body = await req.json().catch(() => ({}));
      meetingKeyParam = body.meeting_key != null ? String(body.meeting_key) : null;
    }
  }

  if (!meetingKeyParam) {
    return new Response(JSON.stringify({ error: "meeting_key parameter is required" }), {
      status: 400,
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  }
  const meetingKey = parseInt(meetingKeyParam, 10);

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  // Check cache: sessions for this meeting fetched within 24h
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { data: cached } = await supabase
    .from("sessions")
    .select("*")
    .eq("meeting_key", meetingKey)
    .gt("fetched_at", cutoff);

  if (cached && cached.length > 0) {
    return new Response(JSON.stringify({ data: cached, source: "cache" }), {
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  }

  // Fetch from OpenF1
  const openf1Res = await fetch(
    `https://api.openf1.org/v1/sessions?meeting_key=${meetingKey}`,
  );
  if (!openf1Res.ok) {
    return new Response(
      JSON.stringify({ error: `OpenF1 returned ${openf1Res.status}` }),
      { status: 502, headers: { ...CORS, "Content-Type": "application/json" } },
    );
  }

  const sessions = await openf1Res.json();
  if (!Array.isArray(sessions) || sessions.length === 0) {
    return new Response(JSON.stringify({ data: [], source: "openf1" }), {
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  }

  const rows = sessions.map((s: Record<string, unknown>) => ({
    session_key: s.session_key,
    meeting_key: s.meeting_key,
    session_name: s.session_name,
    session_type: s.session_type,
    date_start: s.date_start,
    date_end: s.date_end,
    gmt_offset: s.gmt_offset,
    fetched_at: new Date().toISOString(),
  }));

  const { data: upserted, error } = await supabase
    .from("sessions")
    .upsert(rows, { onConflict: "session_key" })
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

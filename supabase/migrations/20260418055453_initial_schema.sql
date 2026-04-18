create table meetings (
  meeting_key integer primary key,
  year integer not null,
  country_name text,
  country_code text,
  circuit_short_name text,
  circuit_key integer,
  meeting_name text,
  meeting_official_name text,
  location text,
  date_start timestamptz,
  gmt_offset text,
  fetched_at timestamptz default now()
);
create index meetings_year_idx on meetings(year);

create table sessions (
  session_key integer primary key,
  meeting_key integer references meetings(meeting_key) on delete cascade,
  session_name text,
  session_type text,
  date_start timestamptz,
  date_end timestamptz,
  gmt_offset text,
  fetched_at timestamptz default now()
);
create index sessions_meeting_key_idx on sessions(meeting_key);

alter table meetings enable row level security;
alter table sessions enable row level security;

create policy "meetings readable by anyone"
  on meetings for select using (true);
create policy "sessions readable by anyone"
  on sessions for select using (true);

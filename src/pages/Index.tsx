import { useMemo, useState } from "react";
import TopBar from "@/components/TopBar";
import SubNav from "@/components/SubNav";
import PositionList from "@/components/PositionList";
import DriverDetailCard from "@/components/DriverDetailCard";
import TrackMap from "@/components/TrackMap";
import SessionInfoCard from "@/components/SessionInfoCard";
import { getDriversForSession } from "@/data/mockDrivers";
import { mockMeetings } from "@/data/mockMeetings";
import type { SelectedSession } from "@/types/f1";

const Index = () => {
  // Default to Hungary 2024 Qualifying
  const defaultMeeting = mockMeetings.find((m) => m.year === 2024 && m.country === "Hungary")!;
  const defaultSession = defaultMeeting.sessions.find((s) => s.sessionName === "Qualifying")!;

  const [selected, setSelected] = useState<SelectedSession>({
    year: 2024,
    meeting: defaultMeeting,
    session: defaultSession,
  });
  const [topTab, setTopTab] = useState<"leaderboard" | "tracker" | "commentary">("tracker");
  const [subTab, setSubTab] = useState<"laps" | "sectors" | "h2h" | "telemetry">("telemetry");

  const drivers = useMemo(
    () => getDriversForSession(selected.session.sessionKey),
    [selected.session.sessionKey]
  );

  const [selectedCode, setSelectedCode] = useState<string>("ALO");
  const selectedDriver = drivers.find((d) => d.code === selectedCode) ?? drivers[0];

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-900 text-white overflow-hidden font-sans">
      <TopBar
        activeTab={topTab}
        onTabChange={setTopTab}
        selected={selected}
        onSelectedChange={(s) => {
          setSelected(s);
          // reset selection to leader when session changes
          const newDrivers = getDriversForSession(s.session.sessionKey);
          setSelectedCode(newDrivers[1]?.code ?? newDrivers[0].code);
        }}
      />
      <SubNav activeTab={subTab} onTabChange={setSubTab} />

      <main className="flex-1 flex min-h-0">
        <PositionList
          drivers={drivers}
          selectedCode={selectedCode}
          onSelect={setSelectedCode}
        />

        {/* Map area with floating panels */}
        <section className="relative flex-1">
          <TrackMap
            circuitName={selected.meeting.circuitShortName}
            drivers={drivers}
            selectedCode={selectedCode}
            onSelectDriver={setSelectedCode}
          />

          {/* Floating driver detail card on the left */}
          <div className="absolute top-4 left-4 z-10">
            <DriverDetailCard driver={selectedDriver} />
          </div>

          {/* Bottom-right session card */}
          <SessionInfoCard
            sessionLabel={
              selected.session.sessionType === "Qualifying"
                ? "Q2"
                : selected.session.sessionType === "Practice"
                ? "P1"
                : selected.session.sessionType === "Race"
                ? "RACE"
                : "SPR"
            }
            timeRemaining="0:07:41"
            airTemp={22}
          />
        </section>
      </main>
    </div>
  );
};

export default Index;

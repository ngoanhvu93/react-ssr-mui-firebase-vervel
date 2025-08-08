import RoundRobinTournament from "~/round-robin-tournament/page";
import type { Route } from "./+types/round-robin-tournament";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Giải đấu" },
    { name: "Giải đấu", content: "Giải đấu để xem kết quả!" },
  ];
}

export default function RoundRobinTournamentPage() {
  return <RoundRobinTournament />;
}

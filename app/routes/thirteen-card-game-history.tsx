import ThirteenCardGameHistory from "~/thirteen-card-game-history/page";
import type { Route } from "./+types/thirteen-card-game-history";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Lịch sử bài tiến lên" },
    { name: "Lịch sử bài tiến lên", content: "Lịch sử bài tiến lên" },
  ];
}

export default function ThirteenCardGameHistoryPage() {
  return <ThirteenCardGameHistory />;
}

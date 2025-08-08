import ThirteenCardGameDetail from "~/thirteen-card-game-detail/page";
import type { Route } from "./+types/thirteen-card-game-detail";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Chi tiết ván bài" },
    {
      name: "Chi tiết ván bài",
      content: "Chi tiết ván bài",
    },
  ];
}

export default function ThirteenCardGameDetailPage() {
  return <ThirteenCardGameDetail />;
}

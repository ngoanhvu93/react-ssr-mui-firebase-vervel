import ThirteenCardRoom from "~/thirteen-card-room/page";
import type { Route } from "./+types/thirteen-card-room";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Ghi điểm bài tiến lên" },
    { name: "Ghi điểm bài tiến lên", content: "Ghi điểm bài tiến lên" },
    { name: "description", content: "Ghi điểm bài tiến lên" },
    { name: "keywords", content: "Ghi điểm bài tiến lên" },
    { name: "author", content: "Ghi điểm bài tiến lên" },
    { name: "robots", content: "Ghi điểm bài tiến lên" },
    { name: "theme-color", content: "Ghi điểm bài tiến lên" },
    { name: "og:title", content: "Ghi điểm bài tiến lên" },
    { name: "og:description", content: "Ghi điểm bài tiến lên" },
    { name: "og:type", content: "website" },
    { name: "og:url", content: "https://appvn.vn/thirteen-card-room" },
    {
      name: "og:image",
      content:
        "https://cellphones.com.vn/sforum/wp-content/uploads/2023/02/tien-len-2.jpg",
    },
    { name: "og:image:alt", content: "Ghi điểm bài tiến lên" },
  ];
}

export default function ThirteenCardRoomPage() {
  return <ThirteenCardRoom />;
}

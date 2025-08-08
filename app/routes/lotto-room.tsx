import LottoRoom from "~/lotto-room/page";
import type { Route } from "./+types/lotto-room";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Phòng lô tô" },
    { name: "description", content: "Phòng lô tô" },
    {
      name: "og:title",
      content: "Phòng lô tô",
    },
    {
      name: "og:image",
      content:
        "https://www.escapeartist.com/wp-content/uploads/2020/09/Lotto-online.jpg",
    },
  ];
}

export default function LottoRoomPage() {
  return <LottoRoom />;
}

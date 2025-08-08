import JoinLottoRoom from "~/join-lotto-room/page";
import type { Route } from "./+types/join-lotto-room";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Tham gia phòng lô tô - Ứng dụng Việt" },
    {
      name: "description",
      content:
        "Tham gia phòng lô tô trực tuyến để chơi cùng bạn bè. Nhập mã phòng hoặc link để tham gia trò chơi lô tô truyền thống Việt Nam.",
    },
    {
      name: "keywords",
      content:
        "tham gia phòng lô tô, join lô tô, game lô tô, phòng chơi lô tô, lô tô online, trò chơi dân gian",
    },
    { name: "author", content: "Ứng dụng Việt" },
    {
      name: "robots",
      content:
        "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
    },
    { name: "theme-color", content: "#ffffff" },
    // Open Graph tags
    { property: "og:title", content: "Tham gia phòng lô tô - Ứng dụng Việt" },
    {
      property: "og:description",
      content:
        "Tham gia phòng lô tô trực tuyến để chơi cùng bạn bè. Nhập mã phòng hoặc link để tham gia trò chơi lô tô truyền thống Việt Nam.",
    },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://appvn.vn/join-lotto-room" },
    {
      property: "og:image",
      content:
        "https://img.freepik.com/free-vector/join-game-concept-illustration_114360-1243.jpg",
    },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:image:type", content: "image/jpeg" },
    {
      property: "og:image:alt",
      content: "Tham gia phòng lô tô trực tuyến",
    },
    { property: "og:site_name", content: "Ứng dụng Việt" },
    { property: "og:locale", content: "vi_VN" },
    // Twitter Card tags
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:site", content: "@appvn" },
    { name: "twitter:creator", content: "@appvn" },
    { name: "twitter:title", content: "Tham gia phòng lô tô - Ứng dụng Việt" },
    {
      name: "twitter:description",
      content:
        "Tham gia phòng lô tô trực tuyến để chơi cùng bạn bè. Nhập mã phòng hoặc link để tham gia trò chơi lô tô truyền thống Việt Nam.",
    },
    {
      name: "twitter:image",
      content:
        "https://img.freepik.com/free-vector/join-game-concept-illustration_114360-1243.jpg",
    },
    {
      name: "twitter:image:alt",
      content: "Tham gia phòng lô tô trực tuyến",
    },
    // Canonical
    { rel: "canonical", href: "https://appvn.vn/join-lotto-room" },
  ];
}

export default function JoinLottoRoomPage() {
  return <JoinLottoRoom />;
}

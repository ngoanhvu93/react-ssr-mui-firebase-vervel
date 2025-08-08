import JoinThirteenCardRoom from "../join-thirteen-card-room/page";
import type { Route } from "./+types/join-thirteen-card-room";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Tham gia phòng bài tiến lên - Ứng dụng Việt" },
    {
      name: "description",
      content:
        "Tham gia phòng bài tiến lên trực tuyến để chơi cùng bạn bè. Nhập mã phòng hoặc link để tham gia trò chơi bài tiến lên truyền thống Việt Nam.",
    },
    {
      name: "keywords",
      content:
        "tham gia phòng bài tiến lên, join bài tiến lên, game bài, phòng chơi bài, bài online, trò chơi bài",
    },
    { name: "author", content: "Ứng dụng Việt" },
    {
      name: "robots",
      content:
        "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
    },
    { name: "theme-color", content: "#ffffff" },
    // Open Graph tags
    {
      property: "og:title",
      content: "Tham gia phòng bài tiến lên - Ứng dụng Việt",
    },
    {
      property: "og:description",
      content:
        "Tham gia phòng bài tiến lên trực tuyến để chơi cùng bạn bè. Nhập mã phòng hoặc link để tham gia trò chơi bài tiến lên truyền thống Việt Nam.",
    },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://appvn.vn/join-thirteen-card-room" },
    {
      property: "og:image",
      content:
        "https://img.freepik.com/free-vector/join-card-game-concept-illustration_114360-1244.jpg",
    },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:image:type", content: "image/jpeg" },
    {
      property: "og:image:alt",
      content: "Tham gia phòng bài tiến lên trực tuyến",
    },
    { property: "og:site_name", content: "Ứng dụng Việt" },
    { property: "og:locale", content: "vi_VN" },
    // Twitter Card tags
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:site", content: "@appvn" },
    { name: "twitter:creator", content: "@appvn" },
    {
      name: "twitter:title",
      content: "Tham gia phòng bài tiến lên - Ứng dụng Việt",
    },
    {
      name: "twitter:description",
      content:
        "Tham gia phòng bài tiến lên trực tuyến để chơi cùng bạn bè. Nhập mã phòng hoặc link để tham gia trò chơi bài tiến lên truyền thống Việt Nam.",
    },
    {
      name: "twitter:image",
      content:
        "https://img.freepik.com/free-vector/join-card-game-concept-illustration_114360-1244.jpg",
    },
    {
      name: "twitter:image:alt",
      content: "Tham gia phòng bài tiến lên trực tuyến",
    },
    // Canonical
    { rel: "canonical", href: "https://appvn.vn/join-thirteen-card-room" },
  ];
}

export default function JoinThirteenCardRoomPage() {
  return <JoinThirteenCardRoom />;
}

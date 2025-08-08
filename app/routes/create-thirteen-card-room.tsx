import CreateThirteenCardRoom from "../create-thirteen-card-room/page";
import type { Route } from "./+types/create-thirteen-card-room";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Tạo phòng bài ba lá - Ứng dụng Việt" },
    {
      name: "description",
      content:
        "Tạo phòng bài ba lá trực tuyến để chơi cùng bạn bè. Tạo phòng, mời bạn bè và bắt đầu trò chơi bài ba lá truyền thống Việt Nam.",
    },
    {
      name: "keywords",
      content:
        "tạo phòng bài ba lá, bài ba lá, game bài, phòng chơi bài, bài online, trò chơi bài",
    },
    { name: "author", content: "Ứng dụng Việt" },
    {
      name: "robots",
      content:
        "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
    },
    { name: "theme-color", content: "#ffffff" },
    // Open Graph tags
    { property: "og:title", content: "Tạo phòng bài ba lá - Ứng dụng Việt" },
    {
      property: "og:description",
      content:
        "Tạo phòng bài ba lá trực tuyến để chơi cùng bạn bè. Tạo phòng, mời bạn bè và bắt đầu trò chơi bài ba lá truyền thống Việt Nam.",
    },
    { property: "og:type", content: "website" },
    {
      property: "og:url",
      content: "https://appvn.vn/create-thirteen-card-room",
    },
    {
      property: "og:image",
      content:
        "https://img.freepik.com/free-vector/playing-cards-concept-illustration_114360-1241.jpg",
    },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:image:type", content: "image/jpeg" },
    {
      property: "og:image:alt",
      content: "Tạo phòng bài ba lá trực tuyến",
    },
    { property: "og:site_name", content: "Ứng dụng Việt" },
    { property: "og:locale", content: "vi_VN" },
    // Twitter Card tags
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:site", content: "@appvn" },
    { name: "twitter:creator", content: "@appvn" },
    { name: "twitter:title", content: "Tạo phòng bài ba lá - Ứng dụng Việt" },
    {
      name: "twitter:description",
      content:
        "Tạo phòng bài ba lá trực tuyến để chơi cùng bạn bè. Tạo phòng, mời bạn bè và bắt đầu trò chơi bài ba lá truyền thống Việt Nam.",
    },
    {
      name: "twitter:image",
      content:
        "https://img.freepik.com/free-vector/playing-cards-concept-illustration_114360-1241.jpg",
    },
    {
      name: "twitter:image:alt",
      content: "Tạo phòng bài ba lá trực tuyến",
    },
    // Canonical
    { rel: "canonical", href: "https://appvn.vn/create-thirteen-card-room" },
  ];
}

export default function CreateThirteenCardRoomPage() {
  return <CreateThirteenCardRoom />;
}

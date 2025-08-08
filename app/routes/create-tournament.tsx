import CreateTournament from "~/create-tournament/page";
import type { Route } from "./+types/create-tournament";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Tạo giải đấu - Ứng dụng Việt" },
    {
      name: "description",
      content:
        "Tạo giải đấu trực tuyến để quản lý và theo dõi kết quả. Tạo giải đấu, thêm đội bóng và quản lý lịch thi đấu một cách dễ dàng.",
    },
    {
      name: "keywords",
      content:
        "tạo giải đấu, giải đấu bóng đá, quản lý giải đấu, lịch thi đấu, đội bóng, tournament",
    },
    { name: "author", content: "Ứng dụng Việt" },
    {
      name: "robots",
      content:
        "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
    },
    { name: "theme-color", content: "#ffffff" },
    // Open Graph tags
    { property: "og:title", content: "Tạo giải đấu - Ứng dụng Việt" },
    {
      property: "og:description",
      content:
        "Tạo giải đấu trực tuyến để quản lý và theo dõi kết quả. Tạo giải đấu, thêm đội bóng và quản lý lịch thi đấu một cách dễ dàng.",
    },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://appvn.vn/create-tournament" },
    {
      property: "og:image",
      content:
        "https://img.freepik.com/free-vector/tournament-concept-illustration_114360-1242.jpg",
    },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:image:type", content: "image/jpeg" },
    {
      property: "og:image:alt",
      content: "Tạo giải đấu trực tuyến",
    },
    { property: "og:site_name", content: "Ứng dụng Việt" },
    { property: "og:locale", content: "vi_VN" },
    // Twitter Card tags
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:site", content: "@appvn" },
    { name: "twitter:creator", content: "@appvn" },
    { name: "twitter:title", content: "Tạo giải đấu - Ứng dụng Việt" },
    {
      name: "twitter:description",
      content:
        "Tạo giải đấu trực tuyến để quản lý và theo dõi kết quả. Tạo giải đấu, thêm đội bóng và quản lý lịch thi đấu một cách dễ dàng.",
    },
    {
      name: "twitter:image",
      content:
        "https://img.freepik.com/free-vector/tournament-concept-illustration_114360-1242.jpg",
    },
    {
      name: "twitter:image:alt",
      content: "Tạo giải đấu trực tuyến",
    },
    // Canonical
    { rel: "canonical", href: "https://appvn.vn/create-tournament" },
  ];
}

export default function CreateTournamentPage() {
  return <CreateTournament />;
}

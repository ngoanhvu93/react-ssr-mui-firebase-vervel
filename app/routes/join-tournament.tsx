import JoinTournament from "~/join-tournament/page";
import type { Route } from "./+types/join-tournament";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Tham gia giải đấu - Ứng dụng Việt" },
    {
      name: "description",
      content:
        "Tham gia giải đấu trực tuyến để theo dõi kết quả và bảng xếp hạng. Nhập mã giải đấu hoặc link để tham gia và xem thông tin chi tiết.",
    },
    {
      name: "keywords",
      content:
        "tham gia giải đấu, join tournament, giải đấu bóng đá, bảng xếp hạng, kết quả giải đấu, tournament",
    },
    { name: "author", content: "Ứng dụng Việt" },
    {
      name: "robots",
      content:
        "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
    },
    { name: "theme-color", content: "#ffffff" },
    // Open Graph tags
    { property: "og:title", content: "Tham gia giải đấu - Ứng dụng Việt" },
    {
      property: "og:description",
      content:
        "Tham gia giải đấu trực tuyến để theo dõi kết quả và bảng xếp hạng. Nhập mã giải đấu hoặc link để tham gia và xem thông tin chi tiết.",
    },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://appvn.vn/join-tournament" },
    {
      property: "og:image",
      content:
        "https://img.freepik.com/free-vector/join-tournament-concept-illustration_114360-1245.jpg",
    },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:image:type", content: "image/jpeg" },
    {
      property: "og:image:alt",
      content: "Tham gia giải đấu trực tuyến",
    },
    { property: "og:site_name", content: "Ứng dụng Việt" },
    { property: "og:locale", content: "vi_VN" },
    // Twitter Card tags
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:site", content: "@appvn" },
    { name: "twitter:creator", content: "@appvn" },
    { name: "twitter:title", content: "Tham gia giải đấu - Ứng dụng Việt" },
    {
      name: "twitter:description",
      content:
        "Tham gia giải đấu trực tuyến để theo dõi kết quả và bảng xếp hạng. Nhập mã giải đấu hoặc link để tham gia và xem thông tin chi tiết.",
    },
    {
      name: "twitter:image",
      content:
        "https://img.freepik.com/free-vector/join-tournament-concept-illustration_114360-1245.jpg",
    },
    {
      name: "twitter:image:alt",
      content: "Tham gia giải đấu trực tuyến",
    },
    // Canonical
    { rel: "canonical", href: "https://appvn.vn/join-tournament" },
  ];
}

export default function JoinTournamentPage() {
  return <JoinTournament />;
}

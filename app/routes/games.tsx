import Games from "~/games/games";
import type { Route } from "./+types/games";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Trò chơi Việt - Ứng dụng Việt" },
    {
      name: "description",
      content:
        "Khám phá và trải nghiệm các trò chơi hữu ích cho người Việt. Hoàn toàn miễn phí với nhiều trò chơi thú vị!",
    },
    {
      name: "keywords",
      content:
        "trò chơi việt, game việt nam, trò chơi dân gian, game online, trò chơi miễn phí, game giải trí",
    },
    { name: "author", content: "Ứng dụng Việt" },
    {
      name: "robots",
      content:
        "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
    },
    { name: "theme-color", content: "#ffffff" },
    // Open Graph tags
    { property: "og:title", content: "Trò chơi Việt - Ứng dụng Việt" },
    {
      property: "og:description",
      content:
        "Khám phá và trải nghiệm các trò chơi hữu ích cho người Việt. Hoàn toàn miễn phí với nhiều trò chơi thú vị!",
    },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://appvn.vn/games" },
    {
      property: "og:image",
      content:
        "https://img.freepik.com/free-vector/game-controller-concept-illustration_114360-1233.jpg",
    },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:image:type", content: "image/jpeg" },
    {
      property: "og:image:alt",
      content: "Trò chơi Việt - Kho game dành cho người Việt",
    },
    { property: "og:site_name", content: "Ứng dụng Việt" },
    { property: "og:locale", content: "vi_VN" },
    // Twitter Card tags
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:site", content: "@appvn" },
    { name: "twitter:creator", content: "@appvn" },
    { name: "twitter:title", content: "Trò chơi Việt - Ứng dụng Việt" },
    {
      name: "twitter:description",
      content:
        "Khám phá và trải nghiệm các trò chơi hữu ích cho người Việt. Hoàn toàn miễn phí với nhiều trò chơi thú vị!",
    },
    {
      name: "twitter:image",
      content:
        "https://img.freepik.com/free-vector/game-controller-concept-illustration_114360-1233.jpg",
    },
    {
      name: "twitter:image:alt",
      content: "Trò chơi Việt - Kho game dành cho người Việt",
    },
    // Canonical
    { rel: "canonical", href: "https://appvn.vn/games" },
  ];
}

export default function GamesPage() {
  return <Games />;
}

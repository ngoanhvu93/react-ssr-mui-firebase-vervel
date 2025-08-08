import CreateLottoRoom from "~/create-lotto-room/page";
import type { Route } from "./+types/create-lotto-room";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Tạo phòng lô tô - Ứng dụng Việt" },
    {
      name: "description",
      content:
        "Tạo phòng lô tô trực tuyến để chơi cùng bạn bè. Tạo phòng, mời bạn bè và bắt đầu trò chơi lô tô truyền thống Việt Nam.",
    },
    {
      name: "keywords",
      content:
        "tạo phòng lô tô, lô tô việt, game lô tô, phòng chơi lô tô, lô tô online, trò chơi dân gian",
    },
    { name: "author", content: "Ứng dụng Việt" },
    {
      name: "robots",
      content:
        "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
    },
    { name: "theme-color", content: "#ffffff" },
    // Open Graph tags
    { property: "og:title", content: "Tạo phòng lô tô - Ứng dụng Việt" },
    {
      property: "og:description",
      content:
        "Tạo phòng lô tô trực tuyến để chơi cùng bạn bè. Tạo phòng, mời bạn bè và bắt đầu trò chơi lô tô truyền thống Việt Nam.",
    },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://appvn.vn/create-lotto-room" },
    {
      property: "og:image",
      content:
        "https://play-lh.googleusercontent.com/7yKOZB8ZdEiAHt18F124rEvehJLNms6JnEYeNdnLsrjONshzjK4aqJFBbz43hhzZzOs",
    },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:image:type", content: "image/jpeg" },
    {
      property: "og:image:alt",
      content: "Tạo phòng lô tô trực tuyến",
    },
    { property: "og:site_name", content: "Ứng dụng Việt" },
    { property: "og:locale", content: "vi_VN" },
    // Twitter Card tags
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:site", content: "@appvn" },
    { name: "twitter:creator", content: "@appvn" },
    { name: "twitter:title", content: "Tạo phòng lô tô - Ứng dụng Việt" },
    {
      name: "twitter:description",
      content:
        "Tạo phòng lô tô trực tuyến để chơi cùng bạn bè. Tạo phòng, mời bạn bè và bắt đầu trò chơi lô tô truyền thống Việt Nam.",
    },
    {
      name: "twitter:image",
      content:
        "https://play-lh.googleusercontent.com/7yKOZB8ZdEiAHt18F124rEvehJLNms6JnEYeNdnLsrjONshzjK4aqJFBbz43hhzZzOs",
    },
    {
      name: "twitter:image:alt",
      content: "Tạo phòng lô tô trực tuyến",
    },
    // Canonical
    { rel: "canonical", href: "https://appvn.vn/create-lotto-room" },
  ];
}

const CreateLottoRoomPage = () => {
  return <CreateLottoRoom />;
};

export default CreateLottoRoomPage;

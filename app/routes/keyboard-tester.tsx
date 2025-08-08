import KeyboardTester from "~/keyboard-tester/page";
import type { Route } from "../keyboard-tester/+types/page";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Kiểm tra bàn phím - Ứng dụng Việt" },
    {
      name: "description",
      content:
        "Công cụ kiểm tra bàn phím trực tuyến. Kiểm tra xem tất cả các phím trên bàn phím của bạn có hoạt động bình thường không.",
    },
    {
      name: "keywords",
      content:
        "kiểm tra bàn phím, keyboard tester, test bàn phím, công cụ kiểm tra, bàn phím online, test phím",
    },
    { name: "author", content: "Ứng dụng Việt" },
    {
      name: "robots",
      content:
        "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
    },
    { name: "theme-color", content: "#ffffff" },
    // Open Graph tags
    { property: "og:title", content: "Kiểm tra bàn phím - Ứng dụng Việt" },
    {
      property: "og:description",
      content:
        "Công cụ kiểm tra bàn phím trực tuyến. Kiểm tra xem tất cả các phím trên bàn phím của bạn có hoạt động bình thường không.",
    },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://appvn.vn/keyboard-tester" },
    {
      property: "og:image",
      content:
        "https://img.freepik.com/free-vector/keyboard-concept-illustration_114360-1237.jpg",
    },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:image:type", content: "image/jpeg" },
    {
      property: "og:image:alt",
      content: "Công cụ kiểm tra bàn phím trực tuyến",
    },
    { property: "og:site_name", content: "Ứng dụng Việt" },
    { property: "og:locale", content: "vi_VN" },
    // Twitter Card tags
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:site", content: "@appvn" },
    { name: "twitter:creator", content: "@appvn" },
    { name: "twitter:title", content: "Kiểm tra bàn phím - Ứng dụng Việt" },
    {
      name: "twitter:description",
      content:
        "Công cụ kiểm tra bàn phím trực tuyến. Kiểm tra xem tất cả các phím trên bàn phím của bạn có hoạt động bình thường không.",
    },
    {
      name: "twitter:image",
      content:
        "https://img.freepik.com/free-vector/keyboard-concept-illustration_114360-1237.jpg",
    },
    {
      name: "twitter:image:alt",
      content: "Công cụ kiểm tra bàn phím trực tuyến",
    },
    // Canonical
    { rel: "canonical", href: "https://appvn.vn/keyboard-tester" },
  ];
}

export default function KeyboardTesterRoute() {
  return <KeyboardTester />;
}

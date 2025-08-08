import CountDown from "~/count-down/page";
import type { Route } from "./+types/count-down";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Đếm ngược ngày lễ - Ứng dụng Việt" },
    {
      name: "description",
      content:
        "Xem lịch đếm ngược các ngày lễ lớn ở Việt Nam như Tết Nguyên Đán, Giỗ Tổ Hùng Vương, Quốc Khánh 2/9 và nhiều ngày lễ quan trọng khác",
    },
    {
      name: "keywords",
      content:
        "ngày lễ việt nam, tết nguyên đán, giỗ tổ hùng vương, quốc khánh 2/9, ngày lễ lớn, đếm ngược ngày lễ, lịch việt nam",
    },
    { name: "author", content: "Ứng dụng Việt" },
    {
      name: "robots",
      content:
        "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
    },
    { name: "theme-color", content: "#ffffff" },
    // Open Graph tags
    { property: "og:title", content: "Đếm ngược ngày lễ - Ứng dụng Việt" },
    {
      property: "og:description",
      content:
        "Xem lịch đếm ngược các ngày lễ lớn ở Việt Nam như Tết Nguyên Đán, Giỗ Tổ Hùng Vương, Quốc Khánh 2/9 và nhiều ngày lễ quan trọng khác",
    },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://appvn.vn/count-down" },
    {
      property: "og:image",
      content:
        "https://img.freepik.com/free-vector/countdown-concept-illustration_114360-1234.jpg",
    },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:image:type", content: "image/jpeg" },
    {
      property: "og:image:alt",
      content: "Đếm ngược các ngày lễ Việt Nam",
    },
    { property: "og:site_name", content: "Ứng dụng Việt" },
    { property: "og:locale", content: "vi_VN" },
    // Twitter Card tags
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:site", content: "@appvn" },
    { name: "twitter:creator", content: "@appvn" },
    { name: "twitter:title", content: "Đếm ngược ngày lễ - Ứng dụng Việt" },
    {
      name: "twitter:description",
      content:
        "Xem lịch đếm ngược các ngày lễ lớn ở Việt Nam như Tết Nguyên Đán, Giỗ Tổ Hùng Vương, Quốc Khánh 2/9 và nhiều ngày lễ quan trọng khác",
    },
    {
      name: "twitter:image",
      content:
        "https://img.freepik.com/free-vector/countdown-concept-illustration_114360-1234.jpg",
    },
    {
      name: "twitter:image:alt",
      content: "Đếm ngược các ngày lễ Việt Nam",
    },
    // Canonical
    { rel: "canonical", href: "https://appvn.vn/count-down" },
  ];
}

export default function CountDownPage() {
  return <CountDown />;
}

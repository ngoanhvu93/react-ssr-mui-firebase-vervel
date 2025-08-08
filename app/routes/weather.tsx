import { Suspense } from "react";
import WeatherPage from "~/weather/page";

export function meta({}: any) {
  return [
    { title: "Thời tiết - Ứng dụng Việt" },
    {
      name: "description",
      content:
        "Xem thông tin thời tiết chính xác và cập nhật cho các tỉnh thành Việt Nam. Dự báo thời tiết chi tiết, nhiệt độ, độ ẩm và các thông tin khí tượng.",
    },
    {
      name: "keywords",
      content:
        "thời tiết, weather, dự báo thời tiết, thời tiết việt nam, nhiệt độ, độ ẩm, khí tượng",
    },
    { name: "author", content: "Ứng dụng Việt" },
    {
      name: "robots",
      content:
        "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
    },
    { name: "theme-color", content: "#ffffff" },
    // Open Graph tags
    { property: "og:title", content: "Thời tiết - Ứng dụng Việt" },
    {
      property: "og:description",
      content:
        "Xem thông tin thời tiết chính xác và cập nhật cho các tỉnh thành Việt Nam. Dự báo thời tiết chi tiết, nhiệt độ, độ ẩm và các thông tin khí tượng.",
    },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://appvn.vn/weather" },
    {
      property: "og:image",
      content:
        "https://img.freepik.com/free-vector/weather-concept-illustration_114360-1239.jpg",
    },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:image:type", content: "image/jpeg" },
    {
      property: "og:image:alt",
      content: "Thông tin thời tiết Việt Nam",
    },
    { property: "og:site_name", content: "Ứng dụng Việt" },
    { property: "og:locale", content: "vi_VN" },
    // Twitter Card tags
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:site", content: "@appvn" },
    { name: "twitter:creator", content: "@appvn" },
    { name: "twitter:title", content: "Thời tiết - Ứng dụng Việt" },
    {
      name: "twitter:description",
      content:
        "Xem thông tin thời tiết chính xác và cập nhật cho các tỉnh thành Việt Nam. Dự báo thời tiết chi tiết, nhiệt độ, độ ẩm và các thông tin khí tượng.",
    },
    {
      name: "twitter:image",
      content:
        "https://img.freepik.com/free-vector/weather-concept-illustration_114360-1239.jpg",
    },
    {
      name: "twitter:image:alt",
      content: "Thông tin thời tiết Việt Nam",
    },
    // Canonical
    { rel: "canonical", href: "https://appvn.vn/weather" },
  ];
}

export default function WeatherRoute() {
  return (
    <Suspense
      fallback={
        <div className="h-screen w-full flex items-center justify-center bg-gradient-to-b from-blue-500 to-blue-700">
          <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
        </div>
      }
    >
      <WeatherPage />
    </Suspense>
  );
}

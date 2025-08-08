import Home from "~/home/page";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Ứng dụng Việt - Nền tảng ứng dụng đa năng cho người Việt" },
    {
      name: "description",
      content:
        "Ứng dụng Việt là nền tảng tổng hợp các tiện ích, công cụ, ứng dụng miễn phí và hữu ích dành riêng cho người Việt. Khám phá, trải nghiệm và sử dụng các app chất lượng, an toàn, phù hợp với nhu cầu hàng ngày của bạn.",
    },
    {
      name: "keywords",
      content:
        "ứng dụng việt, tiện ích việt nam, app miễn phí, công cụ online, ứng dụng hữu ích, app cho người việt, appvn, ứng dụng đa năng, tiện ích online, ứng dụng chất lượng, ứng dụng an toàn, ứng dụng hay, app mobile, app web, app tiện ích, app giáo dục, app giải trí, app công việc, app học tập, app sức khỏe, app đời sống",
    },
    { name: "author", content: "Ứng dụng Việt" },
    {
      name: "robots",
      content:
        "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
    },
    {
      name: "viewport",
      content:
        "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover",
    },
    { name: "theme-color", content: "#ffffff" },
    { name: "apple-mobile-web-app-capable", content: "yes" },
    {
      name: "apple-mobile-web-app-status-bar-style",
      content: "black-translucent",
    },
    { name: "apple-mobile-web-app-title", content: "Ứng dụng Việt" },
    { name: "format-detection", content: "telephone=no" },
    { name: "mobile-web-app-capable", content: "yes" },
    { name: "msapplication-tap-highlight", content: "no" },

    // Open Graph tags
    {
      property: "og:title",
      content: "Ứng dụng Việt - Nền tảng ứng dụng đa năng cho người Việt",
    },
    {
      property: "og:description",
      content:
        "Khám phá và trải nghiệm các tiện ích hữu ích cho người Việt. Hoàn toàn miễn phí với nhiều ứng dụng thú vị, an toàn và chất lượng.",
    },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://appvn.vn" },
    { property: "og:image", content: "https://appvn.vn/og-image.jpg" },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:image:type", content: "image/jpeg" },
    {
      property: "og:image:alt",
      content: "Ứng dụng Việt - Nền tảng ứng dụng đa năng cho người Việt",
    },
    { property: "og:site_name", content: "Ứng dụng Việt" },
    { property: "og:locale", content: "vi_VN" },

    // Twitter Card tags
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:site", content: "@appvn" },
    { name: "twitter:creator", content: "@appvn" },
    {
      name: "twitter:title",
      content: "Ứng dụng Việt - Nền tảng ứng dụng đa năng cho người Việt",
    },
    {
      name: "twitter:description",
      content:
        "Khám phá và trải nghiệm các tiện ích hữu ích cho người Việt. Hoàn toàn miễn phí với nhiều ứng dụng thú vị, an toàn và chất lượng.",
    },
    { name: "twitter:image", content: "https://appvn.vn/og-image.jpg" },
    {
      name: "twitter:image:alt",
      content: "Ứng dụng Việt - Nền tảng ứng dụng đa năng cho người Việt",
    },

    // Additional SEO tags
    { rel: "canonical", href: "https://appvn.vn" },
    { name: "language", content: "vi" },
    { name: "geo.region", content: "VN" },
    { name: "geo.placename", content: "Việt Nam" },
    { name: "geo.position", content: "21.0285;105.8542" }, // Hà Nội
    { name: "ICBM", content: "21.0285, 105.8542" },
    { name: "distribution", content: "global" },
    { name: "rating", content: "general" },
    { name: "copyright", content: "© 2024 Ứng dụng Việt" },
    { name: "publisher", content: "Ứng dụng Việt" },
    { name: "referrer", content: "origin-when-cross-origin" },
    // Social
    { property: "fb:app_id", content: "1234567890" },
    {
      property: "article:author",
      content: "https://www.facebook.com/vungocoder/",
    },
    {
      property: "article:publisher",
      content: "https://www.facebook.com/vungocoder/",
    },
    { property: "zalo:app_id", content: "0969872363" },
    { property: "zalo:app_name", content: "Ứng dụng Việt" },
    {
      property: "zalo:title",
      content: "Ứng dụng Việt - Nền tảng ứng dụng đa năng cho người Việt",
    },
    {
      property: "zalo:description",
      content:
        "Khám phá và trải nghiệm các tiện ích hữu ích cho người Việt. Hoàn toàn miễn phí!",
    },
    { property: "zalo:image", content: "https://appvn.vn/og-image.jpg" },
    { property: "zalo:type", content: "website" },
  ];
}

export default function HomePage() {
  return <Home />;
}

import CalendarPage from "~/calendar/page";

export function meta({}: any) {
  return [
    { title: "Ghi chú - Ứng dụng Việt" },
    {
      name: "description",
      content:
        "Ứng dụng ghi chú đơn giản và tiện lợi. Tạo, chỉnh sửa và quản lý các ghi chú của bạn một cách dễ dàng.",
    },
    {
      name: "keywords",
      content:
        "ghi chú, note, ứng dụng ghi chú, quản lý ghi chú, ghi chú online, note app",
    },
    { name: "author", content: "Ứng dụng Việt" },
    {
      name: "robots",
      content:
        "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
    },
    { name: "theme-color", content: "#ffffff" },
    // Open Graph tags
    { property: "og:title", content: "Ghi chú - Ứng dụng Việt" },
    {
      property: "og:description",
      content:
        "Ứng dụng ghi chú đơn giản và tiện lợi. Tạo, chỉnh sửa và quản lý các ghi chú của bạn một cách dễ dàng.",
    },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://appvn.vn/note" },
    {
      property: "og:image",
      content:
        "https://img.freepik.com/free-vector/note-taking-concept-illustration_114360-1238.jpg",
    },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:image:type", content: "image/jpeg" },
    {
      property: "og:image:alt",
      content: "Ứng dụng ghi chú trực tuyến",
    },
    { property: "og:site_name", content: "Ứng dụng Việt" },
    { property: "og:locale", content: "vi_VN" },
    // Twitter Card tags
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:site", content: "@appvn" },
    { name: "twitter:creator", content: "@appvn" },
    { name: "twitter:title", content: "Ghi chú - Ứng dụng Việt" },
    {
      name: "twitter:description",
      content:
        "Ứng dụng ghi chú đơn giản và tiện lợi. Tạo, chỉnh sửa và quản lý các ghi chú của bạn một cách dễ dàng.",
    },
    {
      name: "twitter:image",
      content:
        "https://img.freepik.com/free-vector/note-taking-concept-illustration_114360-1238.jpg",
    },
    {
      name: "twitter:image:alt",
      content: "Ứng dụng ghi chú trực tuyến",
    },
    // Canonical
    { rel: "canonical", href: "https://appvn.vn/note" },
  ];
}

export default function NoteRoute() {
  return <CalendarPage />;
}

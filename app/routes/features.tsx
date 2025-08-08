import React from "react";
import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { CustomButton } from "~/components/CustomButton";

export function meta({}: any) {
  return [
    { title: "Tính năng - Ứng dụng Việt" },
    {
      name: "description",
      content:
        "Khám phá các tính năng đa dạng và hữu ích của Ứng dụng Việt. Từ trò chơi giải trí đến tiện ích công việc, tất cả đều được thiết kế cho người Việt.",
    },
    {
      name: "keywords",
      content:
        "tính năng, features, ứng dụng việt, tiện ích, công cụ, tính năng app, app features",
    },
    { name: "author", content: "Ứng dụng Việt" },
    {
      name: "robots",
      content:
        "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
    },
    { name: "theme-color", content: "#ffffff" },
    // Open Graph tags
    { property: "og:title", content: "Tính năng - Ứng dụng Việt" },
    {
      property: "og:description",
      content:
        "Khám phá các tính năng đa dạng và hữu ích của Ứng dụng Việt. Từ trò chơi giải trí đến tiện ích công việc, tất cả đều được thiết kế cho người Việt.",
    },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://appvn.vn/features" },
    {
      property: "og:image",
      content:
        "https://img.freepik.com/free-vector/features-concept-illustration_114360-1246.jpg",
    },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:image:type", content: "image/jpeg" },
    {
      property: "og:image:alt",
      content: "Tính năng đa dạng của Ứng dụng Việt",
    },
    { property: "og:site_name", content: "Ứng dụng Việt" },
    { property: "og:locale", content: "vi_VN" },
    // Twitter Card tags
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:site", content: "@appvn" },
    { name: "twitter:creator", content: "@appvn" },
    { name: "twitter:title", content: "Tính năng - Ứng dụng Việt" },
    {
      name: "twitter:description",
      content:
        "Khám phá các tính năng đa dạng và hữu ích của Ứng dụng Việt. Từ trò chơi giải trí đến tiện ích công việc, tất cả đều được thiết kế cho người Việt.",
    },
    {
      name: "twitter:image",
      content:
        "https://img.freepik.com/free-vector/features-concept-illustration_114360-1246.jpg",
    },
    {
      name: "twitter:image:alt",
      content: "Tính năng đa dạng của Ứng dụng Việt",
    },
    // Canonical
    { rel: "canonical", href: "https://appvn.vn/features" },
  ];
}

const FeaturesPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="  min-h-screen p-4">
      <div className="flex items-center mb-6">
        <button
          title="Quay lại"
          onClick={() => navigate(-1)}
          className="mr-4 p-2 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold">Tính năng</h1>
      </div>

      <div className="text-center py-10">
        <div className="mb-6 flex justify-center">
          <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
            <span className="font-bold text-indigo-500">F</span>
          </div>
        </div>
        <h2 className="text-xl font-semibold mb-4">
          Trang tính năng sẽ xuất hiện ở đây
        </h2>
        <p className="text-gray-600 mb-6">Trang này đang được phát triển</p>
        <CustomButton variant="primary" onClick={() => navigate("/")}>
          Quay lại trang chủ
        </CustomButton>
      </div>
    </div>
  );
};

export default FeaturesPage;

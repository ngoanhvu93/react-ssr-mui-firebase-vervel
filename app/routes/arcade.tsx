import React from "react";
import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { CustomButton } from "~/components/CustomButton";
import type { Route } from "./+types/arcade";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Arcade - Ứng dụng Việt" },
    {
      name: "description",
      content:
        "Khu vực Arcade - Nơi tập trung các trò chơi giải trí thú vị và hấp dẫn. Khám phá và trải nghiệm các game đa dạng dành cho người Việt.",
    },
    {
      name: "keywords",
      content:
        "arcade, trò chơi arcade, game giải trí, trò chơi việt, game online, giải trí",
    },
    { name: "author", content: "Ứng dụng Việt" },
    {
      name: "robots",
      content:
        "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
    },
    { name: "theme-color", content: "#ffffff" },
    // Open Graph tags
    { property: "og:title", content: "Arcade - Ứng dụng Việt" },
    {
      property: "og:description",
      content:
        "Khu vực Arcade - Nơi tập trung các trò chơi giải trí thú vị và hấp dẫn. Khám phá và trải nghiệm các game đa dạng dành cho người Việt.",
    },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://appvn.vn/arcade" },
    {
      property: "og:image",
      content:
        "https://img.freepik.com/free-vector/arcade-game-concept-illustration_114360-1236.jpg",
    },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:image:type", content: "image/jpeg" },
    {
      property: "og:image:alt",
      content: "Khu vực Arcade - Trò chơi giải trí Việt Nam",
    },
    { property: "og:site_name", content: "Ứng dụng Việt" },
    { property: "og:locale", content: "vi_VN" },
    // Twitter Card tags
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:site", content: "@appvn" },
    { name: "twitter:creator", content: "@appvn" },
    { name: "twitter:title", content: "Arcade - Ứng dụng Việt" },
    {
      name: "twitter:description",
      content:
        "Khu vực Arcade - Nơi tập trung các trò chơi giải trí thú vị và hấp dẫn. Khám phá và trải nghiệm các game đa dạng dành cho người Việt.",
    },
    {
      name: "twitter:image",
      content:
        "https://img.freepik.com/free-vector/arcade-game-concept-illustration_114360-1236.jpg",
    },
    {
      name: "twitter:image:alt",
      content: "Khu vực Arcade - Trò chơi giải trí Việt Nam",
    },
    // Canonical
    { rel: "canonical", href: "https://appvn.vn/arcade" },
  ];
}

const ArcadePage: React.FC = () => {
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
        <h1 className="text-2xl font-bold">Arcade</h1>
      </div>

      <div className="text-center py-10">
        <div className="mb-6 flex justify-center">
          <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
            <span className="font-bold text-indigo-500">A</span>
          </div>
        </div>
        <h2 className="text-xl font-semibold mb-4">
          Khu vực Arcade sẽ xuất hiện ở đây
        </h2>
        <p className="text-gray-600 mb-6">Trang này đang được phát triển</p>
        <CustomButton variant="primary" onClick={() => navigate("/")}>
          Quay lại trang chủ
        </CustomButton>
      </div>
    </div>
  );
};

export default ArcadePage;

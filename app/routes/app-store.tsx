import { useState } from "react";
import type { Route } from "./+types/app-store";
import { BottomAppBar } from "~/components/BottomAppBar";
import { AppCard } from "~/components/AppCard";
import { AppCollection } from "~/components/AppCollection";
import { FeaturedAppCard } from "~/components/FeaturedAppCard";
import { TopAppBar } from "~/components/TopAppBar";
import { AppStoreSkeleton } from "~/components/Skeletons";
import { format } from "date-fns/format";
import { v4 as uuidv4 } from "uuid";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "App Store - Ứng dụng Việt" },
    {
      name: "description",
      content:
        "Khám phá và tải về các ứng dụng hữu ích, trò chơi thú vị và tiện ích chất lượng dành cho người Việt. Hoàn toàn miễn phí!",
    },
    {
      name: "keywords",
      content:
        "app store, ứng dụng việt, tải app, ứng dụng miễn phí, trò chơi việt, tiện ích online, app chất lượng",
    },
    { name: "author", content: "Ứng dụng Việt" },
    {
      name: "robots",
      content:
        "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
    },
    { name: "theme-color", content: "#ffffff" },
    // Open Graph tags
    { property: "og:title", content: "App Store - Ứng dụng Việt" },
    {
      property: "og:description",
      content:
        "Khám phá và tải về các ứng dụng hữu ích, trò chơi thú vị và tiện ích chất lượng dành cho người Việt. Hoàn toàn miễn phí!",
    },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://appvn.vn/app-store" },
    {
      property: "og:image",
      content:
        "https://img.freepik.com/free-vector/app-store-banner_33099-168.jpg",
    },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:image:type", content: "image/jpeg" },
    {
      property: "og:image:alt",
      content: "App Store - Kho ứng dụng Việt Nam",
    },
    { property: "og:site_name", content: "Ứng dụng Việt" },
    { property: "og:locale", content: "vi_VN" },
    // Twitter Card tags
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:site", content: "@appvn" },
    { name: "twitter:creator", content: "@appvn" },
    { name: "twitter:title", content: "App Store - Ứng dụng Việt" },
    {
      name: "twitter:description",
      content:
        "Khám phá và tải về các ứng dụng hữu ích, trò chơi thú vị và tiện ích chất lượng dành cho người Việt. Hoàn toàn miễn phí!",
    },
    {
      name: "twitter:image",
      content:
        "https://img.freepik.com/free-vector/app-store-banner_33099-168.jpg",
    },
    {
      name: "twitter:image:alt",
      content: "App Store - Kho ứng dụng Việt Nam",
    },
    // Canonical
    { rel: "canonical", href: "https://appvn.vn/app-store" },
  ];
}

const AppStore = () => {
  const [isLoading, setIsLoading] = useState(false);

  // Featured app data
  const featuredApps = [
    {
      id: uuidv4(),
      title: "Ghi Điểm Đánh Bài",
      subtitle: "ỨNG DỤNG MỚI",
      imageUrl:
        "https://topgamebaidoithuong.org/wp-content/uploads/2024/12/word-image-11901-2.png",
      tagline: "Ghi điểm dễ dàng, không cần giấy bút",
      to: "/join-thirteen-card-room",
      actionLabel: "MỞ",
    },
    {
      id: uuidv4(),
      title: "Loto Việt",
      subtitle: "PHÁT HÀNH MỚI",
      imageUrl:
        "https://csniort.centres-sociaux.fr/files/2023/07/18-Aout-bingo-loto-1-1024x768.jpg",
      tagline: "Trải nghiệm lô tô Việt Nam đậm chất dân gian, kết nối bạn bè",
      to: "/join-lotto-room",
      actionLabel: "MỞ",
    },
  ];

  // Top games data
  const topGames = [
    {
      id: uuidv4(),
      title: "Loto Việt",
      developer: "Vu Ngo",
      category: "Trò chơi",
      icon: (
        <img
          src="https://cdn-icons-png.freepik.com/512/6768/6768828.png"
          alt="Loto Việt"
          className="w-full h-full bg-red-500"
        />
      ),
      rating: 4.7,
      action: "MỞ",
      to: "/join-lotto-room",
    },
    {
      id: uuidv4(),
      title: "Tiến Lên Miền Nam",
      developer: "Vu Ngo",
      category: "Trò chơi",
      icon: (
        <img
          src="https://play-lh.googleusercontent.com/GrK0gOhlTnBdd-8gG3MbuPedQMqrexVQHP8TjsqJGdIPpg56sPKBCpksrT8orAehYJM=w240-h480-rw"
          alt="Tiến Lên Miền Nam"
          className="w-full h-full"
        />
      ),
      rating: 4.9,
      action: "MỞ",
      to: "/join-thirteen-card-room",
    },
  ];

  // Top apps data
  const topApps = [
    {
      id: uuidv4(),
      title: "Quản Lý Tài Chính",
      developer: "Vu Ngo",
      category: "Tài chính",
      icon: (
        <img
          src="https://cdn.vectorstock.com/i/500p/91/65/flat-wallet-with-card-and-cash-long-shadow-vector-3269165.jpg"
          alt="Tài Chính"
          className="w-full h-full"
        />
      ),
      rating: 4.5,
      action: "MỞ",
      isNew: true,
    },
    {
      id: uuidv4(),
      title: "Đọc Sách",
      developer: "Vu Ngo",
      category: "Giáo dục",
      icon: (
        <img
          src="https://img.freepik.com/premium-photo/books-are-source-inspiration-imagination-ai-generated_47726-10581.jpg"
          alt="Đọc Sách"
          className="w-full h-full"
        />
      ),
      rating: 4.6,
      action: "MỞ",
    },
    {
      id: uuidv4(),
      title: "Sổ Tay Sức Khỏe",
      developer: "Vu Ngo",
      category: "Sức khỏe",
      icon: (
        <img
          src="https://img.freepik.com/free-vector/hand-drawn-flat-design-stack-books_23-2149322346.jpg?semt=ais_hybrid&w=740"
          alt="Sức Khỏe"
          className="w-full h-full"
        />
      ),
      rating: 4.4,
      action: "MỞ",
    },
  ];

  return (
    <div className="w-full flex flex-col mx-auto max-w-4xl">
      <TopAppBar
        title={
          <div className="flex items-center gap-2">
            <div>Hôm nay</div>
            <span className="text-gray-500 text-sm">
              {format(new Date(), "dd/MM")}
            </span>
          </div>
        }
      />
      <div className="flex flex-col items-center p-4 w-full mx-auto ">
        <div className="w-full">
          {isLoading ? (
            <AppStoreSkeleton />
          ) : (
            <div className="w-full">
              {/* Featured App Banner */}
              <div className="mb-8">
                <div className="grid grid-cols-1 gap-4">
                  {featuredApps.map((app) => (
                    <FeaturedAppCard
                      key={app.id}
                      id={app.id}
                      title={app.title}
                      subtitle={app.subtitle}
                      imageUrl={app.imageUrl}
                      tagline={app.tagline}
                      to={app.to}
                      actionLabel={app.actionLabel}
                    />
                  ))}
                </div>
              </div>

              {/* Top Games Collection */}
              <AppCollection
                title="Trò chơi hàng đầu"
                subtitle="Các trò chơi phổ biến nhất trên App Việt"
                viewAllLink="/games"
              >
                {topGames.map((game) => (
                  <AppCard
                    key={game.id}
                    id={game.id}
                    icon={game.icon}
                    title={game.title}
                    developer={game.developer}
                    category={game.category}
                    rating={game.rating}
                    action={game.action as any}
                    to={game.to}
                  />
                ))}
              </AppCollection>

              {/* Top Apps Collection */}
              <AppCollection
                title="Ứng dụng hàng đầu"
                subtitle="Các ứng dụng phổ biến nhất trên App Việt"
                viewAllLink="/apps"
              >
                {topApps.map((app) => (
                  <AppCard
                    key={app.id}
                    id={app.id}
                    icon={app.icon}
                    title={app.title}
                    developer={app.developer}
                    category={app.category}
                    rating={app.rating}
                    action={app.action as any}
                    isNew={app.isNew}
                  />
                ))}
              </AppCollection>
            </div>
          )}
        </div>
      </div>
      <BottomAppBar />
    </div>
  );
};

export default AppStore;

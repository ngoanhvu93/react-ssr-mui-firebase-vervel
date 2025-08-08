import React, { useState, useEffect } from "react";
import { BottomAppBar } from "~/components/BottomAppBar";
import { AppCard } from "~/components/AppCard";
import { AppCollection } from "~/components/AppCollection";
import { FeaturedAppCard } from "~/components/FeaturedAppCard";
import { TopAppBar } from "~/components/TopAppBar";
import { v4 as uuidv4 } from "uuid";
import {
  FeaturedAppCardSkeleton,
  AppCollectionSkeleton,
} from "~/components/Skeletons";

const AppsPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  // Featured app data
  const featuredApp = {
    id: uuidv4(),
    title: "Đếm Ngược",
    subtitle: "ỨNG DỤNG ĐƯỢC ĐỀ XUẤT",
    imageUrl:
      "https://cdn2.tuoitre.vn/471584752817336320/2023/1/1/phao-hoa-tphcm-1-1672510710935144328982.jpg",
    tagline:
      "Đếm ngược các ngày lễ Việt Nam, và các sự kiện quan trọng của bạn",
    to: "/count-down?from=home",
    actionLabel: "MỞ",
  };

  // Top apps data
  const topApps = [
    {
      id: uuidv4(),
      title: "Đếm Ngược",
      developer: "Vu Ngo",
      category: "Tiện ích",
      icon: (
        <img
          src="https://cdn.shopify.com/app-store/listing_images/66270766aace8fc2180cd3c227e5d6f9/icon/CMr3o62O6IkDEAE=.png"
          alt="Đếm Ngược"
          className="w-full h-full object-cover"
        />
      ),
      rating: 4.8,
      action: "MỞ",
      to: "/count-down?from=home",
    },

    {
      id: uuidv4(),
      title: "Lô Tô Việt",
      developer: "Vu Ngo",
      category: "Trò chơi",
      icon: (
        <img
          src="https://cdn-icons-png.flaticon.com/512/6768/6768828.png"
          alt="Loto Việt"
          className="w-full h-full object-cover bg-red-500"
        />
      ),
      rating: 4.8,
      action: "MỞ",
      to: "/join-lotto-room?from=home",
    },

    {
      id: uuidv4(),
      title: "Ghi Điểm Bài Tiến Lên",
      developer: "Vu Ngo",
      category: "Tiện ích",
      icon: (
        <img
          src="https://play-lh.googleusercontent.com/GrK0gOhlTnBdd-8gG3MbuPedQMqrexVQHP8TjsqJGdIPpg56sPKBCpksrT8orAehYJM=w240-h480-rw"
          alt="Ghi Điểm Bài Tiến Lên"
          className="w-full h-full"
        />
      ),
      rating: 4.8,
      action: "MỞ",
      to: "/join-thirteen-card-room?from=home",
    },
    {
      id: uuidv4(),
      title: "Quản Lý Gải Đấu Bóng Đá",
      developer: "Vu Ngo",
      category: "Tiện ích",
      icon: (
        <img
          src="https://img.freepik.com/premium-vector/soccer-tournament-design-with-illustration-soccer-ball-cup_1302-18127.jpg"
          alt="Quản Lý Gải Đấu Bóng Đá"
          className="w-full h-full"
        />
      ),
      rating: 4.8,
      action: "MỞ",
      to: "/join-tournament?from=home",
    },

    {
      id: uuidv4(),
      title: "DuoCards",
      developer: "Vu Ngo",
      category: "Giáo dục",
      icon: (
        <img
          src="https://img.freepik.com/free-vector/hand-drawn-flat-design-stack-books_23-2149322346.jpg?semt=ais_hybrid&w=740"
          alt="Sức Khỏe"
          className="w-full h-full"
        />
      ),
      rating: 4.4,
      action: "MỞ",
      to: "/flash-cards?from=home",
    },
  ];

  // Free apps data
  const freeApps = [
    {
      id: uuidv4(),
      title: "Đọc Sách",
      developer: "Vu Ngo",
      category: "Giáo dục",
      icon: (
        <img
          src="https://img.freepik.com/premium-photo/books-are-source-inspiration-imagination-ai-generated_47726-10581.jpg"
          alt="Đọc Sách"
          className="w-full h-full object-cover"
        />
      ),
      rating: 4.6,
      action: "MỞ",
    },
    {
      id: uuidv4(),
      title: "Nhạc Việt",
      developer: "Vu Ngo",
      category: "Âm nhạc",
      icon: (
        <img
          src="https://cdn.dribbble.com/userupload/36517259/file/original-2fe79a73f6ad2834c5641357288fe5dd.jpg?resize=400x0"
          alt="Nhạc Việt"
          className="w-full h-full object-cover"
        />
      ),
      rating: 4.7,
      action: "MỞ",
    },
    {
      id: uuidv4(),
      title: "Ghi Chú",
      developer: "Vu Ngo",
      category: "Tiện ích",
      icon: (
        <img
          src="https://cdn.dribbble.com/userupload/36551899/file/original-301dbd7522ac64fb5b3f4d59eb3eee34.jpg?resize=400x0"
          alt="Ghi Chú"
          className="w-full h-full object-cover"
        />
      ),
      rating: 4.5,
      action: "MỞ",
    },
  ];

  // Productivity apps
  const productivityApps = [
    {
      id: uuidv4(),
      title: "Lịch Việt",
      developer: "Vu Ngo",
      category: "Tiện ích",
      icon: (
        <img
          src="https://voidtech.net/images/calendar_color_picker/Calendar%20Color%20Picker%20Icon%20Large%20Clear.png"
          alt="Lịch Việt"
          className="w-full h-full"
        />
      ),
      rating: 4.8,
      action: "MỞ",
    },
    {
      id: uuidv4(),
      title: "Quản Lý Công Việc",
      developer: "Vu Ngo",
      category: "Hiệu suất",
      icon: (
        <img
          src="https://is5-ssl.mzstatic.com/image/thumb/Purple115/v4/a6/55/f2/a655f2a6-5763-4698-e177-68d36782daba/source/256x256bb.jpg"
          alt="Công Việc"
          className="w-full h-full"
        />
      ),
      rating: 4.7,
      action: "MỞ",
    },
    {
      id: uuidv4(),
      title: "Thời Tiết",
      developer: "Vu Ngo",
      category: "Tiện ích",
      icon: (
        <img
          src="https://cdn-icons-png.flaticon.com/512/4814/4814268.png"
          alt="Thời Tiết"
          className="w-full h-full object-cover"
        />
      ),
      rating: 4.9,
      action: "MỞ",
      to: "/weather",
    },
  ];

  return (
    <div className="w-full flex flex-col mx-auto max-w-4xl">
      <TopAppBar title="Ứng dụng" />

      <div className="flex flex-col items-center p-4 w-full mx-auto ">
        {/* Loading state */}
        {isLoading ? (
          <div className="w-full">
            {/* Featured App Skeleton */}
            <div className="mb-8">
              <FeaturedAppCardSkeleton />
            </div>

            {/* Top Apps Skeleton */}
            <AppCollectionSkeleton />

            {/* Free Apps Skeleton */}
            <AppCollectionSkeleton />

            {/* Productivity Apps Skeleton */}
            <AppCollectionSkeleton />
          </div>
        ) : (
          /* Scrollable content area */
          <div className="w-full">
            {/* Featured App Banner */}
            <div className="mb-8">
              <FeaturedAppCard
                id={featuredApp.id}
                title={featuredApp.title}
                subtitle={featuredApp.subtitle}
                imageUrl={featuredApp.imageUrl}
                tagline={featuredApp.tagline}
                to={featuredApp.to}
                actionLabel={featuredApp.actionLabel}
              />
            </div>

            {/* Top Apps */}
            <div className="mb-8">
              <AppCollection
                title="Ứng dụng hàng đầu"
                subtitle="Các ứng dụng phổ biến nhất trên App Việt"
                viewAllLink="/apps/top"
                horizontal={false}
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
                    to={app.to}
                  />
                ))}
              </AppCollection>
            </div>

            {/* Free Apps */}
            <div className="mb-8">
              <AppCollection
                title="Ứng dụng miễn phí"
                subtitle="Các ứng dụng miễn phí chất lượng cao"
                viewAllLink="/apps/free"
                horizontal={false}
              >
                {freeApps.map((app) => (
                  <AppCard
                    key={app.id}
                    id={app.id}
                    icon={app.icon}
                    title={app.title}
                    developer={app.developer}
                    category={app.category}
                    rating={app.rating}
                    action={app.action as any}
                  />
                ))}
              </AppCollection>
            </div>

            {/* Productivity Apps */}
            <div className="mb-8">
              <AppCollection
                title="Nâng cao hiệu suất"
                subtitle="Các ứng dụng giúp bạn làm việc hiệu quả"
                viewAllLink="/apps/productivity"
                horizontal={false}
              >
                {productivityApps.map((app) => (
                  <AppCard
                    key={app.id}
                    id={app.id}
                    icon={app.icon}
                    title={app.title}
                    developer={app.developer}
                    category={app.category}
                    rating={app.rating}
                    action={app.action as any}
                    to={app.to}
                  />
                ))}
              </AppCollection>
            </div>
          </div>
        )}
      </div>
      <BottomAppBar />
    </div>
  );
};

export default AppsPage;

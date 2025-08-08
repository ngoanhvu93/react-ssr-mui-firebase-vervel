import React, { useState } from "react";
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

// Types for our game data
interface GameData {
  featuredGame: {
    id: string;
    title: string;
    subtitle: string;
    imageUrl: string;
    tagline: string;
    to: string;
    actionLabel: string;
  };
  popularGames: Array<{
    id: string;
    title: string;
    developer: string;
    category: string;
    icon: React.ReactNode;
    rating: number;
    action: "NHẬN" | "MỞ" | "MUA";
    to?: string;
    isFeatured?: boolean;
  }>;
  newGames: Array<{
    id: string;
    title: string;
    developer: string;
    category: string;
    icon: React.ReactNode;
    rating: number;
    action: "NHẬN" | "MỞ" | "MUA";
    isNew?: boolean;
  }>;
  mustPlayGames: Array<{
    id: string;
    title: string;
    developer: string;
    category: string;
    icon: React.ReactNode;
    rating: number;
    action: "NHẬN" | "MỞ" | "MUA";
  }>;
}

const Games: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const gameData: GameData = {
    featuredGame: {
      id: uuidv4(),
      title: "Lô tô Việt",
      subtitle: "TRÒ CHƠI ĐƯỢC ĐỀ XUẤT",
      imageUrl:
        "https://csniort.centres-sociaux.fr/files/2023/07/18-Aout-bingo-loto-1-1024x768.jpg",
      tagline: "Trải nghiệm lô tô Việt Nam đậm chất dân gian, kết nối bạn bè",
      to: "/join-lotto-room?from=games",
      actionLabel: "MỞ",
    },
    popularGames: [
      {
        id: uuidv4(),
        title: "Lô tô Việt",
        developer: "Vu Ngo",
        category: "Trò chơi dân gian",
        icon: (
          <img
            src="https://cdn-icons-png.freepik.com/512/6768/6768828.png"
            alt="Lô tô Việt"
            className="w-full h-full bg-red-500"
          />
        ),
        rating: 4.9,
        action: "MỞ",
        to: "/join-lotto-room?from=games",
      },
      {
        id: uuidv4(),
        title: "Flappy Bird",
        developer: "Vu Ngo",
        category: "Trò chơi vui nhộn",
        icon: (
          <img
            src="https://cdn-icons-png.flaticon.com/512/6768/6768828.png"
            alt="Flappy Bird"
            className="w-full h-full"
          />
        ),
        rating: 4.9,
        action: "MỞ",
        to: "/flappy-bird",
      },
      {
        id: uuidv4(),
        title: "Thật Hay Thách",
        developer: "Vu Ngo",
        category: "Trò chơi vui nhộn",
        icon: (
          <img
            src="https://cdn-icons-png.flaticon.com/512/6768/6768828.png"
            alt="Thử Thách Ngẫu Nhiên"
            className="w-full h-full"
          />
        ),
        rating: 4.8,
        action: "MỞ",
        to: "/coming-soon?from=games",
        isFeatured: true,
      },
    ],
    newGames: [
      {
        id: uuidv4(),
        title: "Xì Tố",
        developer: "Vu Ngo",
        category: "Trò chơi bài mới",
        icon: (
          <img
            src="https://image.winudf.com/v2/image1/Y29tLmJsaXNzLmtwbGF5LmdhbWViYWkueGl0by54aXBoZV9pY29uXzE2OTYxMTQ3NTZfMDgw/icon.png?w=184&fakeurl=1"
            alt="Xì Tố"
            className="w-full h-full"
          />
        ),
        rating: 4.5,
        action: "MỞ",
        isNew: true,
      },
      {
        id: uuidv4(),
        title: "Caro",
        developer: "Vu Ngo",
        category: "Trò chơi cổ điển",
        icon: (
          <img
            src="https://i.pinimg.com/564x/39/44/70/394470ab186d4c50c8ec329b2b555ea2.jpg"
            alt="Caro"
            className="w-full h-full"
          />
        ),
        rating: 4.6,
        action: "MỞ",
        isNew: true,
      },
      {
        id: uuidv4(),
        title: "Đoán Từ",
        developer: "Vu Ngo",
        category: "Trò chơi trí tuệ",
        icon: (
          <img
            src="https://i.pinimg.com/564x/13/80/d5/1380d50092148938faf8d36739979c05.jpg"
            alt="Đoán Từ"
            className="w-full h-full"
          />
        ),
        rating: 4.4,
        action: "MỞ",
        isNew: true,
      },
    ],
    mustPlayGames: [
      {
        id: uuidv4(),
        title: "Phỏm",
        developer: "Vu Ngo",
        category: "Trò chơi bài",
        icon: (
          <img
            src="https://play-lh.googleusercontent.com/00WNehix9TSJS2pzf-02ZoL_f_1IAMUCj3utWkOV5yaWJalFMyXrNbekkb2aaE69cgg"
            alt="Phỏm"
            className="w-full h-full object-cover"
          />
        ),
        rating: 4.7,
        action: "MỞ",
      },
      {
        id: uuidv4(),
        title: "Mậu Binh",
        developer: "Vu Ngo",
        category: "Trò chơi bài",
        icon: (
          <img
            src="https://play-lh.googleusercontent.com/iOaE_2XObGhEAzeqOgzNQOMMfFvf_Xhf72B3iY4kjjBc8xtdoeQp6wYOG63-KTs23Lo"
            alt="Mậu Binh"
            className="w-full h-full"
          />
        ),
        rating: 4.8,
        action: "MỞ",
      },
      {
        id: uuidv4(),
        title: "Tá Lả",
        developer: "Vu Ngo",
        category: "Trò chơi bài",
        icon: (
          <img
            src="https://cdn6.aptoide.com/imgs/b/3/2/b328b8485667c84342365ceccc70e147_icon.png"
            alt="Tá Lả"
            className="w-full h-full"
          />
        ),
        rating: 4.6,
        action: "MỞ",
      },
    ],
  };

  return (
    <div className="flex flex-col w-full mx-auto max-w-4xl">
      <TopAppBar title="Trò chơi" />

      <div className="flex flex-col items-center p-4 w-full mx-auto">
        {isLoading ? (
          <div className="w-full">
            <div className="mb-8">
              <FeaturedAppCardSkeleton />
            </div>
            <AppCollectionSkeleton />
            <AppCollectionSkeleton />
            <AppCollectionSkeleton />
          </div>
        ) : (
          <div className="w-full">
            {/* Featured Game Banner */}
            <div className="mb-8">
              <FeaturedAppCard
                id={gameData?.featuredGame.id || ""}
                title={gameData?.featuredGame.title || ""}
                subtitle={gameData?.featuredGame.subtitle || ""}
                imageUrl={gameData?.featuredGame.imageUrl || ""}
                tagline={gameData?.featuredGame.tagline || ""}
                to={gameData?.featuredGame.to || ""}
                actionLabel={gameData?.featuredGame.actionLabel || ""}
              />
            </div>

            {/* Popular Games */}
            <AppCollection
              title="Phổ biến"
              subtitle="Các trò chơi được yêu thích nhất"
              viewAllLink="/games/popular"
              horizontal={false}
            >
              {gameData?.popularGames.map((game) => (
                <AppCard
                  key={game.id}
                  id={game.id}
                  icon={game.icon}
                  title={game.title}
                  developer={game.developer}
                  category={game.category}
                  rating={game.rating}
                  action={game.action}
                  to={game.to}
                  isFeatured={game.isFeatured}
                />
              ))}
            </AppCollection>

            {/* New Games */}
            <AppCollection
              title="Mới phát hành"
              subtitle="Các trò chơi mới nhất trên App Việt"
              viewAllLink="/games/new"
              horizontal={false}
            >
              {gameData?.newGames.map((game) => (
                <AppCard
                  key={game.id}
                  id={game.id}
                  icon={game.icon}
                  title={game.title}
                  developer={game.developer}
                  category={game.category}
                  rating={game.rating}
                  action={game.action}
                  isNew={game.isNew}
                />
              ))}
            </AppCollection>

            {/* Must Play Games */}
            <AppCollection
              title="Không thể bỏ qua"
              subtitle="Các trò chơi đáng chơi nhất"
              viewAllLink="/games/must-play"
              horizontal={false}
            >
              {gameData?.mustPlayGames.map((game) => (
                <AppCard
                  key={game.id}
                  id={game.id}
                  icon={game.icon}
                  title={game.title}
                  developer={game.developer}
                  category={game.category}
                  rating={game.rating}
                  action={game.action}
                />
              ))}
            </AppCollection>
          </div>
        )}
      </div>
      <BottomAppBar />
    </div>
  );
};

export default Games;

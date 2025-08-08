import React, { useState, useEffect } from "react";
import type { Route } from "./+types/search";
import {
  Search,
  X,
  Book,
  AlignLeft,
  Music,
  ShoppingBag,
  Gamepad2,
  Heart,
  Film,
  Flame,
} from "lucide-react";

import { BottomAppBar } from "~/components/BottomAppBar";
import { AppCard } from "~/components/AppCard";
import { AppCollection } from "~/components/AppCollection";
import { CategoryList } from "~/components/CategoryList";
import { TopAppBar } from "~/components/TopAppBar";
import {
  AppCollectionSkeleton,
  CategoryListSkeleton,
} from "~/components/Skeletons";
import { v4 as uuidv4 } from "uuid";
import { IconButton } from "@mui/material";
import TextField from "@mui/material/TextField";
import { InputAdornment } from "@mui/material";

const allApps = [
  {
    id: uuidv4(),
    title: "Ghi Điểm Bài Tiến Lên",
    developer: "Vu Ngo",
    category: "Trò chơi bài",
    icon: (
      <img
        src="https://play-lh.googleusercontent.com/GrK0gOhlTnBdd-8gG3MbuPedQMqrexVQHP8TjsqJGdIPpg56sPKBCpksrT8orAehYJM=w240-h480-rw"
        alt="Tiến Lên Miền Nam"
        className="w-full h-full"
      />
    ),
    rating: 4.9,
    action: "MỞ",
    to: "/join-thirteen-card-room?from=search",
  },
  {
    id: uuidv4(),
    title: "Loto Việt",
    developer: "Vu Ngo",
    category: "Trò chơi dân gian",
    icon: (
      <img
        src="https://cdn-icons-png.flaticon.com/512/6768/6768828.png"
        alt="Loto Việt"
        className="w-full h-full bg-red-500"
      />
    ),
    rating: 4.7,
    action: "MỞ",
    to: "/join-lotto-room?from=search",
  },
  {
    id: uuidv4(),
    title: "Đếm Ngược",
    developer: "Vu Ngo",
    category: "Tiện ích",
    icon: (
      <img
        src="https://cdn.shopify.com/app-store/listing_images/66270766aace8fc2180cd3c227e5d6f9/icon/CMr3o62O6IkDEAE=.png"
        alt="Đếm Ngược"
        className="w-full h-full"
      />
    ),
    rating: 4.8,
    action: "MỞ",
    to: "/count-down?from=search",
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
    to: "/join-tournament?from=search",
  },
  {
    id: uuidv4(),
    title: "Âm Nhạc Dân Gian",
    developer: "Vu Ngo",
    category: "Âm nhạc",
    icon: (
      <img
        src="https://via.placeholder.com/120/6A0DAD/FFFFFF?text=AN"
        alt="Âm Nhạc Dân Gian"
        className="w-full h-full"
      />
    ),
    rating: 4.5,
    action: "MỞ",
    to: "/music-app?from=search",
  },
  {
    id: uuidv4(),
    title: "Truyện Cười Dân Gian",
    developer: "Vu Ngo",
    category: "Sách",
    icon: (
      <img
        src="https://via.placeholder.com/120/FF5733/FFFFFF?text=TC"
        alt="Truyện Cười"
        className="w-full h-full"
      />
    ),
    rating: 4.6,
    action: "MỞ",
    to: "/books-app?from=search",
  },
];

// Categories
const categories = [
  {
    id: uuidv4(),
    name: "Trò chơi",
    icon: <Gamepad2 size={24} />,
    bgColor: "bg-blue-500",
    to: "/games",
  },
  {
    id: uuidv4(),
    name: "Giải trí",
    icon: <Film size={24} />,
    bgColor: "bg-purple-500",
    to: "/entertainment",
  },
  {
    id: uuidv4(),
    name: "Mua sắm",
    icon: <ShoppingBag size={24} />,
    bgColor: "bg-green-500",
    to: "/shopping",
  },
  {
    id: uuidv4(),
    name: "Âm nhạc",
    icon: <Music size={24} />,
    bgColor: "bg-orange-500",
    to: "/music",
  },
  {
    id: uuidv4(),
    name: "Giáo dục",
    icon: <Book size={24} />,
    bgColor: "bg-pink-500",
    to: "/education",
  },
  {
    id: uuidv4(),
    name: "Sách",
    icon: <AlignLeft size={24} />,
    bgColor: "bg-cyan-500",
    to: "/books",
  },
  {
    id: uuidv4(),
    name: "Sức khỏe",
    icon: <Heart size={24} />,
    bgColor: "bg-red-500",
    to: "/health",
  },
  {
    id: uuidv4(),
    name: "Xu hướng",
    icon: <Flame size={24} />,
    bgColor: "bg-yellow-600",
    to: "/trending",
  },
];

// Add this function before the SearchPage component
function removeDiacritics(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

// Add SearchPageSkeleton component
const SearchPageSkeleton: React.FC = () => {
  return (
    <div className="flex bg-gray-50 flex-col h-[100dvh] overflow-hidden max-w-4xl mx-auto">
      <TopAppBar title="Tìm kiếm">
        <div className="relative mt-4">
          <div className="w-full bg-gray-100 rounded-xl py-3 px-10 h-12 animate-pulse"></div>
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300">
            <Search size={20} />
          </div>
        </div>
      </TopAppBar>

      <div className="p-4 grow overflow-y-auto">
        {/* Recent searches skeleton */}
        <div className="mb-8 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-40 mb-3"></div>
          <div className="flex flex-wrap gap-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-full h-9 w-32"></div>
            ))}
          </div>
        </div>

        {/* Suggested Apps */}
        <AppCollectionSkeleton />

        {/* Categories */}
        <CategoryListSkeleton />
      </div>
      <BottomAppBar />
    </div>
  );
};

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Tìm kiếm - Ứng dụng Việt" },
    {
      name: "description",
      content:
        "Tìm kiếm và khám phá các ứng dụng, trò chơi và tiện ích hữu ích dành cho người Việt. Tìm thấy những gì bạn cần một cách nhanh chóng!",
    },
    {
      name: "keywords",
      content:
        "tìm kiếm, search, ứng dụng việt, tìm app, tìm trò chơi, tìm tiện ích, khám phá ứng dụng",
    },
    { name: "author", content: "Ứng dụng Việt" },
    {
      name: "robots",
      content:
        "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
    },
    { name: "theme-color", content: "#ffffff" },
    // Open Graph tags
    { property: "og:title", content: "Tìm kiếm - Ứng dụng Việt" },
    {
      property: "og:description",
      content:
        "Tìm kiếm và khám phá các ứng dụng, trò chơi và tiện ích hữu ích dành cho người Việt. Tìm thấy những gì bạn cần một cách nhanh chóng!",
    },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://appvn.vn/search" },
    {
      property: "og:image",
      content:
        "https://img.freepik.com/free-vector/search-concept-illustration_114360-2017.jpg",
    },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:image:type", content: "image/jpeg" },
    {
      property: "og:image:alt",
      content: "Tìm kiếm ứng dụng và tiện ích Việt Nam",
    },
    { property: "og:site_name", content: "Ứng dụng Việt" },
    { property: "og:locale", content: "vi_VN" },
    // Twitter Card tags
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:site", content: "@appvn" },
    { name: "twitter:creator", content: "@appvn" },
    { name: "twitter:title", content: "Tìm kiếm - Ứng dụng Việt" },
    {
      name: "twitter:description",
      content:
        "Tìm kiếm và khám phá các ứng dụng, trò chơi và tiện ích hữu ích dành cho người Việt. Tìm thấy những gì bạn cần một cách nhanh chóng!",
    },
    {
      name: "twitter:image",
      content:
        "https://img.freepik.com/free-vector/search-concept-illustration_114360-2017.jpg",
    },
    {
      name: "twitter:image:alt",
      content: "Tìm kiếm ứng dụng và tiện ích Việt Nam",
    },
    // Canonical
    { rel: "canonical", href: "https://appvn.vn/search" },
  ];
}

function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showClearButton, setShowClearButton] = useState(false);
  const [searchResults, setSearchResults] = useState<typeof allApps>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Filter apps based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    const normalizedQuery = removeDiacritics(searchQuery);

    const filteredApps = allApps.filter((app) => {
      const normalizedTitle = removeDiacritics(app.title);
      const normalizedDeveloper = removeDiacritics(app.developer);
      const normalizedCategory = removeDiacritics(app.category);

      return (
        normalizedTitle.includes(normalizedQuery) ||
        normalizedDeveloper.includes(normalizedQuery) ||
        normalizedCategory.includes(normalizedQuery)
      );
    });

    setSearchResults(filteredApps);
  }, [searchQuery]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setShowClearButton(query.length > 0);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setShowClearButton(false);
    setIsSearching(false);
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim() !== "") {
      // Add to recent searches if not already there
      if (!recentSearches.includes(searchQuery)) {
        setRecentSearches((prev) => [searchQuery, ...prev].slice(0, 5));
      }
    }
  };

  const handleRecentSearchClick = (query: string) => {
    setSearchQuery(query);
    setShowClearButton(true);
  };

  // Suggested apps data - Just using a subset of allApps
  const suggestedApps = allApps.slice(0, 3);

  if (isLoading) {
    return <SearchPageSkeleton />;
  }

  return (
    <div className="flex flex-col w-full mx-auto max-w-4xl">
      <TopAppBar
        title="Tìm kiếm"
        fullWidth
        fullWidthAction={
          <TextField
            sx={{ fontSize: "12px", fontWeight: "light", width: "100%" }}
            variant="standard"
            placeholder="Ứng dụng, trò chơi..."
            value={searchQuery}
            onChange={handleSearch}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearchSubmit();
              }
            }}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search fontSize="small" />
                </InputAdornment>
              ),
              endAdornment: showClearButton ? (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={clearSearch}
                    aria-label="Clear search"
                    title="Clear search"
                  >
                    <X />
                  </IconButton>
                </InputAdornment>
              ) : null,
            }}
          />
        }
      />

      <div className="flex flex-col items-center p-4 w-full mx-auto grow overflow-y-auto">
        <div className="w-full h-[100dvh]">
          {isSearching ? (
            <div className="w-full">
              {searchResults.length > 0 ? (
                <AppCollection
                  title="Kết quả tìm kiếm"
                  subtitle={`Tìm thấy ${searchResults.length} kết quả cho "${searchQuery}"`}
                >
                  {searchResults.map((app) => (
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
              ) : (
                <div className="flex flex-col items-center h-full justify-center grow py-20">
                  <div className="mb-4">
                    <Search size={48} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    Không tìm thấy kết quả nào
                  </h3>
                  <p className="text-gray-500 text-center">
                    Không tìm thấy kết quả nào cho "{searchQuery}"
                  </p>
                  <p className="text-gray-500 text-center">
                    Thử tìm kiếm với từ khóa khác
                  </p>
                </div>
              )}

              {/* Show category suggestions when search has no results */}
              {searchResults.length === 0 && (
                <CategoryList
                  title="Duyệt theo danh mục"
                  categories={categories}
                />
              )}
            </div>
          ) : (
            <div className="w-full grow flex-1">
              {/* Recent searches */}
              {recentSearches.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-3">
                    Tìm kiếm gần đây
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((query, index) => (
                      <button
                        key={index}
                        onClick={() => handleRecentSearchClick(query)}
                        className="bg-gray-200 hover:bg-gray-300 rounded-full px-4 py-2 text-sm flex items-center"
                      >
                        <Search size={14} className="mr-1" />
                        {query}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggested Apps */}
              <AppCollection title="Đề xuất" subtitle="Ứng dụng nổi bật">
                {suggestedApps.map((app) => (
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

              {/* Categories */}
              <CategoryList
                title="Khám phá theo danh mục"
                categories={categories}
              />
            </div>
          )}
        </div>
      </div>
      <BottomAppBar />
    </div>
  );
}

export default SearchPage;

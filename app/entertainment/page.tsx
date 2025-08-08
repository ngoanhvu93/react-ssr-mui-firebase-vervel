import { useNavigate } from "react-router";
import { TopAppBar } from "~/components/TopAppBar";
import { AppCard } from "~/components/AppCard";
import { AppCollection } from "~/components/AppCollection";
import { FeaturedAppCard } from "~/components/FeaturedAppCard";
import { BottomAppBar } from "~/components/BottomAppBar";
import { v4 as uuidv4 } from "uuid";

export default function EntertainmentPage() {
  const navigate = useNavigate();

  // Featured entertainment app
  const featuredApp = {
    id: uuidv4(),
    title: "Nhạc Việt",
    subtitle: "ỨNG DỤNG GIẢI TRÍ ĐƯỢC ĐỀ XUẤT",
    imageUrl:
      "https://cdn.dribbble.com/userupload/36517259/file/original-2fe79a73f6ad2834c5641357288fe5dd.jpg?resize=400x0",
    tagline: "Khám phá âm nhạc Việt Nam với hàng nghìn bài hát hay nhất",
    to: "/coming-soon?from=entertainment",
    actionLabel: "MỞ",
  };

  // Music apps
  const musicApps = [
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
      to: "/coming-soon?from=entertainment",
    },
    {
      id: uuidv4(),
      title: "Karaoke Online",
      developer: "Vu Ngo",
      category: "Âm nhạc",
      icon: (
        <img
          src="https://img.freepik.com/free-vector/karaoke-microphone-with-music-notes_23-2148864563.jpg"
          alt="Karaoke Online"
          className="w-full h-full object-cover"
        />
      ),
      rating: 4.6,
      action: "MỞ",
      to: "/coming-soon?from=entertainment",
    },
    {
      id: uuidv4(),
      title: "Radio Việt",
      developer: "Vu Ngo",
      category: "Âm nhạc",
      icon: (
        <img
          src="https://img.freepik.com/free-vector/radio-station-concept-illustration_114360-8080.jpg"
          alt="Radio Việt"
          className="w-full h-full object-cover"
        />
      ),
      rating: 4.5,
      action: "MỞ",
      to: "/coming-soon?from=entertainment",
    },
  ];

  // Video apps
  const videoApps = [
    {
      id: uuidv4(),
      title: "Phim Việt",
      developer: "Vu Ngo",
      category: "Video",
      icon: (
        <img
          src="https://img.freepik.com/free-vector/cinema-realistic-composition-with-3d-camera-tripod-clapperboard_1284-66747.jpg"
          alt="Phim Việt"
          className="w-full h-full object-cover"
        />
      ),
      rating: 4.8,
      action: "MỞ",
      to: "/coming-soon?from=entertainment",
    },
    {
      id: uuidv4(),
      title: "TikTok Việt",
      developer: "Vu Ngo",
      category: "Video ngắn",
      icon: (
        <img
          src="https://img.freepik.com/free-vector/social-media-concept-illustration_114360-2157.jpg"
          alt="TikTok Việt"
          className="w-full h-full object-cover"
        />
      ),
      rating: 4.9,
      action: "MỞ",
      to: "/coming-soon?from=entertainment",
    },
    {
      id: uuidv4(),
      title: "YouTube Việt",
      developer: "Vu Ngo",
      category: "Video",
      icon: (
        <img
          src="https://img.freepik.com/free-vector/video-streaming-concept-illustration_114360-1314.jpg"
          alt="YouTube Việt"
          className="w-full h-full object-cover"
        />
      ),
      rating: 4.7,
      action: "MỞ",
      to: "/coming-soon?from=entertainment",
    },
  ];

  // Social media apps
  const socialApps = [
    {
      id: uuidv4(),
      title: "Facebook Việt",
      developer: "Vu Ngo",
      category: "Mạng xã hội",
      icon: (
        <img
          src="https://img.freepik.com/free-vector/social-media-concept-illustration_114360-2157.jpg"
          alt="Facebook Việt"
          className="w-full h-full object-cover"
        />
      ),
      rating: 4.6,
      action: "MỞ",
      to: "/coming-soon?from=entertainment",
    },
    {
      id: uuidv4(),
      title: "Instagram Việt",
      developer: "Vu Ngo",
      category: "Chia sẻ ảnh",
      icon: (
        <img
          src="https://img.freepik.com/free-vector/social-media-concept-illustration_114360-2157.jpg"
          alt="Instagram Việt"
          className="w-full h-full object-cover"
        />
      ),
      rating: 4.5,
      action: "MỞ",
      to: "/coming-soon?from=entertainment",
    },
    {
      id: uuidv4(),
      title: "Zalo",
      developer: "Vu Ngo",
      category: "Nhắn tin",
      icon: (
        <img
          src="https://img.freepik.com/free-vector/messaging-concept-illustration_114360-2157.jpg"
          alt="Zalo"
          className="w-full h-full object-cover"
        />
      ),
      rating: 4.8,
      action: "MỞ",
      to: "/coming-soon?from=entertainment",
    },
  ];

  // Gaming apps
  const gamingApps = [
    {
      id: uuidv4(),
      title: "Lô Tô Việt",
      developer: "Vu Ngo",
      category: "Trò chơi dân gian",
      icon: (
        <img
          src="https://cdn-icons-png.flaticon.com/512/6768/6768828.png"
          alt="Lô Tô Việt"
          className="w-full h-full object-cover bg-red-500"
        />
      ),
      rating: 4.9,
      action: "MỞ",
      to: "/join-lotto-room?from=entertainment",
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
          className="w-full h-full object-cover"
        />
      ),
      rating: 4.8,
      action: "MỞ",
      to: "/game-flappy-bird?from=entertainment",
    },
    {
      id: uuidv4(),
      title: "Ghi Điểm Bài Tiến Lên",
      developer: "Vu Ngo",
      category: "Trò chơi bài",
      icon: (
        <img
          src="https://play-lh.googleusercontent.com/GrK0gOhlTnBdd-8gG3MbuPedQMqrexVQHP8TjsqJGdIPpg56sPKBCpksrT8orAehYJM=w240-h480-rw"
          alt="Ghi Điểm Bài Tiến Lên"
          className="w-full h-full"
        />
      ),
      rating: 4.7,
      action: "MỞ",
      to: "/join-thirteen-card-room?from=entertainment",
    },
  ];

  return (
    <div className="w-full flex flex-col mx-auto max-w-4xl">
      <TopAppBar onBack={() => navigate(-1)} title="Giải trí" />

      <div className="flex flex-col items-center p-4 w-full mx-auto bg-gray-50">
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

          {/* Music Apps */}
          <div className="mb-8">
            <AppCollection
              title="Âm nhạc"
              subtitle="Khám phá âm nhạc Việt Nam"
              viewAllLink="/entertainment/music"
              horizontal={false}
            >
              {musicApps.map((app) => (
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

          {/* Video Apps */}
          <div className="mb-8">
            <AppCollection
              title="Video"
              subtitle="Xem phim và video giải trí"
              viewAllLink="/entertainment/video"
              horizontal={false}
            >
              {videoApps.map((app) => (
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

          {/* Social Media Apps */}
          <div className="mb-8">
            <AppCollection
              title="Mạng xã hội"
              subtitle="Kết nối với bạn bè và gia đình"
              viewAllLink="/entertainment/social"
              horizontal={false}
            >
              {socialApps.map((app) => (
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

          {/* Gaming Apps */}
          <div className="mb-8">
            <AppCollection
              title="Trò chơi"
              subtitle="Giải trí với các trò chơi thú vị"
              viewAllLink="/games"
              horizontal={false}
            >
              {gamingApps.map((app) => (
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
      </div>
      <BottomAppBar />
    </div>
  );
}

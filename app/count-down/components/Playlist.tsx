import { motion } from "framer-motion";

const Playlist = (props: {
  showPlaylist: boolean;
  setShowPlaylist: (show: boolean) => void;
  selectSong: (index: number) => void;
  currentSongIndex: number;
  displayedSongs: any[];
  filteredSongs: any[];
  searchTerm: string;
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  activeCategoryFilter: string | null;
  handleCategoryFilter: (category: string | null) => void;
  getCategoryLabel: (category: string) => string;
  formatTime: (seconds: number) => string;
  categoryMap: Record<string, string>;
}) => {
  const {
    selectSong,
    currentSongIndex,
    displayedSongs,
    filteredSongs,
    searchTerm,
    handleSearch,
    activeCategoryFilter,
    handleCategoryFilter,
    getCategoryLabel,
    formatTime,
    categoryMap,
    setShowPlaylist,
  } = props;
  return (
    <motion.div
      className="fixed inset-0 bg-black/50 z-50"
      onClick={() => setShowPlaylist(false)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="absolute bottom-0 left-0 right-0   rounded-t-2xl p-3 sm:p-4 min-h-[60vh] sm:min-h-[70vh] md:min-h-[80vh] max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
      >
        {/* Fixed handle at top - make it obvious it can be dragged */}
        <div
          className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-3 sm:mb-4 cursor-grab active:cursor-grabbing"
          onTouchStart={(e) => {
            const touchY = e.touches[0].clientY;
            const handleTouch = (e: TouchEvent) => {
              const currentY = e.touches[0].clientY;
              if (currentY - touchY > 50) {
                // If swiped down more than 50px
                setShowPlaylist(false);
                document.removeEventListener("touchmove", handleTouch);
                document.removeEventListener("touchend", handleEnd);
              }
            };

            const handleEnd = () => {
              document.removeEventListener("touchmove", handleTouch);
              document.removeEventListener("touchend", handleEnd);
            };

            document.addEventListener("touchmove", handleTouch);
            document.addEventListener("touchend", handleEnd);
          }}
        />

        {/* Fixed search section */}
        <div className="mb-2 sticky top-0">
          <input
            type="text"
            placeholder="Tìm kiếm bài hát..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/80 focus:border-transparent focus:shadow-[0_0_0_1px_rgba(244,63,94,0.3),0_0_0_4px_rgba(244,63,94,0.15)] transition-all duration-200"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        {/* Add category selector */}
        <div className="mb-3 overflow-x-auto">
          <div className="flex space-x-2 pb-2">
            <button
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium ${
                !activeCategoryFilter
                  ? "bg-red-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => handleCategoryFilter(null)}
            >
              Tất cả
            </button>
            {/* Generate buttons for each category */}
            {Object.entries(categoryMap).map(([key, label]) => (
              <button
                key={key}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium ${
                  activeCategoryFilter === key
                    ? "bg-red-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
                onClick={() => handleCategoryFilter(key)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <h4 className="font-bold text-gray-800 mb-1 sm:mb-2 text-sm sm:text-base">
          Danh sách phát ({displayedSongs.length} bài)
        </h4>

        {/* Scrollable song list */}
        <div className="overflow-y-auto h-[calc(60vh-120px)] sm:h-[calc(70vh-140px)] md:h-[calc(80vh-160px)]">
          {displayedSongs.length > 0 ? (
            <ul className="space-y-0.5 sm:space-y-1 pb-safe">
              {displayedSongs.map((song, index) => (
                <li
                  key={song.id}
                  id={`song-${song.id}`}
                  className={`p-1.5 sm:p-2 rounded ${
                    filteredSongs[currentSongIndex]?.id === song.id
                      ? "bg-red-100 text-red-700"
                      : "hover:bg-gray-100"
                  } cursor-pointer`}
                  onClick={() => selectSong(index)}
                >
                  <div className="flex items-center">
                    <span className="mr-1 sm:mr-2 text-xs sm:text-sm">
                      {index + 1}.
                    </span>
                    <div className="overflow-hidden">
                      <div className="font-medium text-xs sm:text-sm truncate">
                        {song.title}
                      </div>
                      <div className="text-xs text-gray-600 truncate">
                        {song.artist}
                      </div>
                    </div>
                    <span className="ml-2 text-xs px-1.5 py-0.5 bg-gray-100 rounded text-gray-600">
                      {getCategoryLabel(song.category)}
                    </span>
                    <div className="ml-auto text-xs text-gray-500">
                      {formatTime(song.duration)}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="flex flex-col items-center justify-center ">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🔍</span>
                </div>
                <h3 className="text-gray-800 font-medium mb-1">
                  Không tìm thấy bài hát
                </h3>
                <p className="text-gray-600 text-sm">
                  Không có bài hát nào phù hợp.
                  <br />
                  {searchTerm && `Không tìm thấy kết quả cho "${searchTerm}".`}
                </p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Playlist;

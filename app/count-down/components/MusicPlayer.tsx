import { motion } from "framer-motion";
import { ListVideo, Repeat, SkipBack, SkipForward } from "lucide-react";
import { cn } from "~/utils/cn";

export interface Song {
  id: string;
  title: string;
  artist: string;
  file: string;
  duration: number;
  coverImage?: string;
  category: string;
}

const MusicPlayer = (props: {
  filteredSongs: Song[];
  currentSongIndex: number;
  showPlaylist: boolean;
  setShowPlaylist: (showPlaylist: boolean) => void;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  toggleShuffle: () => void;
  isShuffle: boolean;
  toggleRepeat: () => void;
  isRepeat: boolean;
  playPreviousSong: () => void;
  playNextSong: () => void;
  handleTimelineChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  formatTime: (time: number) => string;
  toggleAudio: () => void;
  Pause: React.ElementType;
  Play: React.ElementType;
  Shuffle: React.ElementType;
  SkipForward: React.ElementType;
  Repeat: React.ElementType;
}) => {
  const {
    filteredSongs,
    currentSongIndex,
    showPlaylist,
    setShowPlaylist,
    isPlaying,
    currentTime,
    duration,
    toggleShuffle,
    isShuffle,
    toggleRepeat,
    isRepeat,
    playPreviousSong,
    playNextSong,
    handleTimelineChange,
    formatTime,
    toggleAudio,
    Pause,
    Play,
    Shuffle,
  } = props;
  return (
    <motion.div
      className="w-full max-w-lg my-4 lg:my-5 bg-gradient-to-r from-red-500/30 to-amber-500/30 backdrop-blur-md p-4 mx-auto rounded-2xl shadow-lg border border-white/40 flex-shrink-0"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.5, delay: 1.5 }}
      role="region"
      aria-label="Music Player"
    >
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <motion.div
          className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-red-500 to-amber-500 rounded-lg shadow-md overflow-hidden flex items-center justify-center"
          whileHover={{ scale: 1.05 }}
        >
          <span className="text-xl sm:text-2xl">🎵</span>
        </motion.div>

        <div className="flex-1 ml-3 sm:ml-4 overflow-hidden">
          {filteredSongs.length > 0 && (
            <>
              <h3 className="font-bold text-gray-800 text-sm sm:text-base truncate">
                {filteredSongs[currentSongIndex]?.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-700 truncate">
                {filteredSongs[currentSongIndex]?.artist}
              </p>
            </>
          )}
        </div>

        <button
          title="Playlist"
          className="ml-2 p-1.5 sm:p-2 rounded-full  /30 hover: /50 transition-all"
          onClick={() => setShowPlaylist(!showPlaylist)}
        >
          <ListVideo size={18} className="sm:hidden" />
          <ListVideo size={20} className="hidden sm:block" />
        </button>
      </div>

      <div className="flex items-center justify-center mb-3 sm:mb-4">
        <div className="relative">
          <motion.div
            className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 mx-auto bg-gradient-to-br from-gray-900 to-gray-800 rounded-full shadow-lg overflow-hidden flex items-center justify-center border-4 border-gray-700"
            animate={{
              rotate: isPlaying ? 360 : 0,
            }}
            transition={{
              repeat: isPlaying ? Infinity : 0,
              duration: 3,
              ease: "linear",
            }}
          >
            {/* Lỗ giữa đĩa CD */}
            <div className="w-5 h-5 sm:w-6 sm:h-6   rounded-full border border-gray-400"></div>
            {/* Vòng tròn phản chiếu */}
            {/* <div className="absolute w-28 h-28 sm:w-36 sm:h-36 rounded-full border-2 border-gray-600 opacity-30"></div> */}
            <div className="absolute w-22 h-22 sm:w-28 sm:h-28 rounded-full border-2 border-gray-500 opacity-30"></div>
            <div className="absolute w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-gray-400 opacity-30"></div>

            {/* Phần bìa album nhỏ ở giữa */}
            <div className="absolute w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-red-500 to-amber-500 flex items-center justify-center overflow-hidden">
              <span className="text-lg sm:text-xl">🎵</span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="flex justify-between text-xs text-gray-700">
          <span className="font-medium">{formatTime(currentTime)}</span>
          <span className="font-medium">{formatTime(duration)}</span>
        </div>
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={handleTimelineChange}
          className="w-full h-1.5 sm:h-2 rounded-lg appearance-none cursor-pointer bg-gray-300 accent-red-600"
          aria-label="Audio timeline"
          style={{
            background: `linear-gradient(to right, #e63946 ${
              (currentTime / duration) * 100
            }%, #e5e7eb ${(currentTime / duration) * 100}%)`,
          }}
        />
        <div className="flex items-center justify-between mt-3 sm:mt-4">
          <motion.button
            onClick={toggleShuffle}
            className={cn("text-gray-700", {
              "text-red-500": isShuffle,
            })}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label={isShuffle ? "Disable shuffle" : "Enable shuffle"}
            title={isShuffle ? "Tắt trộn bài" : "Bật trộn bài"}
          >
            <Shuffle size={18} className="sm:hidden" />
            <Shuffle size={20} className="hidden sm:block" />
          </motion.button>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <motion.button
              onClick={playPreviousSong}
              className="text-gray-700 hover:text-red-700 transition-all p-1.5 sm:p-2"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Previous song"
            >
              <SkipBack size={22} className="sm:hidden" />
              <SkipBack size={24} className="hidden sm:block" />
            </motion.button>

            <motion.button
              onClick={toggleAudio}
              className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full ${
                isPlaying ? "bg-red-600" : "bg-amber-600"
              } text-white transition-all hover:brightness-110 shadow-md`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label={isPlaying ? "Pause music" : "Play music"}
            >
              {isPlaying ? (
                <Pause size={20} className="sm:hidden" />
              ) : (
                <Play size={20} className="ml-0.5 sm:hidden" />
              )}
              {isPlaying ? (
                <Pause size={24} className="hidden sm:block" />
              ) : (
                <Play size={24} className="ml-1 hidden sm:block" />
              )}
            </motion.button>

            <motion.button
              onClick={playNextSong}
              className="text-gray-700 hover:text-red-700 transition-all p-1.5 sm:p-2"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Next song"
            >
              <SkipForward size={22} className="sm:hidden" />
              <SkipForward size={24} className="hidden sm:block" />
            </motion.button>
          </div>

          <motion.button
            onClick={toggleRepeat}
            className={cn("text-gray-700 -1.5 sm:p-2", {
              "text-red-500": isRepeat,
            })}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label={isRepeat ? "Disable repeat" : "Enable repeat"}
          >
            <Repeat size={18} className="sm:hidden" />
            <Repeat size={20} className="hidden sm:block" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default MusicPlayer;

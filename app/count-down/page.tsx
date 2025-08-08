import { useEffect, useState, useRef } from "react";
import confetti from "canvas-confetti";
import {
  Play,
  Pause,
  SkipForward,
  Repeat,
  Calendar,
  Shuffle,
  Loader,
  Plus,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CountdownTimer, { type EventType } from "./components/CountdownTimer";
import { useNavigate, useSearchParams } from "react-router";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  addMonths,
  subMonths,
  isSameDay,
} from "date-fns";
import { vi } from "date-fns/locale";
import { type CustomEventType } from "./components/CustomEventModal";
import { auth } from "firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import AuthModal from "~/components/AuthModal";
import CustomEventsList from "./components/CustomEventsList";

import { disableBodyScroll, enableBodyScroll } from "~/utils/modal-utils";
import MusicPlayer, { type Song } from "./components/MusicPlayer";
import { TopAppBar } from "~/components/TopAppBar";
import WelcomePopup from "~/components/WelcomePopup";
import SearchResults from "./components/SearchResults";
import Playlist from "./components/Playlist";
import { songsList } from "./data/songs-list";
import EventsListMenu from "./components/EventsListMenu";
import Today from "./components/Today";
import { holidays } from "./data/holidays";
import { CalendarDialog } from "./components/CalendarDialog";
import IconButton from "@mui/material/IconButton";
export interface Holiday {
  id: string;
  name: string;
  date: Date;
  icon: string;
  eventType: EventType;
  isCustom?: boolean;
}

// Hàm loại bỏ dấu tiếng Việt
const removeDiacritics = (str: string): string => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
};

const currentYear = new Date().getFullYear();
const nextYear = currentYear + 1;

const CountDown = () => {
  // Move customEvents state declaration up before using it
  const [customEvents, setCustomEvents] = useState<CustomEventType[]>([]);
  const [searchParams] = useSearchParams();

  const from = searchParams.get("from");

  // Hàm kiểm tra xem một ngày có phải là hôm nay không
  const isTodayDate = (date: Date): boolean => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Hàm kiểm tra xem một sự kiện đã qua hơn 1 ngày chưa
  const isEventMoreThanOneDayOld = (date: Date): boolean => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    return date < yesterday;
  };

  // Tìm ngày lễ gần nhất sắp tới
  const findNextUpcomingHoliday = (): Holiday => {
    const today = new Date();

    // Tạo danh sách tất cả các sự kiện (cả hệ thống và tùy chỉnh)
    let allEvents: Holiday[] = [...holidays];

    // Thêm sự kiện tùy chỉnh nếu có
    if (customEvents.length > 0) {
      const customHolidays: Holiday[] = customEvents.map((event) => ({
        id: event.id,
        name: event.name,
        date: event.date,
        icon: event.icon,
        eventType: "custom",
        isCustom: true,
      }));

      allEvents = [...allEvents, ...customHolidays];
    }

    // Tìm sự kiện hôm nay
    const todayEvent = allEvents.find((holiday) => isTodayDate(holiday.date));

    if (todayEvent) {
      // Nếu có sự kiện hôm nay và đã qua hơn 1 ngày, tìm sự kiện tiếp theo
      if (isEventMoreThanOneDayOld(todayEvent.date)) {
        const nextEvents = allEvents
          .filter((holiday) => holiday.date > today)
          .sort((a, b) => a.date.getTime() - b.date.getTime());
        return nextEvents.length > 0 ? nextEvents[0] : holidays[0];
      }
      // Nếu có sự kiện hôm nay và chưa qua 1 ngày, hiển thị sự kiện hôm nay
      return todayEvent;
    }

    // Nếu không có sự kiện hôm nay, tìm sự kiện tiếp theo
    const upcomingHolidays = allEvents
      .filter((holiday) => holiday.date > today)
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    return upcomingHolidays.length > 0 ? upcomingHolidays[0] : holidays[0];
  };

  // Initialize with the first holiday, then update in useEffect
  const [selectedHoliday, setSelectedHoliday] = useState<Holiday>(holidays[0]);

  // Update selectedHoliday after mount to include customEvents
  useEffect(() => {
    setSelectedHoliday(findNextUpcomingHoliday());
  }, [customEvents]);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [holidaySearchTerm, setHolidaySearchTerm] = useState<string>("");
  const [mainPageSearchTerm, setMainPageSearchTerm] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Holiday[]>([]);
  const [showSearchResults, setShowSearchResults] = useState<boolean>(false);

  // Thêm useEffect để xử lý click bên ngoài menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    // Thêm event listener khi menu mở
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      // Prevent scrolling on body when menu is open
      disableBodyScroll();

      // Scroll to selected holiday when menu opens
      setTimeout(() => {
        const selectedElement = document.getElementById(
          `holiday-${selectedHoliday.id}`
        );
        if (selectedElement) {
          selectedElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }, 300); // Small delay to ensure the menu is fully opened
    } else {
      // Restore scrolling when menu is closed
      enableBodyScroll();
    }

    // Cleanup function
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      // Ensure scrolling is restored when component unmounts
      enableBodyScroll();
    };
  }, [isMenuOpen, selectedHoliday.id]);

  // Cập nhật useEffect để xử lý việc cập nhật ngày lễ khi component mount
  useEffect(() => {
    // Không cần tự động cập nhật ngày lễ sang năm sau nếu đã qua
    // Chỉ tìm ngày lễ gần nhất trong tương lai (nếu có)
    const upcomingHolidays = holidays
      .filter((holiday) => holiday.date > new Date())
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    // Nếu có ngày lễ sắp tới, chọn ngày gần nhất
    // Nếu không có ngày lễ nào sắp tới, giữ nguyên holiday đã chọn
    if (upcomingHolidays.length > 0) {
      setSelectedHoliday(upcomingHolidays[0]);
    }
  }, []);

  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isVisualizing, setIsVisualizing] = useState(false);
  const visualizerRef = useRef<HTMLCanvasElement>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  const animationRef = useRef<number | null>(null);

  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [shuffledIndices, setShuffledIndices] = useState<number[]>([]);
  const [currentShuffleIndex, setCurrentShuffleIndex] = useState<number>(0);

  const [showCelebration, setShowCelebration] = useState<boolean>(false);
  const [key, setKey] = useState<number>(0);

  const [currentDate, setCurrentDate] = useState(new Date());

  const [showCustomEventsList, setShowCustomEventsList] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Tính số ngày còn lại đến ngày lễ
  const getDaysUntilHoliday = () => {
    if (!selectedHoliday) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const holidayDate = new Date(selectedHoliday.date);
    holidayDate.setHours(0, 0, 0, 0);

    const diffTime = holidayDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  };

  const daysUntilHoliday = getDaysUntilHoliday();

  useEffect(() => {
    const audioInstance = new Audio("/asian-new-year-celebration.mp3");
    audioInstance.loop = isRepeat;
    audioInstance.volume = volume;

    audioInstance.addEventListener("loadedmetadata", () => {
      setDuration(audioInstance.duration);
    });

    setAudio(audioInstance);

    return () => {
      if (audioInstance) {
        audioInstance.pause();
        audioInstance.currentTime = 0;
        cancelAnimationFrame(animationRef.current as number);
      }
    };
  }, []);

  const updateTimeDisplay = () => {
    if (audio) {
      setCurrentTime(audio.currentTime);
      animationRef.current = requestAnimationFrame(updateTimeDisplay);
    }
  };

  const toggleAudio = () => {
    if (audio) {
      if (isPlaying) {
        audio.pause();
        cancelAnimationFrame(animationRef.current as number);
        setIsPlaying(false);
      } else {
        audio
          .play()
          .then(() => {
            setIsPlaying(true);
            animationRef.current = requestAnimationFrame(updateTimeDisplay);
          })
          .catch((error) => {
            console.log("Audio playback failed:", error);
          });
      }
    }
  };

  const handleTimelineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audio) {
      const newTime = parseFloat(e.target.value);
      audio.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  useEffect(() => {
    if (audio && isPlaying && !audioContext) {
      const context = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      const source = context.createMediaElementSource(audio);
      const analyserNode = context.createAnalyser();

      analyserNode.fftSize = 256;
      source.connect(analyserNode);
      analyserNode.connect(context.destination);

      setAudioContext(context);
      setAnalyser(analyserNode);
      setIsVisualizing(true);

      renderVisualizer();
    }
  }, [audio, isPlaying, audioContext]);

  const renderVisualizer = () => {
    if (!analyser || !visualizerRef.current) return;

    const canvas = visualizerRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      if (!isVisualizing) return;

      requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArray[i] / 3;

        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, "#e63946");
        gradient.addColorStop(1, "#ffb703");

        ctx.fillStyle = gradient;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

        x += barWidth + 1;
      }
    };

    draw();
  };

  const toggleRepeat = () => {
    if (audio) {
      const newRepeatState = !isRepeat;
      audio.loop = newRepeatState;
      setIsRepeat(newRepeatState);
    }
  };

  const navigate = useNavigate();

  // Thêm hàm để chọn ngày lễ
  const selectHoliday = (holiday: Holiday) => {
    setIsLoading(true);
    setSelectedHoliday(holiday);
    setIsMenuOpen(false);

    // Giả lập loading để UX mượt hơn
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  };

  // Add this function to calculate days until a specific holiday
  const getDaysUntilSpecificHoliday = (holidayDate: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const targetDate = new Date(holidayDate);
    targetDate.setHours(0, 0, 0, 0);

    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  };

  // Add this function to calculate days since a past holiday
  const getDaysSincePastHoliday = (holidayDate: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const targetDate = new Date(holidayDate);
    targetDate.setHours(0, 0, 0, 0);

    const diffTime = today.getTime() - targetDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  };

  const [currentSongIndex, setCurrentSongIndex] = useState<number>(0);
  const [filteredSongs, setFilteredSongs] = useState<Song[]>([]);
  const [displayedSongs, setDisplayedSongs] = useState<Song[]>([]);
  const [showPlaylist, setShowPlaylist] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Lọc bài hát theo ngày lễ được chọn
  useEffect(() => {
    if (selectedHoliday) {
      const songsForHoliday = songsList.filter(
        (song) => song.category === selectedHoliday.id
      );
      const songs = songsForHoliday.length > 0 ? songsForHoliday : songsList;
      setFilteredSongs(songs);
      setDisplayedSongs(songs);
      setCurrentSongIndex(0);
    } else {
      setFilteredSongs(songsList);
      setDisplayedSongs(songsList);
    }
  }, [selectedHoliday]);

  // Cập nhật audio source khi thay đổi bài hát
  useEffect(() => {
    if (audio && filteredSongs.length > 0) {
      const newSong = filteredSongs[currentSongIndex];
      audio.src = newSong.file;

      if (isPlaying) {
        audio
          .play()
          .catch((error) => console.log("Audio playback failed:", error));
      }

      document.title = `${newSong.title} - ${newSong.artist}`;
    }
  }, [currentSongIndex, filteredSongs]);

  // Hàm tạo mảng chỉ số ngẫu nhiên cho chế độ shuffle
  const generateShuffledIndices = (length: number) => {
    const indices = Array.from({ length }, (_, i) => i);
    // Thuật toán Fisher-Yates
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    return indices;
  };

  // Khởi tạo danh sách ngẫu nhiên khi danh sách bài hát thay đổi hoặc khi bật shuffle
  useEffect(() => {
    if (filteredSongs.length > 0 && isShuffle) {
      const shuffled = generateShuffledIndices(filteredSongs.length);
      setShuffledIndices(shuffled);
      // Tìm vị trí của bài hát hiện tại trong danh sách ngẫu nhiên
      const currentIndexInShuffled = shuffled.findIndex(
        (idx) => idx === currentSongIndex
      );
      setCurrentShuffleIndex(
        currentIndexInShuffled !== -1 ? currentIndexInShuffled : 0
      );
    }
  }, [filteredSongs, isShuffle]);

  // Xử lý khi bài hát kết thúc
  useEffect(() => {
    if (audio) {
      const handleEnded = () => {
        if (isRepeat) {
          // Logic khi lặp lại bài hát
          audio.currentTime = 0;
          audio.play();
        } else {
          playNextSong();
        }
      };

      audio.addEventListener("ended", handleEnded);
      return () => {
        audio.removeEventListener("ended", handleEnded);
      };
    }
  }, [
    audio,
    currentSongIndex,
    isShuffle,
    shuffledIndices,
    currentShuffleIndex,
  ]);

  // Cập nhật hàm chuyển bài tiếp theo để hỗ trợ chế độ shuffle
  const playNextSong = () => {
    if (filteredSongs.length > 0) {
      if (isShuffle) {
        // Trong chế độ shuffle, dùng mảng chỉ số đã trộn
        setCurrentShuffleIndex((prevIndex) => {
          const nextIndex =
            prevIndex === shuffledIndices.length - 1 ? 0 : prevIndex + 1;
          setCurrentSongIndex(shuffledIndices[nextIndex]);
          return nextIndex;
        });
      } else {
        // Chế độ thông thường, chuyển tuần tự
        setCurrentSongIndex((prevIndex) =>
          prevIndex === filteredSongs.length - 1 ? 0 : prevIndex + 1
        );
      }
    }
  };

  // Cập nhật hàm chuyển bài trước đó để hỗ trợ chế độ shuffle
  const playPreviousSong = () => {
    if (filteredSongs.length > 0) {
      if (isShuffle) {
        // Trong chế độ shuffle, dùng mảng chỉ số đã trộn
        setCurrentShuffleIndex((prevIndex) => {
          const nextIndex =
            prevIndex === 0 ? shuffledIndices.length - 1 : prevIndex - 1;
          setCurrentSongIndex(shuffledIndices[nextIndex]);
          return nextIndex;
        });
      } else {
        // Chế độ thông thường, chuyển tuần tự
        setCurrentSongIndex((prevIndex) =>
          prevIndex === 0 ? filteredSongs.length - 1 : prevIndex - 1
        );
      }
    }
  };

  // Hàm bật/tắt chế độ shuffle
  const toggleShuffle = () => {
    setIsShuffle((prev) => {
      const newState = !prev;
      if (newState) {
        // Khi bật shuffle, tạo mảng chỉ số ngẫu nhiên
        const shuffled = generateShuffledIndices(filteredSongs.length);
        setShuffledIndices(shuffled);
        // Tìm vị trí của bài hát hiện tại trong danh sách ngẫu nhiên
        const currentIndexInShuffled = shuffled.findIndex(
          (idx) => idx === currentSongIndex
        );
        setCurrentShuffleIndex(
          currentIndexInShuffled !== -1 ? currentIndexInShuffled : 0
        );
      }
      return newState;
    });
  };

  // Thêm sau khai báo các state khác
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<
    string | null
  >(null);

  // Danh sách các danh mục và tên hiển thị
  const categoryMap: Record<string, string> = {
    tet: "Tết Nguyên Đán",
    christmas: "Giáng Sinh",
    newYear: "Năm Mới",
    independence: "Quốc Khánh",
    valentine: "Lễ Tình Nhân",
    internationalWomensDay: "Quốc Tế Phụ Nữ",
    hungKings: "Giỗ Tổ Hùng Vương",
    liberation: "Giải Phóng Miền Nam",
    internationalWorkers: "Quốc Tế Lao Động",
    internationalChildrensDay: "Quốc Tế Thiếu Nhi",
    midAutumn: "Tết Trung Thu",
    vietnameseWomensDay: "Phụ Nữ Việt Nam",
    teachers: "Nhà Giáo Việt Nam",
  };

  // Thêm hàm xử lý lọc theo danh mục
  const handleCategoryFilter = (category: string | null) => {
    setActiveCategoryFilter(category);

    if (category === null) {
      // Nếu không chọn danh mục nào, hiển thị danh sách theo holiday đã chọn
      if (selectedHoliday) {
        const songsForHoliday = songsList.filter(
          (song) => song.category === selectedHoliday.id
        );
        setDisplayedSongs(
          songsForHoliday.length > 0 ? songsForHoliday : songsList
        );
      } else {
        setDisplayedSongs(songsList);
      }
    } else {
      // Lọc theo danh mục được chọn
      const songsForCategory = songsList.filter(
        (song) => song.category === category
      );
      setDisplayedSongs(songsForCategory);
    }

    // Reset search term khi chuyển danh mục
    setSearchTerm("");
  };

  // Hàm lấy tên danh mục để hiển thị
  const getCategoryLabel = (category: string): string => {
    return categoryMap[category] || category;
  };

  // Sửa lại hàm handleSearch để kết hợp với filter danh mục
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    // Base songs to search from - based on active category filter
    let baseList = activeCategoryFilter
      ? songsList.filter((song) => song.category === activeCategoryFilter)
      : selectedHoliday
        ? songsList.filter((song) => song.category === selectedHoliday.id)
        : songsList;

    if (term.trim() === "") {
      // Nếu không có từ khóa tìm kiếm, hiển thị danh sách theo filter đang active
      setDisplayedSongs(baseList);
    } else {
      // Lọc bài hát theo từ khóa trong danh sách đã được filter
      const normalizedSearchTerm = removeDiacritics(term);
      const results = baseList.filter(
        (song) =>
          removeDiacritics(song.title.toLowerCase()).includes(
            normalizedSearchTerm
          ) ||
          removeDiacritics(song.artist.toLowerCase()).includes(
            normalizedSearchTerm
          )
      );
      setDisplayedSongs(results);
    }
  };

  // Hàm để chọn bài hát cụ thể từ danh sách hiển thị
  const selectSong = (index: number) => {
    // Tìm bài hát được chọn từ danh sách hiển thị
    const selectedSong = displayedSongs[index];

    // Tìm vị trí của bài hát đó trong danh sách thực tế đang phát
    const actualIndex = filteredSongs.findIndex(
      (song) => song.id === selectedSong.id
    );

    if (actualIndex !== -1) {
      setCurrentSongIndex(actualIndex);
      setShowPlaylist(false);
      if (audio && !isPlaying) {
        toggleAudio();
      }
    }
  };

  // Hàm xử lý khi đếm ngược hoàn thành
  const handleCountdownComplete = () => {
    setShowCelebration(true);

    // Kích hoạt confetti
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval: any = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      // Kích hoạt confetti từ nhiều vị trí
      confetti({
        particleCount: 100,
        angle: randomInRange(55, 125),
        spread: randomInRange(50, 70),
        origin: { x: randomInRange(0.1, 0.9), y: randomInRange(0.1, 0.5) },
        colors: ["#e63946", "#ffb703", "#f1faee", "#a8dadc", "#457b9d"],
        zIndex: 9999,
      });
    }, 200);

    // Tự động tắt hiệu ứng sau 10 giây, nhưng không reset đếm ngược
    setTimeout(() => {
      setShowCelebration(false);
      // Không gọi resetCountdownForNextYear nữa
    }, 10000);
  };

  // Thêm useEffect mới để kiểm tra nếu ngày mục tiêu đã qua
  useEffect(() => {
    // Kiểm tra nếu ngày mục tiêu đã qua
    if (selectedHoliday && selectedHoliday.date < new Date()) {
      console.log("Phát hiện ngày mục tiêu đã qua:", selectedHoliday.name);
      // Không tự động reset đếm ngược nữa
    }
  }, [selectedHoliday]);

  // Filter holidays based on search term
  const filteredHolidays = holidays.filter((holiday) => {
    // If search term is empty, return all holidays
    if (holidaySearchTerm.trim() === "") {
      return true;
    }

    // Check if search is potentially a date format
    const dateRegex = /^(\d{1,2})[/-](\d{1,2})(?:[/-](\d{4}))?$/;
    const dateMatch = holidaySearchTerm.match(dateRegex);

    if (dateMatch) {
      // Search by date
      const day = parseInt(dateMatch[1], 10);
      const month = parseInt(dateMatch[2], 10);
      const year = dateMatch[3]
        ? parseInt(dateMatch[3], 10)
        : new Date().getFullYear();

      // Search by full date (day/month/year)
      if (dateMatch[3]) {
        return (
          holiday.date.getDate() === day &&
          holiday.date.getMonth() === month - 1 &&
          holiday.date.getFullYear() === year
        );
      }
      // Search by day and month only
      else {
        return (
          holiday.date.getDate() === day &&
          holiday.date.getMonth() === month - 1
        );
      }
    }
    // If input is just a number between 1-31, treat as day search
    else if (
      /^\d{1,2}$/.test(holidaySearchTerm) &&
      parseInt(holidaySearchTerm, 10) >= 1 &&
      parseInt(holidaySearchTerm, 10) <= 31
    ) {
      const day = parseInt(holidaySearchTerm, 10);
      return holiday.date.getDate() === day;
    }
    // Search by month name or number
    else if (/^tháng\s*(\d{1,2})$/i.test(holidaySearchTerm)) {
      const monthMatch = holidaySearchTerm.match(/^tháng\s*(\d{1,2})$/i);
      if (monthMatch && monthMatch[1]) {
        const month = parseInt(monthMatch[1], 10);
        if (month >= 1 && month <= 12) {
          return holiday.date.getMonth() === month - 1;
        }
      }
    }

    // If not a date format, do the regular name search
    const normalizedSearchTerm = removeDiacritics(
      holidaySearchTerm.toLowerCase()
    );
    return (
      removeDiacritics(holiday.name.toLowerCase()).includes(
        normalizedSearchTerm
      ) || holiday.id.toLowerCase().includes(normalizedSearchTerm)
    );
  });

  // Handle holiday search
  const handleHolidaySearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setHolidaySearchTerm(term);
  };

  // Thêm useEffect để lắng nghe phím Space để điều khiển nhạc
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Kiểm tra nếu người dùng đang nhập liệu trong input hoặc textarea
      if (
        event.code === "Space" &&
        !["INPUT", "TEXTAREA"].includes((event.target as HTMLElement).tagName)
      ) {
        event.preventDefault(); // Ngăn không cho trang cuộn xuống
        toggleAudio();
      }
    };

    // Thêm event listener
    if (typeof window !== "undefined") {
      window.addEventListener("keydown", handleKeyDown);
    }

    // Cleanup function
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("keydown", handleKeyDown);
      }
    };
  }, [audio, isPlaying]); // Re-run khi audio hoặc isPlaying thay đổi

  // Thêm useEffect mới để xử lý việc ngăn cuộn khi playlist mở
  useEffect(() => {
    if (showPlaylist) {
      // Prevent scrolling on body when playlist is open
      disableBodyScroll();

      // Scroll to the active song
      setTimeout(() => {
        if (filteredSongs.length > 0 && currentSongIndex >= 0) {
          const activeSongId = filteredSongs[currentSongIndex]?.id;
          const activeSongElement = document.getElementById(
            `song-${activeSongId}`
          );
          if (activeSongElement) {
            activeSongElement.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }
        }
      }, 300); // Small delay to ensure the playlist is fully opened
    } else {
      // Restore scrolling when playlist is closed
      enableBodyScroll();
    }

    // Cleanup function
    return () => {
      enableBodyScroll();
    };
  }, [showPlaylist, filteredSongs, currentSongIndex]); // Re-run khi showPlaylist hoặc currentSongIndex thay đổi

  // Add this function to handle main page search
  const handleMainPageSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setMainPageSearchTerm(term);

    if (term.trim() === "") {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    // Check if search is potentially a date format
    const dateRegex = /^(\d{1,2})[/-](\d{1,2})(?:[/-](\d{4}))?$/;
    const dateMatch = term.match(dateRegex);

    let results: Holiday[] = [];

    if (dateMatch) {
      // Search by date
      const day = parseInt(dateMatch[1], 10);
      const month = parseInt(dateMatch[2], 10);
      const year = dateMatch[3]
        ? parseInt(dateMatch[3], 10)
        : new Date().getFullYear();

      // Search by full date (day/month/year)
      if (dateMatch[3]) {
        results = holidays.filter(
          (holiday) =>
            holiday.date.getDate() === day &&
            holiday.date.getMonth() === month - 1 &&
            holiday.date.getFullYear() === year
        );
      }
      // Search by day and month only
      else {
        results = holidays.filter(
          (holiday) =>
            holiday.date.getDate() === day &&
            holiday.date.getMonth() === month - 1
        );
      }
    }
    // If input is just a number between 1-31, treat as day search
    else if (
      /^\d{1,2}$/.test(term) &&
      parseInt(term, 10) >= 1 &&
      parseInt(term, 10) <= 31
    ) {
      const day = parseInt(term, 10);
      results = holidays.filter((holiday) => holiday.date.getDate() === day);
    }
    // Search by month name or number
    else if (/^tháng\s*(\d{1,2})$/i.test(term)) {
      const monthMatch = term.match(/^tháng\s*(\d{1,2})$/i);
      if (monthMatch && monthMatch[1]) {
        const month = parseInt(monthMatch[1], 10);
        if (month >= 1 && month <= 12) {
          results = holidays.filter(
            (holiday) => holiday.date.getMonth() === month - 1
          );
        }
      }
    }
    // If it's not a date format, search by name
    else {
      const normalizedSearchTerm = removeDiacritics(term);
      results = holidays.filter(
        (holiday) =>
          removeDiacritics(holiday.name.toLowerCase()).includes(
            normalizedSearchTerm
          ) || holiday.id.toLowerCase().includes(normalizedSearchTerm)
      );
    }

    // Sort results by upcoming date
    results = results.sort((a, b) => {
      const daysUntilA = getDaysUntilSpecificHoliday(a.date);
      const daysUntilB = getDaysUntilSpecificHoliday(b.date);
      return daysUntilA - daysUntilB;
    });

    setSearchResults(results);
    setShowSearchResults(true);
  };

  // Add these state variables to the component
  const [showCalendarModal, setShowCalendarModal] = useState<boolean>(false);
  const [currentCalendarDate, setCurrentCalendarDate] = useState<Date>(
    new Date()
  );
  const calendarModalRef = useRef<HTMLDivElement>(null);

  // Add this function to find holiday for a specific date
  const findHolidayForDate = (date: Date): Holiday | undefined => {
    return holidays.find((holiday) => isSameDay(new Date(holiday.date), date));
  };

  // Add this function to handle clicking outside the calendar modal
  useEffect(() => {
    function handleClickOutsideCalendar(event: MouseEvent) {
      if (
        calendarModalRef.current &&
        !calendarModalRef.current.contains(event.target as Node)
      ) {
        setShowCalendarModal(false);
      }
    }

    if (showCalendarModal) {
      document.addEventListener("mousedown", handleClickOutsideCalendar);
      // Prevent scrolling on body when calendar modal is open
      disableBodyScroll();

      // Scroll to selected holiday in the calendar list
      setTimeout(() => {
        const selectedElement = document.getElementById(
          `calendar-holiday-${selectedHoliday.id}`
        );
        if (selectedElement) {
          selectedElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }, 300); // Small delay to ensure the modal is fully opened
    } else {
      // Restore scrolling when calendar modal is closed
      enableBodyScroll();
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideCalendar);
      // Ensure scrolling is restored when component unmounts
      enableBodyScroll();
    };
  }, [showCalendarModal, selectedHoliday.id]);

  // Function to change month
  const changeMonth = (amount: number) => {
    setCurrentCalendarDate((prevDate) => {
      if (amount > 0) {
        return addMonths(prevDate, amount);
      } else {
        return subMonths(prevDate, Math.abs(amount));
      }
    });
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const monthStart = startOfMonth(currentCalendarDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const days = eachDayOfInterval({ start: startDate, end: endDate });
    return days;
  };

  // Hàm xử lý khi người dùng chọn một sự kiện tùy chỉnh
  const handleSelectCustomEvent = (event: CustomEventType) => {
    const customHoliday: Holiday = {
      id: event.id,
      name: event.name,
      date: event.date,
      icon: event.icon,
      eventType: "custom",
      isCustom: true,
    };

    setSelectedHoliday(customHoliday);
    setShowCustomEventsList(false);
  };

  return (
    <div className="relative w-full flex flex-col max-w-4xl mx-auto">
      <TopAppBar
        onBack={() => {
          if (from === "home") {
            navigate("/");
            return;
          }
          if (from === "games") {
            navigate("/games");
            return;
          }
          if (from === "search") {
            navigate("/search");
            return;
          }
          if (from === "countdown") {
            navigate("/");
          }
        }}
        title={"Đếm ngược"}
        actionOne={
          <IconButton onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <Calendar />
          </IconButton>
        }
      />
      <div className="flex flex-col items-center w-full mx-auto">
        <WelcomePopup autoCloseTime={10000} />
        {/* Search results dropdown */}
        {showSearchResults && (
          <SearchResults
            showSearchResults={showSearchResults}
            searchResults={searchResults}
            mainPageSearchTerm={mainPageSearchTerm}
            setMainPageSearchTerm={setMainPageSearchTerm}
            setShowSearchResults={setShowSearchResults}
            selectHoliday={selectHoliday}
            getDaysUntilSpecificHoliday={getDaysUntilSpecificHoliday}
          />
        )}

        {isMenuOpen && (
          <EventsListMenu
            setIsMenuOpen={setIsMenuOpen}
            holidaySearchTerm={holidaySearchTerm}
            setHolidaySearchTerm={setHolidaySearchTerm}
            handleHolidaySearch={handleHolidaySearch}
            filteredHolidays={filteredHolidays}
            findNextUpcomingHoliday={findNextUpcomingHoliday}
            getDaysUntilSpecificHoliday={getDaysUntilSpecificHoliday}
            getDaysSincePastHoliday={getDaysSincePastHoliday}
            selectHoliday={selectHoliday}
            selectedHoliday={selectedHoliday}
          />
        )}
        <div className="h-full overflow-x-hidden overflow-y-auto  flex flex-col items-center justify-between px-4 md:px-6 lg:px-12 xl:px-20 w-full relative py-4 md:py-8">
          {/* Enhanced UI for current date display */}
          <motion.div
            onClick={() => setShowCalendarModal(true)}
            className="w-full max-w-lg mx-auto mb-4 lg:mb-5 cursor-pointer group"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="bg-gradient-to-r from-red-600/15 to-amber-600/20 backdrop-blur-md p-3 sm:p-4 rounded-2xl shadow-lg border border-white/40 hover:shadow-xl transition-all duration-300 relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-red-500/10 z-0 animate-pulse"></div>
              <div className="absolute -bottom-6 -left-6 w-20 h-20 rounded-full bg-amber-500/10 z-0 animate-pulse"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div className="relative z-10">
                <Today
                  vietnameseDate={format(currentDate, "EEEE, dd/MM/yyyy", {
                    locale: vi,
                  })}
                  currentDate={format(currentDate, "hh:mm a", {
                    locale: vi,
                  })}
                />
                {/* <NextUpcomingHoliday
                  daysUntilHoliday={daysUntilHoliday}
                  findNextUpcomingHoliday={findNextUpcomingHoliday}
                  selectedHoliday={selectedHoliday}
                  selectHoliday={selectHoliday}
                  getDaysUntilSpecificHoliday={getDaysUntilSpecificHoliday}
                  getDaysSincePastHoliday={getDaysSincePastHoliday}
                  formatDate={formatDate}
                /> */}
              </div>
            </div>
          </motion.div>

          {/* Countdown timer */}
          <motion.div
            className="w-full flex flex-col items-center justify-center flex-shrink-0 mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.5 }}
          >
            {isLoading ? (
              <div className="flex flex-col items-center justify-center">
                <Loader className="text-blue-500 animate-spin" size={40} />
              </div>
            ) : (
              <motion.div
                className="w-full max-w-lg mx-auto bg-gradient-to-r from-red-500/30 to-amber-500/30 backdrop-blur-md p-4 sm:p-8 rounded-2xl shadow-xl border border-white/30 overflow-hidden relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                {/* Decorative elements */}
                <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-red-500/10 z-0"></div>
                <div className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full bg-amber-500/10 z-0"></div>

                <div className="relative z-10 flex flex-col items-center justify-center">
                  <h1
                    className="text-xl sm:text-2xl font-extrabold mb-4  text-center gradient-animation max-w-full break-words"
                    aria-label={`${selectedHoliday.name} countdown timer`}
                  >
                    {selectedHoliday.icon}{" "}
                    <span className="bg-gradient-to-r from-red-600 via-red-900 to-red-600  bg-clip-text background-animate">
                      {selectedHoliday.name}
                    </span>{" "}
                    {selectedHoliday.icon}
                  </h1>

                  {/* Hiển thị thông báo khi sự kiện đã qua */}
                  {selectedHoliday.date < new Date() ? (
                    <div className="mb-4 p-4  /80 backdrop-blur-md rounded-xl shadow-lg text-center">
                      <h2 className="text-xl font-bold text-red-600 mb-2">
                        🎊 {selectedHoliday.name} đã qua 🎊
                      </h2>
                      <p className="text-gray-800">
                        Sự kiện này đã diễn ra vào{" "}
                        {format(selectedHoliday.date, "dd/MM/yyyy")}
                      </p>
                      <p className="text-gray-800 mt-2">
                        <span className="font-medium px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                          Đã qua {getDaysSincePastHoliday(selectedHoliday.date)}{" "}
                          ngày
                        </span>{" "}
                        kể từ sự kiện này
                      </p>
                    </div>
                  ) : (
                    <CountdownTimer
                      key={`${selectedHoliday.id}-${key}`}
                      targetDate={selectedHoliday.date}
                      onComplete={handleCountdownComplete}
                      eventType={selectedHoliday.eventType as EventType}
                    />
                  )}
                </div>
              </motion.div>
            )}

            {/* Hiển thị thông báo chúc mừng khi hoàn thành */}
            <AnimatePresence>
              {showCelebration && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="mt-4 p-4  /80 backdrop-blur-md rounded-xl shadow-lg text-center"
                >
                  <h2 className="text-2xl font-bold text-red-600 mb-2">
                    🎉 {selectedHoliday.name} đã đến! 🎉
                  </h2>
                  <p className="text-gray-800">
                    Chúc bạn một {selectedHoliday.name} tràn đầy niềm vui và
                    hạnh phúc!
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Calendar Modal */}
          <CalendarDialog
            showCalendarModal={showCalendarModal}
            setShowCalendarModal={setShowCalendarModal}
            calendarModalRef={
              calendarModalRef as React.RefObject<HTMLDivElement>
            }
            currentCalendarDate={currentCalendarDate}
            setCurrentCalendarDate={setCurrentCalendarDate}
            changeMonth={changeMonth}
            holidays={holidays}
            selectedHoliday={selectedHoliday}
            findHolidayForDate={findHolidayForDate}
            generateCalendarDays={generateCalendarDays}
            selectHoliday={selectHoliday}
          />

          {/* Music Player */}
          <MusicPlayer
            filteredSongs={filteredSongs}
            currentSongIndex={currentSongIndex}
            showPlaylist={showPlaylist}
            setShowPlaylist={setShowPlaylist}
            isPlaying={isPlaying}
            currentTime={currentTime}
            duration={duration}
            toggleShuffle={toggleShuffle}
            isShuffle={isShuffle}
            toggleRepeat={toggleRepeat}
            isRepeat={isRepeat}
            playPreviousSong={playPreviousSong}
            playNextSong={playNextSong}
            handleTimelineChange={handleTimelineChange}
            formatTime={formatTime}
            toggleAudio={toggleAudio}
            Pause={Pause}
            Play={Play}
            Shuffle={Shuffle}
            SkipForward={SkipForward}
            Repeat={Repeat}
          />
          <AnimatePresence>
            {showPlaylist && (
              <Playlist
                showPlaylist={showPlaylist}
                setShowPlaylist={setShowPlaylist}
                selectSong={selectSong}
                currentSongIndex={currentSongIndex}
                displayedSongs={displayedSongs}
                filteredSongs={filteredSongs}
                searchTerm={holidaySearchTerm}
                handleSearch={handleHolidaySearch}
                activeCategoryFilter={activeCategoryFilter}
                handleCategoryFilter={handleCategoryFilter}
                getCategoryLabel={getCategoryLabel}
                formatTime={formatTime}
                categoryMap={categoryMap}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Modal hiển thị danh sách sự kiện tùy chỉnh */}
        <AnimatePresence>
          {showCustomEventsList && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 "
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="w-full max-w-2xl"
              >
                <CustomEventsList
                  onSelectEvent={handleSelectCustomEvent}
                  selectedEventId={
                    selectedHoliday.isCustom ? selectedHoliday.id : undefined
                  }
                  onClose={() => {
                    setShowCustomEventsList(false);
                    setShowAuthModal(false);
                  }}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Auth Modal */}
        <AuthModal
          isOpen={showAuthModal}
          setIsOpen={() => {
            setShowAuthModal(false);
            setShowCustomEventsList(false);
          }}
          description="Bạn cần đăng nhập để tạo và quản lý sự kiện tùy chỉnh."
        />
      </div>
      <motion.div
        className="fixed bottom-10 right-4 size-14 flex justify-center items-center rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 p-2 z-10 shadow-lg hover:shadow-xl transition-all duration-300"
        onClick={() => {
          if (user) {
            setShowCustomEventsList(!showCustomEventsList);
          } else {
            setShowAuthModal(true);
          }
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Plus
          size={32}
          className="flex justify-center items-center text-white"
        />
      </motion.div>
    </div>
  );
};

export default CountDown;

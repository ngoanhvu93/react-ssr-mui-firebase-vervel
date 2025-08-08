import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router";
import { doc, getDoc } from "firebase/firestore";
import type { GameHistory } from "firebase/types";
import { toast } from "react-hot-toast";
import { db } from "firebase/firebase";
import { format } from "date-fns/format";
import { vi } from "date-fns/locale";
import type { GameRoundMode } from "~/thirteen-card-room/page";
import { PlayerInfomation } from "~/thirteen-card-room/components/PlayerInfomation";
import { GameRoundPointsPerGame } from "~/thirteen-card-room/components/GameRoundPointsPerGame";
import { GameRoundProgressive } from "~/thirteen-card-room/components/GameRoundProgressive";
import { SettingModal } from "~/thirteen-card-room/components/SettingModal";
import { ThirteenCardGameDetailSkeleton } from "./components/ThirteenCardGameDetailSkeleton";
import { TopAppBar } from "~/components/TopAppBar";
import { Settings } from "lucide-react";
import IconButton from "@mui/material/IconButton";

// Thêm interface để quản lý các settings
interface GameSettings {
  scoreViewMode: GameRoundMode;
  showRoundNumbers: boolean;
  showAvatars: boolean;
  showWinningScore: boolean;
}

export default function ThirteenCardGameDetail() {
  const navigate = useNavigate();
  const [gameDetail, setGameDetail] = useState<GameHistory | null>(null);
  const [loading, setLoading] = useState(true);

  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");

  // Khởi tạo state từ localStorage
  useEffect(() => {
    const settings: Partial<GameSettings> = {
      scoreViewMode: localStorage.getItem("scoreViewMode") as GameRoundMode,
      showRoundNumbers: JSON.parse(
        localStorage.getItem("showRoundNumbers") ?? "true"
      ),
      showAvatars: JSON.parse(localStorage.getItem("showAvatars") ?? "true"),
      showWinningScore: JSON.parse(
        localStorage.getItem("showWinningScore") ?? "true"
      ),
    };

    if (settings.scoreViewMode) setShowScoreMode(settings.scoreViewMode);
    if (settings.showRoundNumbers !== null)
      setShowRoundNumbers(settings?.showRoundNumbers ?? true);
    if (settings.showAvatars !== null)
      setShowAvatars(settings.showAvatars ?? true);
    if (settings.showWinningScore !== null)
      setShowWinningScore(settings.showWinningScore ?? true);
  }, []);

  // Lưu settings vào localStorage khi có thay đổi
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("scoreViewMode", showScoreMode);
      localStorage.setItem(
        "showRoundNumbers",
        JSON.stringify(showRoundNumbers)
      );
      localStorage.setItem("showAvatars", JSON.stringify(showAvatars));
      localStorage.setItem(
        "showWinningScore",
        JSON.stringify(showWinningScore)
      );
    }
  }, []);

  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      toast.error("ID phòng không hợp lệ");
      navigate("/");
      return;
    }
  }, [id]);

  useEffect(() => {
    const fetchGameDetail = async () => {
      try {
        setLoading(true);
        const docRef = doc(db, "gameHistories", id as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setGameDetail({ id: docSnap.id, ...docSnap.data() } as GameHistory);
        } else {
          toast.error("Không tìm thấy thông tin ván bài.");
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching game detail:", error);
        toast.error("Có lỗi xảy ra khi tải thông tin ván bài.");
      } finally {
        setLoading(false);
        setIsLoading(false);
      }
    };

    fetchGameDetail();
  }, [id]);

  // Thêm hàm helper để lưu settings
  const saveSettingToLocalStorage = (key: string, value: any) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        key,
        typeof value === "string" ? value : JSON.stringify(value)
      );
    }
  };

  // Thêm hàm helper để lấy settings
  const getSettingFromLocalStorage = (key: string, defaultValue: any) => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(key);
      if (saved === null) return defaultValue;
      try {
        return JSON.parse(saved);
      } catch {
        return saved; // Nếu không parse được JSON thì trả về string
      }
    }
    return defaultValue;
  };

  // Khởi tạo state với giá trị từ localStorage
  const [showScoreMode, setShowScoreMode] = useState<GameRoundMode>(() =>
    getSettingFromLocalStorage("scoreViewMode", "points-per-game")
  );
  const [showAvatars, setShowAvatars] = useState<boolean>(() =>
    getSettingFromLocalStorage("showAvatars", true)
  );
  const [showRoundNumbers, setShowRoundNumbers] = useState<boolean>(() =>
    getSettingFromLocalStorage("showRoundNumbers", true)
  );
  const [showWinningScore, setShowWinningScore] = useState<boolean>(() =>
    getSettingFromLocalStorage("showWinningScore", true)
  );

  // Gộp các useEffect lưu settings vào một effect duy nhất
  useEffect(() => {
    saveSettingToLocalStorage("scoreViewMode", showScoreMode);
    saveSettingToLocalStorage("showAvatars", showAvatars);
    saveSettingToLocalStorage("showRoundNumbers", showRoundNumbers);
    saveSettingToLocalStorage("showWinningScore", showWinningScore);
  }, [showScoreMode, showAvatars, showRoundNumbers, showWinningScore]);

  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      toast.error("ID phòng không hợp lệ");
      navigate("/");
      return;
    }
  }, [id]);

  if (loading) {
    return <ThirteenCardGameDetailSkeleton />;
  }

  return (
    <div className="w-full flex flex-col max-w-4xl mx-auto">
      <TopAppBar
        title={`Lịch sử chơi`}
        onBack={() => {
          navigate(-1);
        }}
        actionThree={
          <IconButton
            size="small"
            sx={{
              border: "1px solid",
              borderRadius: "100%",
            }}
            onClick={() => setIsSettingsOpen(true)}
          >
            <Settings size={20} />
          </IconButton>
        }
      >
        {gameDetail && (
          <PlayerInfomation
            room={gameDetail}
            showAvatars={showAvatars}
            setEditingPlayer={() => {}}
            setModalMode={() => {}}
            setShowModalEditPlayer={() => {}}
            setSelectedAvatar={() => {}}
            setAvatarPreview={() => {}}
            setEditNameError={() => {}}
          />
        )}
      </TopAppBar>

      <div className="grow overflow-y-auto h-full">
        {/* {loading && <CustomLoading />} */}
        {gameDetail && (
          <div className="w-full">
            <GameRoundPointsPerGame
              room={gameDetail}
              showScoreMode={showScoreMode}
              showRoundNumbers={showRoundNumbers}
              handleEditRoundClick={() => {}}
            />
            <GameRoundProgressive
              room={gameDetail}
              showScoreMode={showScoreMode}
              showRoundNumbers={showRoundNumbers}
              handleEditRoundClick={() => {}}
            />
            <div className="p-4 flex items-center justify-center flex-col gap-2">
              <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-lg font-semibold shadow-sm">
                Điểm thắng: {gameDetail?.winningScore}
              </div>
              <div className="text-gray-600 text-sm">Thời gian kết thúc:</div>
              <div className="text-gray-700 font-medium">
                {format(
                  new Date(gameDetail.endTime),
                  "EEE, dd/MM/yyy hh:mm a",
                  {
                    locale: vi,
                  }
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Settings Modal */}
      <SettingModal
        room={gameDetail}
        showScoreMode={showScoreMode}
        setShowScoreMode={setShowScoreMode}
        handleSaveSetting={() => {}}
        isSettingsOpen={isSettingsOpen}
        setIsSettingsOpen={() => setIsSettingsOpen(!isSettingsOpen)}
        newWinningScore={0}
        setNewWinningScore={() => {}}
        showAvatars={showAvatars}
        setShowAvatars={setShowAvatars}
        showRoundNumbers={showRoundNumbers}
        setShowRoundNumbers={setShowRoundNumbers}
        showWinningScore={showWinningScore}
        setShowWinningScore={setShowWinningScore}
      />
    </div>
  );
}

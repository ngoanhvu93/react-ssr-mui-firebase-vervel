import { X, ArrowRight, Trash, Check, ArrowDown, Loader } from "lucide-react";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";
import type { GameHistory, Player } from "firebase/types";
import { db } from "firebase/firebase";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-hot-toast";
import { vi } from "date-fns/locale";
import { format } from "date-fns";
import { CustomButton } from "~/components/CustomButton";
import { TopAppBar } from "~/components/TopAppBar";
import PlayerAvatar from "~/thirteen-card-room/components/PlayerAvatar";
import ThirteenCardHistorySkeleton from "~/thirteen-card-game-history/components/ThirteenCardHistorySkeleton";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";

export default function ThirteenCardGameHistory() {
  const navigate = useNavigate();
  const [histories, setHistories] = useState<GameHistory[]>([]);
  const [displayedHistories, setDisplayedHistories] = useState<GameHistory[]>(
    []
  );
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [_, setError] = useState("");
  const [isConfirmDelete, setIsConfirmDelete] = useState(false);
  const [deleteHistoryId, setDeleteHistoryId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    const fetchHistories = async () => {
      setIsLoading(true);
      try {
        const historyRef = collection(db, "gameHistories");
        const q = query(historyRef, where("roomId", "==", id));
        const querySnapshot = await getDocs(q);
        const historyData = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          // Sort players by totalScore in descending order
          const sortedPlayers = [...data.players].sort(
            (a, b) => b.totalScore - a.totalScore
          );

          // Group players by score to identify ties
          const scoreGroups: Record<number, number[]> = {};
          sortedPlayers.forEach((player, idx) => {
            if (!scoreGroups[player.totalScore]) {
              scoreGroups[player.totalScore] = [];
            }
            scoreGroups[player.totalScore].push(idx);
          });

          // Mark players with tied scores
          Object.values(scoreGroups).forEach((indices) => {
            if (indices.length > 1) {
              indices.forEach((idx) => {
                sortedPlayers[idx].tied = true;
              });
            }
          });

          return {
            ...data,
            players: sortedPlayers,
            id: doc.id,
          };
        }) as GameHistory[];

        // Sắp xếp lịch sử theo thời gian kết thúc từ mới nhất đến cũ nhất
        historyData.sort(
          (a, b) =>
            new Date(b.endTime).getTime() - new Date(a.endTime).getTime()
        );

        setHistories(historyData);
        // Initialize displayed histories with the first page
        setDisplayedHistories(historyData.slice(0, ITEMS_PER_PAGE));
      } catch (err) {
        console.error("Error fetching histories:", err);
        setError("Không thể tải lịch sử. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistories();
  }, [id]);

  const loadMoreHistories = () => {
    setIsLoadingMore(true);

    // Simulate loading delay for better UX
    setTimeout(() => {
      const nextPage = page + 1;
      const end = nextPage * ITEMS_PER_PAGE;
      // Always load from the beginning to the new end point
      setDisplayedHistories(histories.slice(0, end));
      setPage(nextPage);
      setIsLoadingMore(false);
    }, 500);
  };

  const handleDeleteHistory = async (historyId: string) => {
    const historyRef = collection(db, "gameHistories");
    const docRef = doc(historyRef, historyId);
    await deleteDoc(docRef);
    const updatedHistories = histories.filter(
      (history) => history.id !== historyId
    );
    setHistories(updatedHistories);
    setDisplayedHistories(updatedHistories.slice(0, page * ITEMS_PER_PAGE));
    toast.success("Đã xóa ván bài!");
    setIsConfirmDelete(false);
  };

  const calculateRanksWithGap = (players: Player[]): (number | null)[] => {
    const scores = players.map((p) => p.totalScore);

    const allZero = scores.every((score) => score === 0);
    if (allZero) return players.map(() => null);

    const sortedPlayers = [...players].sort(
      (a, b) => b.totalScore - a.totalScore
    );

    const scoreToRank = new Map<number, number>();
    let currentRank = 1;

    sortedPlayers.forEach((player, index) => {
      if (!scoreToRank.has(player.totalScore)) {
        scoreToRank.set(player.totalScore, currentRank);
      }
      currentRank = index + 2; // tăng theo index + 2 để tạo khoảng
    });

    return players.map((p) => scoreToRank.get(p.totalScore) ?? null);
  };

  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      toast.error("ID phòng không hợp lệ");
      navigate("/");
      return;
    }
  }, [id]);

  return (
    <div className="w-full flex flex-col max-w-4xl mx-auto">
      <TopAppBar
        title="Lịch sử chơi"
        onBack={() => {
          navigate(-1);
        }}
      />
      <div className="grow overflow-y-auto h-full">
        {histories.length === 0 && !isLoading && (
          <div className="flex items-center justify-center h-full w-full">
            <p className="text-gray-600">Không có lịch sử chơi</p>
          </div>
        )}
        <div className="flex-1 overflow-y-auto">
          <div className="grid gap-4 p-4">
            {isLoading ? (
              <ThirteenCardHistorySkeleton items={3} />
            ) : (
              displayedHistories.map((history) => (
                <div
                  key={history.id}
                  className="border shadow-md border-gray-200 rounded-lg p-2"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2 sm:gap-0">
                    <span className="text-sm">
                      Kết thúc vào:{" "}
                      {format(
                        new Date(history.endTime),
                        "EEEE, dd/MM/yyyy, HH:mm a",
                        {
                          locale: vi, // Hiển thị tiếng Việt
                        }
                      )}
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                        Điểm thắng: {history.winningScore}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 ">
                    <div className="grid grid-cols-4 gap-2">
                      {history.players.map((player, index) => (
                        <div
                          key={player.id}
                          className={`flex flex-col items-center p-2 rounded-lg border-2 text-black border-gray-200 ${
                            player.tied
                              ? "bg-blue-50 border-blue-200"
                              : index === 0
                                ? "bg-yellow-100"
                                : index === 1
                                  ? "bg-gray-100"
                                  : index === 2
                                    ? "bg-orange-100"
                                    : "bg-slate-100"
                          }`}
                        >
                          <div className="flex items-center justify-center gap-2 mb-1">
                            {(() => {
                              const ranks = calculateRanksWithGap(
                                history.players ?? []
                              );
                              const rank = ranks[index];
                              switch (rank) {
                                case 1:
                                  return (
                                    <span className="text-red-500 text-xl">
                                      ♥️
                                    </span>
                                  );
                                case 2:
                                  return (
                                    <span className="text-red-500 text-xl">
                                      ♦️
                                    </span>
                                  );
                                case 3:
                                  return (
                                    <span className="text-black text-xl">
                                      ♣️
                                    </span>
                                  );
                                case 4:
                                  return (
                                    <span className="text-black text-xl">
                                      ♠️
                                    </span>
                                  );
                                default:
                                  return null;
                              }
                            })()}
                          </div>
                          {player.avatar ? (
                            <PlayerAvatar
                              player={player}
                              size="large"
                              index={index}
                            />
                          ) : (
                            <PlayerAvatar
                              player={player}
                              size="large"
                              index={index}
                            />
                          )}
                          <span className="text-center my-1 line-clamp-1 font-semibold">
                            {player.name}
                          </span>
                          <span className="text-xl font-bold text-red-500">
                            {player.totalScore}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 flex justify-between gap-2 pt-4 border-t">
                    <CustomButton
                      size="small"
                      icon={<Trash size={20} />}
                      variant="danger"
                      className="text-red-600 hover:text-red-800 ml-4"
                      onClick={() => {
                        setDeleteHistoryId(history.id);
                        setIsConfirmDelete(true);
                      }}
                    >
                      Xóa
                    </CustomButton>
                    <CustomButton
                      icon={<ArrowRight size={20} />}
                      size="small"
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() =>
                        navigate(
                          `/thirteen-card-game-detail/${history.id}?type=game-detail`
                        )
                      }
                      variant="primary"
                    >
                      Xem chi tiết
                    </CustomButton>
                  </div>
                </div>
              ))
            )}

            {!isLoading && histories.length > displayedHistories.length && (
              <div className="flex justify-center mt-4">
                <CustomButton
                  icon={<ArrowDown size={20} />}
                  variant="primary"
                  onClick={loadMoreHistories}
                  className="w-full"
                  disabled={isLoadingMore}
                >
                  {isLoadingMore ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader size={20} className="animate-spin" /> Đang tải...
                    </span>
                  ) : (
                    `Xem thêm (${displayedHistories.length}/${histories.length})`
                  )}
                </CustomButton>
              </div>
            )}
          </div>
        </div>
      </div>

      {isConfirmDelete && (
        <Dialog
          open={isConfirmDelete}
          onClose={() => setIsConfirmDelete(false)}
        >
          <DialogTitle>Xác nhận xóa</DialogTitle>
          <IconButton
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
            }}
            onClick={() => setIsConfirmDelete(false)}
          >
            <X />
          </IconButton>
          <DialogContent dividers>
            <p>Bạn có chắc chắn muốn xóa ván bài này không?</p>
          </DialogContent>
          <DialogActions>
            <CustomButton
              variant="confirm"
              onClick={() => {
                if (deleteHistoryId) {
                  handleDeleteHistory(deleteHistoryId);
                }
              }}
            >
              Xác nhận
            </CustomButton>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
}

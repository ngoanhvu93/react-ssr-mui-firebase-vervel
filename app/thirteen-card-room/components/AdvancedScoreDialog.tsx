import {
  Star,
  MousePointerClick,
  Info,
  Loader,
  RotateCcw,
  X,
} from "lucide-react";
import type { Room } from "firebase/types";
import PlayerAvatar from "./PlayerAvatar";
import { cn } from "~/utils/cn";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import ToggleButton from "@mui/material/ToggleButton";

export const AdvancedScoreDialog = (props: {
  isAdvancedScoringOpen: boolean;
  setIsAdvancedScoringOpen: (isAdvancedScoringOpen: boolean) => void;
  room: Room;
  scores: Record<string, number | boolean>;
  setScores: (
    scores:
      | Record<string, number | boolean>
      | ((
          prev: Record<string, number | boolean>
        ) => Record<string, number | boolean>)
  ) => void;
  setIsScoreSettingsOpen: (isScoreSettingsOpen: boolean) => void;
  currentInput: string;
  setCurrentInput: (currentInput: string) => void;
  handleAdvancedScoreSubmit: () => void;
  isSavingAdvancedScores: boolean;
  calculatePoints: (rank: number, isWhiteWin: boolean) => number;
  hasAnyWhiteWin: boolean;
  isDuplicateRank: (
    playerId: string,
    newRank: number,
    prev: Record<string, number | boolean>
  ) => boolean;
  loadingTotalScore: boolean;
}) => {
  const {
    isAdvancedScoringOpen,
    setIsAdvancedScoringOpen,
    room,
    scores,
    setScores,
    setIsScoreSettingsOpen,
    setCurrentInput,
    handleAdvancedScoreSubmit,
    isSavingAdvancedScores,
    calculatePoints,
    hasAnyWhiteWin,
    loadingTotalScore,
  } = props;

  return (
    <Dialog
      open={isAdvancedScoringOpen}
      onClose={() => setIsAdvancedScoringOpen(false)}
      fullWidth
    >
      <DialogTitle>
        <div className="font-bold">
          Ghi điểm nhanh ván{" "}
          {room?.players[0]?.scores.length
            ? room.players[0].scores.length + 1
            : 1}
        </div>
      </DialogTitle>
      <DialogContent dividers={true}>
        <span className="text-sm flex items-center gap-1 bg-yellow-200 text-blue-500 font-medium px-2 py-1 mb-2 rounded-md ">
          <Info size={16} />
          Nhấn vào người chơi để ghi điểm
        </span>
        <IconButton
          aria-label="close"
          onClick={() => {
            setIsAdvancedScoringOpen(false);
            setCurrentInput("");
            setScores({});
          }}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <X />
        </IconButton>

        <div className="grid grid-cols-4 gap-1">
          {room?.players.map((player, index) => {
            const rank = Number(scores[player.id]) || 0;
            const isWhiteWin = Boolean(scores[`${player.id}_white`]);
            let rankPoints = calculatePoints(rank, isWhiteWin);
            return (
              <div key={player.id} className="flex flex-col gap-4">
                <ToggleButton
                  value={rank}
                  onClick={() => {
                    if (hasAnyWhiteWin) return; // Nếu có white win, không làm gì

                    setScores((prev) => {
                      const currentRank = (prev[player.id] as number) ?? 0;
                      let newRank = currentRank === 4 ? 1 : currentRank + 1;

                      // Lấy danh sách tất cả rank đã tồn tại
                      const existingRanks = new Set(
                        Object.values(prev) as number[]
                      );

                      // Tối đa thử 4 lần để tìm rank không trùng
                      for (let i = 0; i < 4; i++) {
                        if (!existingRanks.has(newRank)) break; // Nếu rank hợp lệ, thoát vòng lặp
                        newRank = newRank === 4 ? 1 : newRank + 1;
                      }

                      return { ...prev, [player.id]: newRank };
                    });
                  }}
                >
                  <div className="flex flex-col items-center w-full">
                    <div className="flex items-center">
                      <div className="flex flex-col gap-3 items-center">
                        <div className="size-6 flex items-center justify-center">
                          {isWhiteWin ? (
                            <Star size={32} className="text-yellow-600" />
                          ) : (
                            <div className=" size-6 flex items-center gap-2">
                              {rank === 0 && <MousePointerClick />}
                              {rank === 1 && (
                                <span className="text-red-500 text-xl">♥️</span>
                              )}
                              {rank === 2 && (
                                <span className="text-red-500 text-xl">♦️</span>
                              )}
                              {rank === 3 && (
                                <span className="text-black text-xl">♣️</span>
                              )}
                              {rank === 4 && (
                                <span className="text-black text-xl">♠️</span>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col items-center gap-1">
                          <div className="relative">
                            <PlayerAvatar index={index} player={player} />
                            <span className="absolute size-6 flex items-center justify-center text-white bg-red-500 rounded-full p-1 py-1 -top-2 -right-2 text-xs">
                              {loadingTotalScore ? (
                                <Loader className="size-4 animate-spin" />
                              ) : (
                                rankPoints + player.totalScore
                              )}
                            </span>
                          </div>
                          <span className="line-clamp-1 capitalize text-sm font-semibold w-full text-center pt-2">
                            {player.name}
                          </span>
                        </div>

                        <div className="text-center w-full">
                          <span
                            className={cn(
                              " h-6 w-full font-medium flex items-center justify-center gap-1"
                            )}
                          >
                            {isWhiteWin ? (
                              "Tới trắng"
                            ) : (
                              <div className="flex items-center gap-2">
                                {rank === 0 && "?"}
                                {rank === 1 && "Nhất"}
                                {rank === 2 && "Nhì"}
                                {rank === 3 && "Ba"}
                                {rank === 4 && "Tư"}
                              </div>
                            )}
                          </span>
                          <div className="font-bold text-2xl">{rankPoints}</div>
                          <div className="text-sm text-gray-500">điểm</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </ToggleButton>
                <ToggleButton
                  fullWidth
                  value={`${player.id}_white`}
                  onClick={() => {
                    setScores((prev: Record<string, number | boolean>) => {
                      if (prev[`${player.id}_white`]) {
                        const { [`${player.id}_white`]: _, ...rest } = prev;
                        return rest;
                      }

                      const currentWhiteWinPlayer = Object.entries(prev).find(
                        ([key, value]) =>
                          key.endsWith("_white") && value === true
                      );

                      if (currentWhiteWinPlayer) {
                        const [currentWhiteWinKey] = currentWhiteWinPlayer;
                        const { [currentWhiteWinKey]: _, ...rest } = prev;
                        return {
                          ...rest,
                          [`${player.id}_white`]: true,
                        };
                      }

                      const newScores: Record<string, number | boolean> = {};
                      room?.players.forEach((p) => {
                        newScores[p.id] = 4;
                      });
                      newScores[`${player.id}_white`] = true;
                      return newScores;
                    });
                  }}
                  title={
                    isWhiteWin
                      ? "Hủy tới trắng"
                      : hasAnyWhiteWin
                        ? "Đổi người tới trắng"
                        : "Tới trắng (+9 điểm)"
                  }
                  aria-label={
                    isWhiteWin
                      ? "Hủy tới trắng"
                      : hasAnyWhiteWin
                        ? "Đổi người tới trắng"
                        : "Tới trắng"
                  }
                >
                  <span className="text-xs sm:text-sm font-medium">
                    Tới trắng
                  </span>
                </ToggleButton>
              </div>
            );
          })}
        </div>

        <Button
          sx={{ mt: 2 }}
          size="large"
          color="secondary"
          onClick={() => {
            setScores({});
            setCurrentInput("");
          }}
          startIcon={<RotateCcw className="size-4" />}
          variant="contained"
          fullWidth
        >
          Đặt lại
        </Button>
      </DialogContent>
      <DialogActions>
        <Button
          size="large"
          fullWidth
          onClick={() => setIsScoreSettingsOpen(true)}
        >
          Cài đặt điểm
        </Button>
        <Button
          size="large"
          onClick={() => {
            setIsAdvancedScoringOpen(false);
            setCurrentInput("");
            setScores({});
          }}
        >
          Hủy
        </Button>

        <Button
          size="large"
          variant="contained"
          onClick={handleAdvancedScoreSubmit}
          disabled={isSavingAdvancedScores || room?.isCompleted}
        >
          {isSavingAdvancedScores ? (
            <div className="flex items-center gap-2">
              <Loader className="size-4 animate-spin" />
            </div>
          ) : (
            "Lưu"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

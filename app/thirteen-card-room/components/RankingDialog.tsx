import type { Room } from "firebase/types";
import { X } from "lucide-react";
import PlayerAvatar from "./PlayerAvatar";
import { format } from "date-fns";
import { vi } from "date-fns/locale/vi";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";

export const RankingDialog = (props: {
  isRankingDialogOpen: boolean;
  setIsRankingDialogOpen: (isRankingDialogOpen: boolean) => void;
  room: Room;
  handleCompleteGame: () => void;
  handleCreateNewGame: () => void;
  setIsResetDialogOpen: (isResetDialogOpen: boolean) => void;
}) => {
  return (
    <Dialog
      open={props.isRankingDialogOpen}
      onClose={() => props.setIsRankingDialogOpen(false)}
      fullWidth
    >
      <DialogTitle>
        <h2 className="text-xl font-bold">🎉 Kết thúc ván chơi 🎉</h2>
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={() => props.setIsRankingDialogOpen(false)}
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
        }}
      >
        <X />
      </IconButton>
      <DialogContent dividers>
        <div className="text-center mb-6">
          <p className="">Điểm chiến thắng: {props.room?.winningScore}</p>
          {props.room?.endTime && (
            <>
              <p className=" text-sm mt-1">Thời gian kết thúc: </p>
              <p className=" text-sm mt-1">
                {format(
                  new Date(props.room.endTime),
                  "EEEE, LLL dd/MM/yyy HH:mm a",
                  {
                    locale: vi,
                  }
                )}
              </p>
            </>
          )}
        </div>

        <div className="grid grid-cols-4 gap-1 w-full">
          {[...props.room.players]
            .sort((a, b) => b.totalScore - a.totalScore)
            .map((player, index) => (
              <div className="w-full" key={player.id}>
                <Card>
                  <div className="flex flex-col items-center gap-1 p-4">
                    <span className="text-xl font-bold">
                      {index === 0 ? (
                        <span className="text-red-500 text-xl">♥️</span>
                      ) : index === 1 ? (
                        <span className="text-red-500 text-xl">♦️</span>
                      ) : index === 2 ? (
                        <span className="text-black text-xl">♣️</span>
                      ) : (
                        <span className="text-black text-xl">♠️</span>
                      )}
                    </span>
                    <div className="flex flex-col items-center gap-1">
                      <PlayerAvatar
                        size="large"
                        player={player}
                        index={
                          props.room.players.findIndex(
                            (p) => p.id === player.id
                          ) ?? 0
                        }
                      />
                      <span className="font-semibold">{player.name}</span>
                    </div>
                    <div className="font-bold text-xl text-red-500 text-center">
                      {player.totalScore}
                    </div>
                  </div>
                </Card>
              </div>
            ))}
        </div>
      </DialogContent>
      <DialogActions>
        {!props.room?.isCompleted ? (
          <>
            <Button
              size="large"
              onClick={() => props.setIsRankingDialogOpen(false)}
            >
              Đóng
            </Button>
            <Button
              size="large"
              variant="outlined"
              onClick={() => {
                props.setIsRankingDialogOpen(false);
                props.setIsResetDialogOpen(true);
              }}
              className="w-full"
            >
              Tạo ván mới
            </Button>

            <Button
              size="large"
              variant="contained"
              onClick={props.handleCompleteGame}
            >
              Lưu
            </Button>
          </>
        ) : (
          <>
            <Button
              size="large"
              onClick={() => props.setIsRankingDialogOpen(false)}
            >
              Đóng
            </Button>
            <Button
              size="large"
              variant="contained"
              onClick={props.handleCreateNewGame}
            >
              Tạo ván mới
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

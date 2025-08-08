import type { Room } from "firebase/types";
import PlayerAvatar from "./PlayerAvatar";
import { ArrowLeft, ArrowRight, Edit, Loader, Save, X } from "lucide-react";
import { cn } from "~/utils/cn";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import { NoteAlt } from "@mui/icons-material";

export const BaseScoreDialog = (props: {
  isScoreSheetOpen: boolean;
  setIsScoreSheetOpen: (isScoreSheetOpen: boolean) => void;
  editingRound: number | null;
  room: Room;
  scores: Record<string, number | boolean>;
  setScores: (
    scores:
      | Record<string, number | boolean>
      | ((
          prev: Record<string, number | boolean>
        ) => Record<string, number | boolean>)
  ) => void;
  selectedPlayerId: string | null;
  setSelectedPlayerId: (selectedPlayerId: string | null) => void;
  currentInput: string;
  setCurrentInput: (currentInput: string) => void;
  handleInputFocus: (playerId: string) => void;
  handleNumberInput: (num: string) => void;
  handleNegative: () => void;
  handleClear: () => void;
  handleNext: () => void;
  handlePrevious: () => void;
  handleUpdateRoundScores: () => void;
  handleSubmitScores: () => void;
  isSavingScores: boolean;
  editedScores: Record<string, number>;
  loadingTotalScore: boolean;
}) => {
  return (
    <Dialog
      open={props.isScoreSheetOpen}
      onClose={() => {
        props.setIsScoreSheetOpen(false);
        props.setSelectedPlayerId(null);
        props.setCurrentInput("");
      }}
      fullWidth
    >
      <DialogTitle>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full   shadow-md border border-amber-300">
            <span className="text-amber-500 text-xl font-extrabold">
              {props.editingRound !== null ? (
                <Edit className="text-base" />
              ) : (
                <NoteAlt className="text-base" />
              )}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg">
              {props.editingRound !== null ? "Sửa điểm ván" : "Ghi điểm ván"}
              <span className="ml-2">
                {props.loadingTotalScore ? (
                  <Loader className="size-4 animate-spin inline-block align-middle" />
                ) : props.editingRound !== null ? (
                  <span>{props.editingRound + 1}</span>
                ) : props.room?.players[0]?.scores.length ? (
                  <span>{props.room.players[0].scores.length + 1}</span>
                ) : null}
              </span>
            </span>
          </div>
        </div>
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={() => {
          props.setIsScoreSheetOpen(false);
          props.setSelectedPlayerId(null);
          props.setCurrentInput("");
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

      <DialogContent dividers={true}>
        <>
          <div className="grid grid-cols-4 gap-1 mb-4 text-center">
            {props.room?.players.map((player, index) => (
              <div
                key={player.id}
                className={cn(
                  "flex items-center rounded-md p-2 py-4 border shadow-sm cursor-pointer",
                  {
                    "bg-amber-500": props.selectedPlayerId === player.id,
                  }
                )}
                onClick={() => props.handleInputFocus(player.id)}
                data-player-id={player.id}
              >
                <div className="relative flex flex-col justify-center items-center w-full gap-2">
                  <div className="relative">
                    <PlayerAvatar index={index} player={player} />
                    <span className="absolute size-6 flex items-center justify-center bg-red-500 text-white rounded-full p-1 py-1 -top-2 -right-2 text-xs">
                      {props.loadingTotalScore ? (
                        <Loader className="size-4 animate-spin" />
                      ) : (
                        Number(props.scores[player.id] ?? 0) + player.totalScore
                      )}
                    </span>
                  </div>
                  <span className="line-clamp-1 font-semibold">
                    {player.name}
                  </span>

                  <div
                    className={cn(
                      "w-full p-2 text-center text-xl rounded-lg text-red-500 font-bold",
                      {
                        "  border-amber-500":
                          props.selectedPlayerId === player.id,
                        "bg-gray-50": props.selectedPlayerId !== player.id,
                      }
                    )}
                  >
                    {props.selectedPlayerId === player.id
                      ? props.currentInput || 0
                      : (props.editingRound !== null
                          ? props.editedScores[player.id]
                          : props.scores[player.id]) || 0}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2 ">
            {["Nhất", "Nhì", "Ba", 7, 8, 9, 4, 5, 6, 1, 2, 3].map((num) => (
              <Button
                key={num}
                size="medium"
                variant="outlined"
                onClick={() => {
                  props.handleNumberInput(num.toString());
                }}
                sx={{
                  fontWeight: "bold",
                }}
              >
                {num}
              </Button>
            ))}
            <Button
              size="medium"
              variant="outlined"
              onClick={() => {
                props.handleNegative();
              }}
              color="error"
              sx={{
                fontWeight: "bold",
              }}
            >
              Âm
            </Button>
            <Button
              size="medium"
              variant="outlined"
              onClick={() => {
                props.handleNumberInput("0");
              }}
              sx={{
                fontWeight: "bold",
              }}
            >
              0
            </Button>
            <Button
              size="medium"
              variant="outlined"
              onClick={() => {
                props.handleClear();
              }}
              color="error"
              sx={{
                fontWeight: "bold",
              }}
            >
              Xóa
            </Button>
          </div>
          <div className="flex gap-2 mt-2">
            <Button
              size="medium"
              onClick={props.handlePrevious}
              variant="outlined"
              disabled={props.isSavingScores || props.room?.isCompleted}
              fullWidth
            >
              <ArrowLeft />
            </Button>
            <Button
              size="medium"
              variant="outlined"
              onClick={() => {
                props.setScores({});
                props.setCurrentInput("");
              }}
              fullWidth
              sx={{
                fontWeight: "bold",
              }}
            >
              AC
            </Button>
            <Button
              size="medium"
              onClick={props.handleNext}
              variant="outlined"
              disabled={props.isSavingScores || props.room?.isCompleted}
              fullWidth
            >
              <ArrowRight />
            </Button>
          </div>
        </>
      </DialogContent>
      <DialogActions>
        <Button
          size="large"
          onClick={() => {
            props.setIsScoreSheetOpen(false);
            props.setSelectedPlayerId(null);
            props.setCurrentInput("");
          }}
        >
          Hủy
        </Button>
        <Button
          size="large"
          onClick={() => {
            if (props.editingRound !== null) {
              props.handleUpdateRoundScores();
            } else {
              props.handleSubmitScores();
            }
            props.setSelectedPlayerId(null);
            props.setCurrentInput("");
            props.setScores({});
          }}
          disabled={props.isSavingScores || props.room?.isCompleted}
          variant="contained"
          loading={props.isSavingScores}
        >
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
};

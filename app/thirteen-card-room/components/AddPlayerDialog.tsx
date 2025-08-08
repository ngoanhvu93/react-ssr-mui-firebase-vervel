import { Info, Pencil } from "lucide-react";
import { X } from "lucide-react";
import PlayerAvatar from "./PlayerAvatar";
import { UserPlus } from "lucide-react";
import type { Room } from "firebase/types";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";

const AddPlayerDialog = (props: {
  room: Room;
  playerNames: string[];
  setPlayerNames: (names: string[]) => void;
  handleBulkAddPlayers: (e: React.FormEvent) => void;
  handleBulkAvatarChange: (index: number, file: File) => void;
  handleRemoveAvatar: (index: number) => void;
  getDuplicateErrorMessage: (name: string, index: number) => string;
  isNameDuplicate: (name: string, index: number) => boolean;
  checkForDuplicates: (names: string[]) => void;
  avatarPreviews: string[];
  isSavingPlayers: boolean;
  setShowModalAddPlayer: (isOpen: boolean) => void;
}) => {
  const {
    room,
    playerNames,
    setPlayerNames,
    handleBulkAddPlayers,
    handleBulkAvatarChange,
    handleRemoveAvatar,
    getDuplicateErrorMessage,
    isNameDuplicate,
    checkForDuplicates,
    avatarPreviews,
    isSavingPlayers,
    setShowModalAddPlayer,
  } = props;

  return (
    <Dialog
      open={true}
      onClose={() => {
        if (isSavingPlayers) return;
        setShowModalAddPlayer(false);
      }}
      fullWidth
      disableEscapeKeyDown={isSavingPlayers}
    >
      <DialogTitle>
        <h2 className="font-bold">Thêm người chơi</h2>
      </DialogTitle>
      <IconButton
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
        }}
        onClick={() => setShowModalAddPlayer(false)}
        disabled={isSavingPlayers}
      >
        <X />
      </IconButton>
      <form onSubmit={handleBulkAddPlayers}>
        <DialogContent dividers>
          <p className="text-sm mb-4 flex items-center gap-2">
            <Info className="size-4" />
            <span>Nhấn vào ảnh đại diện để chọn ảnh</span>
          </p>
          {/* Grid 2 cột */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ">
            {playerNames.map((name, index) => {
              const duplicateError = getDuplicateErrorMessage(name, index);
              return (
                <div key={index} className="flex items-center gap-4 w-full">
                  {/* Avatar */}
                  {avatarPreviews[index] ? (
                    <div className="relative">
                      <label htmlFor={`avatar-input-${index}`}>
                        <div className={isSavingPlayers ? "opacity-60" : ""}>
                          <PlayerAvatar
                            index={index}
                            player={{
                              name,
                              avatar: avatarPreviews[index] || "",
                            }}
                            size="large"
                            onClick={() => {
                              if (isSavingPlayers) return;
                              const input = document.createElement("input");
                              input.type = "file";
                              input.accept = "image/*";
                              input.onchange = (e) => {
                                const file = (e.target as HTMLInputElement)
                                  .files?.[0];
                                if (file) {
                                  handleBulkAvatarChange(index, file);
                                }
                              };
                              input.click();
                            }}
                          />
                        </div>
                      </label>
                      <X
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                        size={20}
                        onClick={() => {
                          if (!isSavingPlayers) {
                            handleRemoveAvatar(index);
                          }
                        }}
                        style={{
                          cursor: isSavingPlayers ? "not-allowed" : "pointer",
                        }}
                      />
                    </div>
                  ) : (
                    <label
                      htmlFor={`avatar-input-${index}`}
                      className="relative"
                    >
                      <div className={isSavingPlayers ? "opacity-60" : ""}>
                        <PlayerAvatar
                          player={{
                            name,
                            avatar: avatarPreviews[index] ?? "",
                          }}
                          size="large"
                          index={index}
                        />
                      </div>
                      <input
                        title="Chọn ảnh đại diện"
                        id={`avatar-input-${index}`}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={isSavingPlayers}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleBulkAvatarChange(index, file);
                        }}
                      />
                      <Pencil
                        className="absolute bottom-2 right-2 text-black"
                        size={14}
                      />
                    </label>
                  )}
                  <TextField
                    id={`player-name-${index}`}
                    label={`Nhập tên người chơi ${index + 1}`}
                    variant="standard"
                    value={name}
                    onChange={(e) => {
                      const newNames = [...playerNames];
                      newNames[index] = e.target.value;
                      setPlayerNames(newNames);
                      checkForDuplicates(newNames);
                    }}
                    error={isNameDuplicate(name, index)}
                    helperText={duplicateError}
                    placeholder={`Nhập tên người chơi ${index + 1}`}
                    fullWidth
                    disabled={isSavingPlayers}
                  />
                </div>
              );
            })}
          </div>

          {/* Nút bấm */}
        </DialogContent>
        <DialogActions>
          <Button
            size="large"
            onClick={() => setShowModalAddPlayer(false)}
            disabled={isSavingPlayers}
          >
            Hủy
          </Button>
          <Button
            size="large"
            type="submit"
            variant="contained"
            color="primary"
            startIcon={
              isSavingPlayers ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <UserPlus size={20} />
              )
            }
            disabled={
              playerNames.some(
                (name, index) =>
                  name.trim() !== "" && isNameDuplicate(name, index)
              ) ||
              playerNames.filter((name) => name.trim()).length < 4 ||
              isSavingPlayers
            }
          >
            {isSavingPlayers ? "Đang thêm..." : "Thêm"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddPlayerDialog;

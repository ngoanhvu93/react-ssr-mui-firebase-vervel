import { ImageUp, X } from "lucide-react";

import PlayerAvatar from "./PlayerAvatar";
import type { Player, Room } from "firebase/types";
import type { ModalMode } from "../page";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";

const EditPlayerDialog = (props: {
  editingPlayer: Player;
  setEditingPlayer: (
    playerOrUpdater: Player | ((prev: Player) => Player | null)
  ) => void;
  handleEditPlayer: (playerName: string) => void;
  getPlayerIndex: (playerId: string) => number;
  avatarPreview: string | null;
  setAvatarPreview: (avatarPreview: string) => void;
  selectedAvatar: File | null;
  setSelectedAvatar: (selectedAvatar: string) => void;
  editNameError: string;
  setEditNameError: (editNameError: string) => void;
  handleAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  checkEditNameDuplicate: (name: string) => void;
  modalMode: ModalMode;
  setModalMode: (modalMode: ModalMode) => void;
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
  room: Room;
  loading?: boolean;
  setShowModalEditPlayer: (showModalEditPlayer: boolean) => void;
}) => {
  const {
    editingPlayer,
    setEditingPlayer,
    handleEditPlayer,
    getPlayerIndex,
    avatarPreview,
    setAvatarPreview,
    editNameError,
    setEditNameError,
    handleAvatarChange,
    checkEditNameDuplicate,
    modalMode,
    setModalMode,
    setIsModalOpen,
    room,
    loading,
    setShowModalEditPlayer,
  } = props;

  return (
    <Dialog
      open={props.isModalOpen}
      onClose={() => props.setIsModalOpen(false)}
      fullWidth
    >
      <DialogTitle>
        <h2 className="text-xl font-bold">Sửa thông tin</h2>
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={() => props.setIsModalOpen(false)}
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
        }}
      >
        <X />
      </IconButton>
      <DialogContent dividers>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const playerNameInput = form.playerName as HTMLInputElement;
            if (playerNameInput && playerNameInput.value.trim()) {
              handleEditPlayer(playerNameInput.value);
            }
          }}
        >
          <div className="mb-4 flex items-center gap-3">
            {/* Avatar */}
            <div className="relative w-16 h-16">
              {avatarPreview || editingPlayer?.avatar ? (
                <div className="relative">
                  <label htmlFor="avatar-input">
                    <PlayerAvatar
                      index={getPlayerIndex(editingPlayer?.id ?? "")}
                      player={{
                        name: editingPlayer?.name || "",
                        avatar: (avatarPreview || editingPlayer?.avatar) ?? "",
                      }}
                      size="xlarge"
                    />
                  </label>

                  <X
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 cursor-pointer"
                    size={20}
                    onClick={() => {
                      setAvatarPreview("");
                      if (editingPlayer) {
                        setEditingPlayer((prev) =>
                          prev
                            ? {
                                ...prev,
                                avatar: "",
                              }
                            : null
                        );
                      }
                    }}
                  />
                </div>
              ) : (
                <label htmlFor="avatar-input">
                  <PlayerAvatar
                    index={getPlayerIndex(editingPlayer?.id ?? "")}
                    player={{
                      name: editingPlayer?.name || "",
                      avatar: (avatarPreview || editingPlayer?.avatar) ?? "",
                    }}
                    size="xlarge"
                  />
                </label>
              )}
              <label htmlFor="avatar-input">
                <ImageUp className="absolute bottom-0 right-0 border-2 border-white bg-blue-500 text-white p-0.5 rounded-full cursor-pointer hover:bg-blue-600 transition" />
              </label>
              <input
                title="Chọn ảnh đại diện"
                id="avatar-input"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>

            {/* Ô nhập tên */}
            <div className="flex-1">
              <TextField
                fullWidth
                autoFocus
                id="playerName"
                label="Tên người chơi"
                variant="standard"
                placeholder="Nhập tên người chơi"
                value={editingPlayer?.name || ""}
                onChange={(e) => {
                  if (modalMode === "edit") {
                    setEditingPlayer((prev) =>
                      prev
                        ? {
                            ...prev,
                            name: e.target.value,
                            avatar: editingPlayer?.avatar || "",
                          }
                        : null
                    );
                    checkEditNameDuplicate(e.target.value);
                  }
                }}
                error={!!editNameError}
                helperText={editNameError}
                required
                slotProps={{
                  input: {
                    inputProps: {
                      maxLength: 20,
                    },
                  },
                }}
              />
            </div>
          </div>
        </form>
      </DialogContent>
      <DialogActions>
        <Button
          size="large"
          onClick={() => {
            setIsModalOpen(false);
            setEditingPlayer({} as Player);
            setModalMode("add");
            setEditNameError("");
          }}
        >
          Hủy
        </Button>
        <Button
          size="large"
          variant="contained"
          onClick={() => handleEditPlayer(editingPlayer.name)}
          disabled={
            !!editNameError ||
            room.isCompleted ||
            loading ||
            !editingPlayer.name
          }
          loading={loading}
        >
          Cập nhật
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditPlayerDialog;

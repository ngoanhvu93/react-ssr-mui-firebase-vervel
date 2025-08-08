import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Camera, Loader, Users } from "lucide-react";

import { X } from "lucide-react";

import type { ILottoRoom } from "firebase/types";
import { CustomButton } from "~/components/CustomButton";
import PlayerAvatar from "~/components/PlayerAvatar";

const CreatePlayerInfoModal = (props: {
  showEnterNameModal: boolean;
  setShowEnterNameModal: (show: boolean) => void;
  lottoRoom: ILottoRoom;
  playerName: string;
  setPlayerName: (name: string) => void;
  avatarUrl: string;
  handleAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCreatePlayer: (e: React.FormEvent) => void;
  setAvatarUrl: (url: string) => void;
  isUploadingAvatar: boolean;
  isLoading: boolean;
}) => {
  const currentPlayerCount = props.lottoRoom?.players?.length || 0;
  const maxPlayers = 10;
  const isRoomFull = currentPlayerCount >= maxPlayers;

  return (
    <Dialog
      open={props.showEnterNameModal}
      onClose={() => {}}
      fullWidth
      maxWidth="sm"
      disableEscapeKeyDown
    >
      <DialogTitle>Nhập tên của bạn</DialogTitle>
      <DialogContent dividers>
        {/* Hiển thị thông tin số lượng người chơi */}
        <div className="flex items-center gap-2 mb-4 p-2 bg-blue-50 rounded-lg">
          <Users className="text-blue-600" size={16} />
          <span className="text-sm text-blue-700">
            {currentPlayerCount}/{maxPlayers} người chơi
            {isRoomFull && (
              <span className="text-red-600 font-medium ml-2">
                (Phòng đã đầy)
              </span>
            )}
          </span>
        </div>

        <form onSubmit={props.handleCreatePlayer}>
          <div className="flex items-center gap-4 mb-4">
            <label htmlFor="avatar-input" className="cursor-pointer relative">
              <PlayerAvatar
                player={{
                  name: props.playerName,
                  avatar: props.avatarUrl || "",
                }}
                size="xlarge"
                index={props.lottoRoom?.players?.length || 0}
              />
              <input
                type="file"
                id="avatar-input"
                accept="image/*"
                onChange={props.handleAvatarChange}
                className="hidden"
              />
              {props.isUploadingAvatar && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  p-1">
                  <Loader className="animate-spin text-blue-500" />
                </div>
              )}
              {props.avatarUrl && (
                <X
                  size={24}
                  className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    props.setAvatarUrl("");
                  }}
                />
              )}
              <Camera className="absolute bottom-0 right-0 border-2 border-white bg-blue-500 text-white p-1 rounded-full cursor-pointer hover:bg-blue-600 transition" />
            </label>
            <input
              type="text"
              value={props.playerName}
              onChange={(e) => {
                e.preventDefault();
                e.stopPropagation();
                props.setPlayerName(e.target.value);
              }}
              placeholder="Nhập tên của bạn"
              className="w-full p-2 border border-gray-300 rounded-md"
              autoFocus
              required
            />
          </div>
          <CustomButton
            variant="primary"
            type="submit"
            className="w-full"
            disabled={
              !props.playerName.trim() ||
              props.isUploadingAvatar ||
              props.isLoading ||
              isRoomFull
            }
          >
            {props.isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader className="animate-spin" />
              </span>
            ) : isRoomFull ? (
              "Phòng đã đầy"
            ) : (
              "Bắt đầu chơi"
            )}
          </CustomButton>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePlayerInfoModal;

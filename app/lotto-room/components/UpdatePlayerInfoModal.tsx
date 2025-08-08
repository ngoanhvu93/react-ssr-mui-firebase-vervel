import { Camera, Loader } from "lucide-react";

import {
  CheckCircle,
  Info,
  Pencil,
  Save,
  UserX,
  X,
  XCircle,
} from "lucide-react";
import { CustomButton } from "~/components/CustomButton";
import PlayerAvatar from "~/components/PlayerAvatar";
import { cn } from "~/utils/cn";
import type { LottoPlayer, ILottoRoom } from "firebase/types";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

const UpdatePlayerInfoModal = (props: {
  selectedPlayer: LottoPlayer;
  setSelectedPlayer: (player: LottoPlayer) => void;
  showUpdatePlayerInfoModal: boolean;
  setShowUpdatePlayerInfoModal: (show: boolean) => void;
  setIsEditingName: (isEditing: boolean) => void;
  isEditingName: boolean;
  newPlayerName: string;
  setNewPlayerName: (name: string) => void;
  isUpdatingPlayer: boolean;
  updatePlayerInfo: () => void;
  userId: string;
  lottoRoom: ILottoRoom;
  handleAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setAvatarUrl: (url: string) => void;
  avatarUrl: string;
  promptRemovePlayer: (playerId: string) => void;
  isUploadingAvatar: boolean;
}) => {
  if (!props.selectedPlayer) return null;

  return (
    <Dialog
      open={props.showUpdatePlayerInfoModal}
      onClose={() => {
        props.setIsEditingName(false);
        props.setShowUpdatePlayerInfoModal(false);
      }}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        <h3 className="font-bold">Thông tin người chơi</h3>
      </DialogTitle>
      <DialogContent dividers>
        {props.selectedPlayer.id !== props.userId && (
          <div className="flex gap-2 items-center mb-2 text-blue-500">
            <Info size={16} />
            <span className="text-xs">Bạn không được sửa người chơi khác</span>
          </div>
        )}
        <div className="flex gap-4 items-center">
          <label
            htmlFor="edit-player-avatar"
            className={cn(" relative", {
              "cursor-pointer": props.selectedPlayer.id === props.userId,
            })}
          >
            <div className="relative">
              <PlayerAvatar
                player={{
                  name: props.newPlayerName,
                  avatar: props.avatarUrl || "",
                }}
                size="xlarge"
                index={
                  props.lottoRoom?.players?.findIndex(
                    (player) => player.id === props.selectedPlayer.id
                  ) || 0
                }
              />
              {props.isUploadingAvatar && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  p-1">
                  <Loader className="animate-spin text-blue-500" />
                </div>
              )}
              {props.selectedPlayer.id === props.userId && (
                <input
                  title="Chọn ảnh đại diện"
                  type="file"
                  id="edit-player-avatar"
                  className="hidden"
                  onChange={(e) => props.handleAvatarChange(e)}
                />
              )}
              {props.avatarUrl && props.selectedPlayer.id === props.userId && (
                <X
                  size={24}
                  className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    props.setAvatarUrl("");
                    props.setSelectedPlayer({
                      ...props.selectedPlayer,
                      avatar: "",
                    });
                  }}
                />
              )}
              {props.selectedPlayer.id === props.userId && (
                <Camera className="absolute bottom-0 right-0 border-2 border-white bg-blue-500 text-white p-1 rounded-full cursor-pointer hover:bg-blue-600 transition" />
              )}
            </div>
          </label>

          {props.isEditingName ? (
            <>
              <input
                type="text"
                value={props.newPlayerName}
                onChange={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  props.setIsEditingName(true);
                  props.setNewPlayerName(e.target.value);
                }}
                className="border-b-2 border-blue-500 font-semibold w-full outline-none bg-transparent focus:border-blue-500"
                placeholder="Nhập tên mới"
                autoFocus
              />
              <div className="flex gap-4">
                <CheckCircle
                  onClick={props.updatePlayerInfo}
                  size={24}
                  className="text-green-500"
                />
                <XCircle
                  onClick={() => {
                    props.setIsEditingName(false);
                    props.setNewPlayerName(props.selectedPlayer.name);
                  }}
                  size={24}
                  className="text-red-500"
                />
              </div>
            </>
          ) : (
            <>
              {props.selectedPlayer.id === props.userId ? (
                <p
                  onClick={() => {
                    props.setIsEditingName(true);
                    props.setNewPlayerName(props.selectedPlayer.name);
                  }}
                  className="font-semibold w-full"
                >
                  {props.selectedPlayer.name}
                </p>
              ) : (
                <p className="font-semibold w-full">
                  {props.selectedPlayer.name}
                </p>
              )}
              <div className="flex gap-4">
                {props.selectedPlayer.id === props.userId && (
                  <Pencil
                    onClick={() => {
                      props.setIsEditingName(true);
                      props.setNewPlayerName(props.selectedPlayer.name);
                    }}
                    size={24}
                    className="text-blue-500"
                  />
                )}
                <UserX
                  onClick={() =>
                    props.promptRemovePlayer(props.selectedPlayer.id)
                  }
                  size={24}
                  className="text-red-500"
                />
              </div>
            </>
          )}
        </div>
      </DialogContent>
      <DialogActions>
        <div className="flex gap-4 justify-end w-full">
          <CustomButton
            icon={<X size={16} />}
            variant="close"
            onClick={() => {
              props.setShowUpdatePlayerInfoModal(false);
              props.setIsEditingName(false);
              props.setNewPlayerName(props.selectedPlayer.name);
            }}
          >
            Đóng
          </CustomButton>
          {props.selectedPlayer.id === props.userId && (
            <CustomButton
              icon={
                props.isUpdatingPlayer ? (
                  <Loader className="animate-spin" size={16} />
                ) : (
                  <Save size={16} />
                )
              }
              variant="confirm"
              onClick={props.updatePlayerInfo}
              disabled={props.isUpdatingPlayer || props.isUploadingAvatar}
            >
              {props.isUpdatingPlayer ? "Đang lưu..." : "Lưu"}
            </CustomButton>
          )}
        </div>
      </DialogActions>
    </Dialog>
  );
};

export default UpdatePlayerInfoModal;

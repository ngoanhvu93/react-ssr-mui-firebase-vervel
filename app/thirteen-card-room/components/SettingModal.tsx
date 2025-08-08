import { Loader, RotateCcw, X } from "lucide-react";
import { Save } from "lucide-react";
import type { GameHistory, Room } from "firebase/types";
import toast from "react-hot-toast";
import { EditingRoomName } from "./EditingRoomName";
import { EditingWinningScore } from "./EditingWinningScore";
import type { GameRoundMode } from "../page";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Switch from "@mui/material/Switch";
import Divider from "@mui/material/Divider";

export const SettingModal = (props: {
  showAvatars: boolean;
  setShowAvatars: (showAvatars: boolean) => void;
  showRoundNumbers: boolean;
  setShowRoundNumbers: (showRoundNumbers: boolean) => void;
  showWinningScore: boolean;
  setShowWinningScore: (showWinningScore: boolean) => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (isSettingsOpen: boolean) => void;
  room: Room | GameHistory | null;
  showScoreMode: GameRoundMode;
  setShowScoreMode: (showScoreMode: GameRoundMode) => void;
  newRoomName?: string;
  setNewRoomName?: (newRoomName: string) => void;
  isEditingRoomName?: boolean;
  setIsEditingRoomName?: (isEditingRoomName: boolean) => void;
  loading?: boolean;
  isEditingWinningScore?: boolean;
  setIsEditingWinningScore?: (isEditingWinningScore: boolean) => void;
  newWinningScore: number;
  setNewWinningScore?: (newWinningScore: number) => void;
  handleSaveSetting: () => void;
  showSettingName?: boolean;
  showSettingWinningScore?: boolean;
}) => {
  return (
    <Dialog
      open={props.isSettingsOpen}
      onClose={() => props.setIsSettingsOpen(false)}
      fullWidth
    >
      <DialogTitle>
        <h2 className="text-xl font-bold">Cài đặt</h2>
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={() => props.setIsSettingsOpen(false)}
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
        }}
      >
        <X />
      </IconButton>
      <DialogContent dividers>
        <div className="space-y-4">
          {/* Add room name setting */}
          {props.showSettingName && (
            <EditingRoomName
              room={props.room as Room}
              isEditingRoomName={props.isEditingRoomName || false}
              setIsEditingRoomName={props.setIsEditingRoomName || (() => {})}
              newRoomName={props.newRoomName || ""}
              setNewRoomName={props.setNewRoomName || (() => {})}
              loading={props.loading || false}
            />
          )}
          {/* Add winning score setting */}
          {props.showSettingWinningScore && (
            <EditingWinningScore
              room={props.room as Room}
              isEditingWinningScore={props.isEditingWinningScore || false}
              setIsEditingWinningScore={
                props.setIsEditingWinningScore || (() => {})
              }
              newWinningScore={props.newWinningScore}
              setNewWinningScore={props.setNewWinningScore || (() => {})}
              loading={props.loading || false}
            />
          )}
          <Divider sx={{ my: 2 }} />

          <div>
            <label className="mb-2 block font-bold">Chế độ xem điểm</label>
            <div>
              <label className="flex items-center gap-2 cursor-pointer justify-between">
                <span className="text-sm font-medium">Điểm từng ván</span>
                <Switch
                  checked={props.showScoreMode === "points-per-game"}
                  onChange={() => props.setShowScoreMode("points-per-game")}
                  color="primary"
                />
              </label>
              <label className="flex items-center gap-2 cursor-pointer justify-between">
                <span className="text-sm font-medium">Điểm lũy tiến</span>
                <Switch
                  edge="end"
                  checked={props.showScoreMode === "progressive"}
                  onChange={() => props.setShowScoreMode("progressive")}
                  color="primary"
                />
              </label>
              <label className="flex items-center gap-2 cursor-pointer justify-between">
                <span className="text-sm font-medium">Chỉ tổng điểm</span>
                <Switch
                  edge="end"
                  checked={props.showScoreMode === "total"}
                  onChange={() => props.setShowScoreMode("total")}
                  color="primary"
                />
              </label>
            </div>
          </div>
          <Divider sx={{ margin: "16px 0" }} />

          <div>
            <label className="mb-2 block font-bold">Hiển thị</label>
            <label className="flex items-center gap-2 cursor-pointer justify-between">
              <span className="text-sm font-medium">Hiển thị ảnh đại diện</span>
              <Switch
                edge="end"
                checked={props.showAvatars}
                onChange={(e) => props.setShowAvatars(e.target.checked)}
                color="primary"
              />
            </label>
            <label className="flex items-center gap-2 cursor-pointer justify-between">
              <span className="text-sm font-medium">
                Hiển thị số thứ tự ván
              </span>
              <Switch
                edge="end"
                checked={props.showRoundNumbers}
                onChange={(e) => props.setShowRoundNumbers(e.target.checked)}
                color="primary"
              />
            </label>
            <label className="flex items-center gap-2 cursor-pointer justify-between">
              <span className="text-sm font-medium">
                Hiển thị điểm chiến thắng
              </span>
              <Switch
                edge="end"
                checked={props.showWinningScore}
                onChange={(e) => props.setShowWinningScore(e.target.checked)}
                color="primary"
              />
            </label>
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          size="large"
          startIcon={<RotateCcw size={20} />}
          variant="outlined"
          className="w-full"
          onClick={() => {
            props.setShowScoreMode("points-per-game");
            props.setShowAvatars(true);
            props.setShowRoundNumbers(true);
            props.setShowWinningScore(true);
            toast.success("Đã đặt lại cài đặt mặc định!");
          }}
        >
          Đặt lại
        </Button>
        <Button
          size="large"
          startIcon={<Save size={20} />}
          variant="contained"
          className="w-full"
          disabled={props.newRoomName?.trim().length === 0}
          onClick={() => {
            props.handleSaveSetting?.();
            props.setIsSettingsOpen(false);
            props.setIsEditingRoomName?.(false);
            props.setIsEditingWinningScore?.(false);
            toast.success("Đã lưu cài đặt!");
          }}
        >
          {props.loading ? <Loader className="size-4 animate-spin" /> : "Lưu"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

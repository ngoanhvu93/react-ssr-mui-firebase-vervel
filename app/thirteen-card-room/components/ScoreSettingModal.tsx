import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Fab from "@mui/material/Fab";
import IconButton from "@mui/material/IconButton";
import { Minus, Plus, X } from "lucide-react";

type CustomScores = {
  whiteWin: number;
  first: number;
  second: number;
  third: number;
  fourth: number;
};

export const ScoreSettingModal = (props: {
  isScoreSettingsOpen: boolean;
  setIsScoreSettingsOpen: (isScoreSettingsOpen: boolean) => void;
  customScores: CustomScores;
  setCustomScores: React.Dispatch<React.SetStateAction<CustomScores>>;
  resetDefaultScores: () => void;
}) => {
  return (
    <Dialog
      open={props.isScoreSettingsOpen}
      onClose={() => props.setIsScoreSettingsOpen(false)}
      fullWidth
    >
      <DialogTitle>
        <h2 className="text-xl font-bold">Cài đặt điểm</h2>
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={() => {
          props.setIsScoreSettingsOpen(false);
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
        <div className="w-full relative">
          <div className="space-y-4">
            <div className="flex items-center gap-2 justify-between">
              <label className="block flex-1 text-sm font-medium mb-1">
                Điểm tới trắng
              </label>
              <div className="flex items-center gap-1">
                <Fab
                  color="primary"
                  size="small"
                  title="Trừ điểm"
                  onClick={() =>
                    props.setCustomScores((prev) => ({
                      ...prev,
                      whiteWin: prev.whiteWin - 1,
                    }))
                  }
                >
                  <Minus size={16} />
                </Fab>
                <span className="w-10 text-center">
                  {props.customScores.whiteWin}
                </span>
                <Fab
                  color="primary"
                  size="small"
                  title="Tăng điểm"
                  onClick={() =>
                    props.setCustomScores((prev) => ({
                      ...prev,
                      whiteWin: prev.whiteWin + 1,
                    }))
                  }
                >
                  <Plus size={16} />
                </Fab>
              </div>
            </div>
            <div className="flex items-center gap-2 justify-between">
              <label className="block text-sm font-medium mb-1">
                Điểm hạng nhất
              </label>
              <div className="flex items-center gap-1">
                <Fab
                  title="Trừ điểm"
                  onClick={() =>
                    props.setCustomScores((prev) => ({
                      ...prev,
                      first: prev.first - 1,
                    }))
                  }
                  size="small"
                  color="primary"
                >
                  <Minus size={16} />
                </Fab>
                <span className="w-10 text-center">
                  {props.customScores.first}
                </span>
                <Fab
                  title="Tăng điểm"
                  onClick={() =>
                    props.setCustomScores((prev) => ({
                      ...prev,
                      first: prev.first + 1,
                    }))
                  }
                  size="small"
                  color="primary"
                >
                  <Plus size={16} />
                </Fab>
              </div>
            </div>
            <div className="flex items-center gap-2 justify-between">
              <label className="block text-sm font-medium mb-1">
                Điểm hạng nhì
              </label>
              <div className="flex items-center gap-1">
                <Fab
                  title="Trừ điểm"
                  onClick={() =>
                    props.setCustomScores((prev) => ({
                      ...prev,
                      second: prev.second - 1,
                    }))
                  }
                  size="small"
                  color="primary"
                >
                  <Minus size={16} />
                </Fab>
                <span className="w-10 text-center">
                  {props.customScores.second}
                </span>
                <Fab
                  title="Tăng điểm"
                  onClick={() =>
                    props.setCustomScores((prev) => ({
                      ...prev,
                      second: prev.second + 1,
                    }))
                  }
                  size="small"
                  color="primary"
                >
                  <Plus size={16} />
                </Fab>
              </div>
            </div>
            <div className="flex items-center gap-2 justify-between">
              <label className="block text-sm font-medium mb-1">
                Điểm hạng ba
              </label>
              <div className="flex items-center gap-1">
                <Fab
                  title="Trừ điểm"
                  onClick={() =>
                    props.setCustomScores((prev) => ({
                      ...prev,
                      third: prev.third - 1,
                    }))
                  }
                  size="small"
                  color="primary"
                >
                  <Minus size={16} />
                </Fab>
                <span className="w-10 text-center">
                  {props.customScores.third}
                </span>
                <Fab
                  title="Tăng điểm"
                  onClick={() =>
                    props.setCustomScores((prev) => ({
                      ...prev,
                      third: prev.third + 1,
                    }))
                  }
                  size="small"
                  color="primary"
                >
                  <Plus size={16} />
                </Fab>
              </div>
            </div>
            <div className="flex items-center gap-2 justify-between">
              <label className="block text-sm font-medium mb-1">
                Điểm hạng tư
              </label>
              <div className="flex items-center gap-1">
                <Fab
                  title="Trừ điểm"
                  onClick={() =>
                    props.setCustomScores((prev) => ({
                      ...prev,
                      fourth: prev.fourth - 1,
                    }))
                  }
                  size="small"
                  color="primary"
                >
                  <Minus size={16} />
                </Fab>
                <span className="w-10 text-center">
                  {props.customScores.fourth}
                </span>
                <Fab
                  title="Tăng điểm"
                  onClick={() =>
                    props.setCustomScores((prev) => ({
                      ...prev,
                      fourth: prev.fourth + 1,
                    }))
                  }
                  size="small"
                  color="primary"
                >
                  <Plus size={16} />
                </Fab>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          size="large"
          onClick={() => {
            props.setIsScoreSettingsOpen(false);
          }}
        >
          Hủy
        </Button>
        <Button
          size="large"
          variant="outlined"
          onClick={props.resetDefaultScores}
          fullWidth
        >
          Đặt lại
        </Button>
        <Button
          size="large"
          variant="contained"
          onClick={() => props.setIsScoreSettingsOpen(false)}
          fullWidth
        >
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

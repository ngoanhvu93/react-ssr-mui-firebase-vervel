import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import { AlertCircle, X } from "lucide-react";

export const ResetScoreDialog = (props: {
  isResetDialogOpen: boolean;
  setIsResetDialogOpen: (isOpen: boolean) => void;
  handleResetScores: () => void;
}) => {
  const { isResetDialogOpen, setIsResetDialogOpen, handleResetScores } = props;
  return (
    <Dialog
      open={isResetDialogOpen}
      onClose={() => setIsResetDialogOpen(false)}
      fullWidth
    >
      <DialogTitle>
        <h2 className="text-xl font-bold">Xác nhận xoá điểm số</h2>
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={() => setIsResetDialogOpen(false)}
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
        }}
      >
        <X />
      </IconButton>
      <DialogContent dividers>
        <div className="flex items-center gap-3 mb-4 text-yellow-600">
          <AlertCircle size={24} />
          <h3 className="text-lg font-bold">Xác nhận xoá điểm số</h3>
        </div>
        <p>Bạn có chắc chắn muốn xoá tất cả điểm số không?</p>
      </DialogContent>
      <DialogActions>
        <Button size="large" onClick={() => setIsResetDialogOpen(false)}>
          Hủy
        </Button>
        <Button size="large" variant="contained" onClick={handleResetScores}>
          Xác nhận
        </Button>
      </DialogActions>
    </Dialog>
  );
};

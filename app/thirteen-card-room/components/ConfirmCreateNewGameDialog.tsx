import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import { AlertCircle, X } from "lucide-react";

export const ConfirmCreateNewGameModal = (props: {
  isConfirmCreateNewGameOpen: boolean;
  setIsConfirmCreateNewGameOpen: (isOpen: boolean) => void;
  handleCreateNewGame: () => void;
}) => {
  return (
    <Dialog
      open={props.isConfirmCreateNewGameOpen}
      onClose={() => props.setIsConfirmCreateNewGameOpen(false)}
      fullWidth
    >
      <DialogTitle>
        <h2 className="text-xl font-bold">Xác nhận tạo ván mới</h2>
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={() => props.setIsConfirmCreateNewGameOpen(false)}
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
          <h3 className="text-lg font-bold">Xác nhận tạo ván mới</h3>
        </div>
        <p>
          Bạn có chắc chắn muốn tạo ván mới? Thao tác này sẽ xóa tất cả điểm số
          và dữ liệu ván chơi hiện tại.
        </p>
      </DialogContent>
      <DialogActions>
        <Button
          size="large"
          onClick={() => props.setIsConfirmCreateNewGameOpen(false)}
        >
          Hủy
        </Button>
        <Button
          size="large"
          variant="contained"
          color="primary"
          onClick={() => {
            props.handleCreateNewGame();
            props.setIsConfirmCreateNewGameOpen(false);
          }}
        >
          Xác nhận
        </Button>
      </DialogActions>
    </Dialog>
  );
};

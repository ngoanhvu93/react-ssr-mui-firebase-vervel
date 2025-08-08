import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { AlertCircle } from "lucide-react";

const NewGameDialog = (props: {
  showNewGameModal: boolean;
  setShowNewGameModal: (show: boolean) => void;
  createNewGame: () => void;
}) => {
  return (
    <Dialog
      open={props.showNewGameModal}
      onClose={() => props.setShowNewGameModal(false)}
      fullWidth
    >
      <DialogTitle>
        <h2 className="text-xl font-bold">Xác nhận tạo ván mới</h2>
      </DialogTitle>
      <DialogContent>
        <div className="flex items-center gap-3 mb-4 text-yellow-600">
          <AlertCircle size={24} />
          <h3 className="text-lg font-bold">Xác nhận tạo ván mới</h3>
        </div>
        <p className="mb-6">
          Bạn có chắc chắn muốn tạo ván mới? Ván này đang được gọi số, thao tác
          này sẽ kết thúc ván chơi hiện tại.
        </p>
      </DialogContent>
      <DialogActions>
        <div className="flex justify-end gap-2">
          <Button onClick={() => props.setShowNewGameModal(false)}>Hủy</Button>
          <Button
            variant="contained"
            onClick={() => {
              props.createNewGame();
              props.setShowNewGameModal(false);
            }}
          >
            Xác nhận
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  );
};

export default NewGameDialog;

import { DialogActions } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { AlertCircle } from "lucide-react";
import { CustomButton } from "~/components/CustomButton";

export default function ConfirmCreateTicket(props: {
  showNewTicketModal: boolean;
  setShowNewTicketModal: (show: boolean) => void;
  resetGame: () => void;
}) {
  return (
    <Dialog
      open={props.showNewTicketModal}
      onClose={() => props.setShowNewTicketModal(false)}
    >
      <DialogTitle>
        <div className="flex items-center gap-2 text-yellow-600">
          <AlertCircle size={24} />
          <h3 className="text-lg font-bold">Xác nhận đổi 1 vé khác</h3>
        </div>
      </DialogTitle>
      <DialogContent dividers>
        <p>
          Bạn có chắc chắn muốn đổi 1 vé khác? Thao tác này không thể hoàn tác.
        </p>
      </DialogContent>
      <DialogActions>
        <div className="flex justify-end gap-2">
          <CustomButton
            variant="secondary"
            onClick={() => props.setShowNewTicketModal(false)}
          >
            Hủy
          </CustomButton>
          <CustomButton variant="primary" onClick={props.resetGame}>
            Xác nhận
          </CustomButton>
        </div>
      </DialogActions>
    </Dialog>
  );
}

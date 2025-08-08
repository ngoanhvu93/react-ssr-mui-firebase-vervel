import { DialogActions, DialogContent, DialogTitle } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import { AlertCircle } from "lucide-react";
import { CustomButton } from "~/components/CustomButton";

const ConfirmCreateTickets = (props: {
  showPairTicketModal: boolean;
  setShowPairTicketModal: (show: boolean) => void;
  createTicketPair: () => void;
}) => {
  return (
    <Dialog
      open={props.showPairTicketModal}
      onClose={() => props.setShowPairTicketModal(false)}
    >
      <DialogTitle>
        <div className="flex items-center gap-2 text-yellow-600">
          <AlertCircle size={24} />
          <h3 className="text-lg font-bold">Xác nhận đổi 2 vé khác</h3>
        </div>
      </DialogTitle>
      <DialogContent dividers>
        <p>
          Bạn có chắc chắn muốn đổi 2 vé khác? Thao tác này không thể hoàn tác.
        </p>
      </DialogContent>
      <DialogActions>
        <div className="flex justify-end gap-2">
          <CustomButton
            variant="secondary"
            onClick={() => props.setShowPairTicketModal(false)}
          >
            Hủy
          </CustomButton>
          <CustomButton variant="primary" onClick={props.createTicketPair}>
            Xác nhận
          </CustomButton>
        </div>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmCreateTickets;

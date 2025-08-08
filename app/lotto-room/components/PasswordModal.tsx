import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { CustomButton } from "~/components/CustomButton";

const PasswordModal = (props: {
  showPasswordModal: boolean;
  setShowPasswordModal: (show: boolean) => void;
  enteredPassword: string;
  setEnteredPassword: (password: string) => void;
  handlePasswordSubmit: () => void;
}) => {
  return (
    <Dialog
      open={props.showPasswordModal}
      onClose={() => props.setShowPasswordModal(false)}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>Xoá người chơi</DialogTitle>
      <DialogContent>
        <input
          type="password"
          value={props.enteredPassword}
          onChange={(e) => props.setEnteredPassword(e.target.value)}
          placeholder="Nhập mật khẩu để xoá người chơi"
          className="w-full p-2 border border-gray-300 rounded-md mb-4"
          autoFocus
          required
        />
        <div className="flex justify-end gap-2">
          <CustomButton
            variant="secondary"
            onClick={() => props.setShowPasswordModal(false)}
          >
            Hủy
          </CustomButton>
          <CustomButton
            disabled={!props.enteredPassword}
            variant="primary"
            onClick={props.handlePasswordSubmit}
          >
            Xác nhận
          </CustomButton>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PasswordModal;

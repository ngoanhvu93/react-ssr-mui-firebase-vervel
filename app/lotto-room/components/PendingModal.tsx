import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { X } from "lucide-react";
import { CustomButton } from "~/components/CustomButton";

const PendingModal = (props: {
  showPendingModal: boolean;
  setShowPendingModal: (show: boolean) => void;
  pendingRows: number[];
  pendingNumbers: { waiting: number }[];
}) => {
  return (
    <Dialog
      open={props.showPendingModal}
      onClose={() => props.setShowPendingModal(false)}
      fullWidth
    >
      <DialogTitle>
        <h3 className="text-2xl sm:text-2xl text-center font-bold text-green-500">
          ⏳ Đợi số để kinh! ⏳
        </h3>
      </DialogTitle>
      <DialogContent dividers>
        <div className=" flex flex-wrap gap-2 justify-center">
          {props.pendingRows.map((rowIndex, idx) => {
            let bgColor = "bg-yellow-400";
            let textColor = "text-black";
            const waitingNumber = props.pendingNumbers[rowIndex]?.waiting;
            if (waitingNumber !== undefined && !isNaN(Number(waitingNumber))) {
              const n = Number(waitingNumber);
              if (n >= 0 && n <= 9) {
                bgColor = "bg-fuchsia-600"; // Rực rỡ, nổi bật
                textColor = "text-white";
              } else if (n >= 10 && n <= 19) {
                bgColor = "bg-cyan-500";
                textColor = "text-black";
              } else if (n >= 20 && n <= 29) {
                bgColor = "bg-lime-400";
                textColor = "text-black";
              } else if (n >= 30 && n <= 39) {
                bgColor = "bg-orange-500";
                textColor = "text-white";
              } else if (n >= 40 && n <= 49) {
                bgColor = "bg-red-600";
                textColor = "text-white";
              } else if (n >= 50 && n <= 59) {
                bgColor = "bg-amber-400";
                textColor = "text-black";
              } else if (n >= 60 && n <= 69) {
                bgColor = "bg-violet-700";
                textColor = "text-white";
              } else if (n >= 70 && n <= 79) {
                bgColor = "bg-emerald-500";
                textColor = "text-black";
              } else if (n >= 80 && n <= 89) {
                bgColor = "bg-pink-500";
                textColor = "text-white";
              } else if (n >= 90 && n <= 99) {
                bgColor = "bg-black";
                textColor = "text-yellow-300";
              }
            }
            return (
              <div
                key={idx}
                className={`size-12 p-2 text-xs border-2 ring-1 ring-white shadow-lg ${textColor} ${bgColor} flex items-center justify-center font-extrabold rounded-full transition-colors duration-200`}
                style={{
                  outline: "2px solid #fff",
                  outlineOffset: "-2px",
                }}
              >
                <span className={`text-base font-extrabold ${textColor}`}>
                  {props.pendingNumbers[rowIndex]?.waiting}
                </span>
              </div>
            );
          })}
        </div>
      </DialogContent>
      <DialogActions>
        <CustomButton
          icon={<X size={16} />}
          className="w-full"
          onClick={() => props.setShowPendingModal(false)}
        >
          Đóng
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
};

export default PendingModal;

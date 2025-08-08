import { RefreshCw } from "lucide-react";
import type { ILottoRoom } from "firebase/types";
import { CustomButton } from "~/components/CustomButton";

const ChangeTicket = (props: {
  setShowNewTicketModal: (show: boolean) => void;
  setShowPairTicketModal: (show: boolean) => void;
  lottoRoom: ILottoRoom;
}) => {
  return (
    <>
      {props.lottoRoom?.status === "waiting" && (
        <div className="flex gap-1 w-full justify-between p-1">
          <CustomButton
            icon={<RefreshCw />}
            onClick={() => props.setShowNewTicketModal(true)}
            className="w-full"
          >
            Đổi 1 vé khác
          </CustomButton>
          <CustomButton
            icon={<RefreshCw />}
            onClick={() => props.setShowPairTicketModal(true)}
            className="w-full"
          >
            Đổi 2 vé khác
          </CustomButton>
        </div>
      )}
    </>
  );
};

export default ChangeTicket;

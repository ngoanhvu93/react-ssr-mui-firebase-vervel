import { RefreshCw } from "lucide-react";
import type { ILottoRoom } from "firebase/types";
import { CustomButton } from "~/components/CustomButton";

const NewGameButton = (props: {
  lottoRoom: ILottoRoom;
  setShowNewGameModal: (showNewGameModal: boolean) => void;
}) => {
  const { lottoRoom, setShowNewGameModal } = props;
  return (
    <>
      {lottoRoom?.status === "playing" && (
        <div className="flex w-full justify-center mx-auto mb-2">
          <CustomButton
            icon={<RefreshCw />}
            variant="primary"
            className="w-full"
            onClick={() => setShowNewGameModal(true)}
          >
            Tạo ván mới
          </CustomButton>
        </div>
      )}
    </>
  );
};

export default NewGameButton;

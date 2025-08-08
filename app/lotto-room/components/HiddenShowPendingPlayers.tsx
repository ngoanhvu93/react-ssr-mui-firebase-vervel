import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { CustomButton } from "~/components/CustomButton";

const HiddenShowPendingPlayers = (props: {
  showPendingPlayers: boolean;
  setShowPendingPlayers: (showPendingPlayers: boolean) => void;
}) => {
  const { showPendingPlayers, setShowPendingPlayers } = props;
  return (
    <>
      <div className="flex items-center gap-2 justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2 text-yellow-700">
          <AlertCircle size={16} />
          Người chơi đợi số
        </h3>
        {showPendingPlayers ? (
          <CustomButton
            icon={<EyeOff size={16} />}
            className="w-20"
            variant="close"
            size="small"
            onClick={() => setShowPendingPlayers(false)}
          >
            Ẩn
          </CustomButton>
        ) : (
          <CustomButton
            icon={<Eye size={16} />}
            className="w-20"
            variant="confirm"
            size="small"
            onClick={() => setShowPendingPlayers(true)}
          >
            Hiện
          </CustomButton>
        )}
      </div>
    </>
  );
};

export default HiddenShowPendingPlayers;

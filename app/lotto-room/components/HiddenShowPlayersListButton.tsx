import { Eye } from "lucide-react";

import { EyeOff } from "lucide-react";
import { CustomButton } from "~/components/CustomButton";

const HiddenShowPlayersListButton = (props: {
  showPlayersList: boolean;
  setShowPlayersList: (showPlayersList: boolean) => void;
}) => {
  const { showPlayersList, setShowPlayersList } = props;
  return (
    <>
      {showPlayersList ? (
        <CustomButton
          icon={<EyeOff size={16} />}
          variant="close"
          onClick={() => setShowPlayersList(!showPlayersList)}
          size="small"
          className="w-20"
        >
          Ẩn
        </CustomButton>
      ) : (
        <CustomButton
          icon={<Eye size={16} />}
          variant="confirm"
          onClick={() => setShowPlayersList(!showPlayersList)}
          size="small"
          className="w-20"
        >
          Hiện
        </CustomButton>
      )}
    </>
  );
};

export default HiddenShowPlayersListButton;

import { IconButton } from "@mui/material";
import { EmojiEvents } from "@mui/icons-material";
import type { ILottoRoom } from "firebase/types";

const ReviewResultsButton = (props: {
  lottoRoom: ILottoRoom;
  setShowCongratulationsModal: (showCongratulationsModal: boolean) => void;
}) => {
  const { lottoRoom, setShowCongratulationsModal } = props;

  return (
    <>
      {lottoRoom?.status === "ended" && (
        <IconButton
          size="small"
          sx={{
            border: "1px solid",
            borderRadius: "100%",
          }}
          color="primary"
          onClick={() => {
            setShowCongratulationsModal(true);
          }}
        >
          <EmojiEvents fontSize="small" />
        </IconButton>
      )}
    </>
  );
};

export default ReviewResultsButton;

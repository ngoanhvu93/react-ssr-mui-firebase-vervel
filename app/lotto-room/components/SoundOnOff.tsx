import IconButton from "@mui/material/IconButton";
import { Volume2, VolumeX } from "lucide-react";
import type { ILottoRoom } from "firebase/types";
const MusicOnOff = (props: {
  lottoRoom: ILottoRoom;
  isPlaying: boolean;
  togglePlay: () => void;
}) => {
  return (
    <IconButton
      size="small"
      sx={{
        border: "1px solid",
        borderRadius: "100%",
      }}
    >
      {props.isPlaying ? (
        <Volume2 size={20} onClick={props.togglePlay} />
      ) : (
        <VolumeX size={20} onClick={props.togglePlay} />
      )}
    </IconButton>
  );
};

export default MusicOnOff;

import { RefreshCcw } from "lucide-react";
import type { ILottoRoom } from "firebase/types";
import { useState, useEffect } from "react";
import { CustomButton } from "~/components/CustomButton";
import AppBar from "@mui/material/AppBar";

const CreateNewGameButton = (props: {
  lottoRoom: ILottoRoom;
  setShowNewGameModal: (showNewGameModal: boolean) => void;
}) => {
  const { lottoRoom, setShowNewGameModal } = props;
  const [countdown, setCountdown] = useState(15);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (lottoRoom?.status === "ended" && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prevCount) => prevCount - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [lottoRoom?.status, countdown]);

  return (
    <>
      {lottoRoom?.status === "ended" && (
        <AppBar
          position="sticky"
          className="p-1"
          sx={(theme) => ({
            position: "sticky",
            bottom: 0,
            zIndex: 40,
            width: "100%",
            boxShadow:
              theme.palette.mode === "dark"
                ? "0 2px 8px rgba(0,0,0,0.5)"
                : "0 2px 4px rgba(0,0,0,0.08)",
            backgroundColor:
              theme.palette.mode === "dark"
                ? "rgba(24, 24, 28, 0.85)"
                : "rgba(255,255,255,0.85)",
            backdropFilter: "blur(8px)",
            color: theme.palette.text.primary,
            borderTop:
              theme.palette.mode === "dark"
                ? "1px solid rgba(255,255,255,0.08)"
                : "1px solid rgba(0,0,0,0.06)",
          })}
        >
          {countdown > 0 ? (
            <CustomButton className="w-full" icon={<RefreshCcw />}>
              Tạo ván mới sau: {countdown}s
            </CustomButton>
          ) : (
            <CustomButton
              className="w-full"
              onClick={() => setShowNewGameModal(true)}
              icon={<RefreshCcw />}
            >
              Tạo ván mới
            </CustomButton>
          )}
        </AppBar>
      )}
    </>
  );
};

export default CreateNewGameButton;

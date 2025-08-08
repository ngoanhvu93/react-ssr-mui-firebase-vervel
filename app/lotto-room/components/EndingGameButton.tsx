import AppBar from "@mui/material/AppBar";
import type { ILottoRoom } from "firebase/types";
import { CustomButton } from "~/components/CustomButton";

const EndingGameButton = (props: { lottoRoom: ILottoRoom }) => {
  const { lottoRoom } = props;
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
          <CustomButton variant="danger" className="w-full">
            Ván chơi này đã kết thúc
          </CustomButton>
        </AppBar>
      )}
    </>
  );
};

export default EndingGameButton;

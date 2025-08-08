import { Play } from "lucide-react";
import { Loader } from "lucide-react";
import type { ILottoRoom } from "firebase/types";
import { CustomButton } from "~/components/CustomButton";
import { cn } from "~/utils/cn";
import AppBar from "@mui/material/AppBar";

const CallingButton = (props: {
  lottoRoom: ILottoRoom;
  isCalling: boolean;
  isCallingNumber: boolean;
  setIsCalling: (isCalling: boolean) => void;
  callRandomNumber: () => void;
  userId: string;
  isNumberInTickets: (number: number) => boolean;
  selectedNumbers: number[];
}) => {
  return (
    <>
      {(props.lottoRoom?.status === "waiting" ||
        props.lottoRoom?.status === "playing") && (
        <>
          {(props.lottoRoom?.status === "waiting" ||
            props.lottoRoom?.players?.find(
              (player) => player.isCallerNumber && player.id === props.userId
            )) && (
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
              <CustomButton
                icon={
                  props.isCalling || props.isCallingNumber ? (
                    <Loader className=" animate-spin text-white" />
                  ) : (
                    <Play />
                  )
                }
                variant="primary"
                size="medium"
                onClick={() => {
                  props.setIsCalling(true);
                  props.callRandomNumber();
                }}
                className={cn(
                  "w-full relative overflow-hidden transition-all duration-300",
                  {
                    "animate-none": !props.isCallingNumber,
                    "animate-pulse bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 background-animate":
                      props.isCallingNumber,
                  }
                )}
                disabled={Boolean(
                  props.isCalling ||
                    props.isCallingNumber ||
                    props.lottoRoom?.calledNumbers?.length === 90 ||
                    // Sửa điều kiện kiểm tra số đã đánh dấu
                    (props.lottoRoom?.lastCalledNumber &&
                      props.isNumberInTickets(
                        props.lottoRoom.lastCalledNumber
                      ) &&
                      !props.selectedNumbers.includes(
                        props.lottoRoom.lastCalledNumber
                      ) &&
                      props.lottoRoom.calledNumbers?.length > 0)
                )}
              >
                {props.isCallingNumber || props.isCalling ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-bounce">Đang</span>
                    <span
                      className="animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    >
                      kêu
                    </span>
                    <span
                      className="animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    >
                      ...
                    </span>
                    <div className="flex size-6 items-center justify-center bg-gradient-to-r from-green-500 transition-all duration-300 to-emerald-500 text-white animate-bounce shadow-lg ring-2 ring-green-300 ring-offset-2 rounded-full"></div>
                  </span>
                ) : (
                  <span className="relative group">
                    <span className="absolute -inset-1 blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></span>
                    <span className="relative">
                      {props.lottoRoom?.calledNumbers?.length === 90 ? (
                        "Đã kêu hết số"
                      ) : props.lottoRoom?.lastCalledNumber &&
                        props.isNumberInTickets(
                          props.lottoRoom.lastCalledNumber
                        ) &&
                        !props.selectedNumbers.includes(
                          props.lottoRoom.lastCalledNumber
                        ) &&
                        props.lottoRoom.calledNumbers?.length > 0 ? (
                        <div className="flex items-center gap-2">
                          <span> Đánh dấu số </span>
                          <span className="bg-gradient-to-r rounded-full font-bold flex items-center justify-center size-6 from-green-500  to-emerald-500 text-white shadow-lg ring-2 ring-green-300 ring-offset-2">
                            {props.lottoRoom.lastCalledNumber}
                          </span>
                        </div>
                      ) : (
                        "Kêu Số"
                      )}
                    </span>
                  </span>
                )}
              </CustomButton>
            </AppBar>
          )}
        </>
      )}
    </>
  );
};

export default CallingButton;

import { Heart } from "lucide-react";
import { X } from "lucide-react";
import type { ILottoRoom, WinningPlayer } from "firebase/types";
import PlayerAvatar from "~/components/PlayerAvatar";
import { cn } from "~/utils/cn";
import Confetti from "react-confetti";
import { CustomButton } from "~/components/CustomButton";
import Dialog from "@mui/material/Dialog";
const CongratulationsDialog = (props: {
  showCongratulationsModal: boolean;
  setShowCongratulationsModal: (show: boolean) => void;
  winners: WinningPlayer[];
  lottoRoom: ILottoRoom;
  lastCalledNumber: number;
}) => {
  return (
    <>
      <div className="fixed top-0 left-0 h-10 z-[9999]">
        <Confetti />
      </div>
      <Dialog
        open={props.showCongratulationsModal}
        onClose={() => props.setShowCongratulationsModal(false)}
        fullWidth
      >
        <div className="  p-4 rounded-lg shadow-lg w-full relative">
          <div className="flex items-center justify-center flex-col">
            <h3 className="text-xl sm:text-2xl font-bold text-yellow-600 mb-2">
              🎉 Chúc mừng! 🎉
            </h3>
            <div className="w-full">
              <p className="text-center font-semibold mb-2">
                {props.winners?.length === 1 ? (
                  "Người chơi đã kinh"
                ) : (
                  <div className="flex flex-col justify-center items-center gap-1">
                    Các người chơi đã kinh
                    <span className=" text-gray-500">
                      (kinh trùng chia đều)
                    </span>
                  </div>
                )}
              </p>

              {props.winners?.map((winner, index) => {
                const player = props.lottoRoom?.players?.find(
                  (player) => player.id === winner.id
                );
                return (
                  <div
                    key={index}
                    className="font-bold flex flex-col gap-2 items-center bg-yellow-300 rounded-md mb-2 border border-yellow-500 w-full p-4"
                  >
                    <PlayerAvatar
                      player={{
                        name: player?.name || "",
                        avatar: player?.avatar || "",
                      }}
                      index={player?.index || 0}
                      size="xlarge"
                    />
                    <p className="text-center font-bold text-lg text-black">
                      {winner.name}
                    </p>
                    <div className="flex gap-4">
                      {winner.fiveWinNumbers.map((num, index) => (
                        <div
                          key={index}
                          className={cn(
                            "size-10 flex items-center justify-center font-bold text-2xl text-center  bg-red-600 text-white p-2 rounded-full ring-2 ring-red-300 ring-offset-2 shadow-lg",
                            {
                              " bg-gradient-to-r rounded-full from-green-500 transition-all duration-300 to-emerald-500 text-white  animate-bounce ring-2 ring-green-300 ring-offset-2":
                                num === props.lastCalledNumber,
                            }
                          )}
                        >
                          {num}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex gap-4 justify-center mt-4 w-full">
            <CustomButton
              className="w-full"
              icon={<X />}
              variant="close"
              onClick={() => props.setShowCongratulationsModal(false)}
            >
              Đóng
            </CustomButton>
            <CustomButton
              className="w-full"
              variant="primary"
              icon={<Heart color="red" />}
              onClick={() => {
                props.setShowCongratulationsModal(false);
                window.open(
                  "momo://?action=transfer&receiver=0969872363",
                  "_blank"
                );
              }}
            >
              Ủng hộ
            </CustomButton>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default CongratulationsDialog;

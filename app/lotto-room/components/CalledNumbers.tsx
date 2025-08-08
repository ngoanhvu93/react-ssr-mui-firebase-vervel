import type { ILottoRoom } from "firebase/types";
import { cn } from "~/utils/cn";
const CalledNumbers = (props: {
  lottoRoom: ILottoRoom;
  lastCalledNumber: number;
}) => {
  return (
    <>
      {props.lottoRoom?.status === "playing" &&
        props.lottoRoom?.calledNumbers
          ?.slice(-3)
          .reverse()
          .map((num, index) => (
            <span
              key={`selected-${num}-${index}`}
              className={cn(
                "size-6 flex items-center justify-center p-1 text-sm rounded-full font-bold bg-yellow-500 text-red-600 ring-1 ring-yellow-300 ring-offset-1",
                {
                  "bg-gradient-to-r text-2xl from-green-500 transition-all duration-300 to-emerald-500 text-white size-8 animate-bounce shadow-lg ring-2 ring-green-300 ring-offset-2":
                    num === props.lastCalledNumber,
                }
              )}
            >
              {num}
            </span>
          ))}
    </>
  );
};

export default CalledNumbers;

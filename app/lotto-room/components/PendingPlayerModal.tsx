import type { LottoPlayer } from "firebase/types";
import PlayerAvatar from "~/components/PlayerAvatar";

interface PendingPlayerProps {
  playersWithPending: LottoPlayer[];
}

const PendingPlayerModal = ({ playersWithPending }: PendingPlayerProps) => {
  return (
    <div className="grid grid-cols-2 gap-1 mt-1">
      {playersWithPending.map((player) => (
        <div
          key={player.id}
          className="flex items-center justify-between gap-1 w-full bg-green-500 border border-white rounded-lg shadow-md p-1"
        >
          <div className="flex flex-col items-center justify-start p-1 gap-1">
            <PlayerAvatar
              player={{
                name: player.name,
                avatar: player.avatar || "",
              }}
              size="small"
              index={player.index || 0}
            />
            <span className="text-center line-clamp-1 flex items-center justify-center text-gray-900">
              {player.name}
            </span>
          </div>

          <div className="flex-1 flex flex-wrap justify-start gap-1">
            {player?.pendingNumbers?.map((num, idx) => {
              let bgColor = "bg-yellow-400";
              let textColor = "text-black";
              if (typeof num === "number" || !isNaN(Number(num))) {
                const n = Number(num);
                if (n >= 0 && n <= 9) {
                  bgColor = "bg-fuchsia-600"; // Rực rỡ, nổi bật
                  textColor = "text-white";
                } else if (n >= 10 && n <= 19) {
                  bgColor = "bg-cyan-500";
                  textColor = "text-black";
                } else if (n >= 20 && n <= 29) {
                  bgColor = "bg-lime-400";
                  textColor = "text-black";
                } else if (n >= 30 && n <= 39) {
                  bgColor = "bg-orange-500";
                  textColor = "text-white";
                } else if (n >= 40 && n <= 49) {
                  bgColor = "bg-red-600";
                  textColor = "text-white";
                } else if (n >= 50 && n <= 59) {
                  bgColor = "bg-amber-400";
                  textColor = "text-black";
                } else if (n >= 60 && n <= 69) {
                  bgColor = "bg-violet-700";
                  textColor = "text-white";
                } else if (n >= 70 && n <= 79) {
                  bgColor = "bg-emerald-500";
                  textColor = "text-black";
                } else if (n >= 80 && n <= 89) {
                  bgColor = "bg-pink-500";
                  textColor = "text-white";
                } else if (n >= 90 && n <= 99) {
                  bgColor = "bg-black";
                  textColor = "text-yellow-300";
                }
              }
              return (
                <div
                  key={idx}
                  className={`size-7 p-2 text-xs border-2 border-white shadow-lg ${textColor} ${bgColor} flex items-center justify-center font-extrabold rounded-full transition-colors duration-200`}
                  style={{
                    outline: "2px solid #fff",
                    outlineOffset: "-2px",
                  }}
                >
                  <span className={`text-base font-extrabold ${textColor}`}>
                    {num}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PendingPlayerModal;

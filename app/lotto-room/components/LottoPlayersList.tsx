import PlayerAvatar from "~/components/PlayerAvatar";
import { cn } from "~/utils/cn";
import type { LottoPlayer, ILottoRoom } from "firebase/types";

const PlayersList = ({
  lottoRoom,
  onlineUsers,
  handlePlayerClick,
}: {
  lottoRoom: ILottoRoom;
  onlineUsers: Record<string, boolean>;
  handlePlayerClick: (player: LottoPlayer) => void;
}) => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-1 w-full p-1 mb-1">
      {lottoRoom?.players?.map((player, index) => (
        <div
          key={player.id}
          className="flex flex-col justify-center items-center cursor-pointer group relative"
          onClick={() => {
            handlePlayerClick(player);
          }}
        >
          <div className="relative">
            <PlayerAvatar
              player={{
                name: player.name,
                avatar: player.avatar || "",
              }}
              size="medium"
              index={index}
            />
            <span
              className={cn(
                "size-3 rounded-full absolute bottom-1 -right-1 border border-white -translate-x-1/2 translate-y-1/2 ",
                {
                  "bg-green-500": onlineUsers[player.id],
                  "bg-gray-400": !onlineUsers[player.id],
                }
              )}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default PlayersList;

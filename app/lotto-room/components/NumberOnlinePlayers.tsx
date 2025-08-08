import type { ILottoRoom } from "firebase/types";
import { cn } from "~/utils/cn";

const NumberOnlinePlayers = (props: {
  lottoRoom: ILottoRoom;
  onlineUsers: Record<string, boolean>;
  onClick: () => void;
  isLoggedIn?: boolean;
}) => {
  const currentPlayerCount = props.lottoRoom?.players?.length || 0;
  const maxPlayers = 10;
  const onlinePlayerCount =
    props.lottoRoom?.players?.filter((player) => props.onlineUsers[player.id])
      .length || 0;

  return (
    <span className="font-medium flex items-center gap-2 cursor-pointer">
      <>
        <span
          className={cn(
            "size-5 flex items-center justify-center text-xs rounded-full font-bold",
            currentPlayerCount >= maxPlayers ? "bg-red-500" : "bg-green-500"
          )}
          title={`${onlinePlayerCount} online / ${currentPlayerCount}/${maxPlayers} tổng`}
        >
          {onlinePlayerCount}
        </span>
        {currentPlayerCount >= maxPlayers && (
          <span className="text-xs text-red-600 font-medium">(Đầy)</span>
        )}
      </>
    </span>
  );
};

export default NumberOnlinePlayers;

import type { ILottoRoom } from "firebase/types";
import PlayerAvatar from "~/components/PlayerAvatar";

const LottoRoomInfomation = (props: { lottoRoom: ILottoRoom }) => {
  const callingPlayers =
    props.lottoRoom?.players?.filter((player) => player.isCallerNumber) || [];

  return (
    <>
      {callingPlayers.length > 0 ? (
        <div className="flex items-center">
          <span className="font-semibold mr-1">Người kêu số: </span>
          <PlayerAvatar
            size="small"
            player={{
              name: callingPlayers[0].name,
              avatar: callingPlayers[0].avatar || "",
            }}
            index={callingPlayers[0].index}
          />
          <span className="ml-1 font-semibold line-clamp-1 max-w-20">
            {callingPlayers.map((player) => player.name).join(", ")}
          </span>
        </div>
      ) : (
        <div className="flex items-center mt-1">
          <span className="font-semibold">
            Chưa có người chơi nào đang gọi số
          </span>
        </div>
      )}
    </>
  );
};

export default LottoRoomInfomation;

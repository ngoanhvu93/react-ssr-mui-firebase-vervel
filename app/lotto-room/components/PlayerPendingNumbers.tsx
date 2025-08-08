import type { ILottoRoom } from "firebase/types";
import PendingPlayerModal from "./PendingPlayerModal";
import HiddenShowPendingPlayers from "./HiddenShowPendingPlayers";

const PlayerPendingNumbers = (props: {
  lottoRoom: ILottoRoom;
  showPendingPlayers: boolean;
  setShowPendingPlayers: (showPendingPlayers: boolean) => void;
}) => {
  const { lottoRoom, showPendingPlayers, setShowPendingPlayers } = props;
  if (!lottoRoom?.players || lottoRoom.players.length === 0) return null;

  // Get players with pending numbers, excluding the current player
  const playersWithPending = lottoRoom.players.filter(
    (player) => player.pendingNumbers && player.pendingNumbers.length > 0
  );

  if (playersWithPending.length === 0) return null;

  return (
    <>
      {(lottoRoom?.status === "playing" || lottoRoom?.status === "ended") && (
        <div
          className="w-full p-1 border border-yellow-400 shadow-md"
          style={{
            background: "linear-gradient(90deg, #fef08a 0%, #facc15 100%)",
            fontWeight: 700,
          }}
        >
          <HiddenShowPendingPlayers
            showPendingPlayers={showPendingPlayers}
            setShowPendingPlayers={setShowPendingPlayers}
          />
          {showPendingPlayers && (
            <PendingPlayerModal playersWithPending={playersWithPending} />
          )}
        </div>
      )}
    </>
  );
};

export default PlayerPendingNumbers;

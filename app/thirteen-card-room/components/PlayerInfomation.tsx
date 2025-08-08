import type { GameHistory, Player } from "firebase/types";

import type { Room } from "firebase/types";
import PlayerAvatar from "./PlayerAvatar";

export const PlayerInfomation = (props: {
  room: Room | GameHistory | null;
  showAvatars: boolean;
  setEditingPlayer: (player: Player) => void;
  setModalMode: (mode: string) => void;
  setShowModalEditPlayer: (open: boolean) => void;
  setSelectedAvatar: (avatar: string | null) => void;
  setAvatarPreview: (avatar: string | null) => void;
  setEditNameError: (error: string | null) => void;
}) => {
  const {
    room,
    showAvatars,
    setEditingPlayer,
    setModalMode,
    setShowModalEditPlayer,
    setSelectedAvatar,
    setAvatarPreview,
    setEditNameError,
  } = props;

  const calculateRanksWithGap = (players: Player[]): (number | null)[] => {
    const scores = players.map((p) => p.totalScore);

    const allZero = scores.every((score) => score === 0);
    if (allZero) return players.map(() => null);

    const sortedPlayers = [...players].sort(
      (a, b) => b.totalScore - a.totalScore
    );

    const scoreToRank = new Map<number, number>();
    let currentRank = 1;

    sortedPlayers.forEach((player, index) => {
      if (!scoreToRank.has(player.totalScore)) {
        scoreToRank.set(player.totalScore, currentRank);
      }
      currentRank = index + 2; // tăng theo index + 2 để tạo khoảng
    });

    return players.map((p) => scoreToRank.get(p.totalScore) ?? null);
  };

  return (
    <div className="w-full pt-2 pb-1">
      <div className="flex justify-between items-center">
        {room?.players.map((player, index) => (
          <div key={player.id} className="w-1/4 text-sm font-medium relative">
            <div className="text-center">
              <div className="flex justify-center flex-col items-center gap-2">
                {showAvatars ? (
                  <div
                    onClick={() => {
                      setEditingPlayer(player);
                      setModalMode("edit");
                      setShowModalEditPlayer(true);
                      setSelectedAvatar(null);
                      setAvatarPreview(player.avatar);
                      setEditNameError(null);
                    }}
                    className=" cursor-pointer"
                  >
                    {(() => {
                      const ranks = calculateRanksWithGap(room?.players ?? []);
                      const rank = ranks[index];
                      switch (rank) {
                        case 1:
                          return (
                            <span className="text-red-500 text-xl">♥️</span>
                          );
                        case 2:
                          return (
                            <span className="text-red-500 text-xl">♦️</span>
                          );
                        case 3:
                          return <span className="text-black text-xl">♣️</span>;
                        case 4:
                          return <span className="text-black text-xl">♠️</span>;
                        default:
                          return null;
                      }
                    })()}

                    {player.avatar ? (
                      <PlayerAvatar
                        key={index}
                        player={{
                          name: player.name,
                          avatar: player.avatar,
                        }}
                        size="xlarge"
                        index={index}
                        onClick={() => {
                          setEditingPlayer(player);
                          setModalMode("edit");
                          setShowModalEditPlayer(true);
                          setSelectedAvatar(null);
                          setAvatarPreview(player.avatar);
                          setEditNameError(null);
                        }}
                      />
                    ) : (
                      <PlayerAvatar
                        key={index}
                        player={player}
                        size="xlarge"
                        index={index}
                      />
                    )}
                  </div>
                ) : null}
                <div className="text-center w-full">
                  <h3 className="font-semibold text-sm md:text-base text-center line-clamp-1">
                    {player.name}
                  </h3>
                  <p className="text-xl font-bold text-center text-red-500">
                    {player.totalScore}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

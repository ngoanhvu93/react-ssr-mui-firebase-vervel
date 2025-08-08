import Divider from "@mui/material/Divider";
import ListItemButton from "@mui/material/ListItemButton";
import type { GameRoundMode } from "../page";
import type { GameHistory, Room } from "firebase/types";

export const GameRoundProgressive = (props: {
  room: Room | GameHistory | null;
  showScoreMode: GameRoundMode;
  showRoundNumbers: boolean;
  handleEditRoundClick: (roundIndex: number) => void;
}) => {
  const calculateProgressiveScores = (scores: number[]) => {
    return scores.reduce((acc, score, index) => {
      acc[index] = (acc[index - 1] || 0) + score;
      return acc;
    }, [] as number[]);
  };
  return (
    <div className="w-full">
      {props.showScoreMode === "progressive" && (
        <div>
          {props.room?.players[0].scores.map((_, roundIndex) => (
            <>
              <ListItemButton
                key={roundIndex}
                sx={{
                  position: "relative",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0px",
                  margin: "0px",
                  fontSize: "16px",
                }}
                onClick={() => props.handleEditRoundClick(roundIndex)}
              >
                {props.room?.players.map((player) => {
                  const progressiveScores = calculateProgressiveScores(
                    player.scores
                  );
                  return (
                    <div
                      key={player.id}
                      className="py-2 text-center w-1/4 font-semibold"
                    >
                      {progressiveScores[roundIndex]}
                    </div>
                  );
                })}
                {props.showRoundNumbers && (
                  <span className="absolute left-0 font-light text-xs">
                    {roundIndex + 1}
                  </span>
                )}
              </ListItemButton>
              <Divider />
            </>
          ))}
        </div>
      )}
    </div>
  );
};

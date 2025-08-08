import { EditIcon, Plus, RefreshCw, Target } from "lucide-react";
import type { GameHistory, Room } from "firebase/types";
import { useEffect, useState } from "react";
import { cn } from "~/lib/utils";
import Fab from "@mui/material/Fab";

export const NavbarBottom = (props: {
  room: Room | GameHistory;
  handleCreateNewGame: () => void;
  handleShareRoom: () => void;
  handleResetScores: () => void;
  handleAddGameRoundClick: () => void;
  handleRankingDialogOpen: () => void;
  handleAdvancedScoringOpen: () => void;
  isResetDialogOpen: boolean;
  setIsResetDialogOpen: (isOpen: boolean) => void;
  isRankingDialogOpen: boolean;
  setIsRankingDialogOpen: (isOpen: boolean) => void;
  isAdvancedScoringOpen: boolean;
  setIsAdvancedScoringOpen: (isOpen: boolean) => void;
  winners: string[];
  showResetScores: boolean;
  showCreateNewGame: boolean;
  showAdvancedScoring: boolean;
  showRanking: boolean;
  showButtonRanking: boolean;
  isComplete: boolean | undefined;
}) => {
  const [isStandalone, setIsStandalone] = useState<boolean>(false);

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      ("standalone" in window.navigator &&
        window.navigator.standalone === true);

    setIsStandalone(standalone);
  }, []);

  return (
    <div
      className={cn("fixed w-full max-w-4xl mx-auto p-4 z-10 bottom-0 py-3", {
        "pb-8": isStandalone,
      })}
    >
      <div className="flex gap-4 justify-center w-full">
        {(props.showRanking && props.showButtonRanking) || props.isComplete ? (
          <div className="flex items-center justify-between gap-4 w-full">
            <Fab
              size="large"
              aria-label="Game Over"
              onClick={() => props.setIsRankingDialogOpen(true)}
              color="warning"
            >
              <span className="text-2xl">🏆</span>
            </Fab>
            <Fab
              size="large"
              onClick={props.handleCreateNewGame}
              color="primary"
            >
              <Plus size={24} />
            </Fab>
          </div>
        ) : (
          <div className="flex justify-between w-full gap-4">
            <div className="w-full">
              {props.showResetScores && (
                <Fab
                  aria-label="Reset Scores"
                  onClick={props.handleResetScores}
                  color="error"
                >
                  <RefreshCw />
                </Fab>
              )}
            </div>

            <div className="flex justify-end gap-4 w-full">
              <Fab
                color="secondary"
                aria-label="edit"
                onClick={() => props.setIsAdvancedScoringOpen(true)}
              >
                <Target />
              </Fab>
              <Fab
                color="primary"
                aria-label="edit"
                onClick={props.handleAddGameRoundClick}
              >
                <EditIcon />
              </Fab>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

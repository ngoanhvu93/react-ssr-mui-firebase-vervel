import { Pencil } from "lucide-react";
import { CheckCircle, Loader, X } from "lucide-react";
import type { Tournament } from "firebase/types";
import { cn } from "~/lib/utils";

const TournamentName = (props: {
  tournament: Tournament | null;
  showEditTournamentName: boolean;
  setShowEditTournamentName: (showEditTournamentName: boolean) => void;
  editTournamentName: string;
  setEditTournamentName: (editTournamentName: string) => void;
  updatingTournamentName: boolean;
  setTournamentNameError: (tournamentNameError: string | null) => void;
  updateTournamentName: () => void;
  tournamentNameError: string | null;
}) => {
  return (
    <>
      <div className="text-xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
        {props.showEditTournamentName ? (
          <div className="flex items-center gap-2 w-full">
            <input
              type="text"
              value={props.editTournamentName}
              onChange={(e) => props.setEditTournamentName(e.target.value)}
              className="border-b-2 border-blue-500 outline-none bg-transparent text-xl font-semibold w-full"
              placeholder="Nhập tên giải đấu"
              maxLength={50}
              autoFocus
            />
            <div className="flex items-center gap-2">
              {props.updatingTournamentName ? (
                <Loader className="animate-spin text-blue-500" size={18} />
              ) : (
                <CheckCircle
                  onClick={props.updateTournamentName}
                  className={cn("text-green-500 cursor-pointer", {
                    "opacity-50 cursor-not-allowed":
                      !props.editTournamentName.trim() ||
                      props.editTournamentName === props.tournament?.name,
                  })}
                  size={18}
                />
              )}
              <X
                className="text-gray-500 cursor-pointer"
                onClick={() => {
                  props.setShowEditTournamentName(false);
                  props.setEditTournamentName(props.tournament?.name || "");
                  props.setTournamentNameError(null);
                }}
                size={18}
              />
            </div>
          </div>
        ) : (
          <>
            <span>Tên giải đấu: {props.tournament?.name}</span>
            <Pencil
              onClick={() => {
                props.setShowEditTournamentName(true);
                props.setEditTournamentName(props.tournament?.name || "");
              }}
              className="text-blue-500 cursor-pointer hover:text-blue-700"
              size={16}
            />
            {props.tournament?.season && (
              <span className="ml-2 text-lg text-blue-600">
                (Mùa {props.tournament.season})
              </span>
            )}
          </>
        )}
      </div>
      {props.tournamentNameError && (
        <div className="text-red-500 text-sm mb-2 bg-red-50 p-2 rounded">
          {props.tournamentNameError}
        </div>
      )}
    </>
  );
};

export default TournamentName;

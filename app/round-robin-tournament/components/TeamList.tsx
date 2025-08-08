import { Unlock, Lock, Loader, Plus, Info } from "lucide-react";
import toast from "react-hot-toast";
import type { Team, Tournament } from "firebase/types";
import { CustomButton } from "~/components/CustomButton";
import PlayerAvatar from "~/components/PlayerAvatar";

const TeamList = (props: {
  tournament: Tournament;
  setEditingTeam: (team: Team) => void;
  setEditTeamName: (name: string) => void;
  setEditTeamAvatar: (avatar: string) => void;
  setEditingTeamId: (id: string) => void;
  setShowEditTeamModal: (show: boolean) => void;
  teamAddingLocked: boolean;
  toggleTeamAddingLock: () => void;
  togglingTeamAddLock: boolean;
  setShowAddTeamModal: (show: boolean) => void;
  showTeamList: boolean;
  toggleTeamList: () => void;
}) => {
  return (
    <>
      <div className="mb-2 flex  justify-between gap-2">
        <div className="flex flex-col gap-1">
          Số đội tham gia: {props.tournament.teams?.length || 0}{" "}
          {props.showTeamList && (
            <span className="text-xs flex items-center gap-1 text-blue-500">
              <Info size={16} />
              Nhấn vào đội để sửa thông tin
            </span>
          )}
        </div>
        <button
          onClick={props.toggleTeamList}
          className="text-blue-500 flex items-start gap-1 hover:text-blue-600"
        >
          {props.showTeamList ? "Ẩn danh sách đội" : "Hiển thị danh sách đội"}
        </button>
      </div>
      {props.showTeamList && (
        <>
          <div className="mb-2 text-sm">
            <div className="grid grid-cols-4 gap-1 mt-2">
              {props.tournament.teams?.map((team, index) => (
                <div
                  key={team.id}
                  className="flex flex-col justify-center items-center gap-1 relative group cursor-pointer hover:bg-gray-100 p-1 rounded-lg transition-colors"
                  onClick={() => {
                    // Show a simple modal with edit and delete options
                    props.setEditingTeam(team);
                    props.setEditTeamName(team.name);
                    props.setEditTeamAvatar(team.avatar || "");
                    props.setEditingTeamId(team.id);
                    props.setShowEditTeamModal(true);
                  }}
                >
                  <PlayerAvatar
                    player={{
                      name: team.name,
                      avatar: team.avatar || "",
                    }}
                    index={index}
                  />
                  <span className="text-sm text-center font-semibold text-gray-500">
                    {team.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative mb-4">
            <CustomButton
              icon={<Plus />}
              onClick={() => {
                if (props.teamAddingLocked) {
                  toast.error("Tính năng thêm đội mới đã bị khóa");
                } else {
                  console.log("Adding team");
                  props.setShowAddTeamModal(true);
                }
              }}
              className="w-full"
            >
              <span className="font-medium">Thêm đội mới</span>
            </CustomButton>

            {/* Lock Toggle Button */}
            <button
              onClick={props.toggleTeamAddingLock}
              disabled={props.togglingTeamAddLock}
              className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full shadow-xl border-2 z-10 ${
                props.teamAddingLocked
                  ? "bg-gradient-to-br from-red-50 to-red-100 text-red-600 hover:from-red-100 hover:to-red-200 border-red-200"
                  : "bg-gradient-to-br from-green-50 to-green-100 text-green-600 hover:from-green-100 hover:to-green-200 border-green-200"
              } transition-all duration-300 hover:scale-110 hover:shadow-2xl`}
              title={
                props.teamAddingLocked
                  ? "Mở khóa tính năng thêm đội mới"
                  : "Khóa tính năng thêm đội mới"
              }
            >
              {props.togglingTeamAddLock ? (
                <Loader size={18} className="animate-spin" />
              ) : props.teamAddingLocked ? (
                <Lock className="transform hover:rotate-12 transition-transform" />
              ) : (
                <Unlock className="transform hover:rotate-12 transition-transform" />
              )}
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default TeamList;

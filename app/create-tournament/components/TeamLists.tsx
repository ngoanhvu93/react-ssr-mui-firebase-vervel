import { Trash2 } from "lucide-react";

import { Info } from "lucide-react";

import { CheckCircle, Pencil, X, Loader } from "lucide-react";
import toast from "react-hot-toast";
import type { Team } from "firebase/types";
import PlayerAvatar from "~/components/PlayerAvatar";
import { cn } from "~/utils/cn";

const TeamLists = (props: {
  teams: Team[];
  setTeams: (teams: Team[]) => void;
  editingTeamId: string;
  editingTeamName: string;
  setEditingTeamName: (name: string) => void;
  startEditingTeam: (id: string, name: string) => void;
  saveEditedTeam: () => void;
  cancelEditingTeam: () => void;
  confirmDeleteTeam: (team: Team) => void;
  handleTeamAvatarEdit: (file: File, teamId: string) => void;
  isUploadingAvatar?: boolean;
  uploadingAvatarId?: string;
}) => {
  return (
    <div className="md:col-span-1">
      <div className="bg-blue-50 p-5 rounded-lg border border-blue-100 sticky top-4">
        <h2 className="text-xl font-semibold text-blue-800 border-b border-blue-200 pb-2 mb-3">
          Đội tham gia
        </h2>
        {props.teams.length === 0 ? (
          <div className="text-gray-500 italic text-center py-8">
            Chưa có đội nào được thêm
          </div>
        ) : (
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {props.teams.map((team, index) => (
              <div
                key={team.id}
                className="flex justify-center gap-4 items-center   p-2 rounded-md shadow-sm"
              >
                <label
                  htmlFor={`team-avatar-input-${team.id}`}
                  className="cursor-pointer relative"
                >
                  <PlayerAvatar
                    player={{
                      name: team.name,
                      avatar: team.avatar || "",
                    }}
                    size="large"
                    index={index}
                  />
                  {team.avatar && (
                    <X
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        props.setTeams(
                          props.teams.map((t) => {
                            if (t.id === team.id) {
                              return { ...t, avatar: "" };
                            }
                            return t;
                          })
                        );
                        toast.success("Đã xóa ảnh đại diện");
                      }}
                      className="text-white absolute -top-2 bg-red-500  rounded-full p-1 -right-2"
                      size={20}
                    />
                  )}
                  {props.isUploadingAvatar &&
                    props.uploadingAvatarId === team.id && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full">
                        <Loader className="text-white animate-spin" />
                      </div>
                    )}
                  <input
                    title="Ảnh đại diện đội"
                    id={`team-avatar-input-${team.id}`}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) props.handleTeamAvatarEdit(file, team.id);
                    }}
                    disabled={props.isUploadingAvatar}
                  />
                </label>

                {props.editingTeamId === team.id ? (
                  <div className="flex gap-4 w-full">
                    <input
                      title="Tên đội"
                      placeholder="Tên đội"
                      type="text"
                      value={props.editingTeamName}
                      onChange={(e) => props.setEditingTeamName(e.target.value)}
                      className={cn(
                        "w-full outline-none bg-transparent text-lg font-medium",
                        props.editingTeamId === team.id &&
                          "border-b-2 border-blue-500"
                      )}
                      autoFocus
                    />
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        title="Lưu"
                        onClick={props.saveEditedTeam}
                        className="text-green-500 hover:text-green-600"
                      >
                        <CheckCircle />
                      </button>
                      <button
                        type="button"
                        title="Hủy"
                        onClick={props.cancelEditingTeam}
                        className="text-gray-500 hover:text-gray-600"
                      >
                        <X />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-4 w-full">
                    <span className="text-lg font-medium w-full">
                      {team.name}
                    </span>
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        title="Sửa tên"
                        onClick={() =>
                          props.startEditingTeam(team.id, team.name)
                        }
                        className="text-blue-500 hover:text-blue-600"
                      >
                        <Pencil />
                      </button>
                      <button
                        type="button"
                        title="Xóa đội"
                        onClick={() => props.confirmDeleteTeam(team)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        <div className="mt-4 text-sm text-gray-600">
          <p className="flex gap-2 items-center">
            <Info />
            Số đội tham gia: {props.teams.length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TeamLists;

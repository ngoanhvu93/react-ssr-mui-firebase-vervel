import { Camera, CheckCircle, Pencil, UserX } from "lucide-react";

import { Loader } from "lucide-react";

import { Info, X } from "lucide-react";
import type { Team, Tournament } from "firebase/types";
import PlayerAvatar from "~/components/PlayerAvatar";
import { cn } from "~/lib/utils";

const EditTeamModal = (props: {
  showEditTeamModal: boolean;
  setShowEditTeamModal: (showEditTeamModal: boolean) => void;
  editingTeam: Team | null;
  setEditingTeam: (editingTeam: Team | null) => void;
  editTeamName: string;
  setEditTeamName: (editTeamName: string) => void;
  setAvatarUrl: (avatarUrl: string) => void;
  updateTeam: () => void;
  addingTeam: boolean;
  setDeletingTeam: (deletingTeam: Team | null) => void;
  setDeletingTeamId: (deletingTeamId: string | null) => void;
  setShowDeleteTeamModal: (showDeleteTeamModal: boolean) => void;
  tournament: Tournament | null;
  avatarUrl: string;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showEditTeam: boolean;
  setShowEditTeam: (showEditTeam: boolean) => void;
  editingTeamId: string | null;
  setEditingTeamId: (editingTeamId: string | null) => void;
  editTeamError: string | null;
  setEditTeamError: (editTeamError: string | null) => void;
  isUploadingAvatar: boolean;
}) => {
  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          props.setShowEditTeamModal(false);
          props.setEditingTeam(null);
          props.setEditTeamName("");
          props.setAvatarUrl("");
          props.setEditTeamError(null);
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
    >
      <div className="  rounded-lg shadow-xl w-full max-w-md">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">
            Chỉnh sửa thông tin đội
          </h2>
        </div>

        <div className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4 w-full">
              <div className="relative">
                <label htmlFor={`team-avatar-input-${props.editingTeam?.id}`}>
                  <PlayerAvatar
                    player={{
                      name: props.editTeamName,
                      avatar: props.avatarUrl || "",
                    }}
                    size="xlarge"
                    index={
                      props.tournament?.teams.findIndex(
                        (t) => t.id === props.editingTeam?.id
                      ) || 0
                    }
                  />
                  {props.isUploadingAvatar && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  p-1">
                      <Loader className="animate-spin text-blue-500" />
                    </div>
                  )}
                  {props.avatarUrl && (
                    <X
                      size={24}
                      className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        props.setAvatarUrl("");
                      }}
                    />
                  )}
                  <Camera className="absolute bottom-0 right-0 border-2 border-white bg-blue-500 text-white p-1 rounded-full cursor-pointer hover:bg-blue-600 transition" />
                  <input
                    id={`team-avatar-input-${props.editingTeam?.id}`}
                    title="Avatar đội"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      props.handleFileChange(e);
                    }}
                    className="hidden"
                  />
                </label>
              </div>

              {props.showEditTeam ? (
                <>
                  <input
                    type="text"
                    value={props.editTeamName}
                    onChange={(e) => props.setEditTeamName(e.target.value)}
                    className="w-full border-b-2 border-blue-500 outline-none bg-transparent text-lg font-medium"
                    placeholder="Nhập tên đội"
                    maxLength={20}
                    autoFocus
                  />
                  <div className="flex items-center gap-4">
                    {props.addingTeam ? (
                      <Loader className="animate-spin  text-green-500" />
                    ) : (
                      <CheckCircle
                        onClick={props.updateTeam}
                        className={cn(` text-green-500 flex `, {
                          "opacity-50 cursor-not-allowed pointer-events-none":
                            props.addingTeam ||
                            !props.editTeamName.trim() ||
                            props.editTeamName === props.editingTeam?.name,
                        })}
                      />
                    )}
                    <X
                      className="text-gray-500 flex justify-end"
                      onClick={() => {
                        props.setEditingTeam(props.editingTeam);
                        props.setEditingTeamId(props.editingTeam?.id || null);
                        props.setShowEditTeamModal(true);
                        props.setEditTeamName(props.editingTeam?.name || "");
                        props.setShowEditTeam(false);
                        props.setEditTeamError(null);
                      }}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-4 w-full">
                    <span
                      onClick={() => {
                        props.setShowEditTeam(true);
                      }}
                      className="text-lg font-medium w-full"
                    >
                      {props.editingTeam?.name}
                    </span>
                    <div className="flex items-center gap-4">
                      <Pencil
                        className="text-blue-500"
                        onClick={() => {
                          props.setShowEditTeam(true);
                        }}
                      />
                      <UserX
                        className="text-red-500 flex justify-end"
                        onClick={() => {
                          props.setDeletingTeam(props.editingTeam);
                          props.setDeletingTeamId(
                            props.editingTeam?.id || null
                          );
                          props.setShowDeleteTeamModal(true);
                        }}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {props.editTeamError && (
            <div className="my-4 text-red-500 bg-red-50 p-3 rounded">
              {props.editTeamError}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200 flex justify-end space-x-4">
          <button
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md font-medium transition-colors"
            onClick={() => {
              props.setShowEditTeamModal(false);
              props.setEditingTeam(null);
              props.setEditTeamName("");
              props.setAvatarUrl("");
              props.setShowEditTeam(false);
            }}
          >
            Đóng
          </button>

          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
            onClick={props.updateTeam}
          >
            {props.addingTeam ? (
              <div className="flex items-center gap-2">
                <Loader className="animate-spin text-white" />
                Đang cập nhật...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <CheckCircle className="text-white" />
                Lưu thay đổi
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditTeamModal;

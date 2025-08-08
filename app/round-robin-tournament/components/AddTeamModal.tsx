import { Info, Plus, Loader, X, Camera } from "lucide-react";
import type { Tournament } from "firebase/types";
import { CustomButton } from "~/components/CustomButton";
import PlayerAvatar from "~/components/PlayerAvatar";

const AddTeamModal = (props: {
  showAddTeamModal: boolean;
  setShowAddTeamModal: (showAddTeamModal: boolean) => void;
  newTeamName: string;
  setNewTeamName: (newTeamName: string) => void;
  newTeamAvatar: string;
  setNewTeamAvatar: (newTeamAvatar: string) => void;
  addTeamError: string | null;
  setAddTeamError: (addTeamError: string | null) => void;
  addingTeam: boolean;
  tournament: Tournament | null;
  addNewTeam: () => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isUploadingAvatar: boolean;
}) => {
  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          props.setShowAddTeamModal(false);
          props.setNewTeamName("");
          props.setNewTeamAvatar("");
          props.setAddTeamError(null);
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
    >
      <div className="  rounded-lg shadow-xl w-full max-w-md">
        <div className="p-5 border-b border-gray-200">
          <div className="text-2xl font-bold text-gray-800">
            Thêm đội vào giải đấu
          </div>
        </div>
        <div className="p-4">
          <div className="mb-4 flex items-center gap-4">
            <label
              htmlFor="team-avatar-input"
              className="cursor-pointer relative"
            >
              <PlayerAvatar
                player={{
                  name: props.newTeamName,
                  avatar: props.newTeamAvatar || "",
                }}
                size="xlarge"
                index={props.tournament?.teams.length}
              />
              {props.isUploadingAvatar && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  p-1">
                  <Loader className="animate-spin text-blue-500" />
                </div>
              )}
              <input
                id="team-avatar-input"
                title="Avatar đội"
                placeholder="Avatar đội"
                type="file"
                accept="image/*"
                onChange={(e) => props.handleFileChange(e)}
                className="hidden"
              />
              {props.newTeamAvatar && (
                <X
                  size={24}
                  className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    props.setNewTeamAvatar("");
                  }}
                />
              )}
              <Camera className="absolute bottom-0 right-0 border-2 border-white bg-blue-500 text-white p-1 rounded-full cursor-pointer hover:bg-blue-600 transition" />
            </label>
            <input
              type="text"
              value={props.newTeamName}
              onChange={(e) => props.setNewTeamName(e.target.value)}
              className="w-full border-b-2 border-blue-500 outline-none bg-transparent text-lg font-medium"
              placeholder="Nhập tên đội"
            />
            <button
              onClick={props.addNewTeam}
              className="w-full bg-green-600 hover:bg-green-700 text-white  py-2 rounded-md font-medium transition-colors "
              disabled={props.addingTeam || !props.newTeamName.trim()}
            >
              {props.addingTeam ? (
                <div className="flex items-center justify-center">
                  <Loader className="animate-spin mr-1 h-4 w-4 text-white" />
                </div>
              ) : (
                <span className="flex items-center justify-center">
                  <Plus size={20} />
                  Thêm đội
                </span>
              )}
            </button>
          </div>
          {props.addTeamError && (
            <div className="my-4 text-red-500 bg-red-50 p-3 rounded">
              {props.addTeamError}
            </div>
          )}
          <div className=" text-red-500 flex gap-2 justify-start">
            <span className="flex items-start justify-center">
              <Info size={20} />
            </span>
            <span className="flex items-start text-sm">
              Khi thêm đội mới, lịch thi đấu sẽ được tạo lại tự động để phù hợp
              với số lượng đội mới.
            </span>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 flex justify-end space-x-3">
          <CustomButton
            icon={<X />}
            variant="secondary"
            size="small"
            onClick={() => {
              props.setShowAddTeamModal(false);
              props.setNewTeamName("");
              props.setNewTeamAvatar("");
              props.setAddTeamError(null);
            }}
            disabled={props.addingTeam}
          >
            Hủy
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

export default AddTeamModal;

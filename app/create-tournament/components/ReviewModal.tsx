import type { Team, Tournament } from "firebase/types";
import { Loader, X, Lock, Globe } from "lucide-react";
import { CustomButton } from "~/components/CustomButton";
import PlayerAvatar from "~/components/PlayerAvatar";

const ReviewModal = (props: {
  showReviewModal: boolean;
  setShowReviewModal: (show: boolean) => void;
  formData: Tournament;
  teams: Team[];
  getTournamentTypeVietnamese: (type: string) => string;
  handleCreateTournament: () => void;
  isCreating: boolean;
  editingTeamId: string;
  editingTeamName: string;
  setEditingTeamName: (name: string) => void;
  startEditingTeam: (teamId: string, currentName: string) => void;
  saveEditedTeam: () => void;
  cancelEditingTeam: () => void;
  confirmDeleteTeam: (team: Team) => void;
  handleTeamAvatarEdit: (file: File, teamId: string) => void;
  setTeamToDelete: (team: Team | null) => void;
}) => {
  return (
    <div
      onClick={(e) => {
        // Only close if clicking the overlay itself, not its children
        if (e.target === e.currentTarget) {
          props.setShowReviewModal(false);
        }
      }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div className="  rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">
              Thông tin giải đấu
            </h2>
            <button
              title="Đóng"
              onClick={() => props.setShowReviewModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-4 w-full overflow-y-auto flex-1">
          <div className="bg-blue-50 p-4 rounded-lg w-full">
            <h3 className="font-semibold text-lg text-blue-800 mb-2">
              Thông tin cơ bản
            </h3>
            <div className="space-y-2">
              <div className="flex gap-2 justify-start">
                <span className="font-medium w-full">Tên giải đấu:</span>
                <span className="w-full">{props.formData?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium w-full">Loại giải đấu:</span>
                <span className="w-full">
                  {props.getTournamentTypeVietnamese(
                    props.formData.tournamentType
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium w-full">Quyền riêng tư:</span>
                <span className="w-full flex items-center">
                  {props.formData.isPrivate ? (
                    <>
                      <Lock size={16} className="mr-1 text-gray-600" />
                      Riêng tư
                    </>
                  ) : (
                    <>
                      <Globe size={16} className="mr-1 text-gray-600" />
                      Công khai
                    </>
                  )}
                </span>
              </div>
              {!props.formData.isPrivate && (
                <div className="flex justify-between">
                  <span className="font-medium w-full">Mật khẩu:</span>
                  <span className="w-full">
                    {props.formData.password || "Không có"}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="font-medium w-full">Thời gian bắt đầu: </span>
                <span className="w-full">
                  {props.formData.startDate
                    ? new Date(props.formData.startDate).toLocaleString(
                        "vi-VN",
                        {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )
                    : "Ngay lập tức"}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg text-green-800 mb-2">
              Danh sách đội tham gia ({props.teams.length})
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {props.teams.map((team, index) => (
                <div
                  key={team.id}
                  className="  flex flex-col gap-2 p-2 rounded  items-center"
                >
                  <PlayerAvatar
                    player={{ name: team.name, avatar: team.avatar || "" }}
                    size="large"
                    index={index}
                  />
                  <span className="font-semibold">{team.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 flex gap-4 w-full">
          <CustomButton
            variant="secondary"
            className="w-full"
            onClick={() => props.setShowReviewModal(false)}
          >
            Chỉnh sửa
          </CustomButton>
          <CustomButton
            variant="primary"
            className="w-full"
            onClick={props.handleCreateTournament}
            disabled={props.isCreating}
          >
            {props.isCreating ? (
              <div className="flex items-center justify-center">
                <Loader className="h-5 w-5 mr-2 animate-spin" />
                Đang tạo...
              </div>
            ) : (
              "Xác nhận"
            )}
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;

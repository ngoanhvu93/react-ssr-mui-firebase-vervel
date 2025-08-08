import { Loader } from "lucide-react";
import type { Team } from "firebase/types";

const DeleteTeamModal = (props: {
  deletingInProgress: boolean;
  setShowDeleteTeamModal: (showDeleteTeamModal: boolean) => void;
  setDeletingTeam: (deletingTeam: Team | null) => void;
  setDeletingTeamId: (deletingTeamId: string | null) => void;
  setDeleteTeamError: (deleteTeamError: string | null) => void;
  deletingTeam: Team | null;
  deleteTeamError: string | null;
  deleteTeam: () => void;
}) => {
  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget && !props.deletingInProgress) {
          props.setShowDeleteTeamModal(false);
          props.setDeletingTeam(null);
          props.setDeletingTeamId(null);
          props.setDeleteTeamError(null);
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
    >
      <div className="  rounded-lg shadow-xl w-full max-w-md">
        <div className="p-5 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Xác nhận xóa đội</h2>
        </div>

        <div className="p-5">
          <div className="text-red-600 bg-red-50 p-3 rounded-md mb-4">
            <p className="font-medium">Cảnh báo!</p>
            <p className="text-sm mt-1">
              Khi xóa đội, tất cả dữ liệu liên quan đến đội này sẽ bị xóa khỏi
              giải đấu. Điều này có thể ảnh hưởng đến lịch thi đấu của các đội
              khác.
            </p>
          </div>

          <p className="mb-4 text-gray-700">
            Bạn có chắc chắn muốn xóa đội{" "}
            <span className="font-semibold">{props.deletingTeam?.name}</span>{" "}
            không?
          </p>

          {props.deleteTeamError && (
            <div className="mb-4 text-red-500 bg-red-50 p-3 rounded">
              {props.deleteTeamError}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={() => {
              props.setShowDeleteTeamModal(false);
              props.setDeletingTeam(null);
              props.setDeletingTeamId(null);
              props.setDeleteTeamError(null);
            }}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md font-medium transition-colors"
            disabled={props.deletingInProgress}
          >
            Hủy
          </button>

          <button
            onClick={props.deleteTeam}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center"
            disabled={props.deletingInProgress}
          >
            {props.deletingInProgress ? (
              <>
                <Loader className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                Đang xóa...
              </>
            ) : (
              "Xác nhận xóa"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteTeamModal;

import { Info, Loader, Lock } from "lucide-react";

const TeamAddLockConfirmationModal = (props: {
  showTeamAddLockConfirmation: boolean;
  setShowTeamAddLockConfirmation: (
    showTeamAddLockConfirmation: boolean
  ) => void;
  confirmTeamAddingLock: () => void;
  togglingTeamAddLock: boolean;
}) => {
  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          props.setShowTeamAddLockConfirmation(false);
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
    >
      <div className="  rounded-lg shadow-xl w-full max-w-md">
        <div className="p-4 border-b border-gray-200 bg-yellow-50">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Lock size={20} className="text-yellow-600" />
            Xác nhận khóa tính năng thêm đội
          </h2>
        </div>

        <div className="p-5">
          <div className="text-yellow-600 bg-yellow-50 p-3 rounded-md mb-4 border border-yellow-200">
            <p className="font-medium flex items-center gap-2">
              <Info size={18} />
              Lưu ý quan trọng
            </p>
            <p className="text-sm mt-2">Khi bạn khóa tính năng thêm đội mới:</p>
            <ul className="text-sm mt-1 list-disc list-inside pl-2 space-y-1">
              <li>Không ai có thể thêm đội mới vào giải đấu</li>
              <li>Việc mở khóa tính năng này sẽ yêu cầu mật khẩu xác nhận</li>
              <li>Tất cả người dùng sẽ nhận được thông báo về việc này</li>
            </ul>
          </div>

          <p className="mb-4 text-gray-700">
            Bạn có chắc chắn muốn khóa tính năng thêm đội mới không?
          </p>
        </div>

        <div className="p-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={() => props.setShowTeamAddLockConfirmation(false)}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md font-medium transition-colors"
          >
            Hủy
          </button>

          <button
            onClick={props.confirmTeamAddingLock}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center"
            disabled={props.togglingTeamAddLock}
          >
            {props.togglingTeamAddLock ? (
              <>
                <Loader className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                Đang khóa...
              </>
            ) : (
              <>
                <Lock size={16} className="mr-2" />
                Xác nhận khóa
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamAddLockConfirmationModal;

import { Info, Loader } from "lucide-react";

const LockPasswordModal = (props: {
  showLockPasswordModal: boolean;
  setShowLockPasswordModal: (showLockPasswordModal: boolean) => void;
  lockingItem: {
    type: "round" | "match" | "teamAdding";
    id: string | number;
  } | null;
  setLockingItem: (
    lockingItem: {
      type: "round" | "match" | "teamAdding";
      id: string | number;
    } | null
  ) => void;
  lockPassword: string;
  setLockPassword: (lockPassword: string) => void;
  lockPasswordError: string | null;
  setLockPasswordError: (lockPasswordError: string | null) => void;
  handleUnlock: () => void;
  togglingLock: string | number | null;
  togglingMatchLock: string | number | null;
  togglingTeamAddLock: boolean;
  isPrivate?: boolean;
}) => {
  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          props.setShowLockPasswordModal(false);
          props.setLockingItem(null);
          props.setLockPassword("");
          props.setLockPasswordError(null);
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
    >
      <div className="  rounded-lg shadow-xl w-full max-w-md">
        <div className="p-5 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">
            {props.lockingItem?.type === "round"
              ? "Mở khóa vòng đấu"
              : props.lockingItem?.type === "match"
              ? "Mở khóa trận đấu"
              : "Mở khóa thêm đội mới"}
          </h2>
        </div>

        <div className="p-5">
          <div className="mb-4 text-gray-700">
            {props.lockingItem?.type === "round"
              ? `Bạn đang mở khóa vòng đấu ${props.lockingItem.id}.`
              : props.lockingItem?.type === "match"
              ? `Bạn đang mở khóa trận đấu.`
              : `Bạn đang mở khóa tính năng thêm đội mới.`}
          </div>

          <div className="text-gray-600 bg-gray-50 p-3 rounded-md mb-4">
            <p className="font-medium">Lưu ý:</p>
            <p className="text-sm mt-1">
              {props.lockingItem?.type === "round"
                ? "Mở khóa vòng đấu sẽ cho phép cập nhật kết quả cho tất cả các trận đấu trong vòng này."
                : props.lockingItem?.type === "match"
                ? "Mở khóa trận đấu sẽ cho phép cập nhật kết quả trận đấu này."
                : "Mở khóa sẽ cho phép thêm đội mới vào giải đấu."}
            </p>
          </div>

          {props.isPrivate ? (
            <div className="mt-4 flex p-3 bg-blue-50 text-blue-800 rounded-md items-start">
              <Info className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Giải đấu riêng tư</p>
                <p className="text-sm mt-1">
                  Giải đấu này được đặt là riêng tư nên bạn có thể mở khóa mà
                  không cần nhập mật khẩu.
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nhập mật khẩu xác nhận:
              </label>
              <input
                type="password"
                value={props.lockPassword}
                onChange={(e) => props.setLockPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập mật khẩu để xác nhận"
              />
              {props.lockPasswordError && (
                <p className="mt-1 text-sm text-red-600">
                  {props.lockPasswordError}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={() => {
              props.setShowLockPasswordModal(false);
              props.setLockingItem(null);
              props.setLockPassword("");
              props.setLockPasswordError(null);
            }}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md font-medium transition-colors"
          >
            Hủy
          </button>

          <button
            onClick={props.handleUnlock}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center"
            disabled={!props.isPrivate && !props.lockPassword}
          >
            {(props.lockingItem?.type === "round" &&
              props.togglingLock === props.lockingItem?.id) ||
            (props.lockingItem?.type === "match" &&
              props.togglingMatchLock === props.lockingItem?.id) ||
            (props.lockingItem?.type === "teamAdding" &&
              props.togglingTeamAddLock) ? (
              <>
                <Loader className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                Đang xử lý...
              </>
            ) : (
              "Mở khóa"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LockPasswordModal;

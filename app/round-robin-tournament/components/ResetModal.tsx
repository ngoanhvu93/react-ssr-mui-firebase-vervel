import { formatDate } from "date-fns";
import { CheckCircle, Info, Loader } from "lucide-react";
import toast from "react-hot-toast";
import type { Tournament } from "firebase/types";

import { CustomButton } from "~/components/CustomButton";

const ResetModal = (props: {
  showResetModal: boolean;
  setShowResetModal: (showResetModal: boolean) => void;
  showSaveStatsConfirmation: boolean;
  setShowSaveStatsConfirmation: (showSaveStatsConfirmation: boolean) => void;
  statsAlreadySaved: boolean;
  setStatsAlreadySaved: (statsAlreadySaved: boolean) => void;
  tournament: Tournament | null;
  seasonStartDate: Date;
  seasonEndDate: Date;
  saveCurrentSeasonStats: () => Promise<void>;
  resetTournament: () => void;
  resetPassword: string;
  setResetPassword: (resetPassword: string) => void;
  resetPasswordError: string | null;
  setResetPasswordError: (resetPasswordError: string | null) => void;
  resetting: boolean;
}) => {
  // Check if tournament is private
  const isPrivate = props.tournament?.isPrivate || false;

  return (
    <div
      onClick={(e) => {
        // Only close if clicking the overlay itself, not its children
        if (e.target === e.currentTarget) {
          props.setShowResetModal(false);
          props.setShowSaveStatsConfirmation(false); // Reset this state when closing
          props.setStatsAlreadySaved(false); // Reset this state when closing
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
    >
      <div className="  rounded-lg shadow-xl w-full max-w-md">
        <div className="p-5 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">
            Bắt đầu mùa giải mới
          </h2>
        </div>

        <div className="p-5">
          {props.statsAlreadySaved ? (
            <div className="bg-green-50 p-4 rounded-md mb-4 border border-green-200">
              <p className="font-medium text-green-700 flex items-center gap-2">
                <CheckCircle size={18} />
                Thống kê mùa giải đã được lưu
              </p>
              <p className="text-sm mt-2 text-green-600">
                Bạn đã lưu thống kê mùa giải {props.tournament?.season || 1}.
                Bạn có thể tiếp tục tạo mùa giải mới.
              </p>
            </div>
          ) : (
            props.showSaveStatsConfirmation && (
              <div className="bg-blue-50 p-4 rounded-md mb-4 border border-blue-200">
                <p className="font-medium text-blue-700 flex items-center gap-2">
                  <Info size={18} />
                  Lưu thống kê mùa giải hiện tại?
                </p>
                <p className="text-sm mt-2 text-blue-600">
                  Mùa giải hiện tại có kết quả trận đấu, bạn có muốn lưu thống
                  kê trước khi tạo mùa giải mới không?
                </p>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => props.setShowSaveStatsConfirmation(false)}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-md text-sm font-medium"
                  >
                    Không lưu
                  </button>
                  <button
                    onClick={() => {
                      props
                        .saveCurrentSeasonStats()
                        .then(() => {
                          toast.success("Đã lưu thống kê mùa giải hiện tại");
                          props.setStatsAlreadySaved(true);
                          props.setShowSaveStatsConfirmation(false);
                        })
                        .catch((error) => {
                          console.error("Lỗi khi lưu thống kê:", error);
                          toast.error(
                            "Không thể lưu thống kê: " +
                              (error as Error).message
                          );
                        });
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm font-medium"
                  >
                    Lưu thống kê
                  </button>
                </div>
              </div>
            )
          )}
          <div className="text-sm text-gray-600 mb-4">
            <p>
              <span className="font-medium">Mùa hiện tại:</span>{" "}
              {props.tournament?.season || 1}
              <br />
              <span className="font-medium">Mùa mới:</span>{" "}
              {(props.tournament?.season || 1) + 1}
            </p>
            <div className="mt-2 p-2 bg-blue-50 rounded-md">
              <p className="font-medium text-blue-600">
                Thời gian mùa giải hiện tại:
              </p>
              <p>
                <span className="font-medium">Bắt đầu:</span>{" "}
                {formatDate(props.seasonStartDate, "dd/MM/yyyy")}
              </p>
              <p>
                <span className="font-medium">Kết thúc:</span>{" "}
                {props.seasonEndDate
                  ? formatDate(props.seasonEndDate, "dd/MM/yyyy")
                  : "Đang diễn ra"}
              </p>
              <p className="mt-2 font-medium text-blue-600">
                Mùa giải mới sẽ bắt đầu từ:
              </p>
              <p>{formatDate(new Date(), "dd/MM/yyyy")}</p>
            </div>
          </div>

          {/* Hiển thị thông báo nếu giải đấu là riêng tư */}
          {isPrivate ? (
            <div className="mt-4 flex p-3 bg-blue-50 text-blue-800 rounded-md items-start">
              <Info className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Giải đấu riêng tư</p>
                <p className="text-sm mt-1">
                  Giải đấu này được đặt là riêng tư nên bạn có thể bắt đầu mùa
                  giải mới mà không cần nhập mật khẩu.
                </p>
              </div>
            </div>
          ) : (
            /* Thêm trường nhập mật khẩu nếu giải đấu không phải riêng tư */
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nhập mật khẩu xác nhận:
              </label>
              <input
                type="password"
                value={props.resetPassword}
                onChange={(e) => props.setResetPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập mật khẩu để xác nhận"
              />
              {props.resetPasswordError && (
                <p className="mt-1 text-sm text-red-600">
                  {props.resetPasswordError}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={() => {
              props.setShowResetModal(false);
              props.setResetPassword("");
              props.setResetPasswordError(null);
            }}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md font-medium transition-colors"
            disabled={props.resetting}
          >
            Hủy
          </button>

          <CustomButton
            onClick={props.resetTournament}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center"
            disabled={props.resetting || (!isPrivate && !props.resetPassword)}
          >
            {props.resetting ? (
              <>
                <Loader className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                Đang đặt lại...
              </>
            ) : (
              "Xác nhận"
            )}
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

export default ResetModal;

import { UserPlus } from "lucide-react";
import { Undo2 } from "lucide-react";
import type { Room } from "firebase/types";
import { useNavigate } from "react-router";
import { CustomButton } from "~/components/CustomButton";
export const NoPlayer = (props: {
  room: Room;
  setModalMode: (mode: string) => void;
  setShowModalAddPlayer: (isOpen: boolean) => void;
}) => {
  const navigate = useNavigate();
  return (
    <div>
      {props.room.players.length === 0 && (
        <div className="min-h-screen flex items-center justify-center w-full bg-gray-50">
          <div className="text-center   p-8 rounded-xl shadow-lg max-w-md w-full mx-4">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Phòng {props.room?.name}
              </h2>
              <p className="text-gray-600">Chưa có người chơi trong phòng</p>
              <p className="text-gray-600">
                Vui lòng thêm người chơi để bắt đầu
              </p>
            </div>

            {props.room.players?.length < 4 && (
              <div className="flex flex-col gap-3 w-full">
                <CustomButton
                  icon={<UserPlus size={20} />}
                  variant="save"
                  type="button"
                  onClick={() => {
                    props.setModalMode("bulk-add");
                    props.setShowModalAddPlayer(true);
                  }}
                  className="w-full transition-transform hover:scale-105"
                >
                  Thêm người chơi
                </CustomButton>
                <CustomButton
                  icon={<Undo2 size={20} />}
                  variant="back"
                  onClick={() => navigate("/join-thirteen-card-room")}
                  type="button"
                  className="w-full transition-transform hover:scale-105"
                >
                  Chọn phòng khác
                </CustomButton>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

import { Pencil, PenOff } from "lucide-react";
import type { Room } from "firebase/types";

export const EditingRoomName = (props: {
  isEditingRoomName: boolean;
  setIsEditingRoomName: (isEditing: boolean) => void;
  newRoomName: string;
  setNewRoomName: (name: string) => void;
  room: Room;
  loading: boolean;
}) => {
  const {
    isEditingRoomName,
    setIsEditingRoomName,
    newRoomName,
    setNewRoomName,
    room,
  } = props;
  return (
    <div className="flex flex-col items-center gap-2 w-full">
      {isEditingRoomName ? (
        <div className="flex flex-col w-full gap-4">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <label htmlFor="room-name" className="text-sm font-medium">
                  Tên phòng mới
                </label>
              </div>

              <div
                className={`w-full border-b-2 border-blue-500 px-1 py-1 focus-within:border-blue-700 transition-colors`}
              >
                <div className="flex items-center gap-2">
                  <input
                    id="room-name"
                    type="text"
                    defaultValue={room?.name}
                    value={newRoomName}
                    onChange={(e) => {
                      setNewRoomName(e.target.value);
                    }}
                    className="w-full outline-none bg-transparent text-lg font-medium"
                    maxLength={30}
                    autoFocus
                  />
                  <PenOff
                    onClick={() => {
                      setIsEditingRoomName(false);
                      setNewRoomName(room?.name);
                    }}
                    size={18}
                  />
                </div>
              </div>
              {newRoomName.trim() === "" && (
                <p className="text-red-500 text-sm mt-1">
                  Tên phòng không được để trống
                </p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div
          onClick={() => {
            setIsEditingRoomName(true);
          }}
          className="flex items-center gap-4 w-full group"
        >
          <div className="font-medium">Tên phòng: {room?.name}</div>
          <button title="Đổi tên phòng">
            <Pencil className="size-4" />
          </button>
        </div>
      )}
    </div>
  );
};

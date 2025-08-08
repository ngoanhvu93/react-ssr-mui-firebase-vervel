import { Info, Pencil, PenOff } from "lucide-react";
import type { Room } from "firebase/types";
export const EditingWinningScore = (props: {
  isEditingWinningScore: boolean;
  setIsEditingWinningScore: (isEditing: boolean) => void;
  newWinningScore: number;
  setNewWinningScore: (score: number) => void;
  room: Room;
  loading: boolean;
}) => {
  const {
    isEditingWinningScore,
    setIsEditingWinningScore,
    newWinningScore,
    setNewWinningScore,
    room,
  } = props;
  return (
    <div className="flex flex-col items-center gap-2 w-full">
      {isEditingWinningScore ? (
        <div className="flex flex-col w-full gap-4">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <label htmlFor="room-name" className="text-sm font-medium">
                  <div className="flex flex-col gap-1">
                    Điểm chiến thắng mới
                    <span className="text-xs flex items-center gap-1">
                      <Info size={16} />
                      Nhập 0 để chơi không giới hạn
                    </span>
                  </div>
                </label>
              </div>

              <div
                className={`w-full border-b-2 border-blue-500 px-1 py-1 focus-within:border-blue-700 transition-colors`}
              >
                <div className="flex items-center gap-2">
                  <input
                    id="room-name"
                    type="text"
                    inputMode="numeric"
                    defaultValue={room?.winningScore}
                    value={newWinningScore}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (!isNaN(Number(value))) {
                        setNewWinningScore(Number(value));
                      }
                      if (value.trim().length === 0) {
                        setNewWinningScore(0);
                      }
                    }}
                    className="w-full outline-none bg-transparent text-lg font-medium"
                    autoFocus
                  />
                  <PenOff
                    onClick={() => {
                      setIsEditingWinningScore(false);
                      setNewWinningScore(room?.winningScore);
                    }}
                    size={18}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          onClick={() => {
            setIsEditingWinningScore(true);
          }}
          className="flex items-center gap-4 w-full group"
        >
          <div className="font-medium">
            Điểm chiến thắng:{" "}
            {room?.winningScore === 0 ? (
              <span className="text-gray-500 text-sm">Không giới hạn</span>
            ) : (
              room?.winningScore + " điểm"
            )}
          </div>
          <button title="Đổi điểm chiến thắng">
            <Pencil className="size-4" />
          </button>
        </div>
      )}
    </div>
  );
};

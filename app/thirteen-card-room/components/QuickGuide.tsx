import Fab from "@mui/material/Fab";
import { Edit, Target } from "lucide-react";
import type { Room } from "firebase/types";

export const QuickGuide = (props: {
  room: Room;
  setIsAdvancedScoringOpen: (isAdvancedScoringOpen: boolean) => void;
  handleAddGameRoundClick: () => void;
}) => {
  return (
    <div>
      {props.room?.players[0]?.scores.length === 0 && (
        <div className="w-full h-full text-center flex flex-col items-center gap-3 px-1 py-4 animate-fadeIn">
          <div className="text-4xl">👋</div>
          <h1 className="text-2xl font-bold drop-shadow-lg">Chào mừng bạn!</h1>
          <p className="text-lg">Bạn đã sẵn sàng ghi điểm chưa?</p>

          <div>
            <ul className="mt-2  text-left space-y-2">
              <li className="flex items-center gap-2">
                <span className="flex items-center gap-2">
                  <div className="size-1 bg-blue-500 rounded-full" />
                  Nhấn vào
                </span>
                <span className="font-bold">
                  <Fab
                    title="Add Score"
                    type="button"
                    onClick={() => props.handleAddGameRoundClick()}
                    color="primary"
                  >
                    <Edit />
                  </Fab>
                </span>
                hoặc
                <Fab
                  title="Advanced Scoring"
                  type="button"
                  onClick={() => props.setIsAdvancedScoringOpen(true)}
                  color="secondary"
                >
                  <Target />
                </Fab>
                để ghi điểm
              </li>
              <li className="flex items-center gap-2">
                <span className="flex items-center gap-2">
                  <div className="size-1 bg-blue-500 rounded-full" />
                  Nhấn vào ảnh đại diện để sửa thông tin
                </span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

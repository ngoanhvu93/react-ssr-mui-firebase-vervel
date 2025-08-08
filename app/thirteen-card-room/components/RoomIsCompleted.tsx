import { format } from "date-fns";
import { vi } from "date-fns/locale";

export const RoomIsCompleted = (props: {
  endTime: string | null | undefined;
  setIsRankingDialogOpen: (isOpen: boolean) => void;
  handleCreateNewGame: () => void;
}) => {
  return (
    <div className="text-center flex flex-col items-center p-4 ">
      <span className="text-sm text-gray-500">Ván bài này đã kết thúc vào</span>
      <span className="font-semibold text-red-500 text-lg">
        {format(props.endTime ?? new Date(), "EEEE, HH:mm dd/MM/yyyy", {
          locale: vi,
        })}
      </span>
    </div>
  );
};

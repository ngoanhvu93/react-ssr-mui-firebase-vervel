import type { Team } from "firebase/types";
import { CustomButton } from "~/components/CustomButton";

const TeamToDelete = (props: {
  teamToDelete: Team;
  setTeamToDelete: (team: Team | null) => void;
  removeTeam: (id: string, name: string) => void;
}) => {
  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          props.setTeamToDelete(null);
        }
      }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div className="  rounded-xl shadow-lg max-w-md w-full p-5">
        <h3 className="text-xl font-bold text-gray-800 mb-3">
          Xác nhận xóa đội
        </h3>
        <p className="text-gray-600 mb-5">
          Bạn có chắc chắn muốn xóa đội{" "}
          <span className="font-semibold">{props.teamToDelete.name}</span>? Hành
          động này không thể hoàn tác.
        </p>

        <div className="flex gap-3 justify-end">
          <CustomButton
            variant="secondary"
            onClick={() => props.setTeamToDelete(null)}
          >
            Hủy bỏ
          </CustomButton>
          <CustomButton
            variant="danger"
            onClick={() =>
              props.removeTeam(props.teamToDelete.id, props.teamToDelete.name)
            }
          >
            Xóa đội
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

export default TeamToDelete;

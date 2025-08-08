import type { User } from "firebase/auth";
import { Calendar, Plus, RefreshCcw, Save } from "lucide-react";
import { BookOpen } from "lucide-react";
import { Table } from "lucide-react";
import { Loader } from "lucide-react";
import type { Team } from "firebase/types";
import { CustomButton } from "~/components/CustomButton";

const BottomBar = (props: {
  loadingStandings: boolean;
  openStandingsModal: () => void;
  openSeasonHistoryModal: () => void;
  savingSeasonStats: boolean;
  saveCurrentSeasonStats: () => void;
  user: User | null;
  setAuthModalPurpose: (purpose: "standings" | "history" | "stats") => void;
  setShowAuthModal: (show: boolean) => void;
  standings: Team[];
  openResetModal: () => void;
}) => {
  return (
    <div className="flex-none sticky z-10 bottom-0  /95 backdrop-blur-lg border-t border-gray-200 py-3 px-4 shadow-lg">
      <div className="flex gap-4 max-w-4xl mx-auto">
        <CustomButton
          className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-all duration-200"
          onClick={props.openStandingsModal}
          disabled={props.loadingStandings}
          title="Xem bảng xếp hạng"
        >
          {props.loadingStandings ? (
            <Loader className="animate-spin" />
          ) : (
            <Table />
          )}
        </CustomButton>

        <CustomButton
          className="flex-1 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 transition-all duration-200"
          onClick={props.openSeasonHistoryModal}
          disabled={props.savingSeasonStats}
          title="Xem lịch sử các mùa giải"
        >
          <BookOpen />
        </CustomButton>

        <CustomButton
          className="flex-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-all duration-200"
          onClick={() => {
            // Check if user is authenticated
            if (!props.user) {
              props.setAuthModalPurpose("stats");
              props.setShowAuthModal(true);
              return;
            }
            props.saveCurrentSeasonStats();
          }}
          disabled={props.standings.some((team) => team.played < 0)}
          title="Lưu thống kê mùa hiện tại"
        >
          {props.savingSeasonStats ? (
            <Loader className="animate-spin" />
          ) : (
            <Save />
          )}
        </CustomButton>
        <CustomButton
          className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-all duration-200"
          onClick={props.openResetModal}
        >
          <Plus />
        </CustomButton>
      </div>
    </div>
  );
};

export default BottomBar;

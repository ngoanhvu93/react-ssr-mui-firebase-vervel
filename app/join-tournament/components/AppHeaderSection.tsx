import type { Tournament } from "firebase/types";
import { TopAppBar } from "~/components/TopAppBar";
import CustomSearch from "~/components/CustomSearch";
import { History } from "lucide-react";

const AppHeaderSection = (props: {
  selectedTournament: Tournament | null;
  setSelectedTournament: (tournament: Tournament | null) => void;
  from: string;
  navigate: (path: string) => void;
  searchQuery: string;
  setSearchQuery: (searchQuery: string) => void;
  showClearButton: boolean;
  setShowClearButton: (showClearButton: boolean) => void;
  searchInputRef: React.RefObject<HTMLInputElement>;
  handleTournamentSelect: (tournament: Tournament) => void;
  handleViewAllTournaments: () => void;
  handleViewMyTournaments: () => void;
  viewMode: "all" | "my";
  filteredTournaments: Tournament[];
}) => {
  return (
    <TopAppBar
      title={props.selectedTournament ? "Tham gia giải đấu" : "Chọn giải đấu"}
      onBack={() => {
        if (props.selectedTournament) {
          props.setSelectedTournament(null);
        } else if (props.from === "home") {
          props.navigate("/");
        } else if (props.from === "games") {
          props.navigate("/games");
        } else if (props.from === "search") {
          props.navigate("/search");
        } else {
          props.navigate("/");
        }
      }}
    >
      {!props.selectedTournament && (
        <CustomSearch
          placeholder="Tìm kiếm giải đấu"
          searchQuery={props.searchQuery}
          setSearchQuery={props.setSearchQuery}
          showClearButton={props.showClearButton}
          setShowClearButton={props.setShowClearButton}
          searchInputRef={props.searchInputRef}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              props.handleTournamentSelect(props.filteredTournaments[0]);
            }
          }}
        />
      )}
      {!props.selectedTournament && (
        <div className="flex w-full p-2 bg-gray-50 rounded-lg mt-2">
          <button
            className={`flex-1 rounded-md transition-all ${
              props.viewMode === "all"
                ? "  shadow-sm text-indigo-600 font-medium"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            onClick={props.handleViewAllTournaments}
          >
            Tất cả giải đấu
          </button>
          <button
            className={`flex-1 p-2 rounded-md transition-all flex items-center justify-center ${
              props.viewMode === "my"
                ? "  shadow-sm text-indigo-600  font-medium"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            onClick={props.handleViewMyTournaments}
          >
            <History size={18} className="mr-2" />
            Giải đấu của tôi
          </button>
        </div>
      )}
    </TopAppBar>
  );
};

export default AppHeaderSection;

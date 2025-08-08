import CustomSearch from "~/components/CustomSearch";

const SearchSection = (props: {
  searchQuery: string;
  setSearchQuery: (searchQuery: string) => void;
  showClearButton: boolean;
  setShowClearButton: (showClearButton: boolean) => void;
  searchInputRef: React.RefObject<HTMLInputElement>;
  scrollToActiveRound: () => void;
}) => {
  return (
    <CustomSearch
      searchQuery={props.searchQuery}
      setSearchQuery={(query) => {
        props.setSearchQuery(query);
        if (query.trim()) {
          setTimeout(() => {
            props.scrollToActiveRound();
          }, 150);
        }
      }}
      placeholder="Tìm kiếm trận đấu, cặp đấu"
      onClear={() => {
        props.setSearchQuery("");
        props.setShowClearButton(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
      showClearButton={props.showClearButton}
      setShowClearButton={props.setShowClearButton}
      searchInputRef={props.searchInputRef}
    />
  );
};
export default SearchSection;

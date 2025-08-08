import { X } from "lucide-react";

import { Search } from "lucide-react";

const SearchQueryNotFound = (props: {
  searchQuery: string;
  setSearchQuery: (searchQuery: string) => void;
  setShowClearButton: (showClearButton: boolean) => void;
}) => {
  return (
    <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex flex-col items-center gap-2">
        <Search size={24} className="text-gray-400" />
        <p className="text-gray-600 font-medium">
          Không tìm thấy trận đấu nào phù hợp
        </p>
        <p className="text-sm text-gray-500">
          Từ khóa tìm kiếm: "{props.searchQuery}"
        </p>
        <button
          onClick={() => {
            props.setSearchQuery("");
            props.setShowClearButton(false);
          }}
          className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
        >
          <X size={16} />
          Xóa tìm kiếm
        </button>
      </div>
    </div>
  );
};

export default SearchQueryNotFound;

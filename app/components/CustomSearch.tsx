import TextField from "@mui/material/TextField";
import { X } from "lucide-react";

const CustomSearch = (props: {
  searchQuery: string;
  setSearchQuery: (searchQuery: string) => void;
  placeholder?: string;
  onClear?: () => void;
  onSearch?: (searchQuery: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  showClearButton: boolean;
  setShowClearButton: (showClearButton: boolean) => void;
  searchInputRef: React.RefObject<HTMLInputElement>;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}) => {
  return (
    <div className="flex items-center gap-2 p-4 w-full">
      <div className="relative flex-1 w-full">
        <TextField
          autoFocus
          ref={props.searchInputRef}
          type="text"
          placeholder={props.placeholder}
          value={props.searchQuery}
          onChange={(e) => {
            props.setSearchQuery(e.target.value);
            props.setShowClearButton(e.target.value.length > 0);
          }}
          size="small"
          fullWidth
          label={props.placeholder}
        />
        {props.showClearButton && (
          <button
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 bg-gray-200 rounded-full p-1 active:bg-gray-300"
            onClick={() => {
              props.setSearchQuery("");
              props.setShowClearButton(false);
              props.searchInputRef.current?.focus();
            }}
            aria-label="Clear search"
            title="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default CustomSearch;

import Button from "@mui/material/Button";
import { Loader } from "lucide-react";

export const LoadMoreButton = (props: {
  searchQuery: string;
  hasMore: boolean;
  loadMore: () => void;
  loadingMore: boolean;
}) => {
  return (
    <div>
      {!props.searchQuery && props.hasMore && (
        <div className="pt-4 pb-2">
          <Button
            onClick={props.loadMore}
            disabled={props.loadingMore}
            variant="outlined"
            sx={{
              textTransform: "none",
            }}
            className="w-full"
          >
            {props.loadingMore ? (
              <div className="flex items-center justify-center">
                <Loader className="w-5 h-5 text-blue-500 animate-spin mr-2" />
                Đang tải...
              </div>
            ) : (
              "Tải thêm"
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

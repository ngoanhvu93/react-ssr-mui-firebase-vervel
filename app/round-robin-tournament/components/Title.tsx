import { Share2 } from "lucide-react";
import { toast } from "react-hot-toast";
import type { Tournament } from "firebase/types";

const Title = (props: { tournament: Tournament | null }) => {
  const { tournament } = props;
  return (
    <span className="flex items-center gap-2 justify-center px-2">
      <div className="flex-1 text-center">Giải đấu vòng tròn</div>
      <button
        type="button"
        title="Chia sẻ"
        className="bg-blue-50 hover:bg-blue-100 h-8 rounded-full px-4 py-1 flex items-center gap-2 text-blue-600 font-medium transition-color"
        onClick={() => {
          const url = window.location.href;
          if (navigator.share) {
            navigator
              .share({
                title: tournament?.name,
                text: `Tham gia Giải đấu ${tournament?.name} cùng mình nhé!`,
                url: url,
              })
              .catch((error) => {
                console.error("Error sharing:", error);
                navigator.clipboard.writeText(url);
                toast.success("Đã sao chép đường dẫn vào bộ nhớ tạm!");
              });
          } else {
            navigator.clipboard.writeText(url);
            toast.success("Đã sao chép đường dẫn vào bộ nhớ tạm!");
          }
        }}
      >
        <Share2 />
        <span className="hidden sm:block">Chia sẻ</span>
      </button>
    </span>
  );
};

export default Title;

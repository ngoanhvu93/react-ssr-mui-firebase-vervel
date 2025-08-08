import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import { CopyIcon, FacebookIcon, XIcon } from "lucide-react";

export const ShareModal = (props: {
  isShareModalOpen: boolean;
  setIsShareModalOpen: (isOpen: boolean) => void;
}) => {
  const { isShareModalOpen, setIsShareModalOpen } = props;
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
  };
  return (
    <Dialog open={isShareModalOpen} onClose={() => setIsShareModalOpen(false)}>
      <DialogTitle>
        <h2 className="text-xl font-bold">Chia sẻ phòng</h2>
      </DialogTitle>
      <DialogContent dividers>
        <div className="  p-6 rounded-lg w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Chia sẻ phòng</h2>
            <button
              title="Close"
              onClick={() => setIsShareModalOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <XIcon className="size-4" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex justify-center p-4 bg-gray-50 rounded-lg">
              <img
                loading="lazy"
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                  window.location.href
                )}`}
                alt="QR Code"
                className="w-32 h-32"
              />
            </div>

            <div className="flex gap-2">
              <input
                title="Share Link"
                type="text"
                value={window.location.href}
                readOnly
                className="flex-1 border rounded-lg px-3 py-2 bg-gray-50"
              />
              <button
                onClick={handleCopyLink}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                <CopyIcon className="size-4" />
                Sao chép
              </button>
            </div>

            <div className="flex justify-center gap-4">
              <button
                title="Share on Facebook"
                onClick={() =>
                  window.open(
                    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                      window.location.href
                    )}`,
                    "_blank"
                  )
                }
                className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
              >
                <FacebookIcon className="size-6" />
              </button>
              <button
                title="Share on Zalo"
                onClick={() =>
                  window.open(
                    `https://zalo.me/share?u=${encodeURIComponent(
                      window.location.href
                    )}`,
                    "_blank"
                  )
                }
                className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12.49 10.272v-.45h1.347v6.322h-.77a.576.576 0 0 1-.577-.573v.001a3.273 3.273 0 0 1-1.938.632 3.284 3.284 0 0 1-3.284-3.282 3.284 3.284 0 0 1 3.284-3.282 3.273 3.273 0 0 1 1.938.632zm-1.938-.132a2.75 2.75 0 0 0-2.75 2.75 2.75 2.75 0 0 0 2.75 2.75 2.75 2.75 0 0 0 2.75-2.75 2.75 2.75 0 0 0-2.75-2.75z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

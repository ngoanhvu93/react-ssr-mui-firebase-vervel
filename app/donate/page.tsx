import { ImageDown } from "lucide-react";
import { toast } from "react-hot-toast";
import { BottomAppBar } from "~/components/BottomAppBar";
import { TopAppBar } from "~/components/TopAppBar";
import Footer from "~/components/Footer";
import { donorsData } from "./donorData";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import { MonetizationOn } from "@mui/icons-material";
import Divider from "@mui/material/Divider";

export default function Donate() {
  const handleSaveQRCode = async () => {
    try {
      const response = await fetch("/images/momo-qr-code.jpg");
      if (!response.ok) {
        throw new Error("Failed to fetch QR code");
      }
      const blob = await response.blob();

      // Check if device is mobile and Web Share API is available
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobile && navigator.share && navigator.canShare) {
        const file = new File([blob], "momo-qr-code.jpg", {
          type: "image/jpg",
        });

        // Check if we can share the file
        const shareData = { files: [file], title: "Mã QR Momo" };
        if (navigator.canShare(shareData)) {
          await navigator.share(shareData);
          return;
        }
      }

      // Fall back to download method
      const url =
        typeof window !== "undefined" ? window.URL.createObjectURL(blob) : "";
      const link = document.createElement("a");
      link.href = url;
      link.download = "momo-qr-code.jpg";
      link.click();
      if (typeof window !== "undefined") {
        window.URL.revokeObjectURL(url);
      }
      toast.success("Đã tải mã QR về thiết bị của bạn!");
    } catch (error) {
      console.error("Failed to download/share QR code:", error);
      toast.error("Không thể tải mã QR.");
    }
  };

  return (
    <div className="w-full flex flex-col mx-auto max-w-4xl">
      <TopAppBar title="Ủng hộ dự án" />

      <div className="flex flex-col items-center p-4 w-full mx-auto ">
        <div className="w-full">
          <div className="w-full">
            <Card className="p-4">
              <h2 className="text-xl font-bold mb-2">
                Vì sao ủng hộ chúng tôi?
              </h2>
              <p className="mb-3">
                Cảm ơn bạn đã quan tâm đến dự án của chúng tôi! Mỗi đóng góp của
                bạn đều có ý nghĩa to lớn trong việc:
              </p>
              <ul className="list-disc pl-5  space-y-2 mb-3">
                <li>
                  Duy trì và phát triển ứng dụng với nhiều tính năng hữu ích hơn
                </li>
                <li>Cải thiện trải nghiệm người dùng và giao diện</li>
                <li>Hỗ trợ đội ngũ phát triển tiếp tục sáng tạo</li>
                <li>Xây dựng cộng đồng người chơi ngày càng lớn mạnh</li>
              </ul>
              <p className=" italic">
                "Mỗi sự ủng hộ nhỏ đều góp phần tạo nên những trải nghiệm tuyệt
                vời cho tất cả mọi người."
              </p>
              <div className="mt-3 text-center ">
                <div className="text-pink-500 italic">
                  Cảm ơn bạn đã đồng hành cùng chúng tôi!{" "}
                </div>
              </div>
            </Card>

            <Card sx={{ p: 2, mt: 2, borderRadius: 1 }}>
              <img
                loading="lazy"
                src={"/images/momo-qr-code.jpg"}
                alt="QR Code"
              />
              <div className="flex items-center justify-center gap-2 mt-2 w-full">
                <Button
                  startIcon={<ImageDown size={20} />}
                  onClick={handleSaveQRCode}
                  variant="contained"
                  color="success"
                  fullWidth
                  sx={{
                    textTransform: "none",
                  }}
                >
                  Lưu mã QR
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() =>
                    typeof window !== "undefined" &&
                    window.open(
                      "momo://?action=transfer&receiver=0969872363",
                      "_blank"
                    )
                  }
                  fullWidth
                  sx={{
                    textTransform: "none",
                  }}
                  startIcon={<MonetizationOn />}
                >
                  Mở MOMO
                </Button>
              </div>
            </Card>

            {/* Danh sách người ủng hộ */}
            <Card sx={{ p: 2, my: 2, borderRadius: 1 }}>
              <h2 className="text-xl font-bold text-center mb-2">
                Người ủng hộ dự án
              </h2>
              <Divider sx={{ mb: 1 }} />
              <div className="overflow-hidden">
                <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                  {donorsData.map((donor, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg transition-all hover:bg-blue-50"
                      style={{
                        borderLeft: index < 3 ? `4px solid ${donor.color}` : "",
                        animation: index < 3 ? "fadeIn 0.5s ease-in" : "",
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex items-center justify-center w-9 h-9 rounded-full ${donor.bgClass} text-white font-bold`}
                        >
                          {index < 3 ? (
                            <span>{index + 1}</span>
                          ) : (
                            <span>{donor.name.charAt(0)}</span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{donor.name}</p>
                          <p className="text-xs text-gray-500">{donor.date}</p>
                        </div>
                      </div>
                      <div className="font-bold ">
                        {donor.amount.toLocaleString()}đ
                      </div>
                    </div>
                  ))}
                </div>
                <Divider sx={{ mt: 1, mb: 1 }} />
                <div className="text-center">
                  <span className="text-sm italic">
                    Cảm ơn đóng góp của tất cả các bạn!
                  </span>
                </div>
              </div>
            </Card>
          </div>
          <Footer />
        </div>
      </div>
      <BottomAppBar />
    </div>
  );
}

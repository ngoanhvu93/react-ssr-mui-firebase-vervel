import React, { useState } from "react";
import { X, ImageDown, Check, Loader, ArrowRight } from "lucide-react";
import { CustomButton } from "./CustomButton";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { db } from "firebase/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useModalScrollLock } from "~/utils/modal-utils";

interface PaymentOption {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  isPopular?: boolean;
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: () => void;
  userEmail?: string | null;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onPaymentSuccess,
  userEmail,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);

  // Use the modal scroll lock hook instead of manual overflow handling
  useModalScrollLock(isOpen);

  const paymentOptions: PaymentOption[] = [
    {
      id: "basic",
      name: "Cơ bản",
      price: 20000,
      description: "Tạo thêm 1 sự kiện tùy chỉnh",
      features: [
        "Tạo thêm 1 sự kiện tùy chỉnh (tổng cộng 2)",
        "Hỗ trợ cơ bản",
        "Hiệu ứng cơ bản",
      ],
    },
    {
      id: "premium",
      name: "Cao cấp",
      price: 50000,
      description: "Tạo không giới hạn sự kiện tùy chỉnh",
      features: [
        "Tạo không giới hạn sự kiện tùy chỉnh",
        "Hỗ trợ ưu tiên",
        "Hiệu ứng đặc biệt",
        "Tùy chỉnh giao diện đếm ngược",
      ],
      isPopular: true,
    },
  ];

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
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "momo-qr-code.jpg";
      link.click();
      window.URL.revokeObjectURL(url);
      toast.success("Đã tải mã QR về thiết bị của bạn!");
    } catch (error) {
      console.error("Failed to download/share QR code:", error);
      toast.error("Không thể tải mã QR.");
    }
  };

  const handlePaymentConfirmation = async () => {
    if (!selectedOption || !userEmail) return;

    setIsProcessing(true);

    try {
      // Lưu thông tin thanh toán vào Firestore
      const paymentId = `payment_${Date.now()}`;
      const selectedPaymentOption = paymentOptions.find(
        (o) => o.id === selectedOption
      );

      if (!selectedPaymentOption) {
        throw new Error("Không tìm thấy gói thanh toán");
      }

      await setDoc(doc(db, "payments", paymentId), {
        userId: userEmail,
        paymentId,
        packageId: selectedOption,
        packageName: selectedPaymentOption.name,
        amount: selectedPaymentOption.price,
        status: "pending",
        createdAt: serverTimestamp(),
        features: selectedPaymentOption.features,
      });

      // Giả lập xác nhận thanh toán thành công
      setTimeout(() => {
        setIsProcessing(false);
        toast.success("Thanh toán thành công!");
        onPaymentSuccess();
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Lỗi khi xử lý thanh toán:", error);
      setIsProcessing(false);
      toast.error("Có lỗi xảy ra khi xử lý thanh toán. Vui lòng thử lại!");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/30 backdrop-blur-sm overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="w-full sm:w-auto sm:max-w-2xl   rounded-none sm:rounded-xl shadow-lg overflow-hidden min-h-[100vh] sm:min-h-0 sm:my-4"
          >
            <div className="relative p-3 sm:p-5 max-h-[100vh] sm:max-h-[85vh] overflow-y-auto">
              <button
                title="Đóng"
                onClick={onClose}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-500 hover:text-gray-700 z-10  /80 p-1 rounded-full"
              >
                <X size={18} />
              </button>

              {!showQRCode ? (
                <>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-1 pr-8">
                    Nâng cấp tài khoản
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                    Ứng dụng hoàn toàn miễn phí cho tất cả các tính năng cơ bản.
                    Bạn chỉ cần nâng cấp khi muốn tạo nhiều sự kiện cá nhân tùy
                    chỉnh.
                  </p>

                  <div className="mb-4 p-2 sm:p-3 bg-green-50 rounded-md text-green-800 text-xs sm:text-sm">
                    <p>
                      <strong>Miễn phí:</strong> Tạo 1 sự kiện cá nhân tùy chỉnh
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-5 sm:mb-6">
                    {paymentOptions.map((option) => (
                      <div
                        key={option.id}
                        className={`border rounded-lg p-3 sm:p-4 cursor-pointer transition-all duration-300 ${
                          selectedOption === option.id
                            ? "border-blue-500 bg-blue-50 shadow-md"
                            : "hover:border-blue-300 hover:shadow-sm"
                        } ${
                          option.isPopular ? "relative overflow-hidden" : ""
                        }`}
                        onClick={() => setSelectedOption(option.id)}
                      >
                        {option.isPopular && (
                          <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-bl-lg">
                            Phổ biến
                          </div>
                        )}
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-bold text-gray-800">
                            {option.name}
                          </h3>
                          <div
                            className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                              selectedOption === option.id
                                ? "border-blue-500 bg-blue-500"
                                : "border-gray-300"
                            }`}
                          >
                            {selectedOption === option.id && (
                              <Check size={14} className="text-white" />
                            )}
                          </div>
                        </div>
                        <p className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
                          {option.price.toLocaleString()}đ
                        </p>
                        <p className="text-sm text-gray-600 mb-2 sm:mb-3">
                          {option.description}
                        </p>
                        <ul className="space-y-1 sm:space-y-2">
                          {option.features.map((feature, index) => (
                            <li
                              key={index}
                              className="flex items-center text-xs sm:text-sm text-gray-700"
                            >
                              <Check
                                size={14}
                                className="text-green-500 mr-1.5 sm:mr-2 flex-shrink-0"
                              />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  <div className="flex  sm:flex-row gap-2 sm:gap-3 mt-4 sticky bottom-0 pt-2  ">
                    <CustomButton
                      icon={<X size={16} />}
                      variant="secondary"
                      onClick={onClose}
                      className="flex-1"
                    >
                      Hủy
                    </CustomButton>
                    <CustomButton
                      icon={<ArrowRight size={16} />}
                      variant="primary"
                      onClick={() => {
                        if (selectedOption) {
                          setShowQRCode(true);
                        } else {
                          toast.error("Vui lòng chọn một gói thanh toán!");
                        }
                      }}
                      disabled={!selectedOption}
                      className="flex-1"
                    >
                      Tiếp tục
                    </CustomButton>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-1 pr-8">
                    Thanh toán
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                    Quét mã QR dưới đây để thanh toán
                  </p>

                  <div className="p-3 sm:p-4 bg-blue-50 rounded-lg mb-4 border border-blue-100">
                    <div className="flex items-start sm:items-center">
                      <div className="flex-shrink-0 mr-2 sm:mr-3">
                        <div className="bg-blue-100 p-1.5 sm:p-2 rounded-full">
                          <svg
                            className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            ></path>
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xs sm:text-sm font-medium text-blue-800 mb-1">
                          Hướng dẫn
                        </h4>
                        <ul className="text-xs text-blue-700 space-y-1">
                          <li>
                            1. Quét mã QR bằng ứng dụng ngân hàng hoặc Momo
                          </li>
                          <li>
                            2. Nội dung chuyển khoản: {userEmail?.split("@")[0]}
                            _{selectedOption}
                          </li>
                          <li>
                            3. Xác nhận và nhấn "Tôi đã thanh toán" bên dưới
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="mb-5 sm:mb-6 text-center">
                    <div className="max-w-[200px] sm:max-w-xs mx-auto   p-2 rounded-lg shadow-sm border">
                      <img
                        src="/images/momo-qr-code.jpg"
                        alt="QR Code"
                        className="w-full h-auto rounded"
                      />
                    </div>
                    <p className="mt-2 text-xs sm:text-sm text-gray-600">
                      Số tiền:{" "}
                      <span className="font-bold text-red-600">
                        {paymentOptions
                          .find((o) => o.id === selectedOption)
                          ?.price.toLocaleString()}
                        đ
                      </span>
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 sm:gap-3 sticky bottom-0 pt-2  ">
                    <CustomButton
                      variant="save"
                      icon={<ImageDown size={16} />}
                      onClick={handleSaveQRCode}
                    >
                      Lưu mã QR
                    </CustomButton>
                    <CustomButton
                      variant="primary"
                      onClick={handlePaymentConfirmation}
                      disabled={isProcessing}
                      icon={
                        isProcessing ? (
                          <Loader className="animate-spin" size={16} />
                        ) : null
                      }
                    >
                      {isProcessing ? "Đang xử lý..." : "Tôi đã thanh toán"}
                    </CustomButton>
                    <button
                      className="text-gray-500 hover:text-gray-700 text-xs sm:text-sm mt-2"
                      onClick={() => setShowQRCode(false)}
                    >
                      Quay lại
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PaymentModal;

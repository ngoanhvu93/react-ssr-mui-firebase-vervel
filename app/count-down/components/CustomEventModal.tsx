import React, { useState } from "react";
import { X, Loader, Save } from "lucide-react";
import { CustomButton } from "~/components/CustomButton";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "firebase/firebase";
import { doc, setDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "react-hot-toast";
import { useModalScrollLock } from "~/utils/modal-utils";

export interface CustomEventType {
  id: string;
  name: string;
  date: Date;
  icon: string;
  userId: string;
  description?: string;
  createdAt: Date;
}

interface CustomEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
  onSave: (event: CustomEventType) => void;
  event?: CustomEventType; // Nếu có sự kiện hiện tại, đây là chế độ chỉnh sửa
}

const CustomEventModal: React.FC<CustomEventModalProps> = ({
  isOpen,
  onClose,
  userEmail,
  onSave,
  event,
}) => {
  const [name, setName] = useState(event?.name || "");
  const [date, setDate] = useState(
    event?.date
      ? new Date(event.date).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0]
  );
  const [time, setTime] = useState(
    event?.date ? new Date(event.date).toTimeString().slice(0, 5) : "00:00"
  );
  const [icon, setIcon] = useState(event?.icon || "🎉");
  const [description, setDescription] = useState(event?.description || "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Use the modal scroll lock hook instead of manual overflow handling
  useModalScrollLock(isOpen);

  // Danh sách biểu tượng phổ biến cho người dùng chọn
  const popularIcons = [
    "🎉",
    "🎊",
    "🎂",
    "🎁",
    "💼",
    "🏆",
    "💍",
    "👶",
    "🎓",
    "🏠",
    "🚗",
    "✈️",
    "💰",
    "💼",
    "💻",
    "📱",
    "📷",
    "🎮",
    "🎬",
    "🎭",
    "🎨",
    "🎤",
    "🎧",
    "🎼",
    "⚽",
    "🏀",
    "🏈",
    "⚾",
    "🎾",
    "🏐",
    "🏉",
    "🎯",
    "🎱",
    "🏓",
    "🏸",
    "🥊",
    "🥋",
    "🏹",
    "🎣",
    "🚴",
    "🚵",
    "🏊",
    "🧗",
    "🏄",
    "🏂",
    "🪂",
    "🏇",
    "🏋️",
    "🤸",
    "🤺",
    "⛷️",
    "🏌️",
    "🧘",
    "🎪",
    "🌞",
    "🌛",
    "⭐",
    "🌈",
    "☀️",
    "☁️",
    "⛅",
    "⛈️",
    "🌤️",
    "🌦️",
    "🌧️",
    "🌩️",
    "🌨️",
    "❄️",
    "💧",
    "💦",
    "☔",
    "🌊",
    "🍔",
    "🍕",
    "🍗",
    "🍖",
    "🍜",
    "🍝",
    "🍣",
    "🍱",
    "🍩",
    "🍪",
    "🍰",
    "🍫",
    "🍬",
    "🍭",
    "🍷",
    "🍸",
    "🍹",
    "🍺",
    "🍻",
    "🥂",
    "🥃",
    "☕",
    "🧋",
    "🍵",
  ];

  const handleSave = async () => {
    // Kiểm tra dữ liệu
    if (name.trim() === "") {
      setError("Vui lòng nhập tên sự kiện");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Tạo đối tượng sự kiện
      const eventDate = new Date(`${date}T${time}`);
      const eventId = event?.id || `event_${Date.now()}`;

      const customEvent: CustomEventType = {
        id: eventId,
        name: name.trim(),
        date: eventDate,
        icon,
        userId: userEmail,
        description: description.trim(),
        createdAt: event?.createdAt || new Date(),
      };

      // Lưu vào Firestore
      await setDoc(doc(db, "custom-events", eventId), {
        ...customEvent,
        date: eventDate.toISOString(),
        createdAt: event?.createdAt || serverTimestamp(),
      });

      toast.success(event ? "Đã cập nhật sự kiện" : "Đã tạo sự kiện mới");
      onSave(customEvent);
      onClose();
    } catch (error) {
      console.error("Lỗi khi lưu sự kiện:", error);
      setError("Đã có lỗi xảy ra khi lưu sự kiện. Vui lòng thử lại!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!event) return;

    if (!confirm("Bạn có chắc chắn muốn xóa sự kiện này?")) {
      return;
    }

    setIsLoading(true);

    try {
      await deleteDoc(doc(db, "custom-events", event.id));
      toast.success("Đã xóa sự kiện");
      onClose();
    } catch (error) {
      console.error("Lỗi khi xóa sự kiện:", error);
      toast.error("Đã có lỗi xảy ra khi xóa sự kiện");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-md   rounded-xl shadow-lg overflow-hidden max-h-[90vh] my-4 flex flex-col"
          >
            {/* Fixed Header */}
            <div className="relative p-5 border-b border-gray-100">
              <button
                title="Đóng"
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <X size={18} />
              </button>

              <h2 className="text-xl font-bold text-gray-800 mb-1">
                {event ? "Chỉnh sửa sự kiện" : "Tạo sự kiện mới"}
              </h2>
              <p className="text-gray-600">
                {event
                  ? "Cập nhật thông tin sự kiện của bạn"
                  : "Tạo sự kiện tùy chỉnh để đếm ngược"}
              </p>
            </div>

            {/* Scrollable Content */}
            <div className="p-5 overflow-y-auto flex-1">
              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
                  {error}
                </div>
              )}

              <div className="mb-4">
                <label
                  htmlFor="eventName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Tên sự kiện <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="eventName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập tên sự kiện"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label
                    htmlFor="eventDate"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Ngày <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="eventDate"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="eventTime"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Giờ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    id="eventTime"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="eventIcon"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Biểu tượng <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center mb-2">
                  <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-md text-2xl">
                    {icon}
                  </div>
                  <input
                    type="text"
                    id="eventIcon"
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    maxLength={2}
                    className="ml-3 w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mt-2 bg-gray-50 p-2 rounded-md">
                  <p className="text-xs text-gray-600 mb-1">
                    Biểu tượng phổ biến:
                  </p>
                  <div className="flex flex-wrap gap-2 max-h-[150px] overflow-y-auto pr-1">
                    {popularIcons.slice(0, 40).map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        title={`Chọn ${emoji}`}
                        onClick={() => setIcon(emoji)}
                        className={`w-8 h-8 flex items-center justify-center rounded-md text-xl hover:bg-gray-200 ${
                          icon === emoji
                            ? "bg-blue-100 border border-blue-300"
                            : ""
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="eventDescription"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Mô tả (tùy chọn)
                </label>
                <textarea
                  id="eventDescription"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập mô tả cho sự kiện của bạn"
                  rows={3}
                />
              </div>
            </div>

            {/* Fixed Footer */}
            <div className="p-5 border-t border-gray-100">
              <div className="flex gap-3">
                {event && (
                  <CustomButton
                    variant="danger"
                    onClick={handleDelete}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    Xóa
                  </CustomButton>
                )}
                <CustomButton
                  variant="secondary"
                  onClick={onClose}
                  disabled={isLoading}
                  className="flex-1"
                >
                  Hủy
                </CustomButton>
                <CustomButton
                  variant={event ? "save" : "create"}
                  onClick={handleSave}
                  disabled={isLoading}
                  className="flex-1"
                  icon={
                    isLoading ? (
                      <Loader size={18} className="animate-spin" />
                    ) : (
                      <Save size={18} />
                    )
                  }
                >
                  {isLoading ? "Đang lưu..." : event ? "Cập nhật" : "Tạo"}
                </CustomButton>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CustomEventModal;

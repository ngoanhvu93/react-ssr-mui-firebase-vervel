import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Calendar,
  PlusCircle,
  Edit,
  ListFilter,
  Loader,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { db, auth } from "firebase/firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { CustomButton } from "~/components/CustomButton";
import PaymentModal from "~/components/PaymentModal";
import { toast } from "react-hot-toast";
import CustomEventModal, { type CustomEventType } from "./CustomEventModal";
import AuthModal from "~/components/AuthModal";
import { disableBodyScroll, enableBodyScroll } from "~/utils/modal-utils";

interface CustomEventsListProps {
  onSelectEvent: (event: CustomEventType) => void;
  selectedEventId?: string;
  onClose?: () => void;
}

const CustomEventsList: React.FC<CustomEventsListProps> = ({
  onSelectEvent,
  selectedEventId,
  onClose,
}) => {
  const [events, setEvents] = useState<CustomEventType[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<CustomEventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CustomEventType | undefined>(
    undefined
  );
  const [userPackage, setUserPackage] = useState<string | null>(null);
  const [packageLoading, setPackageLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Khi người dùng đã đăng nhập, kiểm tra gói đăng ký
        checkUserPackage(currentUser.email);
      }
    });

    return () => unsubscribe();
  }, []);

  // Kiểm tra gói đăng ký của người dùng
  const checkUserPackage = async (email: string | null) => {
    if (!email) return;

    setPackageLoading(true);
    try {
      const paymentsRef = collection(db, "payments");
      const q = query(
        paymentsRef,
        where("userId", "==", email),
        where("status", "==", "pending"),
        orderBy("createdAt", "desc")
      );

      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const packageData = querySnapshot.docs[0].data();
        setUserPackage(packageData.packageId);
      } else {
        setUserPackage(null);
      }
    } catch (error) {
      console.error("Lỗi khi kiểm tra gói:", error);
    } finally {
      setPackageLoading(false);
    }
  };

  // Lấy danh sách sự kiện tùy chỉnh
  const fetchCustomEvents = async () => {
    if (!user) {
      setEvents([]);
      setFilteredEvents([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const eventsRef = collection(db, "custom-events");
      const q = query(
        eventsRef,
        where("userId", "==", user.email),
        orderBy("date", "asc")
      );

      const querySnapshot = await getDocs(q);
      const eventsList: CustomEventType[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        eventsList.push({
          ...data,
          id: doc.id,
          date: new Date(data.date),
          createdAt: new Date(data.createdAt),
        } as CustomEventType);
      });

      setEvents(eventsList);
      setFilteredEvents(eventsList);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sự kiện:", error);
      toast.error("Không thể tải danh sách sự kiện");
    } finally {
      setLoading(false);
    }
  };

  // Cập nhật danh sách khi người dùng thay đổi
  useEffect(() => {
    fetchCustomEvents();
  }, [user]);

  // Lọc sự kiện khi tìm kiếm
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredEvents(events);
    } else {
      const term = searchTerm.toLowerCase().trim();
      const filtered = events.filter(
        (event) =>
          event.name.toLowerCase().includes(term) ||
          event.description?.toLowerCase().includes(term) ||
          format(event.date, "dd/MM/yyyy").includes(term)
      );
      setFilteredEvents(filtered);
    }
  }, [searchTerm, events]);

  // Xử lý khi người dùng chọn một sự kiện
  const handleEventClick = (event: CustomEventType) => {
    onSelectEvent(event);
    if (onClose) onClose();
  };

  // Xử lý khi lưu sự kiện mới hoặc cập nhật
  const handleSaveEvent = (event: CustomEventType) => {
    fetchCustomEvents(); // Làm mới danh sách

    // Tự động chọn sự kiện mới tạo
    if (!editingEvent) {
      onSelectEvent(event);
      if (onClose) onClose();
    }
  };

  // Xử lý khi người dùng muốn thêm sự kiện
  const handleAddEvent = () => {
    // if (!user) {
    //   setShowAuthModal(true);
    //   return;
    // }

    // Nếu người dùng chưa có gói đăng ký và đã có sự kiện, yêu cầu nâng cấp
    // if (!userPackage && events.length >= 1) {
    //   setShowPaymentModal(true);
    //   return;
    // }

    // Nếu gói basic và đã có sự kiện, không cho phép tạo thêm
    // if (userPackage === "basic" && events.length >= 1) {
    //   toast.error(
    //     "Gói Cơ bản chỉ cho phép tạo 1 sự kiện. Vui lòng nâng cấp để tạo thêm!"
    //   );
    //   setShowPaymentModal(true);
    //   return;
    // }

    // Mở modal tạo sự kiện
    setEditingEvent(undefined);
    setShowAddEventModal(true);
  };

  // Xử lý khi người dùng muốn chỉnh sửa sự kiện
  const handleEditEvent = (event: CustomEventType) => {
    setEditingEvent(event);
    setShowAddEventModal(true);
  };

  // Effect to prevent scrolling when modals are open
  useEffect(() => {
    if (showAuthModal || showPaymentModal || showAddEventModal) {
      disableBodyScroll();
    } else {
      enableBodyScroll();
    }

    // Cleanup function to ensure scrolling is restored when component unmounts
    return () => {
      enableBodyScroll();
    };
  }, [showAuthModal, showPaymentModal, showAddEventModal]);

  return (
    <div className="  shadow-lg rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800 flex items-center">
            <Calendar className="mr-2" size={20} />
            Sự kiện của tôi
          </h2>
          <div className="flex items-center gap-2">
            {user ? (
              <div className="text-sm text-gray-600">
                {packageLoading ? (
                  <div className="flex items-center">
                    <Loader size={14} className="animate-spin mr-1" /> Đang
                    tải...
                  </div>
                ) : userPackage ? (
                  <span className="px-2 py-1 rounded-full bg-green-100 text-green-800">
                    Gói {userPackage === "basic" ? "Cơ bản" : "Cao cấp"}
                  </span>
                ) : (
                  <button
                    onClick={() => setShowPaymentModal(true)}
                    className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                  >
                    Nâng cấp ngay
                  </button>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Đăng nhập
              </button>
            )}
            {onClose && (
              <button
                onClick={onClose}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                title="Đóng"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 bg-gray-50">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Tìm kiếm sự kiện..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md pl-9 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
          </div>
          <CustomButton
            variant="create"
            onClick={handleAddEvent}
            icon={<PlusCircle size={18} />}
            className="whitespace-nowrap"
          >
            Tạo mới
          </CustomButton>
        </div>

        {user && !userPackage && events.length === 0 && (
          <div className="mt-3 p-3 bg-blue-50 rounded-md text-blue-800 text-sm">
            <p>
              <strong>Thông báo:</strong> Bạn có thể tạo một sự kiện cá nhân
              hoàn toàn miễn phí. Chỉ cần nâng cấp nếu muốn tạo nhiều hơn.
            </p>
          </div>
        )}
      </div>

      <div className="p-2 max-h-[70vh] overflow-y-auto">
        {loading ? (
          <div className="py-8 flex justify-center items-center">
            <Loader className="animate-spin text-blue-500" />
            <span className="ml-2 text-gray-600">Đang tải...</span>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="py-8 flex flex-col items-center justify-center text-center">
            {events.length === 0 ? (
              <>
                <div className="text-gray-400 mb-3">
                  <Calendar size={40} strokeWidth={1} />
                </div>
                <p className="text-gray-500 mb-2">Bạn chưa có sự kiện nào</p>
                <p className="text-gray-400 text-sm mb-4">
                  Tạo sự kiện của riêng bạn để bắt đầu
                </p>
                <CustomButton
                  variant="create"
                  onClick={handleAddEvent}
                  icon={<Plus size={16} />}
                  size="small"
                >
                  Tạo sự kiện đầu tiên
                </CustomButton>
              </>
            ) : (
              <>
                <ListFilter size={32} className="text-gray-400 mb-3" />
                <p className="text-gray-500">Không tìm thấy sự kiện phù hợp</p>
                <p className="text-gray-400 text-sm mt-1">
                  Thử tìm kiếm với từ khóa khác
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence>
              {filteredEvents.map((event) => {
                const isPast = event.date < new Date();
                const isToday =
                  new Date().toDateString() === event.date.toDateString();

                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className={`p-3 border rounded-lg cursor-pointer ${
                      event.id === selectedEventId
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/50"
                    } ${isPast ? "opacity-60" : ""}`}
                    onClick={() => handleEventClick(event)}
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 text-2xl mr-3">
                        {event.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-gray-800 truncate">
                            {event.name}
                          </h3>
                          <div className="flex space-x-1 ml-2">
                            <button
                              title="Chỉnh sửa"
                              className="p-1 text-gray-500 hover:text-blue-500 rounded-full hover:bg-gray-100"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditEvent(event);
                              }}
                            >
                              <Edit size={14} />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {format(event.date, "EEEE, dd/MM/yyyy HH:mm", {
                            locale: vi,
                          })}
                        </p>
                        {event.description && (
                          <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                            {event.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="text-xs">
                        {isPast ? (
                          <span className="text-red-500">Đã qua</span>
                        ) : isToday ? (
                          <span className="text-green-500">Hôm nay</span>
                        ) : (
                          <span className="text-blue-500">Sắp tới</span>
                        )}
                      </div>
                      <div className="text-xs text-gray-400">
                        Tạo ngày {format(event.createdAt, "dd/MM/yyyy")}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        setIsOpen={setShowAuthModal}
        description="Bạn cần đăng nhập để tạo và quản lý sự kiện tùy chỉnh."
      />

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onPaymentSuccess={() => {
          setShowPaymentModal(false);
          if (user) {
            checkUserPackage(user.email);
            // Sau khi thanh toán thành công, mở modal tạo sự kiện
            setShowAddEventModal(true);
          }
        }}
        userEmail={user?.email}
      />

      {/* Custom Event Modal */}
      {user && (
        <CustomEventModal
          isOpen={showAddEventModal}
          onClose={() => {
            setShowAddEventModal(false);
            setEditingEvent(undefined);
          }}
          userEmail={user.email}
          onSave={handleSaveEvent}
          event={editingEvent}
        />
      )}
    </div>
  );
};

export default CustomEventsList;

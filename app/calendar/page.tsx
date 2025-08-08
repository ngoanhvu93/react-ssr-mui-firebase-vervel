import { useState, useEffect, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Search,
  Edit3,
  Trash2,
  Sun,
  Moon,
  List,
  User,
  Users,
  Home,
  Briefcase,
  Heart,
  X,
  Save,
  CalendarDays,
  Menu,
} from "lucide-react";

interface Event {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  allDay: boolean;
  location: string;
  category: string;
  priority: "low" | "medium" | "high";
  color: string;
  isRecurring: boolean;
  recurrenceRule?: string;
  reminder: boolean;
  reminderTime?: number; // minutes before
  attendees: string[];
  notes: string;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface VietnameseHoliday {
  name: string;
  date: string;
  type: "national" | "traditional" | "religious";
  description: string;
}

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"month" | "week" | "day" | "agenda">(
    "month"
  );
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [showSidebar, setShowSidebar] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const newEventRef = useRef<Event>({
    id: "",
    title: "",
    description: "",
    startDate: new Date(),
    endDate: new Date(),
    allDay: false,
    location: "",
    category: "personal",
    priority: "medium",
    color: "blue",
    isRecurring: false,
    reminder: false,
    attendees: [],
    notes: "",
    isCompleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  // Vietnamese holidays 2024
  const vietnameseHolidays: VietnameseHoliday[] = [
    {
      name: "Tết Dương lịch",
      date: "2024-01-01",
      type: "national",
      description: "Năm mới dương lịch",
    },
    {
      name: "Tết Nguyên đán",
      date: "2024-02-10",
      type: "traditional",
      description: "Tết cổ truyền Việt Nam",
    },
    {
      name: "Giỗ tổ Hùng Vương",
      date: "2024-04-18",
      type: "national",
      description: "Lễ hội Đền Hùng",
    },
    {
      name: "Giải phóng miền Nam",
      date: "2024-04-30",
      type: "national",
      description: "Thống nhất đất nước",
    },
    {
      name: "Quốc tế Lao động",
      date: "2024-05-01",
      type: "national",
      description: "Ngày Quốc tế Lao động",
    },
    {
      name: "Quốc khánh",
      date: "2024-09-02",
      type: "national",
      description: "Ngày độc lập Việt Nam",
    },
  ];

  const categories = [
    {
      id: "all",
      name: "Tất cả",
      icon: <CalendarIcon className="w-4 h-4" />,
      color: "gray",
    },
    {
      id: "personal",
      name: "Cá nhân",
      icon: <User className="w-4 h-4" />,
      color: "blue",
    },
    {
      id: "work",
      name: "Công việc",
      icon: <Briefcase className="w-4 h-4" />,
      color: "green",
    },
    {
      id: "family",
      name: "Gia đình",
      icon: <Home className="w-4 h-4" />,
      color: "pink",
    },
    {
      id: "health",
      name: "Sức khỏe",
      icon: <Heart className="w-4 h-4" />,
      color: "red",
    },
    {
      id: "social",
      name: "Xã hội",
      icon: <Users className="w-4 h-4" />,
      color: "purple",
    },
  ];

  const colors = [
    {
      name: "blue",
      bg: "bg-blue-500",
      text: "text-blue-500",
      border: "border-blue-500",
    },
    {
      name: "green",
      bg: "bg-green-500",
      text: "text-green-500",
      border: "border-green-500",
    },
    {
      name: "purple",
      bg: "bg-purple-500",
      text: "text-purple-500",
      border: "border-purple-500",
    },
    {
      name: "red",
      bg: "bg-red-500",
      text: "text-red-500",
      border: "border-red-500",
    },
    {
      name: "yellow",
      bg: "bg-yellow-500",
      text: "text-yellow-500",
      border: "border-yellow-500",
    },
    {
      name: "pink",
      bg: "bg-pink-500",
      text: "text-pink-500",
      border: "border-pink-500",
    },
    {
      name: "indigo",
      bg: "bg-indigo-500",
      text: "text-indigo-500",
      border: "border-indigo-500",
    },
    {
      name: "orange",
      bg: "bg-orange-500",
      text: "text-orange-500",
      border: "border-orange-500",
    },
  ];

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(typeof window !== "undefined" && window.innerWidth < 768);
      if (typeof window !== "undefined" && window.innerWidth < 768) {
        setShowSidebar(false);
      }
    };

    checkMobile();
    if (typeof window !== "undefined") {
      window.addEventListener("resize", checkMobile);
      return () => window.removeEventListener("resize", checkMobile);
    }
  }, []);

  // Load events from localStorage
  useEffect(() => {
    const savedEvents = localStorage.getItem("calendar-events");
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    }
  }, []);

  // Save events to localStorage
  useEffect(() => {
    localStorage.setItem("calendar-events", JSON.stringify(events));
  }, [events]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const currentDate = new Date(startDate);

    while (currentDate <= lastDay || currentDate.getDay() !== 0) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return days;
  };

  const getEventsForDate = (date: Date) => {
    return events.filter((event) => {
      const eventDate = new Date(event.startDate);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const getVietnameseMonthName = (month: number) => {
    const months = [
      "Tháng 1",
      "Tháng 2",
      "Tháng 3",
      "Tháng 4",
      "Tháng 5",
      "Tháng 6",
      "Tháng 7",
      "Tháng 8",
      "Tháng 9",
      "Tháng 10",
      "Tháng 11",
      "Tháng 12",
    ];
    return months[month];
  };

  const getVietnameseDayName = (day: number) => {
    const days = [
      "Chủ nhật",
      "Thứ 2",
      "Thứ 3",
      "Thứ 4",
      "Thứ 5",
      "Thứ 6",
      "Thứ 7",
    ];
    return days[day];
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("vi-VN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isHoliday = (date: Date) => {
    const dateString = date.toISOString().split("T")[0];
    return vietnameseHolidays.some((holiday) => holiday.date === dateString);
  };

  const getHoliday = (date: Date) => {
    const dateString = date.toISOString().split("T")[0];
    return vietnameseHolidays.find((holiday) => holiday.date === dateString);
  };

  const createEvent = () => {
    const event: Event = {
      ...newEventRef.current,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setEvents((prev) => [...prev, event]);
    setIsCreating(false);
    setSelectedEvent(event);
  };

  const updateEvent = (id: string, updates: Partial<Event>) => {
    setEvents((prev) =>
      prev.map((event) =>
        event.id === id
          ? { ...event, ...updates, updatedAt: new Date() }
          : event
      )
    );
  };

  const deleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== id));
    setSelectedEvent(null);
    setIsEditing(false);
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getColorClass = (colorName: string) => {
    return colors.find((color) => color.name === colorName) || colors[0];
  };

  const getCategoryIcon = (categoryId: string) => {
    return (
      categories.find((cat) => cat.id === categoryId)?.icon || (
        <CalendarIcon className="w-4 h-4" />
      )
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-500";
      case "medium":
        return "text-yellow-500";
      case "low":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  const days = getDaysInMonth(currentDate);

  return (
    <div
      className={`min-h-screen ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="flex h-screen">
        {/* Sidebar */}
        {showSidebar && (
          <div
            className={`w-80 border-r ${
              theme === "dark"
                ? "bg-gray-800 border-gray-700"
                : "  border-gray-200"
            }`}
          >
            {/* Header */}
            <div
              className={`p-4 border-b ${
                theme === "dark" ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-bold">Lịch Việt</h1>
                <button
                  title="Đóng sidebar"
                  onClick={() => setShowSidebar(false)}
                  className={`p-2 rounded-lg ${
                    theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"
                  }`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm sự kiện..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "  border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
                />
              </div>

              {/* Create Event Button */}
              <button
                onClick={() => setIsCreating(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Tạo sự kiện
              </button>
            </div>

            {/* Categories */}
            <div className="p-4">
              <h3 className="font-semibold mb-3 text-sm text-gray-600 uppercase tracking-wide">
                Danh mục
              </h3>
              <div className="space-y-1">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      selectedCategory === category.id
                        ? "bg-blue-100 text-blue-700"
                        : theme === "dark"
                        ? "hover:bg-gray-700"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {category.icon}
                    <span className="text-sm">{category.name}</span>
                    <span className="ml-auto text-xs text-gray-500">
                      {
                        events.filter(
                          (event) =>
                            category.id === "all" ||
                            event.category === category.id
                        ).length
                      }
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="px-4 mb-4">
              <h3 className="font-semibold mb-3 text-sm text-gray-600 uppercase tracking-wide">
                Chế độ xem
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setViewMode("month")}
                  className={`p-2 rounded-lg text-sm transition-colors ${
                    viewMode === "month"
                      ? "bg-blue-100 text-blue-700"
                      : theme === "dark"
                      ? "hover:bg-gray-700"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <CalendarDays className="w-4 h-4 mx-auto mb-1" />
                  Tháng
                </button>
                <button
                  onClick={() => setViewMode("week")}
                  className={`p-2 rounded-lg text-sm transition-colors ${
                    viewMode === "week"
                      ? "bg-blue-100 text-blue-700"
                      : theme === "dark"
                      ? "hover:bg-gray-700"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <CalendarIcon className="w-4 h-4 mx-auto mb-1" />
                  Tuần
                </button>
                <button
                  onClick={() => setViewMode("day")}
                  className={`p-2 rounded-lg text-sm transition-colors ${
                    viewMode === "day"
                      ? "bg-blue-100 text-blue-700"
                      : theme === "dark"
                      ? "hover:bg-gray-700"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <Clock className="w-4 h-4 mx-auto mb-1" />
                  Ngày
                </button>
                <button
                  onClick={() => setViewMode("agenda")}
                  className={`p-2 rounded-lg text-sm transition-colors ${
                    viewMode === "agenda"
                      ? "bg-blue-100 text-blue-700"
                      : theme === "dark"
                      ? "hover:bg-gray-700"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <List className="w-4 h-4 mx-auto mb-1" />
                  Danh sách
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div
            className={`p-4 border-b ${
              theme === "dark"
                ? "bg-gray-800 border-gray-700"
                : "  border-gray-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {!showSidebar && (
                  <button
                    title="Mở sidebar"
                    onClick={() => setShowSidebar(true)}
                    className={`p-2 rounded-lg ${
                      theme === "dark"
                        ? "hover:bg-gray-700"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <Menu className="w-5 h-5" />
                  </button>
                )}

                <div className="flex items-center gap-2">
                  <button
                    title="Quay lại tháng trước"
                    onClick={() => navigateMonth("prev")}
                    className={`p-2 rounded-lg ${
                      theme === "dark"
                        ? "hover:bg-gray-700"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <h2 className="text-xl font-bold">
                    {getVietnameseMonthName(currentDate.getMonth())}{" "}
                    {currentDate.getFullYear()}
                  </h2>

                  <button
                    title="Quay lại tháng sau"
                    onClick={() => navigateMonth("next")}
                    className={`p-2 rounded-lg ${
                      theme === "dark"
                        ? "hover:bg-gray-700"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={goToToday}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm"
                >
                  Hôm nay
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                  className={`p-2 rounded-lg ${
                    theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"
                  }`}
                >
                  {theme === "light" ? (
                    <Moon className="w-4 h-4" />
                  ) : (
                    <Sun className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="flex-1 overflow-y-auto p-4">
            {viewMode === "month" && (
              <div className="grid grid-cols-7 gap-1">
                {/* Day headers */}
                {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map((day) => (
                  <div
                    key={day}
                    className={`p-2 text-center font-semibold text-sm ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {day}
                  </div>
                ))}

                {/* Calendar days */}
                {days.map((day, index) => {
                  const dayEvents = getEventsForDate(day);
                  const holiday = getHoliday(day);

                  return (
                    <div
                      key={index}
                      className={`min-h-[120px] p-2 border ${
                        theme === "dark" ? "border-gray-700" : "border-gray-200"
                      } ${isToday(day) ? "bg-blue-50 border-blue-300" : ""}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className={`text-sm font-medium ${
                            isToday(day) ? "text-blue-600 font-bold" : ""
                          }`}
                        >
                          {day.getDate()}
                        </span>
                        {holiday && (
                          <span className="text-xs text-red-500 font-medium">
                            {holiday.name}
                          </span>
                        )}
                      </div>

                      <div className="space-y-1">
                        {dayEvents.slice(0, 3).map((event) => (
                          <div
                            key={event.id}
                            onClick={() => setSelectedEvent(event)}
                            className={`p-1 rounded text-xs cursor-pointer truncate ${
                              getColorClass(event.color).bg
                            } text-white`}
                          >
                            {event.title}
                          </div>
                        ))}
                        {dayEvents.length > 3 && (
                          <div className="text-xs text-gray-500">
                            +{dayEvents.length - 3} sự kiện khác
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {viewMode === "agenda" && (
              <div className="space-y-4">
                {events
                  .filter(
                    (event) =>
                      selectedCategory === "all" ||
                      event.category === selectedCategory
                  )
                  .sort(
                    (a, b) =>
                      new Date(a.startDate).getTime() -
                      new Date(b.startDate).getTime()
                  )
                  .map((event) => (
                    <div
                      key={event.id}
                      onClick={() => setSelectedEvent(event)}
                      className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                        theme === "dark"
                          ? "bg-gray-800 border-gray-700"
                          : "  border-gray-200"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1">
                            {event.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            {event.description}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>
                                {formatDate(new Date(event.startDate))}
                              </span>
                            </div>
                            {event.location && (
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                <span>{event.location}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(event.category)}
                          <div
                            className={`w-3 h-3 rounded-full ${
                              getColorClass(event.color).bg
                            }`}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Event Details Sidebar */}
        {selectedEvent && (
          <div
            className={`w-96 border-l ${
              theme === "dark"
                ? "bg-gray-800 border-gray-700"
                : "  border-gray-200"
            }`}
          >
            <div
              className={`p-4 border-b ${
                theme === "dark" ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">Chi tiết sự kiện</h2>
                <div className="flex items-center gap-2">
                  <button
                    title="Chỉnh sửa"
                    onClick={() => setIsEditing(true)}
                    className={`p-2 rounded-lg ${
                      theme === "dark"
                        ? "hover:bg-gray-700"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    title="Xóa"
                    onClick={() => deleteEvent(selectedEvent.id)}
                    className={`p-2 rounded-lg ${
                      theme === "dark"
                        ? "hover:bg-gray-700"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    {selectedEvent.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {selectedEvent.description}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">
                      {formatDate(new Date(selectedEvent.startDate))} -{" "}
                      {formatDate(new Date(selectedEvent.endDate))}
                    </span>
                  </div>

                  {selectedEvent.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{selectedEvent.location}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    {getCategoryIcon(selectedEvent.category)}
                    <span className="text-sm">
                      {
                        categories.find(
                          (cat) => cat.id === selectedEvent.category
                        )?.name
                      }
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        getColorClass(selectedEvent.color).bg
                      }`}
                    ></div>
                    <span
                      className={`text-sm ${getPriorityColor(
                        selectedEvent.priority
                      )}`}
                    >
                      Ưu tiên: {selectedEvent.priority}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit Event Modal */}
      {(isCreating || isEditing) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            className={`max-w-2xl w-full ${
              theme === "dark" ? "bg-gray-800" : " "
            } rounded-lg shadow-lg p-6 max-h-[90vh] overflow-y-auto`}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">
                {isCreating ? "Tạo sự kiện mới" : "Chỉnh sửa sự kiện"}
              </h2>
              <button
                title="Đóng modal"
                onClick={() => {
                  setIsCreating(false);
                  setIsEditing(false);
                }}
                className={`p-2 rounded-lg ${
                  theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Tiêu đề sự kiện..."
                value={newEventRef.current.title}
                onChange={(e) => (newEventRef.current.title = e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "  border-gray-300 text-gray-900"
                }`}
              />

              <textarea
                placeholder="Mô tả..."
                value={newEventRef.current.description}
                onChange={(e) =>
                  (newEventRef.current.description = e.target.value)
                }
                rows={3}
                className={`w-full px-4 py-2 rounded-lg border resize-none ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "  border-gray-300 text-gray-900"
                }`}
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Bắt đầu
                  </label>
                  <input
                    title="Bắt đầu"
                    type="datetime-local"
                    value={newEventRef.current.startDate
                      .toISOString()
                      .slice(0, 16)}
                    onChange={(e) =>
                      (newEventRef.current.startDate = new Date(e.target.value))
                    }
                    className={`w-full px-4 py-2 rounded-lg border ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "  border-gray-300 text-gray-900"
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Kết thúc
                  </label>
                  <input
                    title="Kết thúc"
                    type="datetime-local"
                    value={newEventRef.current.endDate
                      .toISOString()
                      .slice(0, 16)}
                    onChange={(e) =>
                      (newEventRef.current.endDate = new Date(e.target.value))
                    }
                    className={`w-full px-4 py-2 rounded-lg border ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "  border-gray-300 text-gray-900"
                    }`}
                  />
                </div>
              </div>

              <input
                type="text"
                placeholder="Địa điểm..."
                value={newEventRef.current.location}
                onChange={(e) =>
                  (newEventRef.current.location = e.target.value)
                }
                className={`w-full px-4 py-2 rounded-lg border ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "  border-gray-300 text-gray-900"
                }`}
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Danh mục
                  </label>
                  <select
                    title="Danh mục"
                    value={newEventRef.current.category}
                    onChange={(e) =>
                      (newEventRef.current.category = e.target.value)
                    }
                    className={`w-full px-4 py-2 rounded-lg border ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "  border-gray-300 text-gray-900"
                    }`}
                  >
                    {categories.slice(1).map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Màu sắc
                  </label>
                  <select
                    title="Màu sắc"
                    value={newEventRef.current.color}
                    onChange={(e) =>
                      (newEventRef.current.color = e.target.value)
                    }
                    className={`w-full px-4 py-2 rounded-lg border ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "  border-gray-300 text-gray-900"
                    }`}
                  >
                    {colors.map((color) => (
                      <option key={color.name} value={color.name}>
                        {color.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={
                    isCreating
                      ? createEvent
                      : () => {
                          updateEvent(selectedEvent!.id, newEventRef.current);
                          setIsEditing(false);
                        }
                  }
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {isCreating ? "Tạo sự kiện" : "Lưu thay đổi"}
                </button>
                <button
                  onClick={() => {
                    setIsCreating(false);
                    setIsEditing(false);
                  }}
                  className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;

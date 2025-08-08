import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import { CircleX, Search, X } from "lucide-react";
import type { Holiday } from "../page";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import React from "react";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";

const EventsListMenu = (props: {
  setIsMenuOpen: (isMenuOpen: boolean) => void;
  holidaySearchTerm: string;
  setHolidaySearchTerm: (holidaySearchTerm: string) => void;
  handleHolidaySearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  filteredHolidays: Holiday[];
  findNextUpcomingHoliday: () => Holiday;
  getDaysUntilSpecificHoliday: (date: Date) => number;
  getDaysSincePastHoliday: (date: Date) => number;
  selectHoliday: (holiday: Holiday) => void;
  selectedHoliday: Holiday;
}) => {
  const {
    setIsMenuOpen,
    holidaySearchTerm,
    setHolidaySearchTerm,
    handleHolidaySearch,
    filteredHolidays,
    findNextUpcomingHoliday,
    getDaysUntilSpecificHoliday,
    getDaysSincePastHoliday,
    selectHoliday,
    selectedHoliday,
  } = props;

  return (
    <Drawer
      anchor="right"
      open={true}
      onClose={() => setIsMenuOpen(false)}
      sx={{
        "& .MuiDrawer-paper": {
          width: "300px",
        },
      }}
    >
      <div className="flex justify-between w-full items-center px-4 py-1">
        <h2 className="text-lg font-semibold">Chọn ngày lễ</h2>
        <IconButton
          onClick={() => setIsMenuOpen(false)}
          aria-label="Đóng menu"
          size="large"
        >
          <X />
        </IconButton>
      </div>
      <Divider />
      <div className="py-2 px-4">
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 flex items-center pl-4 pointer-events-none">
            <Search size={20} />
          </div>
          <input
            type="text"
            placeholder="Tìm theo tên, ngày (25/12) hoặc tháng..."
            value={holidaySearchTerm}
            onChange={handleHolidaySearch}
            aria-label="Tìm kiếm sự kiện"
            className="w-full pl-10 pr-10 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-300 transition-all duration-200 shadow-sm text-sm"
          />
          {holidaySearchTerm && (
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
              onClick={() => setHolidaySearchTerm("")}
              aria-label="Xóa tìm kiếm"
              title="Xóa tìm kiếm"
              type="button"
            >
              <CircleX size={20} />
            </button>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {filteredHolidays.length > 0 ? (
          filteredHolidays.map((holiday) => {
            const isNextUpcoming = holiday.id === findNextUpcomingHoliday().id;
            const daysUntil = getDaysUntilSpecificHoliday(holiday.date);

            const isSelected = selectedHoliday.id === holiday.id;
            const isPast = getDaysUntilSpecificHoliday(holiday.date) < 0;

            return (
              <ListItem
                key={holiday.id}
                id={`holiday-${holiday.id}`}
                role="button"
                tabIndex={0}
                alignItems="flex-start"
                onClick={() => selectHoliday(holiday)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ")
                    selectHoliday(holiday);
                }}
                sx={{
                  borderRadius: 2,
                  mb: 1,
                  cursor: "pointer",
                  transition: "background 0.18s, box-shadow 0.18s",
                  background: isSelected
                    ? "linear-gradient(90deg, #f87171 0%, #fbbf24 100%)"
                    : isPast
                    ? "rgba(156, 163, 175, 0.05)"
                    : daysUntil > 0
                    ? "rgba(34, 197, 94, 0.05)"
                    : "transparent",
                  color: isSelected
                    ? "#fff"
                    : isPast
                    ? "rgb(156, 163, 175)"
                    : daysUntil > 0
                    ? "rgb(34, 197, 94)"
                    : "inherit",
                  boxShadow: isSelected
                    ? "0 2px 8px 0 rgba(251,191,36,0.10)"
                    : "none",
                  "&:hover, &:focus": {
                    background:
                      "linear-gradient(90deg, #f87171 0%, #fbbf24 100%)",
                    color: "#fff",
                    boxShadow: "0 2px 8px 0 rgba(251,191,36,0.13)",
                    outline: "none",
                  },
                  // Dark mode support
                  "@media (prefers-color-scheme: dark)": {
                    background: isSelected
                      ? "linear-gradient(90deg, #ef4444 0%, #f59e42 100%)"
                      : isPast
                      ? "rgba(75, 85, 99, 0.1)"
                      : daysUntil > 0
                      ? "rgba(34, 197, 94, 0.1)"
                      : "transparent",
                    color: isSelected
                      ? "#fff"
                      : isPast
                      ? "rgb(107, 114, 128)"
                      : daysUntil > 0
                      ? "rgb(74, 222, 128)"
                      : "inherit",
                    "&:hover, &:focus": {
                      background:
                        "linear-gradient(90deg, #ef4444 0%, #f59e42 100%)",
                      color: "#fff",
                    },
                  },
                }}
              >
                <ListItemAvatar>
                  <Box
                    sx={{
                      mr: 2,
                      fontSize: "22px",
                      lineHeight: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 36,
                      height: 36,
                      background: isSelected
                        ? "rgba(255,255,255,0.18)"
                        : isPast
                        ? "rgba(156, 163, 175, 0.15)"
                        : daysUntil > 0
                        ? "rgba(34, 197, 94, 0.15)"
                        : "rgba(251,191,36,0.08)",
                      borderRadius: "50%",
                      transition: "background 0.18s",
                      "@media (prefers-color-scheme: dark)": {
                        background: isSelected
                          ? "rgba(255,255,255,0.18)"
                          : isPast
                          ? "rgba(75, 85, 99, 0.2)"
                          : daysUntil > 0
                          ? "rgba(34, 197, 94, 0.2)"
                          : "rgba(251,191,36,0.13)",
                      },
                    }}
                  >
                    {holiday.icon}
                  </Box>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Typography
                        component="span"
                        sx={{
                          fontSize: "15px",
                          fontWeight: isSelected ? 700 : 400,
                          color: isSelected ? "#fff" : "inherit",
                          textShadow: isSelected
                            ? "0 1px 4px rgba(0,0,0,0.10)"
                            : "none",
                        }}
                      >
                        {holiday.name}
                      </Typography>
                      {isNextUpcoming && (
                        <Typography
                          component="span"
                          sx={{
                            color: isSelected ? "#fff" : "rgb(22, 163, 74)",
                            fontWeight: 500,
                            ml: 1,
                            fontSize: "13px",
                            textShadow: isSelected
                              ? "0 1px 4px rgba(0,0,0,0.10)"
                              : "none",
                          }}
                        >
                          (Gần nhất)
                        </Typography>
                      )}
                    </Box>
                  }
                  secondary={
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 0.5,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "13px",
                          fontWeight: 500,
                          color: isSelected
                            ? "#fff"
                            : isNextUpcoming
                            ? "rgb(22, 163, 74)"
                            : isPast
                            ? "rgb(156, 163, 175)"
                            : daysUntil > 0
                            ? "rgb(34, 197, 94)"
                            : "rgb(75, 85, 99)",
                          textShadow: isSelected
                            ? "0 1px 4px rgba(0,0,0,0.10)"
                            : "none",
                        }}
                      >
                        {format(holiday.date, "EEEE, dd/MM/yyyy", {
                          locale: vi,
                        })}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "13px",
                          color: isSelected
                            ? "#fff"
                            : isPast
                            ? "rgb(156, 163, 175)"
                            : daysUntil > 0
                            ? "rgb(34, 197, 94)"
                            : "rgb(75, 85, 99)",
                          textShadow: isSelected
                            ? "0 1px 4px rgba(0,0,0,0.10)"
                            : "none",
                        }}
                      >
                        {daysUntil === 0
                          ? "Hôm nay"
                          : daysUntil > 0
                          ? `Còn ${daysUntil} ngày`
                          : `Đã qua ${getDaysSincePastHoliday(
                              holiday.date
                            )} ngày`}
                      </Typography>
                    </Box>
                  }
                  sx={{ m: 0 }}
                />
              </ListItem>
            );
          })
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-4xl mb-3">🔍</div>
            <div className="text-gray-700 mb-2 text-[16px] font-medium">
              Không tìm thấy sự kiện nào
            </div>
            <div className="text-gray-500 text-[14px]">
              Thử tìm kiếm với từ khóa khác
            </div>
          </div>
        )}
      </div>
    </Drawer>
  );
};

export default EventsListMenu;

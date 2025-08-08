import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";

import type { Holiday } from "../page";
import { vi } from "date-fns/locale";
import { format, isToday, isSameMonth } from "date-fns";
import { cn } from "~/lib/utils";
import { ChevronLeft, ChevronRight, Close } from "@mui/icons-material";

export const CalendarDialog = (props: {
  showCalendarModal: boolean;
  setShowCalendarModal: (show: boolean) => void;
  calendarModalRef: React.RefObject<HTMLDivElement>;
  currentCalendarDate: Date;
  setCurrentCalendarDate: (date: Date) => void;
  changeMonth: (amount: number) => void;
  holidays: Holiday[];
  selectedHoliday: Holiday;
  findHolidayForDate: (date: Date) => Holiday | undefined;
  generateCalendarDays: () => Date[];
  selectHoliday: (holiday: Holiday) => void;
}) => {
  const {
    showCalendarModal,
    setShowCalendarModal,
    calendarModalRef,
    currentCalendarDate,
    setCurrentCalendarDate,
    changeMonth,
    holidays,
    selectedHoliday,
    findHolidayForDate,
    generateCalendarDays,
    selectHoliday,
  } = props;

  return (
    <Dialog
      open={showCalendarModal}
      onClose={() => setShowCalendarModal(false)}
    >
      <DialogTitle>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Lịch sự kiện</h2>
          <IconButton title="Đóng" onClick={() => setShowCalendarModal(false)}>
            <Close />
          </IconButton>
        </div>
        <p className=" text-sm">
          {format(currentCalendarDate, "MMMM yyyy", {
            locale: vi,
          })}
        </p>
      </DialogTitle>
      <DialogContent dividers>
        <div ref={calendarModalRef} onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between">
            <IconButton title="Tháng trước" onClick={() => changeMonth(-1)}>
              <ChevronLeft fontSize="medium" />
            </IconButton>
            <IconButton onClick={() => setCurrentCalendarDate(new Date())}>
              Hôm nay
            </IconButton>
            <IconButton title="Tháng tiếp theo" onClick={() => changeMonth(1)}>
              <ChevronRight fontSize="medium" />
            </IconButton>
          </div>

          {/* Calendar Grid */}
          <div className="">
            {/* Weekday Labels */}
            <div className="grid grid-cols-7 mb-2">
              {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((day, idx) => (
                <div key={idx} className="text-center text-xs font-semibold">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {generateCalendarDays().map((day, idx) => {
                const isCurrentMonth = isSameMonth(day, currentCalendarDate);
                const isTodayDate = isToday(day);
                const holiday = findHolidayForDate(day);

                return (
                  <div
                    key={idx}
                    className={cn(
                      "aspect-square rounded-lg relative flex flex-col items-center justify-center p-1 hover:bg-gray-50 transition-colors cursor-pointer",
                      {
                        "opacity-40": !isCurrentMonth,
                        "bg-red-50 font-medium": isTodayDate,
                      }
                    )}
                    onClick={() => {
                      if (holiday) {
                        selectHoliday(holiday);
                        setShowCalendarModal(false);
                      }
                    }}
                  >
                    <span
                      className={cn("text-xs sm:text-sm leading-none z-10", {
                        "bg-red-500 text-white w-6 h-6 flex items-center justify-center rounded-full font-semibold":
                          isTodayDate,
                      })}
                    >
                      {format(day, "d")}
                    </span>

                    {/* Show holiday indicator */}
                    {holiday && (
                      <div className="mt-1 w-full overflow-hidden flex flex-col items-center">
                        <span className="text-xs sm:text-base">
                          {holiday.icon}
                        </span>
                        <div className="text-[8px] sm:text-[10px] font-medium text-center leading-tight text-red-600 mt-0.5 max-w-full truncate">
                          {holiday.name}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <div className="w-full">
          <h3 className="text-sm font-medium mb-2">Danh sách sự kiện</h3>
          <div className="max-h-40 overflow-y-auto space-y-1.5">
            {holidays
              .sort((a, b) => a.date.getTime() - b.date.getTime())
              .map((holiday) => {
                // Kiểm tra sự kiện đã qua hay chưa
                const isPast = holiday.date < new Date();

                return (
                  <div
                    key={holiday.id}
                    id={`calendar-holiday-${holiday.id}`}
                    className={`flex items-center p-1.5 hover:bg-gray-50 rounded-lg cursor-pointer ${
                      isPast ? "opacity-60" : ""
                    } ${selectedHoliday.id === holiday.id ? "bg-red-100" : ""}`}
                    onClick={() => {
                      selectHoliday(holiday);
                      setShowCalendarModal(false);
                    }}
                  >
                    <span className="mr-2 text-lg">{holiday.icon}</span>
                    <div>
                      <div className="font-medium text-sm">
                        {holiday.name}
                        {isPast && " (Đã qua)"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {format(holiday.date, "LLLL, dd/MM/yyyy", {
                          locale: vi,
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </DialogActions>
    </Dialog>
  );
};

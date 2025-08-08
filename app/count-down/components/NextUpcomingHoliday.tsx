import { cn } from "~/utils/cn";
import { motion } from "framer-motion";
import type { Holiday } from "../page";
import Chip from "@mui/material/Chip";

const NextUpcomingHoliday = (props: {
  daysUntilHoliday: number | null;
  findNextUpcomingHoliday: () => Holiday;
  selectedHoliday: Holiday;
  selectHoliday: (holiday: Holiday) => void;
  getDaysUntilSpecificHoliday: (date: Date) => number;
  getDaysSincePastHoliday: (date: Date) => number;
  formatDate: (date: Date, format: string) => string;
}) => {
  return (
    <div className="mt-2 sm:mt-3">
      {props.daysUntilHoliday !== null &&
        props.findNextUpcomingHoliday()?.id && (
          <motion.div
            className={cn(
              " /80 backdrop-blur-sm p-2 sm:p-3 rounded-xl shadow-sm border border-red-100/50",
              {
                "cursor-not-allowed":
                  props.selectedHoliday.id ===
                  props.findNextUpcomingHoliday().id,
              }
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            onClick={(e) => {
              e.stopPropagation();
              if (
                props.selectedHoliday.id !== props.findNextUpcomingHoliday().id
              ) {
                props.selectHoliday(props.findNextUpcomingHoliday());
              }
            }}
          >
            <div className="flex items-center gap-1">
              <Chip label="Sự kiện gần nhất:" size="small" />
              <Chip
                label={`${props.findNextUpcomingHoliday()?.name} (${
                  props.findNextUpcomingHoliday()?.icon
                })`}
                size="small"
              />
            </div>
            <div className="mt-1">
              {props.getDaysUntilSpecificHoliday(
                props.findNextUpcomingHoliday()?.date
              ) > 0 ? (
                <span className="text-xs font-medium">
                  Còn{" "}
                  {props.getDaysUntilSpecificHoliday(
                    props.findNextUpcomingHoliday()?.date
                  )}{" "}
                  ngày
                  <span className=" ml-1">
                    (
                    {props
                      .formatDate(
                        props.findNextUpcomingHoliday()?.date,
                        "EEEE, dd/MM/yyyy"
                      )
                      .replace("Monday", "Thứ Hai")
                      .replace("Tuesday", "Thứ Ba")
                      .replace("Wednesday", "Thứ Tư")
                      .replace("Thursday", "Thứ Năm")
                      .replace("Friday", "Thứ Sáu")
                      .replace("Saturday", "Thứ Bảy")
                      .replace("Sunday", "Chủ Nhật")}
                    )
                  </span>
                </span>
              ) : props.getDaysUntilSpecificHoliday(
                  props.findNextUpcomingHoliday()?.date
                ) === 0 ? (
                <span className="text-xs font-medium">Hôm nay</span>
              ) : (
                <span className="text-xs font-medium text-gray-600">
                  Đã qua{" "}
                  {props.getDaysSincePastHoliday(
                    props.findNextUpcomingHoliday()?.date
                  )}{" "}
                  ngày
                  <span className="text-gray-500 ml-1">
                    (
                    {props
                      .formatDate(
                        props.findNextUpcomingHoliday()?.date,
                        "EEEE, dd/MM/yyyy"
                      )
                      .replace("Monday", "Thứ Hai")
                      .replace("Tuesday", "Thứ Ba")
                      .replace("Wednesday", "Thứ Tư")
                      .replace("Thursday", "Thứ Năm")
                      .replace("Friday", "Thứ Sáu")
                      .replace("Saturday", "Thứ Bảy")
                      .replace("Sunday", "Chủ Nhật")}
                    )
                  </span>
                </span>
              )}
            </div>
          </motion.div>
        )}
    </div>
  );
};

export default NextUpcomingHoliday;

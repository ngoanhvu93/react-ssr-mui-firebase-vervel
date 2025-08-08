import hungKingsDay from "~/utils/hung-kings-day";
import type { Holiday } from "../page";
import tetsDay from "~/utils/tets-day";

const currentYear = new Date().getFullYear();
const nextYear = currentYear + 1;

export const holidays: Holiday[] = [
  {
    id: "valentine",
    name: "Lễ Tình Nhân",
    date: new Date(currentYear, 1, 14), // 14/02 năm hiện tại
    icon: "💝",
    eventType: "valentine", // Add eventType
  },
  {
    id: "internationalWomensDay",
    name: "Ngày Quốc Tế Phụ Nữ",
    date: new Date(currentYear, 2, 8), // 08/03 năm hiện tại
    icon: "👩",
    eventType: "internationalWomensDay",
  },
  {
    id: "hungKings",
    name: "Giỗ Tổ Hùng Vương",
    date: hungKingsDay(currentYear), // 07/04 năm hiện tại
    icon: "🏛️",
    eventType: "hungkings",
  },
  {
    id: "liberation",
    name: "Giải Phóng Miền Nam",
    date: new Date(currentYear, 3, 30), // 30/04 năm hiện tại
    icon: "🎉",
    eventType: "liberation",
  },
  {
    id: "internationalWorkers",
    name: "Ngày Quốc Tế Lao Động",
    date: new Date(currentYear, 4, 1), // 01/05 năm hiện tại
    icon: "👷",
    eventType: "laborday",
  },
  {
    id: "internationalChildrensDay",
    name: "Ngày Quốc Tế Thiếu Nhi",
    date: new Date(currentYear, 5, 1), // 01/06 năm hiện tại
    icon: "👶",
    eventType: "internationalChildrensDay",
  },
  {
    id: "midAutumn",
    name: "Tết Trung Thu",
    date: new Date(currentYear, 9, 6), // 06/10 năm hiện tại
    icon: "🌕",
    eventType: "midAutumn",
  },
  {
    id: "independence",
    name: "Quốc Khánh",
    date: new Date(currentYear, 8, 2), // 02/09 năm hiện tại
    icon: "🇻🇳",
    eventType: "independence",
  },
  {
    id: "vietnameseWomensDay",
    name: "Ngày Phụ Nữ Việt Nam",
    date: new Date(currentYear, 9, 20), // 20/10 năm hiện tại
    icon: "👩",
    eventType: "vietnameseWomensDay",
  },
  {
    id: "teachers",
    name: "Ngày Nhà Giáo Việt Nam",
    date: new Date(currentYear, 10, 20), // 20/11 năm hiện tại
    icon: "👨‍🏫",
    eventType: "teachersday",
  },
  {
    id: "christmas",
    name: "Giáng Sinh",
    date: new Date(currentYear, 11, 25), // 25/12 năm hiện tại
    icon: "🎄",
    eventType: "christmas",
  },
  {
    id: "newYear",
    name: `Năm Mới ${nextYear}`,
    date: new Date(nextYear, 0, 1), // 01/01 năm sau
    icon: "🎆",
    eventType: "newYear",
  },
  {
    id: "tet",
    name: `Tết Nguyên Đán ${nextYear}`,
    date: tetsDay(currentYear),
    icon: "🧧",
    eventType: "tet",
  },
];

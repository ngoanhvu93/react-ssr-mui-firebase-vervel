import { Sun, Moon, Monitor } from "lucide-react";
import { cn } from "~/utils/cn";

interface ThemeToggleProps {
  theme: "light" | "dark" | "system";
  setTheme: (theme: "light" | "dark" | "system") => void;
}

export default function ThemeToggle({ theme, setTheme }: ThemeToggleProps) {
  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => setTheme("light")}
        className={cn(
          "p-2 rounded-full transition-colors relative group",
          theme === "light"
            ? "text-yellow-500 bg-yellow-500/10"
            : "text-[#949ba4] hover:text-[#dbdee1] hover:bg-[#2b2d31]"
        )}
        title="Chủ đề sáng"
      >
        <Sun size={18} />
        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#111214] text-[#dbdee1] text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
          Chủ đề sáng
        </span>
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={cn(
          "p-2 rounded-full transition-colors relative group",
          theme === "dark"
            ? "text-blue-500 bg-blue-500/10"
            : "text-[#949ba4] hover:text-[#dbdee1] hover:bg-[#2b2d31]"
        )}
        title="Chủ đề tối"
      >
        <Moon size={18} />
        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#111214] text-[#dbdee1] text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
          Chủ đề tối
        </span>
      </button>
      <button
        onClick={() => setTheme("system")}
        className={cn(
          "p-2 rounded-full transition-colors relative group",
          theme === "system"
            ? "text-purple-500 bg-purple-500/10"
            : "text-[#949ba4] hover:text-[#dbdee1] hover:bg-[#2b2d31]"
        )}
        title="Theo hệ thống"
      >
        <Monitor size={18} />
        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#111214] text-[#dbdee1] text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
          Theo hệ thống
        </span>
      </button>
    </div>
  );
}

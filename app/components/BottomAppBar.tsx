import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import {
  Search,
  SportsEsports,
  Apps,
  AccessTime,
  Favorite,
} from "@mui/icons-material";
import { cn } from "~/utils/cn";
import AppBar from "@mui/material/AppBar";
import { Button } from "@mui/material";

interface TabItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  activeIcon: React.ReactNode;
  path: string;
}

export const BottomAppBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const tabs: TabItem[] = [
    {
      id: "donate",
      name: "Ủng hộ",
      icon: <Favorite sx={{ color: "text.secondary" }} />,
      activeIcon: <Favorite sx={{ color: "primary.main" }} />,
      path: "/donate",
    },
    {
      id: "games",
      name: "Trò chơi",
      icon: <SportsEsports sx={{ color: "text.secondary" }} />,
      activeIcon: <SportsEsports sx={{ color: "primary.main" }} />,
      path: "/games",
    },
    {
      id: "apps",
      name: "Ứng dụng",
      icon: <Apps sx={{ color: "text.secondary" }} />,
      activeIcon: <Apps sx={{ color: "primary.main" }} />,
      path: "/",
    },
    {
      id: "updates",
      name: "Hôm nay",
      icon: <AccessTime sx={{ color: "text.secondary" }} />,
      activeIcon: <AccessTime sx={{ color: "primary.main" }} />,
      path: "/app-store",
    },
    {
      id: "search",
      name: "Tìm kiếm",
      icon: <Search sx={{ color: "text.secondary" }} />,
      activeIcon: <Search sx={{ color: "primary.main" }} />,
      path: "/search",
    },
  ];

  const [isStandalone, setIsStandalone] = useState<boolean>(false);
  useEffect(() => {
    const standalone =
      typeof window !== "undefined" &&
      (window.matchMedia("(display-mode: standalone)").matches ||
        ("standalone" in window.navigator &&
          window.navigator.standalone === true));

    setIsStandalone(standalone);
  }, []);

  return (
    <AppBar
      position="sticky"
      sx={(theme) => ({
        position: "sticky",
        pb: isStandalone ? 2 : 0,
        py: 0.5,
        bottom: 0,
        zIndex: 40,
        width: "100%",
        boxShadow:
          theme.palette.mode === "dark"
            ? "0 2px 8px rgba(0,0,0,0.5)"
            : "0 2px 4px rgba(0,0,0,0.08)",
        backgroundColor:
          theme.palette.mode === "dark"
            ? "rgba(24, 24, 28, 0.85)"
            : "rgba(255,255,255,0.85)",
        backdropFilter: "blur(8px)",
        color: theme.palette.text.primary,
        borderTop:
          theme.palette.mode === "dark"
            ? "1px solid rgba(255,255,255,0.08)"
            : "1px solid rgba(0,0,0,0.06)",
      })}
    >
      <div className="flex justify-around items-center">
        {tabs.map((tab) => {
          const isActive = currentPath === tab.path;

          return (
            <Button
              key={tab.id}
              onClick={() => {
                navigate(tab.path);
              }}
              sx={{
                color: "text.secondary",
                "&:hover": {
                  color: "primary.main",
                },
                textTransform: "none",
                fontSize: "10px",
                fontWeight: "normal",
                fontStyle: "normal",
                fontVariant: "normal",
                fontStretch: "normal",
                textAlign: "center",
                textDecoration: "none",
                textOverflow: "ellipsis",
              }}
            >
              <div className="flex flex-col items-center">
                {isActive ? tab.activeIcon : tab.icon}
                <span
                  className={cn("text-xs mt-0.5", {
                    "text-[#007AFF]": isActive,
                  })}
                >
                  {tab.name}
                </span>
              </div>
            </Button>
          );
        })}
      </div>
    </AppBar>
  );
};

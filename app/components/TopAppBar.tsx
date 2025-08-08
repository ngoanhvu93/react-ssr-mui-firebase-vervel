import React, { memo } from "react";
import { UserProfile } from "./UserProfile";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import { Search } from "@mui/icons-material";
import { cn } from "~/utils/cn";

interface AppHeaderProps {
  title: React.ReactNode | string;
  children?: React.ReactNode;
  onBack?: () => void;
  fontSize?: "text-2xl" | "text-xl" | "text-lg" | "text-base";
  standalone?: boolean;
  actionOne?: React.ReactNode;
  actionTwo?: React.ReactNode;
  actionThree?: React.ReactNode;
  showDivider?: boolean;
  showSearch?: boolean;
  onSearch?: () => void;
  fullWidth?: boolean;
  fullWidthAction?: React.ReactNode;
}

export const TopAppBar = memo<AppHeaderProps>(
  ({
    title,
    children,
    onBack,
    actionOne,
    actionTwo,
    actionThree,
    fontSize = "text-xl",
    showDivider = true,
    showSearch = false,
    onSearch,
    fullWidth = false,
    fullWidthAction,
  }) => {
    return (
      <AppBar
        position="sticky"
        sx={(theme) => ({
          position: "sticky",
          top: 0,
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
          borderBottom:
            theme.palette.mode === "dark"
              ? "1px solid rgba(255,255,255,0.08)"
              : "1px solid rgba(0,0,0,0.06)",
        })}
      >
        <div className="flex items-center justify-between w-full px-4 py-2">
          {onBack && (
            <IconButton
              size="small"
              onClick={onBack}
              sx={(theme) => ({
                backgroundColor:
                  theme.palette.mode === "dark" ? "grey.900" : "grey.100",
                "&:hover": {
                  backgroundColor:
                    theme.palette.mode === "dark" ? "grey.800" : "grey.200",
                },
                color: theme.palette.mode === "dark" ? "grey.100" : "grey.700",
              })}
              title="Back"
            >
              <ChevronLeft />
            </IconButton>
          )}
          <h2
            className={cn(
              `font-bold flex items-center justify-start w-full pr-4`,
              fontSize,
              {
                "pl-4": onBack,
              }
            )}
          >
            {title}
            {fullWidth && (
              <div className="flex-1 pl-4 text-sm font-light">
                {fullWidthAction}
              </div>
            )}
          </h2>
          <div className="flex items-center gap-4 justify-end">
            {actionOne && (
              <div className="flex items-center justify-center">
                {actionOne}
              </div>
            )}
            {actionTwo && (
              <div className="flex items-center justify-center">
                {actionTwo}
              </div>
            )}
            {actionThree && (
              <div className="flex items-center justify-center">
                {actionThree}
              </div>
            )}
            {showSearch && (
              <IconButton
                size="small"
                onClick={onSearch}
                sx={{
                  border: "1px solid",
                }}
              >
                <Search fontSize="small" />
              </IconButton>
            )}
            <UserProfile />
          </div>
        </div>
        {children && (
          <Box
            className="w-full"
            sx={(theme) => ({
              borderTop: showDivider
                ? theme.palette.mode === "dark"
                  ? "1px solid rgba(255,255,255,0.08)"
                  : "1px solid rgba(0,0,0,0.06)"
                : "none",
            })}
          >
            {children}
          </Box>
        )}
      </AppBar>
    );
  }
);

TopAppBar.displayName = "AppHeader";

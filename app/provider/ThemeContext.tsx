import React, { createContext, useContext, useEffect, useState } from "react";
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Cookies from "js-cookie";

type ThemeMode = "light" | "dark" | "system";

interface ThemeContextValue {
  theme: ThemeMode;
  actualMode: "light" | "dark";
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "system",
  actualMode: "light",
  toggleTheme: () => {},
  setTheme: () => {},
});

export const useThemeContext = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<ThemeMode>("system");
  const [actualMode, setActualMode] = useState<"light" | "dark">("light");

  useEffect(() => {
    const cookieTheme = Cookies.get("theme") as ThemeMode | undefined;
    const preferred = cookieTheme || "system";
    setThemeState(preferred);
  }, []);

  useEffect(() => {
    const applyMode = () => {
      if (theme === "system") {
        const isDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        setActualMode(isDark ? "dark" : "light");
      } else {
        setActualMode(theme);
      }
    };

    applyMode();

    if (theme === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      mq.addEventListener("change", applyMode);
      return () => mq.removeEventListener("change", applyMode);
    }
  }, [theme]);

  const toggleTheme = () => {
    const next: ThemeMode =
      theme === "light" ? "dark" : theme === "dark" ? "system" : "light";
    setThemeState(next);
    Cookies.set("theme", next, { expires: 365 });
  };

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    Cookies.set("theme", newTheme, { expires: 365 });
  };

  const muiTheme = createTheme({
    palette: {
      mode: actualMode,
    },
  });

  return (
    <ThemeContext.Provider value={{ theme, actualMode, toggleTheme, setTheme }}>
      <MuiThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

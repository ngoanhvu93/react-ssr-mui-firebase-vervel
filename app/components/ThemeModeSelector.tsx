import Box from "@mui/material/Box";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import LightMode from "@mui/icons-material/LightMode";
import DarkMode from "@mui/icons-material/DarkMode";
import Monitor from "@mui/icons-material/Monitor";
import { useThemeContext } from "~/provider/ThemeContext";

const ThemeModeSelector = () => {
  const { theme, setTheme } = useThemeContext();

  const getModeIcon = (modeType: "light" | "dark" | "system") => {
    switch (modeType) {
      case "light":
        return <LightMode sx={{ fontSize: 20 }} />;
      case "dark":
        return <DarkMode sx={{ fontSize: 20 }} />;
      case "system":
        return <Monitor sx={{ fontSize: 20 }} />;
    }
  };

  return (
    <div className="px-4 py-2">
      <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
        Giao diện
      </Typography>
      <ToggleButtonGroup
        value={theme}
        onChange={(_, value) => value && setTheme(value)}
        color="primary"
        exclusive
        fullWidth
        size="small"
      >
        <ToggleButton value="light">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              textTransform: "none",
            }}
          >
            {getModeIcon("light")}
            <Typography sx={{ fontSize: 12 }}>Sáng</Typography>
          </Box>
        </ToggleButton>
        <ToggleButton value="dark">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              textTransform: "none",
            }}
          >
            {getModeIcon("dark")}
            <Typography sx={{ fontSize: 12 }}>Tối</Typography>
          </Box>
        </ToggleButton>
        <ToggleButton value="system">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              textTransform: "none",
            }}
          >
            {getModeIcon("system")}
            <Typography sx={{ fontSize: 12 }}>Hệ thống</Typography>
          </Box>
        </ToggleButton>
      </ToggleButtonGroup>
    </div>
  );
};

export default ThemeModeSelector;

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useEffect, useState } from "react";
import { getCurrentMonthTheme } from "~/utils/monthly-themes";

export interface WelcomePopupProps {
  autoCloseTime?: number; // in milliseconds
}

export default function WelcomePopup({
  autoCloseTime = 8000,
}: WelcomePopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [randomIndex, setRandomIndex] = useState(0);
  useEffect(() => {
    setRandomIndex(Math.floor(Math.random() * 10));
  }, []);
  const currentTheme = getCurrentMonthTheme(randomIndex);

  useEffect(() => {
    // Check if popup has been shown for the current month
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    const popupKey = `welcome_popup_shown_${currentYear}_${currentMonth}`;
    const popupTimestampKey = `welcome_popup_timestamp_${currentYear}_${currentMonth}`;

    const hasBeenShown = localStorage.getItem(popupKey);
    const timestamp = localStorage.getItem(popupTimestampKey);
    const now = new Date().getTime();

    // Check if timestamp exists and is older than 24 hours
    if (timestamp && now - parseInt(timestamp) > 24 * 60 * 60 * 1000) {
      localStorage.removeItem(popupKey);
      localStorage.removeItem(popupTimestampKey);
    }

    if (!hasBeenShown) {
      // Show popup after a small delay to allow page to load
      const showTimeout = setTimeout(() => {
        setIsOpen(true);
        // Mark as shown for this month and store timestamp
        localStorage.setItem(popupKey, "true");
        localStorage.setItem(popupTimestampKey, now.toString());
      }, 500);

      // Close popup after the specified time
      const closeTimeout = setTimeout(() => {
        setIsOpen(false);
      }, autoCloseTime + 500); // Add the same delay as the show timeout

      // Cleanup timeouts on component unmount
      return () => {
        clearTimeout(showTimeout);
        clearTimeout(closeTimeout);
      };
    }
  }, [autoCloseTime]);

  if (!currentTheme) return null;

  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
      <DialogTitle className="flex items-center text-xl font-bold">
        <span className="text-3xl mr-2 animate-pulse">{currentTheme.icon}</span>
        <span>{currentTheme.name}</span>
      </DialogTitle>
      <DialogContent>
        <div className="text-base animate-fadeIn">{currentTheme.message}</div>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setIsOpen(false)}>Đóng</Button>
      </DialogActions>
    </Dialog>
  );
}

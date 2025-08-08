import { useEffect } from "react";

/**
 * Utility functions for modals
 */

/**
 * Disables body scrolling when a modal is open
 */
export const disableBodyScroll = (): void => {
  // Save current scroll position
  const scrollY = window.scrollY;
  
  // Disable scrolling
  document.body.style.overflow = "hidden";
  document.body.style.position = "fixed";
  document.body.style.top = `-${scrollY}px`;
  document.body.style.width = "100%";
  document.body.style.height = "100%";
  document.body.style.left = "0";
  document.body.style.right = "0";
};

/**
 * Enables body scrolling when a modal is closed
 */
export const enableBodyScroll = (): void => {
  // Get the previous scroll position
  const scrollY = document.body.style.top;
  
  // Reset all styles
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.width = "";
  document.body.style.height = "";
  document.body.style.overflow = "";
  document.body.style.left = "";
  document.body.style.right = "";
  
  // Restore scroll position
  if (scrollY) {
    window.scrollTo(0, parseInt(scrollY || "0") * -1);
  }
};

/**
 * Hook to handle body scrolling for modals
 * @param isOpen Whether the modal is open
 */
export const useModalScrollLock = (isOpen: boolean): void => {
  useEffect(() => {
    if (isOpen) {
      disableBodyScroll();
    } else {
      enableBodyScroll();
    }

    // Cleanup on unmount
    return () => {
      enableBodyScroll();
    };
  }, [isOpen]);
}; 
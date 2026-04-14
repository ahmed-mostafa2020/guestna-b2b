import { useCallback } from "react";

/**
 * Custom hook for sharing the current page using the Web Share API.
 * Falls back to an alert if the browser doesn't support it.
 *
 * @returns {{ handleShare: () => Promise<void> }}
 */
const useShare = () => {
  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          url: window.location.href,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      // Fallback for browsers that don't support the Web Share API
      alert("Your browser does not support sharing.");
    }
  }, []);

  return { handleShare };
};

export default useShare;

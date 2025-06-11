"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function ProgressBar() {
  const pathname = usePathname();
  const [NProgress, setNProgress] = useState(null);

  useEffect(() => {
    // Dynamically import NProgress
    const importNProgress = async () => {
      try {
        const nprogress = await import("nprogress");
        setNProgress(nprogress.default);
      } catch (error) {
        console.error("Failed to load NProgress:", error);
      }
    };

    importNProgress();
  }, []);

  useEffect(() => {
    if (NProgress) {
      try {
        // Safely configure NProgress
        NProgress.configure({
          showSpinner: false,
        });

        // Start and immediately stop to reset
        NProgress.start();
        NProgress.done();
      } catch (error) {
        console.error("Error configuring NProgress:", error);
      }
    }
  }, [NProgress, pathname]);

  // Dynamically load CSS
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://cdnjs.cloudflare.com/ajax/libs/nprogress/0.2.0/nprogress.min.css";
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return null;
}

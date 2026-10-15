"use client";

import { useEffect } from "react";

import { ANALYTICS_EVENTS, trackEvent } from "@utils/tracking/analytics";

/**
 * One delegated click listener for the whole app: any element marked with
 * getGtmTag() (data-gtm attributes) is sent to GA4 + GTM as a "ui_click" event.
 */
export default function AnalyticsClickTracker() {
  useEffect(() => {
    const handleClick = (event) => {
      const element = event.target?.closest?.("[data-gtm]");
      if (!element) return;

      const { gtm, gtmCategory, gtmId } = element.dataset;
      trackEvent(ANALYTICS_EVENTS.UI_CLICK, {
        element_name: gtm,
        element_category: gtmCategory,
        element_id: gtmId,
      });
    };

    // Capture phase: runs before navigation or stopPropagation in the element's own handler
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  return null;
}

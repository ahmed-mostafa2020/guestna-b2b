"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";

import { setUserProperties } from "@utils/tracking/analytics";

/**
 * Keeps the GA4 "user_type" user property in sync with the logged-in user
 * (visitor / school / parent / provider …) so reports can be split by it.
 * Must render inside ReduxProvider.
 */
export default function AnalyticsUserProperties() {
  const userType = useSelector((state) => state.users.userType);

  useEffect(() => {
    setUserProperties({ user_type: userType || "visitor" });
  }, [userType]);

  return null;
}

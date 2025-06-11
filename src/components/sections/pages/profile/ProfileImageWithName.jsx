"use client";

import { useSelector } from "react-redux";

import { useEffect, useRef, useState } from "react";

import ProfileImage from "./ProfileImage";

const ProfileImageWithName = () => {
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const name = useSelector((state) => state.profileData.data?.name);

  const headingRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(min-width: 1024px)");

      // Set initial value
      setIsLargeScreen(mediaQuery.matches);

      // Add listener for changes
      const handler = (e) => setIsLargeScreen(e.matches);
      mediaQuery.addEventListener("change", handler);

      return () => mediaQuery.removeEventListener("change", handler);
    }
  }, []);

  useEffect(() => {
    if (headingRef.current && isLargeScreen) {
      if (name?.length >= 11) {
        headingRef.current.textContent = name.substring(0, 10) + "..";
      } else {
        headingRef.current.textContent = name;
      }
    }
  }, [name, isLargeScreen]);

  return (
    <div className="flex items-center gap-2 px-4 border rounded-lg h-[117.4px] border-accordionBorder">
      <ProfileImage hasUploadButton={true} />

      <h2
        ref={headingRef}
        className="text-lg font-medium capitalize lg:text-2xl"
      >
        {name}
      </h2>
    </div>
  );
};

export default ProfileImageWithName;

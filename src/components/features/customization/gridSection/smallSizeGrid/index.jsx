"use client";

import { memo } from "react";

import BookWithConfidenceSection from "@components/ui/trips/BookWithConfidenceSection";
import GuestsAndDateCustomizationSection from "./GuestsAndDateCustomizationSection";

const SmallSizeGrid = ({ packageDays }) => {
  return (
    <>
      <GuestsAndDateCustomizationSection packageDays={packageDays} />

      <BookWithConfidenceSection />
    </>
  );
};

export default memo(SmallSizeGrid);

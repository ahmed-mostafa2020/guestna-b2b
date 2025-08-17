"use client";

import { useState } from "react";
import { Star } from "@mui/icons-material";

const InteractiveRating = ({ value = 0, onChange, label }) => {
  const [hoverValue, setHoverValue] = useState(0);

  const handleClick = (rating) => {
    onChange(rating);
  };

  const handleMouseEnter = (rating) => {
    setHoverValue(rating);
  };

  const handleMouseLeave = () => {
    setHoverValue(0);
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="font-medium capitalize font-ibm">{label}</label>
      )}
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-8 w-8 cursor-pointer transition-colors duration-200 ${
              (hoverValue || value) >= star
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300 hover:text-yellow-200"
            }`}
            onClick={() => handleClick(star)}
            onMouseEnter={() => handleMouseEnter(star)}
            onMouseLeave={handleMouseLeave}
          />
        ))}
      </div>
    </div>
  );
};

export default InteractiveRating;

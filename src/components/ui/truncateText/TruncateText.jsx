"use client";

import { memo, useEffect, useState } from "react";

const TruncateText = ({ text }) => {
  const [maxCharacters, setMaxCharacters] = useState(200);

  useEffect(() => {
    const updateMaxCharacters = () => {
      if (window.innerWidth < 640) {
        setMaxCharacters(160);
      } else if (window.innerWidth < 1024) {
        setMaxCharacters(170);
      } else {
        setMaxCharacters(155);
      }
    };

    updateMaxCharacters(); // Set initial value
    window.addEventListener("resize", updateMaxCharacters); // Update on resize

    return () => {
      window.removeEventListener("resize", updateMaxCharacters);
    };
  }, []);

  if (text?.length <= maxCharacters) {
    return <article className="font-normal leading-6">{text}</article>;
  }

  const truncatedText = text?.slice(0, maxCharacters) + "...";

  return (
    <article title={text} className="font-normal leading-6 text-sm">
      {truncatedText}
    </article>
  );
};

export default memo(TruncateText);

"use client";

import { useEffect, useState } from "react";

const OtpCounter = ({ onComplete, minutes = 0.5 }) => {
  const [timeLeft, setTimeLeft] = useState(minutes * 60); // 1/2 minutes

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onComplete]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // return <span> {timeLeft > 0 ? formatTime(timeLeft) : "Time's up!"}</span>;
  return <span> {timeLeft > 0 && formatTime(timeLeft)}</span>;
};

export default OtpCounter;

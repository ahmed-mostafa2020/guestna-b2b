"use client";

import { useTranslations } from "next-intl";

import { useState } from "react";

import OtpCounter from "@components/forms/checkout/paymentForm/OtpCounter";
import ResendOtpButton from "./ResendOtpButton";

const ResendOtpVerification = () => {
  const [showResendButton, setShowResendButton] = useState(false);
  const [key, setKey] = useState(0);

  const t = useTranslations();

  const handleTimerComplete = () => {
    setShowResendButton(true);
  };

  const handleAfterResend = () => {
    setShowResendButton(false);
    setKey((prevKey) => prevKey + 1); // Reset the counter , This forces a re-render when `key` changes
  };

  return (
    <div className="h-7 centered text-center">
      {!showResendButton ? (
        <div className="centered gap-2 text-sm">
          <span className="opacity-60 cursor-not-allowed transition-all duration-100 ease-in-out">
            {t("forms.auth.confirmAccount.resendOtp")}
          </span>

          <span className="w-5">
            <OtpCounter
              key={key}
              onComplete={handleTimerComplete}
              minutes={0.5}
            />
          </span>
        </div>
      ) : (
        <div onClick={handleAfterResend}>
          <ResendOtpButton />
        </div>
      )}
    </div>
  );
};

export default ResendOtpVerification;

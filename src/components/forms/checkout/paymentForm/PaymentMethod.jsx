"use client";

import Image from "next/image";

import { memo } from "react";

import { cn } from "@utils/cn";

import { FormControlLabel, Radio } from "@mui/material";

const PaymentMethod = ({ value, label, imagesList, currentPaymentMethod }) => {
  const renderedImages = imagesList.map((image, index) => (
    <Image
      key={index}
      src={image.image}
      alt="payment method"
      width={40}
      height={24}
      priority="true"
      className="h-6 rounded-md"
      title={image.name}
    />
  ));

  return (
    <div
      className={cn(
        currentPaymentMethod === value ? "border-textDark" : "border-border",
        "flex items-center gap-6 p-1 bg-white border-2  rounded-xl transition-all duration-200 ease-in-out"
      )}
    >
      <FormControlLabel
        sx={{
          marginInlineStart: 0,
          "& .MuiFormControlLabel-label": {
            color: "1F2626",
            fontWeight: "medium",
            fontSize: "15px",
            fontFamily: "var(--font-somar-sans), sans-serif",
          },
        }}
        value={value}
        control={
          <Radio
            sx={{
              color: "#1F2626",
              "&.Mui-checked": {
                color: "#1F2626",
              },
            }}
          />
        }
        label={label}
      />
      <div className="flex gap-1">{renderedImages}</div>
    </div>
  );
};

export default memo(PaymentMethod);

"use client";
import { memo } from "react";
import { useTranslations } from "next-intl";
import { CircularProgress } from "@mui/material";
import Print from "@mui/icons-material/Print";

const ExportButton = ({
  onClick,
  loading = false,
  disabled = false,
  loadingText,
  className = "",
  type = "button",
  ...props
}) => {
  const t = useTranslations();
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`bg-green-600 w-full hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <CircularProgress size={20} color="inherit" />
          {loadingText}
        </>
      ) : (
        <>
          <Print fontSize="small" />
          {t("profile.tables.orders.bookingDetails.exportExcel")}
        </>
      )}
    </button>
  );
};

export default memo(ExportButton);

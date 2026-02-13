"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { useSnackbar } from "notistack";
import { CircularProgress } from "@mui/material";
import { getHeaders } from "@utils/getHeaders";
import getProxyUrl from "@utils/getProxyUrl";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import axios from "axios";
import TextInputGroup from "@components/forms/TextInputGroup";

const AdministrativeCommentModal = ({ booking, onClose }) => {
  const locale = useLocale();
  const t = useTranslations();
  const { enqueueSnackbar } = useSnackbar();
  const headers = getHeaders(locale);

  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!comment.trim()) {
      enqueueSnackbar(t("forms.validation.require"), { variant: "warning" });
      return;
    }

    setLoading(true);
    try {
      // TODO: Replace with actual API endpoint when available
      await axios.patch(
        getProxyUrl(`${B2B_END_POINTS.PROFILE.ADMINISTRATIVE_COMMENT}`),
        { trip: booking._id, comment },
        { headers }
      );

      enqueueSnackbar(t("profile.tables.bookings.actions.commentSuccess"), {
        variant: "success",
      });
      onClose();
    } catch (error) {
      console.error("Error submitting comment:", error);
      const errorMessage =
        error.response?.data?.message ||
        t("forms.validation.api_errors.other_error");
      enqueueSnackbar(errorMessage, { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl mx-auto w-[95%] md:w-[700px] p-6 space-y-6">
      <h2 className="text-center text-xl md:text-2xl font-semibold">
        {t("profile.tables.bookings.actions.administrativeComment")}
      </h2>

      {/* Booking Info */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
        <div className="flex gap-2">
          <span className="text-sm text-gray-600 font-medium">
            {t("profile.tables.bookings.header.tripName")}:
          </span>
          <span className="text-sm">{booking?.name}</span>
        </div>
        <div className="flex gap-2">
          <span className="text-sm text-gray-600 font-medium">
            {t("profile.tables.bookings.header.schoolName")}:
          </span>
          <span className="text-sm">
            {booking?.organization?.name || booking?.organization}
          </span>
        </div>
      </div>

      {/* Textarea Editor */}
      <div className="space-y-2">
        <TextInputGroup
          name="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={t("profile.tables.bookings.actions.commentPlaceholder")}
          textarea={true}
          rows={8}
          style={{ minHeight: "200px" }}
        />
        <p className="text-xs text-gray-500 text-right">
          {comment.length} {t("common.characters")}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 pt-4">
        <button
          onClick={onClose}
          disabled={loading}
          className="flex-1 font-ibm text-center px-6 py-2.5 border border-gray-300 rounded-lg text-black font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t("links.cancel")}
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex-1 font-ibm text-center px-6 py-2.5 bg-mainColor text-white rounded-lg font-medium hover:bg-linksHover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading && <CircularProgress size={16} color="inherit" />}
          {t("links.send")}
        </button>
      </div>
    </div>
  );
};

export default AdministrativeCommentModal;

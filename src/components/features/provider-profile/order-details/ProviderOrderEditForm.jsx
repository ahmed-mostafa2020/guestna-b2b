"use client";

import { memo, useState, useMemo, useCallback } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Formik } from "formik";
import axios from "axios";
import { useSnackbar } from "notistack";
import { CircularProgress, Alert } from "@mui/material";
import {
  CalendarToday,
  AccessTime,
  Groups,
  MiscellaneousServices,
  LocationOn,
  NoteAlt,
} from "@mui/icons-material";

import TextInputGroup from "@components/forms/TextInputGroup";
import SelectionGroup from "@components/forms/SelectionGroup";
import { getHeaders } from "@utils/helpers/getHeaders";
import getProxyUrl from "@utils/api/getProxyUrl";
import getErrorMessage from "@utils/helpers/getErrorMessage";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import formatDateForInput from "@utils/formatters/FormateDateForInput";
import { formatTimeForInput } from "@utils/formatters/formatTimeForInput";
import { formatTime12h } from "@utils/formatters/formatTime12h";

const ProviderOrderEditForm = ({
  orderId,
  orderData,
  selections,
  onSuccess,
  isModal = false,
  onClose,
}) => {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations("providerProfile.orderDetails.editForm");
  const tGlobal = useTranslations();
  const { enqueueSnackbar } = useSnackbar();
  const headers = useMemo(() => getHeaders(locale), [locale]);

  const [submitError, setSubmitError] = useState(null);

  // Extract IDs from nested objects in the details response
  const extractServiceIds = useCallback((services) => {
    if (!Array.isArray(services)) return [];
    return services
      .map((s) => {
        if (typeof s === "string") return s;
        if (s?.service?._id) return s.service._id;
        if (s?._id) return s._id;
        return null;
      })
      .filter(Boolean);
  }, []);

  const extractBranchId = useCallback((branch) => {
    if (!branch) return "";
    if (typeof branch === "string") return branch;
    if (branch?._id) return branch._id;
    return "";
  }, []);

  // Build initial values from the details response
  const initialValues = useMemo(() => {
    return {
      day: formatDateForInput(orderData?.day) || "",
      endDay: formatDateForInput(orderData?.endDay) || "",
      availableSeats: orderData?.availableSeats ?? "",
      totalAvailableSeats: orderData?.totalAvailableSeats ?? "",
      fromHour: formatTimeForInput(orderData?.fromHour) || "",
      toHour: formatTimeForInput(orderData?.toHour) || "",
      services: extractServiceIds(orderData?.services),
      providerBranch: extractBranchId(orderData?.providerBranch),
      note: orderData?.note || "",
    };
  }, [orderData, extractServiceIds, extractBranchId]);

  // Selection options for dropdowns
  const servicesOptions = useMemo(
    () => selections?.services || [],
    [selections]
  );
  const branchesOptions = useMemo(
    () =>
      selections?.providerBranchs ||
      selections?.providerBranches ||
      selections?.branches ||
      [],
    [selections]
  );

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting }) => {
    setSubmitError(null);

    try {
      const payload = {};

      // Only include changed / non-empty fields
      if (values.day) payload.day = values.day;
      if (values.endDay) payload.endDay = values.endDay;
      if (values.availableSeats !== "" && values.availableSeats !== undefined) {
        payload.availableSeats = Number(values.availableSeats);
      }
      if (
        values.totalAvailableSeats !== "" &&
        values.totalAvailableSeats !== undefined
      ) {
        payload.totalAvailableSeats = Number(values.totalAvailableSeats);
      }
      if (values.fromHour) {
        payload.fromHour = formatTime12h(values.fromHour);
      }
      if (values.toHour) {
        payload.toHour = formatTime12h(values.toHour);
      }
      if (Array.isArray(values.services) && values.services.length > 0) {
        payload.services = values.services;
      }
      if (values.providerBranch) {
        payload.providerBranch = values.providerBranch;
      }
      if (values.note?.trim()) {
        payload.note = values.note.trim();
      }

      await axios.patch(
        getProxyUrl(
          `${B2B_END_POINTS.PROVIDER_PROFILE.ASK_TRIPS_EDIT}/${orderId}`
        ),
        payload,
        { headers: { ...headers, "Content-Type": "application/json" } }
      );

      enqueueSnackbar(t("editSuccess"), { variant: "success" });

      if (onSuccess) {
        onSuccess();
      } else {
        router.push(
          `/${locale}/provider-profile/orders-management/${orderId}`
        );
      }
    } catch (error) {
      console.error("Error editing order:", error);
      const errorMessage = getErrorMessage(error, tGlobal);
      setSubmitError(errorMessage);
      enqueueSnackbar(errorMessage || t("editError"), { variant: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputClick = (e) => {
    if (e.target?.showPicker) {
      try {
        e.target.showPicker();
      } catch {}
    }
  };

  const handleNumberKeyDown = (e) => {
    if (e.key === "-" || e.key === "e" || e.key === "E" || e.key === "+") {
      e.preventDefault();
    }
  };

  return (
    <div className={isModal ? "font-somar" : "bg-white rounded-2xl border border-border shadow-card p-5 sm:p-8 font-somar"}>
      <style jsx>{`
        .somar-placeholder input::placeholder,
        .somar-placeholder textarea::placeholder {
          font-family: "somar", sans-serif !important;
        }
        .somar-placeholder .MuiSelect-select span {
          font-family: "somar", sans-serif !important;
        }
        .somar-placeholder input,
        .somar-placeholder textarea {
          font-family: "somar", sans-serif !important;
        }
      `}</style>

      <Formik
        enableReinitialize
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validateOnBlur={true}
        validateOnChange={true}
        validateOnMount={false}
      >
        {(formik) => {
          const {
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            isSubmitting,
          } = formik;

          return (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                formik.submitForm();
              }}
            >
              {/* Error Alert */}
              {submitError && (
                <Alert
                  severity="error"
                  className="!mb-6 !rounded-xl !font-somar"
                  onClose={() => setSubmitError(null)}
                >
                  {submitError}
                </Alert>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-7">
                {/* ── Start Date ── */}
                <div className="somar-placeholder">
                  <label className="flex items-center gap-2 mb-2 text-sm font-semibold text-textDark font-somar">
                    <CalendarToday className="!w-4 !h-4 text-mainColor" />
                    {t("day")}
                  </label>
                  <TextInputGroup
                    type="date"
                    name="day"
                    value={values.day}
                    errors={errors.day}
                    touched={touched.day}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onClick={handleInputClick}
                    style={{ cursor: "pointer" }}
                  />
                </div>

                {/* ── End Date ── */}
                <div className="somar-placeholder">
                  <label className="flex items-center gap-2 mb-2 text-sm font-semibold text-textDark font-somar">
                    <CalendarToday className="!w-4 !h-4 text-mainColor" />
                    {t("endDay")}
                  </label>
                  <TextInputGroup
                    type="date"
                    name="endDay"
                    value={values.endDay}
                    errors={errors.endDay}
                    touched={touched.endDay}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    min={values.day || undefined}
                    onClick={handleInputClick}
                    style={{ cursor: "pointer" }}
                  />
                </div>

                {/* ── Start Time ── */}
                <div className="somar-placeholder">
                  <label className="flex items-center gap-2 mb-2 text-sm font-semibold text-textDark font-somar">
                    <AccessTime className="!w-4 !h-4 text-mainColor" />
                    {t("fromHour")}
                  </label>
                  <TextInputGroup
                    type="time"
                    name="fromHour"
                    value={values.fromHour}
                    errors={errors.fromHour}
                    touched={touched.fromHour}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onClick={handleInputClick}
                    style={{ cursor: "pointer" }}
                  />
                </div>

                {/* ── End Time ── */}
                <div className="somar-placeholder">
                  <label className="flex items-center gap-2 mb-2 text-sm font-semibold text-textDark font-somar">
                    <AccessTime className="!w-4 !h-4 text-mainColor" />
                    {t("toHour")}
                  </label>
                  <TextInputGroup
                    type="time"
                    name="toHour"
                    value={values.toHour}
                    errors={errors.toHour}
                    touched={touched.toHour}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onClick={handleInputClick}
                    style={{ cursor: "pointer" }}
                  />
                </div>

                {/* ── Expected Participants ── */}
                <div className="somar-placeholder">
                  <label className="flex items-center gap-2 mb-2 text-sm font-semibold text-textDark font-somar">
                    <Groups className="!w-4 !h-4 text-mainColor" />
                    {t("availableSeats")}
                  </label>
                  <TextInputGroup
                    type="number"
                    name="availableSeats"
                    value={values.availableSeats}
                    errors={errors.availableSeats}
                    touched={touched.availableSeats}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onKeyDown={handleNumberKeyDown}
                    min="0"
                    placeholder="0"
                  />
                </div>

                {/* ── Total Available Seats ── */}
                <div className="somar-placeholder">
                  <label className="flex items-center gap-2 mb-2 text-sm font-semibold text-textDark font-somar">
                    <Groups className="!w-4 !h-4 text-mainColor" />
                    {t("totalAvailableSeats")}
                  </label>
                  <TextInputGroup
                    type="number"
                    name="totalAvailableSeats"
                    value={values.totalAvailableSeats}
                    errors={errors.totalAvailableSeats}
                    touched={touched.totalAvailableSeats}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onKeyDown={handleNumberKeyDown}
                    min="0"
                    placeholder="0"
                  />
                </div>

                {/* ── Services (multi-select) ── */}
                <div className="somar-placeholder">
                  <label className="flex items-center gap-2 mb-2 text-sm font-semibold text-textDark font-somar">
                    <MiscellaneousServices className="!w-4 !h-4 text-mainColor" />
                    {t("services")}
                  </label>
                  <SelectionGroup
                    name="services"
                    value={values.services}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    touched={touched.services}
                    errors={errors.services}
                    placeholder={t("selectService")}
                    list={servicesOptions}
                    multiple={true}
                    showCheckbox={true}
                  />
                </div>

                {/* ── Provider Branch (single select) ── */}
                <div className="somar-placeholder">
                  <label className="flex items-center gap-2 mb-2 text-sm font-semibold text-textDark font-somar">
                    <LocationOn className="!w-4 !h-4 text-mainColor" />
                    {t("providerBranch")}
                  </label>
                  <SelectionGroup
                    name="providerBranch"
                    value={values.providerBranch}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    touched={touched.providerBranch}
                    errors={errors.providerBranch}
                    placeholder={t("selectBranch")}
                    list={branchesOptions}
                    multiple={false}
                  />
                </div>

                {/* ── Note (full width) ── */}
                <div className="somar-placeholder md:col-span-2">
                  <label className="flex items-center gap-2 mb-2 text-sm font-semibold text-textDark font-somar">
                    <NoteAlt className="!w-4 !h-4 text-mainColor" />
                    {t("note")}
                  </label>
                  <TextInputGroup
                    textarea
                    name="note"
                    value={values.note}
                    errors={errors.note}
                    touched={touched.note}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder={t("notePlaceholder")}
                    rows={3}
                  />
                </div>
              </div>

              {/* ── Actions ── */}
              <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 sm:gap-0 mt-8 pt-6 border-t border-border">
                <button
                  type="button"
                  onClick={() =>
                    isModal && onClose
                      ? onClose()
                      : router.push(
                          `/${locale}/provider-profile/orders-management/${orderId}`
                        )
                  }
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-6 h-12 flex items-center justify-center rounded-xl border-2 border-border text-textDark font-bold text-sm sm:text-base hover:border-mainColor hover:text-mainColor transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {tGlobal("common.back")}
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 h-12 flex items-center justify-center border-2 border-transparent bg-mainColor text-white rounded-xl font-bold text-sm sm:text-base hover:bg-titleColor disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer shadow-xs active:scale-95 focus:outline-none focus:ring-2 focus:ring-mainColor/30"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <CircularProgress color="inherit" size={18} />
                      <span>{t("submitting")}</span>
                    </div>
                  ) : (
                    t("submitEdit")
                  )}
                </button>
              </div>
            </form>
          );
        }}
      </Formik>
    </div>
  );
};

export default memo(ProviderOrderEditForm);

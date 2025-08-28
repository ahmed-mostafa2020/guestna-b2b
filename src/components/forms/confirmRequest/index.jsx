"use client";

import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { Formik } from "formik";
import axios from "axios";

import { createConfirmRequestSchema } from "@utils/validationSchemas";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import getErrorMessage from "@utils/getErrorMessage ";
import { getHeaders } from "@utils/getHeaders";
import getProxyUrl from "@utils/getProxyUrl";

import Dialog from "@components/common/customizedModal/Dialog";
import TextInputGroup from "../TextInputGroup";
import { CircularProgress } from "@mui/material";
import { TextField } from "@mui/material";

const ConfirmRequestForm = ({ onClose }) => {
  const tripId = useSelector((state) => state.tripDetailsData.data.trip._id);

  const locale = useLocale();
  const t = useTranslations();
  const { enqueueSnackbar } = useSnackbar();

  const router = useRouter();

  const headers = getHeaders(locale);
  const confirmRequestSchema = createConfirmRequestSchema(t);

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    const data = {
      day: values.day,
      availableSeats: values.availableSeats,
      trip: tripId,
      ...(values.note && { note: values.note }),
    };

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: getProxyUrl(B2B_END_POINTS.CONFIRM_REQUEST),
      headers,
      data: JSON.stringify(data),
    };

    axios
      .request(config)
      .then((response) => {
        setSubmitting(false);
        resetForm();

        enqueueSnackbar(t("forms.validation.success"), {
          variant: "success",
        });

        if (onClose) onClose();

        router.push(`/${locale}/profile/bookings-management/orders`);
      })
      .catch((error) => {
        setSubmitting(false);
        console.error("Confirm request error:", error);
        const errorMessage = getErrorMessage(error, t);
        enqueueSnackbar(errorMessage, { variant: "error" });
      });
  };

  return (
    <Dialog
      header={t("forms.confirmRequest.title")}
      closeDialogButton={true}
      handleClose={onClose}
    >
      <Formik
        initialValues={{
          day: new Date().toISOString().split("T")[0],
          availableSeats: 1,
          note: "",
        }}
        validationSchema={confirmRequestSchema}
        onSubmit={handleSubmit}
        enableReinitialize
        validateOnBlur={true}
        validateOnChange={true}
      >
        {({
          values,
          errors,
          touched,
          isValid,
          handleBlur,
          handleChange,
          handleSubmit,
          setFieldValue,
          isSubmitting,
        }) => (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Date Picker */}
            <div className="relative flex flex-col gap-2">
              <label className="font-medium capitalize font-ibm">
                {t("forms.confirmRequest.day.label")}
              </label>
              <TextField
                type="date"
                name="day"
                value={values.day}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.day && Boolean(errors.day)}
                helperText={touched.day && errors.day}
                fullWidth
                inputProps={{
                  min: new Date().toISOString().split("T")[0],
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                  },
                }}
              />
            </div>

            {/* Available Seats */}
            <TextInputGroup
              label={t("forms.confirmRequest.availableSeats.label")}
              name="availableSeats"
              type="number"
              value={values.availableSeats}
              errors={errors.availableSeats}
              touched={touched.availableSeats}
              onChange={(e) => {
                const value = Math.max(1, parseInt(e.target.value) || 1);
                setFieldValue("availableSeats", value);
              }}
              onBlur={handleBlur}
              min="1"
              max="1000"
            />

            {/* Notes */}
            <TextInputGroup
              label={t("forms.confirmRequest.note.label")}
              name="note"
              value={values.note}
              errors={errors.note}
              touched={touched.note}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder={t("forms.confirmRequest.note.placeholder")}
              textarea={true}
              rows={3}
            />

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={!isValid || isSubmitting}
                className={`centered gap-2 flex-1 py-3 text-base font-medium text-center text-white transition-all duration-200 ease-in-out border-2 rounded-lg border-mainColor bg-mainColor disabled:opacity-50 disabled:cursor-not-allowed ${
                  isValid && "hover:bg-linksHover hover:border-linksHover"
                }`}
              >
                {isSubmitting ? (
                  <>
                    {t("forms.validation.sending")}
                    <CircularProgress size={24} sx={{ color: "#ED8A22" }} />
                  </>
                ) : (
                  t("links.confirmRequest")
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 text-base font-medium text-gray-600 transition-all duration-200 ease-in-out border-2 border-gray-300 rounded-lg hover:bg-gray-50"
              >
                {t("links.cancel")}
              </button>
            </div>
          </form>
        )}
      </Formik>
    </Dialog>
  );
};

export default ConfirmRequestForm;

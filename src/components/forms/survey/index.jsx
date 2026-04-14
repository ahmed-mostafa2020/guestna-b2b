"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { Formik } from "formik";
import { createSurveySchema } from "@utils/validators/validationSchemas";
import axios from "axios";

import { B2B_END_POINTS } from "@constants/b2bAPIs";
import getErrorMessage from "@utils/helpers/getErrorMessage";
import { getHeaders } from "@utils/helpers/getHeaders";
import getProxyUrl from "@utils/api/getProxyUrl";

import TextInputGroup from "../TextInputGroup";
import SelectionGroup from "../SelectionGroup";
import InteractiveRating from "@components/ui/InteractiveRating";

import FormSubmitButton from "@components/ui/FormSubmitButton";

const SurveyForm = ({ tripId, organizationId, onClose, onSuccess }) => {
  const locale = useLocale();
  const t = useTranslations();
  const { enqueueSnackbar } = useSnackbar();

  const headers = getHeaders(locale);

  // Validation schema
  const surveySchema = createSurveySchema(t);

  // Dropdown options
  const learningObjectivesOptions = [
    t("forms.survey.learningObjectives.fully"),
    t("forms.survey.learningObjectives.mostly"),
    t("forms.survey.learningObjectives.partially"),
    t("forms.survey.learningObjectives.not"),
  ];

  const scheduleOptions = [
    t("forms.survey.schedule.yes"),
    t("forms.survey.schedule.partial"),
    t("forms.survey.schedule.no"),
  ];

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    const data = {
      trip: tripId,
      organization: organizationId,
      learningObjectivesAchieved: values.learningObjectivesAchieved,
      activityOnSchedule: values.activityOnSchedule,
      rate: values.rate,
      ...(values.note && { note: values.note }),
    };

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: getProxyUrl(B2B_END_POINTS.PROFILE.BOOKINGS_MANAGEMENT.SURVEY),
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

        if (onSuccess) onSuccess();
        if (onClose) onClose();
      })
      .catch((error) => {
        setSubmitting(false);
        console.error("Survey submission error:", error);
        const errorMessage = getErrorMessage(error, t);
        enqueueSnackbar(errorMessage, { variant: "error" });
      });
  };

  return (
    <div className="lg:w-[530px] w-[400px] bg-white rounded-2xl mx-auto my-5">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-center text-mainColor">
          {t("forms.survey.title")}
        </h2>
        <p className="text-sm text-center text-gray-600 mt-1">
          {t("forms.survey.subtitle")}
        </p>
      </div>

      <Formik
        initialValues={{
          learningObjectivesAchieved: "",
          activityOnSchedule: "",
          rate: 0,
          note: "",
        }}
        validationSchema={surveySchema}
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
          <div className="flex flex-col w-full gap-5 px-8 py-8">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Rating */}
              <InteractiveRating
                label={t("forms.survey.rating.label")}
                value={values.rate}
                onChange={(rating) => setFieldValue("rate", rating)}
              />
              {errors.rate && touched.rate && (
                <div className="text-xs text-error font-ibm -mt-3">
                  {errors.rate}
                </div>
              )}

              {/* Learning Objectives */}
              <div className="relative flex flex-col gap-2">
                <label className="font-medium capitalize font-ibm">
                  {t("forms.survey.learningObjectives.label")}
                  <span className="text-xs text-error">*</span>
                </label>
                <SelectionGroup
                  name="learningObjectivesAchieved"
                  value={values.learningObjectivesAchieved}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  touched={touched.learningObjectivesAchieved}
                  errors={errors.learningObjectivesAchieved}
                  placeholder={t("forms.survey.selectAnswer")}
                  list={learningObjectivesOptions}
                />
              </div>

              {/* Schedule Adherence */}
              <div className="relative flex flex-col gap-2">
                <label className="font-medium capitalize font-ibm">
                  {t("forms.survey.schedule.label")}{" "}
                  <span className="text-xs text-error">*</span>
                </label>
                <SelectionGroup
                  name="activityOnSchedule"
                  value={values.activityOnSchedule}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  touched={touched.activityOnSchedule}
                  errors={errors.activityOnSchedule}
                  placeholder={t("forms.survey.selectAnswer")}
                  list={scheduleOptions}
                />
              </div>

              {/* Additional Notes */}
              <TextInputGroup
                label={t("forms.survey.notes.label")}
                name="note"
                value={values.note}
                errors={errors.note}
                touched={touched.note}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder={t("forms.survey.notes.placeholder")}
                textarea={true}
                rows={3}
              />

              {/* Submit Button */}
              <div className="flex gap-2 pt-4">
                <FormSubmitButton
                  loading={isSubmitting}
                  disabled={!isValid}
                  label={t("forms.survey.submit")}
                  isValid={isValid}
                  className="flex-1 py-3 text-base"
                />
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 text-base font-medium text-gray-600 transition-all duration-200 ease-in-out border-2 border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  {t("links.cancel")}
                </button>
              </div>
            </form>
          </div>
        )}
      </Formik>
    </div>
  );
};

export default SurveyForm;

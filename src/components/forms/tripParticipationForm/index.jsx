"use client";

import { useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Formik } from "formik";
import { useSnackbar } from "notistack";
import axios from "axios";

import { createTripParticipationSchema } from "@utils/validators/validationSchemas";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import getProxyUrl from "@utils/api/getProxyUrl";
import { getHeaders } from "@utils/helpers/getHeaders";
import getErrorMessage from "@utils/helpers/getErrorMessage";
import TextInputGroup from "@components/forms/TextInputGroup";
import CheckboxGroup from "@components/forms/CheckboxGroup";
import SelectionGroup from "@components/forms/SelectionGroup";
import FormSubmitButton from "@components/ui/FormSubmitButton";

import GatheringLocationFields from "./GatheringLocationFields";
import NextStepsCard from "./NextStepsCard";
import HelpContactCard from "./HelpContactCard";
import { INITIAL_VALUES } from "./constants";
import { buildParticipationPayload } from "./utils";

const TripParticipationForm = ({ tripId, services = [], onSuccess }) => {
  const t = useTranslations();
  const locale = useLocale();
  const { enqueueSnackbar } = useSnackbar();

  // Proposed services from the poster endpoint → multi-select options
  const serviceOptions = useMemo(
    () =>
      (Array.isArray(services) ? services : []).map((service) => ({
        value: service._id,
        label: service.name,
        description: `${service.price ?? 0} ${t(
          "schoolTripBooking.form.schoolProfit.currency"
        )}${service.note ? ` · ${service.note}` : ""}`,
      })),
    [services, t]
  );

  const validationSchema = useMemo(() => createTripParticipationSchema(t), [t]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axios.patch(
        getProxyUrl(`${B2B_END_POINTS.PROFILE.UPDATE_TRIP_STATUS}/${tripId}`),
        buildParticipationPayload(values),
        { headers: getHeaders(locale) }
      );

      enqueueSnackbar(t("profile.createTripLink.linkCreated"), {
        variant: "success",
      });
      onSuccess?.(response?.data);
    } catch (error) {
      console.error("Failed to submit trip participation:", error);
      enqueueSnackbar(getErrorMessage(error, t), { variant: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      aria-labelledby="trip-participation-title"
      className="flex flex-col gap-8 md:gap-12 px-4 sm:px-8 py-8 md:py-12 rounded-xl bg-white shadow-md"
    >
      <h2
        id="trip-participation-title"
        className="text-xl md:text-[28px] md:leading-9 font-semibold font-ibm text-center text-black"
      >
        {t("profile.createTripLink.participation.title")}
      </h2>

      <Formik
        initialValues={INITIAL_VALUES}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit: submit,
          isSubmitting,
          setFieldValue,
          setFieldTouched,
        }) => (
          <form noValidate onSubmit={submit} className="flex flex-col gap-9">
            <div className="flex flex-col gap-7">
              {serviceOptions.length > 0 && (
                <SelectionGroup
                  labelClassName="font-somar"
                  labelFontFamily="var(--font-somar-sans), sans-serif"
                  name="proposedServices"
                  label={t(
                    "profile.createTripLink.participation.services.label"
                  )}
                  placeholder={t(
                    "profile.createTripLink.participation.services.placeholder"
                  )}
                  value={values.proposedServices}
                  list={serviceOptions}
                  multiple
                  onChange={handleChange}
                  onBlur={handleBlur}
                  touched={touched.proposedServices}
                  errors={errors.proposedServices}
                />
              )}

              <GatheringLocationFields />

              {/* Operating margin per student — optional, sent as 0 when unchecked */}
              <div className="flex flex-col gap-3">
                <CheckboxGroup
                  label={t("schoolTripBooking.form.schoolProfit.toggleLabel")}
                  isChecked={Boolean(values.hasSchoolProfit)}
                  onChangeFunction={(event) => {
                    const { checked } = event.target;
                    setFieldValue("hasSchoolProfit", checked);
                    if (!checked) {
                      setFieldValue("schoolProfit", "", false);
                      setFieldTouched("schoolProfit", false, false);
                    }
                  }}
                  hoveringAction={false}
                />

                {values.hasSchoolProfit && (
                  <div className="flex flex-col gap-2">
                    <TextInputGroup
                      labelClassName="font-somar"
                      labelFontFamily="var(--font-somar-sans), sans-serif"
                      inputClassName="font-somar"
                      type="number"
                      inputMode="decimal"
                      min={0}
                      name="schoolProfit"
                      label={t(
                        "profile.createTripLink.participation.profit.label"
                      )}
                      placeholder={t(
                        "profile.createTripLink.participation.profit.placeholder"
                      )}
                      value={values.schoolProfit}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      touched={touched.schoolProfit}
                      errors={errors.schoolProfit}
                      endAdornment={
                        <span className="text-sm font-medium font-somar text-textDark">
                          {t("schoolTripBooking.form.schoolProfit.currency")}
                        </span>
                      }
                      endAdornmentClassName="pe-4"
                      required
                    />
                    <p className="text-sm font-medium font-somar text-mainColor">
                      {t("profile.createTripLink.participation.profit.hint")}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <NextStepsCard />

            <HelpContactCard />

            <FormSubmitButton
              loading={isSubmitting}
              label={t("profile.createTripLink.participation.submit")}
              className="!mt-0 w-full py-3 font-bold font-somar"
            />
          </form>
        )}
      </Formik>
    </section>
  );
};

export default TripParticipationForm;

"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import { Formik } from "formik";
import { Container, CircularProgress } from "@mui/material";
import TextInputGroup from "@components/forms/TextInputGroup";
import DynamicField from "@components/forms/events/DynamicField";
import formatCurrency from "@utils/formatters/FormatCurrency";

// Formik listener to update pricing keys state in parent wizard
const FormikValueListener = ({ values, pricingKeys, onChange }) => {
  const prevValuesRef = useRef({});

  useEffect(() => {
    const hasChanged = pricingKeys.some((key) => {
      const prev = prevValuesRef.current[key];
      const curr = values[key];
      if (Array.isArray(prev) && Array.isArray(curr)) {
        return (
          prev.length !== curr.length || prev.some((v, i) => v !== curr[i])
        );
      }
      return prev !== curr;
    });

    const isFirstRender = Object.keys(prevValuesRef.current).length === 0;

    if (hasChanged || isFirstRender) {
      const newRefValues = {};
      pricingKeys.forEach((key) => {
        newRefValues[key] = Array.isArray(values[key])
          ? [...values[key]]
          : values[key];
      });
      prevValuesRef.current = newRefValues;
      onChange(values);
    }
  }, [values, pricingKeys, onChange]);

  return null;
};

const EventDynamicForm = ({
  event,
  inputs,
  registrationInitialValues,
  registrationSchema,
  registrationValuesRef,
  isRegistrationSubmitting,
  handleNext,
  pricingKeys,
  handleStep1ValuesChange,
  dynamicPrice,
  formTitle,
}) => {
  const locale = useLocale();
  const t = useTranslations();

  return (
    <Container
      maxWidth="lg"
      className="mt-8 lg:mt-12"
      id="event-registration-form"
    >
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Header section with form title and live pricing */}
        <div className="bg-activityDetailsBg px-6 md:px-10 py-6 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-titleColor font-somar">
              {formTitle}
            </h2>
            <p className="text-sm text-textLight font-somar">
              {t("eventTrips.form.subtitle") ||
                "Please fill in the details below to complete registration"}
            </p>
          </div>
          <div className="bg-white border border-border rounded-xl px-4 py-2.5 flex items-center gap-3 w-fit self-start md:self-auto shadow-sm">
            <span className="text-sm text-textLight font-somar">
              {t("eventTrips.payment.total") || "Total"}:
            </span>
            <span className="text-lg font-bold text-mainColor font-ibm">
              {formatCurrency(dynamicPrice)}
            </span>
          </div>
        </div>

        <div className="px-6 md:px-10 py-8">
          <Formik
            initialValues={
              registrationValuesRef.current || registrationInitialValues
            }
            validationSchema={registrationSchema}
            enableReinitialize={true}
            onSubmit={() => {}}
            validateOnChange={false}
            validateOnBlur={true}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              setFieldValue,
              validateForm,
              setTouched,
            }) => (
              <div className="flex flex-col gap-6">
                <FormikValueListener
                  values={values}
                  pricingKeys={pricingKeys}
                  onChange={handleStep1ValuesChange}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-start">
                  <div className="relative">
                    <TextInputGroup
                      label={t("eventTrips.form.name.label")}
                      type="text"
                      name="name"
                      value={values.name}
                      errors={errors.name}
                      touched={touched.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder={t("eventTrips.form.name.placeholder")}
                      required={true}
                      id="static-field-name"
                      labelFontFamily="var(--font-somar-sans), sans-serif"
                    />
                  </div>
                  {inputs.map((input) => (
                    <DynamicField
                      key={input._id}
                      input={input}
                      value={values[input.key]}
                      error={errors[input.key]}
                      touched={touched[input.key]}
                      handleChange={handleChange}
                      handleBlur={handleBlur}
                      setFieldValue={setFieldValue}
                      t={t}
                      locale={locale}
                    />
                  ))}
                </div>

                <div className="flex justify-center mt-6">
                  <button
                    type="button"
                    disabled={isRegistrationSubmitting}
                    onClick={() => handleNext(validateForm, setTouched, values)}
                    className="w-full sm:w-fit sm:px-24 py-3.5 bg-mainColor text-white rounded-xl font-somar font-semibold text-lg hover:bg-linksHover transition-all duration-200 ease-in-out shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isRegistrationSubmitting ? (
                      <>
                        <CircularProgress size={20} color="inherit" />
                        <span>
                          {t("forms.validation.sending") || "Sending..."}
                        </span>
                      </>
                    ) : (
                      t("pagination.next") || "Next"
                    )}
                  </button>
                </div>
              </div>
            )}
          </Formik>
        </div>
      </div>
    </Container>
  );
};

export default EventDynamicForm;

"use client";

import { useTranslations } from "next-intl";

import { useDispatch, useSelector } from "react-redux";
import { showPaymentMethods } from "@store/checkout/finalTripDetailsSlice";
import {
  updateField,
  toggleCheckbox,
  submitForm,
} from "@store/forms/checkoutForm/checkoutFormSlice";

import { useSnackbar } from "notistack";
import { createCheckoutSchema } from "@utils/validationSchemas";
import { cn } from "@utils/cn";
import TextInputGroup from "../../TextInputGroup";

import { Field, Formik } from "formik";

import PhoneInputWithCountrySelect from "react-phone-number-input";
import "react-phone-number-input/style.css";
import getUnicodeFlagIcon from "country-flag-icons/unicode";

import { Checkbox, FormControlLabel } from "@mui/material";
import { getGtmTag, GTM_TAGS } from "@utils/gtmUtils";

const ContactForm = () => {
  const dispatch = useDispatch();
  const { formData } = useSelector((state) => state.checkoutFormData);

  const t = useTranslations();

  const checkoutSchema = createCheckoutSchema(t);

  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = (values) => {
    event.preventDefault();

    enqueueSnackbar(t("forms.validation.success"), {
      variant: "success",
    });
    dispatch(submitForm(values));
    dispatch(showPaymentMethods());
  };

  return (
    <>
      <div className="flex flex-col gap-4 mb-4 lg:mb-9">
        <h2 className="text-lg font-semibold lg:text-[28px]">
          {t("forms.contactForm.title")}
        </h2>

        <h3 className="font-medium">{t("forms.contactForm.subTitle")}</h3>
      </div>

      <Formik
        initialValues={formData}
        validationSchema={checkoutSchema}
        onSubmit={handleSubmit}
        enableReinitialize
        validateOnBlur={true}
        validateOnChange={true}
        validateOnMount={true}
      >
        {({
          values,
          errors,
          touched,
          isValid,
          handleBlur,
          handleChange,
          setFieldValue,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-8 lg:w-[510px] w-full">
              <TextInputGroup
                label={t("forms.name.name")}
                type="text"
                name="name"
                value={values.name}
                errors={errors.name}
                touched={touched.name}
                onChange={(e) => {
                  handleChange(e);
                  dispatch(
                    updateField({ field: "name", value: e.target.value })
                  );
                }}
                onBlur={handleBlur}
                minLength="2"
                maxLength="50"
              />

              <TextInputGroup
                label={t("forms.email.name")}
                type="email"
                name="email"
                value={values.email}
                errors={errors.email}
                touched={touched.email}
                onChange={(e) => {
                  handleChange(e);
                  dispatch(
                    updateField({ field: "email", value: e.target.value })
                  );
                }}
                onBlur={handleBlur}
                placeholder="guestna@gmail.com"
              />

              <div className="relative flex flex-col gap-2 mb-6">
                <label className="font-medium capitalize font-ibm">
                  {t("forms.phone.name")}
                </label>

                <Field name="mobile">
                  {({ field }) => (
                    <PhoneInputWithCountrySelect
                      {...field}
                      international
                      defaultCountry="SA"
                      value={values.mobile}
                      onChange={(value) => {
                        setFieldValue("mobile", value);
                        dispatch(updateField({ field: "mobile", value }));
                      }}
                      errors={errors.mobile}
                      touched={touched.mobile}
                      onBlur={handleBlur}
                      id="mobile"
                      addInternationalOption={false}
                      style={{ direction: "ltr" }}
                      flagComponent={({ country }) => (
                        <span
                          style={{ fontSize: "1.2em", marginRight: "0.5em" }}
                        >
                          {getUnicodeFlagIcon(country)}
                        </span>
                      )}
                      className={cn(
                        "flex bg-white w-full lg:w-[510px] gap-1 p-4 font-normal border-2 rounded-lg h-[55px] border-input ring-offset-background file:border-0 font-somar text-lg file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed selection:bg-buttonsHover disabled:opacity-50  transition-all duration-200 ease-in-out",
                        errors.mobile && touched.mobile
                          ? "border-error PhoneInputInput-focus:border-error hover:border-error"
                          : "border-border PhoneInputInput-focus:border-textDark hover:border-textDark"
                      )}
                    />
                  )}
                </Field>
                {errors.mobile && touched.mobile && (
                  <div className="absolute text-xs transition-all duration-200 ease-in-out -bottom-[18px] start-0 font-ibm text-error">
                    {errors.mobile}
                  </div>
                )}
              </div>
            </div>

            <FormControlLabel
              sx={{
                width: "100%",
                marginInlineStart: 0,
                "& .MuiFormControlLabel-label": {
                  color: "1F2626",
                  fontWeight: "medium",
                  fontSize: "15px",
                  fontFamily: "var(--font-somar-sans), sans-serif",
                },
              }}
              control={
                <Checkbox
                  checked={values.isSMSupdates}
                  onChange={() => {
                    setFieldValue("isSMSupdates", !values.isSMSupdates);
                    dispatch(toggleCheckbox());
                  }}
                  sx={{
                    color: "var(--color-text-dark)",
                    "& .MuiSvgIcon-root": { fontSize: 28 },
                    "&.Mui-checked": {
                      color: "var(--color-title)",
                    },
                  }}
                />
              }
              label={t("forms.contactForm.checkBoxLabel")}
            />

            <div className="w-full centered">
              <button
                type="submit"
                disabled={
                  !isValid ||
                  formData.name == "" ||
                  formData.mobile == "" ||
                  formData.email == ""
                }
                className={`w-full lg:w-fit lg:px-[200px] mt-8 px-8 py-4 text-base font-medium text-center text-white transition-all duration-200 ease-in-out border-2 rounded-lg border-mainColor bg-mainColor disabled:opacity-50 disabled:cursor-not-allowed ${
                  isValid && "hover:bg-linksHover hover:border-linksHover"
                }`}
                {...getGtmTag(GTM_TAGS.PAYMENT.PROCEED, "payment")}
              >
                {t("links.continuePayment")}
              </button>
            </div>
          </form>
        )}
      </Formik>
    </>
  );
};

export default ContactForm;

"use client";

import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

import { useSelector } from "react-redux";

import { useMemo, useState } from "react";

import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { createRegisterChildSchema } from "@utils/validationSchemas";
import { getHeaders } from "@utils/getHeaders";
import { cn } from "@utils/cn";
import getErrorMessage from "@utils/getErrorMessage ";
import TextInputGroup from "../TextInputGroup";
import DropdownGroup from "../DropdownGroup";

import { Field, Formik } from "formik";
import PhoneInputWithCountrySelect from "react-phone-number-input";
import "react-phone-number-input/style.css";

import axios from "axios";

import { useSnackbar } from "notistack";

import { CircularProgress, Container } from "@mui/material";

const RegisterStudentForm = () => {
  const [formErrors, setFormErrors] = useState([]);

  const locale = useLocale();
  const t = useTranslations();

  const router = useRouter();

  const headers = getHeaders(locale);

  const registerChildSchema = createRegisterChildSchema(t);

  const { enqueueSnackbar } = useSnackbar();

  const { academicStages, nationalities } = useSelector(
    (state) => state.tripDetailsData.data
  );

  const tripId = useSelector((state) => state.tripDetailsData.data.trip._id);

  // Academic stage
  // const academicStage = useSelector((state) => state.homeData.items.stages);
  const [stage, setStage] = useState("");
  const [stageError, setStageError] = useState("");
  const handleChangeStage = (event) => {
    setStage(event.target.value);
  };

  // Nationality
  // const nationalities = useSelector(
  //   (state) => state.address?.list?.nationalities
  // );
  const [nationality, setNationality] = useState("");
  const [nationalityError, setNationalityError] = useState("");
  const handleChangeNationality = (event) => {
    setNationality(event.target.value);
  };

  // Validate custom fields
  const validateCustomFields = () => {
    let isValid = true;

    if (!stage) {
      setStageError(t("forms.validation.required"));
      isValid = false;
    } else {
      setStageError("");
    }

    if (!nationality) {
      setNationalityError(t("forms.validation.required"));
      isValid = false;
    } else {
      setNationalityError("");
    }

    return isValid;
  };

  // Check if form is completely valid
  const isFormValid = useMemo(() => {
    return stage && nationality;
  }, [stage, nationality]);

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    // Validate custom fields before submission
    if (!validateCustomFields()) {
      setSubmitting(false);
      return;
    }

    let data = {
      name: values.studentName,
      nationalId: `${values.nationalId}`,
      email: values.email,
      phone: values.mobile,
      academicStage: stage,
      nationality: nationality,
      promoCode: values.promoCode,
      trip: tripId,
    };

    let registerFormData = JSON.stringify(data);

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${B2B_END_POINTS.MAIN}${B2B_END_POINTS.STUDENT_REGISTER}`,
      headers,
      data: registerFormData,
    };
    axios
      .request(config)
      .then((response) => {
        setSubmitting(false);
        setFormErrors([]);
        resetForm();

        // Change acc to response
        const { _id } = response.data;
        if (_id) {
          enqueueSnackbar(t("forms.validation.success"), {
            variant: "success",
          });

          router.push(`/${locale}/checkout`);
        }
      })

      .catch((error) => {
        setSubmitting(false);

        console.log("Error details:", error + formErrors);

        const errorMessage = getErrorMessage(error, t);

        enqueueSnackbar(errorMessage, {
          variant: "error",
        });

        setFormErrors([errorMessage || "An unknown error occurred."]);
      });
  };

  return (
    <Container maxWidth="lg" id="register-student-form">
      <div className="my-6 border-b border-black lg:my-12"></div>
      <h3 className="pb-6 text-lg font-semibold text-titleColor lg:text-2xl lg:pb-12">
        {t("forms.registerForm.title")}
      </h3>
      <Formik
        initialValues={{
          studentName: "",
          nationalId: "",
          email: "",
          phone: "",
          promoCode: "",
        }}
        validationSchema={registerChildSchema}
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
          isSubmitting,
        }) => (
          <form onSubmit={handleSubmit}>
            <div className="flex flex-wrap w-full gap-x-5 gap-y-7">
              <div className="w-full lg:w-[49%]">
                <TextInputGroup
                  label={t("forms.studentName.name")}
                  type="text"
                  name="studentName"
                  placeholder={t("forms.studentName.placeholder")}
                  value={values.studentName}
                  errors={errors.studentName}
                  touched={touched.studentName}
                  onChange={(e) => {
                    handleChange(e);
                  }}
                  onBlur={handleBlur}
                  minLength="2"
                  maxLength="50"
                />
              </div>

              <div className="lg:w-[49%] w-full">
                <TextInputGroup
                  label={t("forms.nationalId.name")}
                  type="number"
                  name="nationalId"
                  inputMode="numeric"
                  placeholder={t("forms.nationalId.placeholder")}
                  value={values.nationalId}
                  errors={errors.nationalId}
                  touched={touched.nationalId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  minLength="10"
                  maxLength="10"
                />
              </div>

              {/* Academic stage */}
              <div className="w-full lg:w-[49%]">
                <DropdownGroup
                  label={t("forms.academicStages.name")}
                  placeholder={t("forms.academicStages.name")}
                  value={stage}
                  onChange={handleChangeStage}
                  // value={values.nationality}
                  // onChange={(e) => setFieldValue("nationality", e.target.value)}
                  menuItemsList={academicStages}
                />
                {stageError && (
                  <div className="absolute text-xs transition-all duration-200 ease-in-out -bottom-[18px] start-0 font-ibm text-error">
                    {stageError}
                  </div>
                )}
              </div>

              <div className="w-full lg:w-[49%]">
                <TextInputGroup
                  label={t("forms.email.parentEmail")}
                  type="email"
                  name="email"
                  value={values.email}
                  errors={errors.email}
                  touched={touched.email}
                  onChange={(e) => {
                    handleChange(e);
                  }}
                  onBlur={handleBlur}
                  placeholder="guestna@gmail.com"
                />
              </div>

              {/* Nationality */}
              <div className="w-full lg:w-[49%]">
                <DropdownGroup
                  label={t(
                    "profile.information.personalInformation.nationality"
                  )}
                  placeholder={t(
                    "profile.information.personalInformation.nationality"
                  )}
                  value={nationality}
                  onChange={handleChangeNationality}
                  // value={values.nationality}
                  // onChange={(e) => setFieldValue("nationality", e.target.value)}
                  menuItemsList={nationalities}
                />
                {nationalityError && (
                  <div className="absolute text-xs transition-all duration-200 ease-in-out -bottom-[18px] start-0 font-ibm text-error">
                    {nationalityError}
                  </div>
                )}
              </div>

              <div className="relative flex flex-col gap-2 mb-6 lg:w-[49%] w-full">
                <label className="font-medium capitalize font-ibm">
                  {t("forms.phone.parentPhone")}
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
                        // dispatch(updateField({ field: "mobile", value }));
                      }}
                      errors={errors.mobile}
                      touched={touched.mobile}
                      onBlur={handleBlur}
                      id="mobile"
                      addInternationalOption={false}
                      style={{ direction: "ltr" }}
                      className={cn(
                        "flex bg-white w-full gap-1 p-4 font-normal border-2 rounded-lg h-[55px] border-input ring-offset-background file:border-0 font-somar text-lg file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed selection:bg-buttonsHover disabled:opacity-50  transition-all duration-200 ease-in-out",
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

            <div className="w-full lg:w-1/3">
              <TextInputGroup
                label={t("forms.promoCode.label")}
                type="text"
                name="promoCode"
                placeholder={t("forms.promoCode.placeholder")}
                value={values.promoCode}
                errors={errors.promoCode}
                touched={touched.promoCode}
                onChange={(e) => {
                  handleChange(e);
                }}
                onBlur={handleBlur}
                minLength="4"
                maxLength="6"
              />
            </div>

            <button
              type="submit"
              disabled={!isValid || isSubmitting || !isFormValid}
              className={`mx-auto px-20 lg:px-40 w-fit centered gap-2  mt-4 lg:mt-8 py-3 text-base font-medium text-center text-white transition-all duration-200 ease-in-out border-2 rounded-lg border-mainColor bg-mainColor disabled:opacity-50 disabled:cursor-not-allowed ${
                isValid && "hover:bg-linksHover hover:border-linksHover"
              }`}
            >
              {isSubmitting ? (
                <>
                  {t("forms.validation.sending")}

                  <CircularProgress size={24} sx={{ color: "#ED8A22" }} />
                </>
              ) : (
                t("links.continuePayment")
              )}
            </button>
          </form>
        )}
      </Formik>
    </Container>
  );
};

export default RegisterStudentForm;

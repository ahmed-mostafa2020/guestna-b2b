"use client";

import { useLocale, useTranslations } from "next-intl";

import { useState } from "react";

import { B2B_END_POINTS } from "@constants/b2bAPIs";
import getErrorMessage from "@utils/getErrorMessage ";
import { createAddOrganizationUserSchema } from "@utils/validationSchemas";
import { getHeaders } from "@utils/getHeaders";
import getProxyUrl from "@utils/getProxyUrl";
import { cn } from "@utils/cn";
import TextInputGroup from "../TextInputGroup";
import SelectionGroup from "../SelectionGroup";

import { Field, Formik } from "formik";

import { CircularProgress } from "@mui/material";

import { useSnackbar } from "notistack";

import axios from "axios";

import PhoneInputWithCountrySelect from "react-phone-number-input";
import "react-phone-number-input/style.css";
import getUnicodeFlagIcon from "country-flag-icons/unicode";

const OrganizationUserForm = ({ organization, handleClose }) => {
  const [formErrors, setFormErrors] = useState([]);

  const locale = useLocale();
  const t = useTranslations();

  const userTypeData = [
    { name: t("common.usersType.B2B_STAFF_FINANCE"), _id: "B2B_STAFF_FINANCE" },
    { name: t("common.usersType.B2B_STAFF_STMS"), _id: "B2B_STAFF_STMS" },
  ];
  const userTypeOptions = userTypeData.map((item) => item.name);

  const headers = getHeaders(locale);

  const addOrganizationUserSchema = createAddOrganizationUserSchema(t);

  const { enqueueSnackbar } = useSnackbar();

  const findIdByName = (options, name) => {
    const option = options.find((opt) => opt.name === name);
    return option ? option._id : name;
  };

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    let data = {
      email: values.email,
      phone: `${values.mobile}`,
      name: values.name,
      userType: findIdByName(userTypeData, values.userType),
      organization,
    };

    let newUserData = JSON.stringify(data);

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: getProxyUrl(
        B2B_END_POINTS.PROFILE.SCHOOL_TEAM_MANAGEMENT.USERS.NEW_USER
      ),

      headers,
      data: newUserData,
    };
    axios
      .request(config)
      .then((response) => {
        setSubmitting(false);
        setFormErrors([]);
        resetForm();

        if (response.data) {
          enqueueSnackbar(t("forms.validation.success"), {
            variant: "success",
          });
        }
        handleClose();
      })

      .catch((error) => {
        setSubmitting(false);
        const errorMessage = getErrorMessage(error, t);

        enqueueSnackbar(errorMessage, { variant: "error" });
        if (formErrors) {
          setFormErrors([errorMessage]);
        }
      });
  };

  return (
    <Formik
      initialValues={{ email: "", mobile: "", name: "", userType: "" }}
      validationSchema={addOrganizationUserSchema}
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
        handleSubmit,
        setFieldValue,
        isSubmitting,
      }) => (
        <div className="lg:w-[750px] w-[650px] bg-white rounded-2xl mx-auto my-5">
          <div className="p-6 border-b border-black centered">
            <div className="flex items-center gap-1">
              <h3 className="text-xl lg:text-2xl">
                {t("profile.schools_users.form.title")}
              </h3>
            </div>
          </div>

          <div className="flex flex-col w-full gap-5 px-8 py-8 lg:gap-4">
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-4"
            >
              <TextInputGroup
                label={t("profile.schools_users.form.parsoneName")}
                type="text"
                name="name"
                value={values.name}
                errors={errors.name}
                touched={touched.name}
                onChange={(e) => {
                  handleChange(e);
                }}
                onBlur={handleBlur}
                minLength="3"
                maxLength="50"
              />

              <div className="relative min-w-[25%] flex flex-col flex-1 gap-2 transition-all duration-200 ease-in-out">
                <label
                  htmlFor={t("profile.schools_users.form.userTypePlaceholder")}
                  className="font-medium capitalize font-ibm"
                  // style={{ fontFamily: labelFontFamily && labelFontFamily }}
                >
                  {t("profile.schools_users.form.userTypePlaceholder")}
                </label>
                <SelectionGroup
                  name="userType"
                  value={values.userType}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  touched={touched.userType}
                  errors={errors.userType}
                  placeholder={t(
                    "profile.schools_users.form.userTypePlaceholder"
                  )}
                  list={userTypeOptions}
                />
              </div>

              <TextInputGroup
                label={t("forms.email.name")}
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

              <div className="relative flex flex-col gap-2">
                <label className="font-medium capitalize font-ibm">
                  {t("profile.schools_users.form.phone")}
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

              <button
                type="submit"
                disabled={!isValid || isSubmitting}
                className={`centered gap-2 w-full mt-4 py-3 text-base font-medium text-center text-white transition-all duration-200 ease-in-out border-2 rounded-lg border-mainColor bg-mainColor disabled:opacity-50 disabled:cursor-not-allowed ${
                  isValid && "hover:bg-linksHover hover:border-linksHover"
                }`}
              >
                {isSubmitting ? (
                  <>
                    {t("forms.validation.sending")}

                    <CircularProgress size={24} sx={{ color: "#ED8A22" }} />
                  </>
                ) : (
                  t("links.sendRequest")
                )}
              </button>

              <button
                type="button"
                onClick={handleClose}
                className={`centered gap-2 w-full mt-4 py-3 text-base font-medium text-center transition-all duration-200 ease-in-out border-2 rounded-lg border-[#E6F4F4] bg-[#E6F4F4] hover:shadow-md   ${
                  isValid &&
                  "hover:bg-secColor hover:border-secColor hover:text-white"
                }`}
              >
                {t("links.cancel")}
              </button>
            </form>
          </div>
        </div>
      )}
    </Formik>
  );
};

export default OrganizationUserForm;

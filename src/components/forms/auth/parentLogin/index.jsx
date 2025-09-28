"use client";

import Image from "next/image";

import { useLocale, useTranslations } from "next-intl";

import { useDispatch } from "react-redux";
import { submitParentData } from "@store/forms/auth/parentLogin/parentLoginFormSlice";
import { setUser, setUserToken } from "@store/users/usersSlice";

import { useState } from "react";

import { B2B_END_POINTS } from "@constants/b2bAPIs";
import getErrorMessage from "@utils/getErrorMessage";
import { createLoginEmailMethodSchema } from "@utils/validationSchemas";
import { getHeaders } from "@utils/getHeaders";
import setToken from "@utils/setToken";
import getProxyUrl from "@utils/getProxyUrl";
import TextInputGroup from "../../TextInputGroup";
import Logo from "@components/common/Logo";

import { Formik } from "formik";

import { CircularProgress } from "@mui/material";

import { useSnackbar } from "notistack";

import axios from "axios";

import hello from "@assets/gif/hello.gif";

const ParentLoginForm = () => {
  const [formErrors, setFormErrors] = useState([]);

  const locale = useLocale();
  const t = useTranslations();

  const dispatch = useDispatch();

  const headers = getHeaders(locale);

  const loginSchema = createLoginEmailMethodSchema(t);

  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    let data = { email: values.email, password: values.password };

    let parentLoginFormData = JSON.stringify(data);

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: getProxyUrl(B2B_END_POINTS.AUTH.PARENT_LOGIN),

      headers,
      data: parentLoginFormData,
    };
    axios
      .request(config)
      .then((response) => {
        setSubmitting(false);
        setFormErrors([]);
        resetForm();

        if (response.data) {
          enqueueSnackbar(t("forms.auth.confirmAccount.loginSuccessMessage"), {
            variant: "success",
          });
          setToken(response.data.token);
          dispatch(setUserToken(response.data.token));
          dispatch(setUser(response.data.userType));

          dispatch(submitParentData(response.data.user));
        }
      })

      .catch((error) => {
        setSubmitting(false);
        console.error("Error details:", error + formErrors);
        const errorMessage = getErrorMessage(error, t);

        enqueueSnackbar(errorMessage, { variant: "error" });
        if (setFormErrors) {
          setFormErrors([errorMessage]);
        }
      });
  };

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={loginSchema}
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
        isSubmitting,
      }) => (
        <div className="lg:w-[530px] w-[400px] bg-white rounded-2xl mx-auto my-5">
          <div className="p-4 border-b border-black centered">
            <Logo />
          </div>

          <div className="flex flex-col w-full gap-5 px-8 py-8 lg:gap-7">
            <div className="flex-col gap-1 centered">
              <div className="flex items-center gap-1">
                <h3 className="text-xl lg:text-2xl text-mainColor">
                  {t("forms.auth.login.title")}
                </h3>

                <Image src={hello} alt="hello" width={36} height={36} />
              </div>
              <h4 className="text-[#4E4E4E] text-lg lg:text-xl">
                {t("forms.auth.login.parentSubTitle")}
              </h4>
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-5 lg:gap-7"
            >
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

              <TextInputGroup
                label={t("forms.password.name")}
                type="password"
                name="password"
                value={values.password}
                errors={errors.password}
                touched={touched.password}
                onChange={(e) => {
                  handleChange(e);
                }}
                onBlur={handleBlur}
              />

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
                  t("forms.auth.login.name")
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </Formik>
  );
};

export default ParentLoginForm;

"use client";

import { useRouter } from "next/navigation";

import { useLocale, useTranslations } from "next-intl";

import { useDispatch } from "react-redux";
import { setEmail } from "@store/forms/auth/login/loginFormSlice";

import { createResetPasswordByEmailSchema } from "@utils/validators/validationSchemas";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { getHeaders } from "@utils/helpers/getHeaders";
import getProxyUrl from "@utils/api/getProxyUrl";
import TextInputGroup from "../../TextInputGroup";

import { Formik } from "formik";

import FormSubmitButton from "@components/ui/FormSubmitButton";

import { useSnackbar } from "notistack";
import useAxiosForm from "@hooks/forms/useAxiosForm";

const ResetPasswordByEmail = () => {
  const { makeRequest, isDisabled } = useAxiosForm();

  const locale = useLocale();
  const t = useTranslations();

  const router = useRouter();

  const dispatch = useDispatch();

  const headers = getHeaders(locale);

  const resetPasswordByEmail = createResetPasswordByEmailSchema(t);

  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    event.preventDefault();

    let data = { email: values.email };

    let resetPasswordByEmailData = JSON.stringify(data);

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: getProxyUrl(B2B_END_POINTS.AUTH.FORGET_PASSWORD),

      headers,
      data: resetPasswordByEmailData,
    };

    makeRequest(config, {
      setSubmitting,
      resetForm,
      onSuccess: (response) => {
        // const { email } = response.data;

        if (response.data === true) {
          enqueueSnackbar(t("forms.validation.checkYourEmail"), {
            variant: "success",
          });

          dispatch(setEmail(values.email));
          // setIsDisabled(true);
          // router.push(`/${locale}/confirm-account`);
        }
      },
    });
  };

  return (
    <div className="p-8">
      <h1 className="text-black font-ibm">
        {t("forms.auth.forgetPassword.titleEmail")}
      </h1>

      <Formik
        initialValues={{ email: "" }}
        validationSchema={resetPasswordByEmail}
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
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-7 lg:w-[510px] w-full pt-5">
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
                required={true}
              />

              <FormSubmitButton
                loading={isSubmitting}
                disabled={!isValid || isDisabled}
                label={t("forms.auth.forgetPassword.send")}
                isValid={isValid}
                className="w-full mt-4 py-3 text-base"
              />
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default ResetPasswordByEmail;

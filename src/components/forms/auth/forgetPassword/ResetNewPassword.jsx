"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { useLocale, useTranslations } from "next-intl";

// import { useDispatch, useSelector } from "react-redux";
// import { submitForm } from "@store/forms/auth/login/loginFormSlice";

import { useSnackbar } from "notistack";

import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { createResetNewPasswordSchema } from "@utils/validators/validationSchemas";
import setToken from "@utils/api/setToken";
import { getHeaders } from "@utils/helpers/getHeaders";
import getProxyUrl from "@utils/api/getProxyUrl";
import TextInputGroup from "../../TextInputGroup";

import { Formik } from "formik";

import FormSubmitButton from "@components/ui/FormSubmitButton";
import useAxiosForm from "@hooks/forms/useAxiosForm";

const ResetNewPassword = () => {
  const { makeRequest, isDisabled, setIsDisabled } = useAxiosForm();

  // const { email, phone, forgetPasswordId, rememberMe } = useSelector(
  //   (state) => state.loginForm
  // );

  const locale = useLocale();
  const t = useTranslations();

  // const dispatch = useDispatch();

  const router = useRouter();

  const searchParams = useSearchParams();
  const tokenCode = searchParams.get("token");

  const headers = getHeaders(locale);

  const signUpSchema = createResetNewPasswordSchema(t);

  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    let data = {
      token: tokenCode,
      password: values.password,
      confirmedPassword: values.confirmPassword,
    };
    // if (email) {
    //   data.email = email;
    // } else {
    //   data.phone = phone;
    // }

    let resetNewPasswordData = JSON.stringify(data);

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: getProxyUrl(B2B_END_POINTS.AUTH.RESET_PASSWORD),
      headers,
      data: resetNewPasswordData,
    };

    makeRequest(config, {
      setSubmitting,
      resetForm,
      onSuccess: (response) => {
        const token = response.data.token;
        if ((response.status === 201 || response.status === 200) && token) {
          enqueueSnackbar(t("forms.validation.success"), {
            variant: "success",
          });
          setToken(token, true);
          setIsDisabled(true);
          router.push(`/${locale}`);
        }
      },
    });
  };

  return (
    <>
      <div className="flex flex-col gap-5 p-4 pxy-6 lg:gap-10">
        <h2>{t("forms.auth.resetPassword.name")}</h2>

        <Formik
          initialValues={{
            password: "",
            confirmPassword: "",
          }}
          validationSchema={signUpSchema}
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
              <div className="flex flex-col gap-7 lg:w-[510px] w-full">
                <TextInputGroup
                  label={t("forms.password.name")}
                  type="password"
                  name="password"
                  value={values.password}
                  errors={errors.password}
                  touched={touched.password}
                  onChange={(e) => {
                    handleChange(e);
                    // dispatch(
                    //   updateField({ field: "password", value: e.target.value })
                    // );
                  }}
                  onBlur={handleBlur}
                />

                <TextInputGroup
                  label={t("forms.confirmPassword.name")}
                  type="password"
                  name="confirmPassword"
                  value={values.confirmPassword}
                  errors={errors.confirmPassword}
                  touched={touched.confirmPassword}
                  onChange={(e) => {
                    handleChange(e);
                    // dispatch(
                    //   updateField({
                    //     field: "confirmPassword",
                    //     value: e.target.value,
                    //   })
                    // );
                  }}
                  onBlur={handleBlur}
                />
              </div>

              <div className="w-full centered">
                <FormSubmitButton
                  loading={isSubmitting}
                  disabled={!isValid || isDisabled}
                  label={t("forms.auth.resetPassword.resetPassword")}
                  isValid={isValid}
                  className="w-full mt-8 py-3 text-base"
                />
              </div>
            </form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default ResetNewPassword;

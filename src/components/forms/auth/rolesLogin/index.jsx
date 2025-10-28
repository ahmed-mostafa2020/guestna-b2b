"use client";

import Image from "next/image";
import {
  useRouter,
  //  useSearchParams
} from "next/navigation";

import { useLocale, useTranslations } from "next-intl";

import {
  useDispatch,
  //  useSelector
} from "react-redux";
import {
  setUser,
  // setUser,
  setUserToken,
} from "@store/users/usersSlice";
import {
  submitForm,
  // toggleConfirmTermsAndConditions,
} from "@store/forms/auth/login/loginFormSlice";
import { setPermissions } from "@store/permissions/permissionsSlice";
import { setTheme  ,setColorPreferences, setCustomThemeLabel} from "@/src/store/theme/themeSlice";
import { useState } from "react";

import { B2B_END_POINTS } from "@constants/b2bAPIs";
import getErrorMessage from "@utils/getErrorMessage";
import { createLoginEmailMethodSchema } from "@utils/validationSchemas";
import { getHeaders } from "@utils/getHeaders";
import setToken from "@utils/setToken";
import getProxyUrl from "@utils/getProxyUrl";
import TextInputGroup from "../../TextInputGroup";
// import TermsAndConditions from "./TermsAndConditions";

import { Formik } from "formik";

import {
  //  Checkbox,
  CircularProgress,
  //  FormControlLabel
} from "@mui/material";

import { useSnackbar } from "notistack";

import axios from "axios";

import hello from "@assets/gif/hello.gif";
import { set } from "nprogress";

const RolesLoginForm = () => {
  // const confirmTermsAndConditions = useSelector(
  //   (state) => state.loginForm.confirmTermsAndConditions
  // );

  const [formErrors, setFormErrors] = useState([]);
  // const [isOpen, setIsOpen] = useState(false);

  // const searchParams = useSearchParams();
  // const userType = searchParams.get("userType");

  const locale = useLocale();
  const t = useTranslations();

  const dispatch = useDispatch();
  const router = useRouter();

  const headers = getHeaders(locale);

  const loginSchema = createLoginEmailMethodSchema(t);

  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    let data = {
      email: values.email,
      password: values.password,
      // userType: userType,
    };

    let rolesLoginFormData = JSON.stringify(data);

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: getProxyUrl(B2B_END_POINTS.AUTH.ROLES_LOGIN),

      headers,
      data: rolesLoginFormData,
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
          dispatch(setPermissions(response.data.user.permissions));
          
          console.log("User Color Preferences:", response.data.user.colorPreferences);
          if (response.data.user.colorPreferences) {
            dispatch(setTheme("customized"));
            dispatch(
              setColorPreferences(response.data.user.colorPreferences)
            );
            dispatch(setCustomThemeLabel(response.data.user.companyName));
          }
         

          router.push(`/${locale}/profile`);

          dispatch(submitForm(response.data.user));
          // dispatch(setUser(response.data.userType));
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

  // const handleOpen = () => {
  //   setIsOpen(true);
  // };
  // const handleClose = () => {
  //   setIsOpen(false);
  // };

  return (
    <>
      <Formik
        initialValues={{
          email: "",
          password: "",
          // confirmTermsAndConditions: false,
        }}
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

                {/* <div className="flex flex-col">
                  <div className="flex items-center gap-4">
                    <FormControlLabel
                      sx={{
                        marginInlineStart: 0,
                        "& .MuiFormControlLabel-label": {
                          color: "1F2626",
                          fontWeight: "medium",
                          fontSize: "16px",
                          fontFamily: "var(--font-somar-sans), sans-serif",
                        },
                      }}
                      control={
                        <Checkbox
                          checked={confirmTermsAndConditions}
                          onChange={() =>
                            dispatch(toggleConfirmTermsAndConditions())
                          }
                          sx={{
                            color: "var(--color-text-dark)",
                            "& .MuiSvgIcon-root": { fontSize: 28 },
                            "&.Mui-checked": {
                              color: "var(--color-title)",
                            },
                          }}
                        />
                      }
                      label={t("forms.auth.signUp.confirmTermsAndConditions")}
                    />

                    <button
                      onClick={handleOpen}
                      type="button"
                      className="border-b text-mainColor border-mainColor"
                    >
                      {t("pagesHead.title.termsAndConditions")}
                    </button>
                  </div>
                </div> */}

                <button
                  type="submit"
                  disabled={
                    !isValid || isSubmitting
                    // || !confirmTermsAndConditions
                  }
                  className={`centered gap-2 w-full py-3 text-base font-medium text-center text-white transition-all duration-200 ease-in-out border-2 rounded-lg border-mainColor bg-mainColor disabled:opacity-50 disabled:cursor-not-allowed ${
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

      {/* {isOpen && <TermsAndConditions handleClose={handleClose} />} */}
    </>
  );
};

export default RolesLoginForm;

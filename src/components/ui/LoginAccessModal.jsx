"use client";

import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { Modal, Box } from "@mui/material";
import { Formik } from "formik";
import { useSnackbar } from "notistack";
import axios from "axios";
import Image from "next/image";

import { setUser, setUserToken } from "@store/users/usersSlice";
import { submitForm } from "@store/forms/auth/login/loginFormSlice";
import { setPermissions } from "@store/permissions/permissionsSlice";
import {
  setTheme,
  setColorPreferences,
  setCustomLogo,
} from "@store/theme/themeSlice";
import { setOrganizations } from "@store/profile/selectedOrganizationsSlice";
import { createLoginEmailMethodSchema } from "@utils/validators/validationSchemas";
import { getHeaders } from "@utils/helpers/getHeaders";
import setToken from "@utils/api/setToken";
import getProxyUrl from "@utils/api/getProxyUrl";
import getErrorMessage from "@utils/helpers/getErrorMessage";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import TextInputGroup from "@components/forms/TextInputGroup";
import FormSubmitButton from "@components/ui/FormSubmitButton";

import waving from "@assets/gif/waving.gif";

/**
 * LoginAccessModal
 *
 * Shown as a full-blocking overlay when the current user (VISITOR) lacks
 * permission to view the requested page.  On successful login all required
 * Redux slices are updated so that ProtectedProfilePage can re-evaluate
 * permissions without any page navigation.
 *
 * Closing the modal without logging in redirects the user to the home page.
 */
const LoginAccessModal = ({ open }) => {
  const locale = useLocale();
  const t = useTranslations();
  const dispatch = useDispatch();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const headers = getHeaders(locale);
  const loginSchema = createLoginEmailMethodSchema(t);
  const [, setFormErrors] = useState([]);

  const handleClose = () => {
    router.push(`/${locale}`);
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: getProxyUrl(B2B_END_POINTS.AUTH.ROLES_LOGIN),
      headers,
      data: JSON.stringify({ email: values.email, password: values.password }),
    };

    try {
      const response = await axios.request(config);

      if (response.data) {
        enqueueSnackbar(t("forms.auth.confirmAccount.loginSuccessMessage"), {
          variant: "success",
        });

        // Persist token to cookie & Redux
        setToken(response.data.token);
        dispatch(setUserToken(response.data.token));
        dispatch(setUser(response.data.userType));
        dispatch(setPermissions(response.data.user.permissions));
        dispatch(submitForm(response.data.user));

        if (response.data.user?.companyLogo) {
          dispatch(setCustomLogo(response.data.user.companyLogo));
        }
        if (response.data.user?.colorPreferences) {
          dispatch(setTheme("customized"));
          dispatch(setColorPreferences(response.data.user.colorPreferences));
        }

        // Fetch organisations header filter (non-blocking)
        try {
          const orgsRes = await axios.get(
            getProxyUrl(B2B_END_POINTS.PROFILE.HEADER_FILTER_BY_ORGANIZATION),
            {
              headers: {
                "Content-Type": "application/json",
                lang: locale,
                authorization: `Bearer ${response.data.token}`,
              },
            }
          );
          if (orgsRes.data) dispatch(setOrganizations(orgsRes.data));
        } catch {
          // Non-blocking – OrganizationSelector will retry on its own
        }

        resetForm();
        // No router.push here – ProtectedProfilePage re-evaluates automatically
        // once userType & permissions are updated in Redux.
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error, t);
      enqueueSnackbar(errorMessage, { variant: "error" });
      setFormErrors([errorMessage]);
    } finally {
      setSubmitting(false);
    }
  };

  // Only allow closing via the "Back" button – never on backdrop/Escape click.
  const handleModalClose = (_event, reason) => {
    if (reason === "backdropClick" || reason === "escapeKeyDown") return;
    handleClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleModalClose}
      aria-labelledby="login-access-modal-title"
      disableEscapeKeyDown
      slotProps={{
        backdrop: {
          sx: { backgroundColor: "rgba(0, 0, 0, 0.75)" },
        },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "white",
          borderRadius: 3,
          boxShadow: 24,
          p: 4,
          width: { xs: "90%", sm: "460px" },
          outline: "none",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <h2
            id="login-access-modal-title"
            className="text-2xl text-mainColor"
          >
            {t("forms.auth.login.title")}
          </h2>
          <Image src={waving} alt="login" width={36} height={36} />
        </div>

        <p className="text-sm text-gray-500 mb-6">
          {t("forms.auth.login.parentSubTitle")}
        </p>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={loginSchema}
          onSubmit={handleSubmit}
          enableReinitialize
          validateOnBlur
          validateOnChange
          validateOnMount
        >
          {({
            values,
            errors,
            touched,
            isValid,
            handleBlur,
            handleChange,
            handleSubmit: formikSubmit,
            isSubmitting,
          }) => (
            <form
              onSubmit={formikSubmit}
              className="flex flex-col gap-5"
              noValidate
            >
              <TextInputGroup
                label={t("forms.email.name")}
                type="email"
                name="email"
                value={values.email}
                errors={errors.email}
                touched={touched.email}
                onChange={handleChange}
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
                onChange={handleChange}
                onBlur={handleBlur}
              />

              <FormSubmitButton
                loading={isSubmitting}
                disabled={!isValid}
                label={t("forms.auth.login.name")}
                isValid={isValid}
                className="w-full py-3 text-base mt-2"
              />

              <button
                type="button"
                onClick={handleClose}
                className="text-sm text-gray-400 underline text-center hover:text-gray-600 transition-colors"
              >
                {t("common.back")}
              </button>
            </form>
          )}
        </Formik>
      </Box>
    </Modal>
  );
};

export default LoginAccessModal;

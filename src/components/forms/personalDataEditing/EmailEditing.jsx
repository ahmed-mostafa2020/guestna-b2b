"use client";

import { useLocale, useTranslations } from "next-intl";

import { useDispatch, useSelector } from "react-redux";
import { updateEmail } from "@store/profile/profileInfoSlice";

import { memo, useState } from "react";

import { END_POINTS } from "@constants/APIs";
import { createResetPasswordByEmailSchema } from "@utils/validationSchemas";
import { getHeaders } from "@utils/getHeaders";
import getErrorMessage from "@utils/getErrorMessage";
import TextInputGroup from "../TextInputGroup";

import { Formik } from "formik";

import FormSubmitButton from "@components/shared/FormSubmitButton";

import { useSnackbar } from "notistack";

import axios from "axios";

const EmailEditing = ({ handleClose }) => {
  const [_, setFormErrors] = useState([]);
  const [disabledButton, setDisabledButton] = useState(false);

  const oldEmail = useSelector((state) => state.profileData.data?.email);

  const locale = useLocale();
  const t = useTranslations();

  const dispatch = useDispatch();

  const headers = getHeaders(locale);

  const emailEditing = createResetPasswordByEmailSchema(t);

  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    let data = { email: values.email };

    let newEmail = JSON.stringify(data);

    let config = {
      method: "patch",
      maxBodyLength: Infinity,
      url: `${END_POINTS.MAIN}${END_POINTS.PROFILE.EDIT_PERSONAL_INFO}`,

      headers,
      data: newEmail,
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

          dispatch(updateEmail(data));
          handleClose();
        }
      })

      .catch((error) => {
        setDisabledButton(false);
        setSubmitting(false);

        const errorMessage = getErrorMessage(error, t);

        enqueueSnackbar(errorMessage, {
          variant: "error",
        });

        setFormErrors([errorMessage || "An unknown error occurred."]);
      });
  };

  return (
    <Formik
      initialValues={{ email: oldEmail || "" }}
      validationSchema={emailEditing}
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
        <form onSubmit={handleSubmit} className="px-2 lg:px-6 lg:w-[530px]">
          <h2 className="mb-2 text-xl font-semibold text-black">
            {t("profile.editingDataForms.emailEditing")}
          </h2>

          <div className="flex flex-col w-full py-5 gap-7 lg:pt-10">
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
              placeholder={oldEmail}
            />

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={handleClose}
                type="button"
                className="px-8 py-3 text-black transition-all duration-200 ease-in-out hover:text-mainColor"
              >
                {t("links.cancel")}
              </button>

              <FormSubmitButton
                loading={isSubmitting}
                disabled={!isValid || disabledButton || values.email == oldEmail}
                label={t("links.saveChange")}
                isValid={isValid}
                className="py-3 px-8 text-base"
              />
            </div>
          </div>
        </form>
      )}
    </Formik>
  );
};

export default memo(EmailEditing);

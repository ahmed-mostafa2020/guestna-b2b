import { useLocale, useTranslations } from "next-intl";

import { useState } from "react";

import { createContactUsSchema } from "@utils/validationSchemas";
import { getHeaders } from "@utils/getHeaders";
import getErrorMessage from "@utils/getErrorMessage";
import { END_POINTS } from "@constants/APIs";
import TextInputGroup from "../TextInputGroup";

import { Formik } from "formik";

import axios from "axios";

import { useSnackbar } from "notistack";

import { CircularProgress } from "@mui/material";

const ContactUsForm = () => {
  const [formErrors, setFormErrors] = useState([]);

  const locale = useLocale();
  const t = useTranslations();

  const headers = getHeaders(locale);

  const contactUsSchema = createContactUsSchema(t);

  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    let data = {
      name: values.name,
      email: values.email,
      message: values.message,
    };

    let contactUsFormData = JSON.stringify(data);

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${END_POINTS.MAIN}${END_POINTS.CONTACT_US}`,
      headers,
      data: contactUsFormData,
    };
    axios
      .request(config)
      .then((response) => {
        setSubmitting(false);
        setFormErrors([]);
        resetForm();

        // Change acc to response
        const { message } = response.data;
        if (message) {
          enqueueSnackbar(t("forms.validation.success"), {
            variant: "success",
          });
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
    <div className="px-4 py-8 bg-white rounded-2xl">
      <h3 className="pb-5 text-lg font-medium text-black lg:text-xl lg:pb-10">
        {t("contactUs.subTitle")}
      </h3>

      <div className="p-4">
        <Formik
          initialValues={{
            name: "",
            email: "",
            message: "",
          }}
          validationSchema={contactUsSchema}
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
              <div className="flex flex-col w-full gap-7">
                <TextInputGroup
                  label={t("forms.name.name")}
                  type="text"
                  name="name"
                  value={values.name}
                  errors={errors.name}
                  touched={touched.name}
                  onChange={(e) => {
                    handleChange(e);
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
                  }}
                  onBlur={handleBlur}
                  placeholder="guestna@gmail.com"
                />

                <TextInputGroup
                  label={t("forms.message.name")}
                  type="text"
                  name="message"
                  value={values.message}
                  errors={errors.message}
                  touched={touched.message}
                  onChange={(e) => {
                    handleChange(e);
                  }}
                  onBlur={handleBlur}
                  minLength="5"
                  maxLength="225"
                  textarea={true}
                />
              </div>

              <div className="w-full pt-2 centered">
                <button
                  type="submit"
                  disabled={!isValid || isSubmitting}
                  className={`centered gap-2 w-full mt-8 py-3 text-base font-medium text-center text-white transition-all duration-200 ease-in-out border-2 rounded-lg border-mainColor bg-mainColor disabled:opacity-50 disabled:cursor-not-allowed ${
                    isValid && "hover:bg-linksHover hover:border-linksHover"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      {t("forms.validation.sending")}

                      <CircularProgress size={24} sx={{ color: "#ED8A22" }} />
                    </>
                  ) : (
                    t("links.send")
                  )}
                </button>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ContactUsForm;

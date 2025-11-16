"use client";

import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import { useSnackbar } from "notistack";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import Link from "next/link";
import TextInputGroup from "@components/forms/TextInputGroup";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import PermissionsSection from "./PermissionsSection";
import axios from "axios";
import { createAddRoleSchema } from "@utils/validationSchemas";
import { getHeaders } from "@utils/getHeaders";
import getProxyUrl from "@utils/getProxyUrl";
import { CircularProgress } from "@mui/material";

const AddRoleContent = ({ permissionsData, permissionsLoading }) => {
  const locale = useLocale();
  const t = useTranslations();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const pages = permissionsData || [];
  const [permissions, setPermissions] = useState({});

  // Initialize permissions when pages data is loaded
  useEffect(() => {
    if (pages.length > 0 && Object.keys(permissions).length === 0) {
      const initial = {};
      pages.forEach((page) => {
        initial[page._id] = {};
        page.child?.forEach((element) => {
          initial[page._id][element._id] = false; // Start with all unchecked
        });
      });
      setPermissions(initial);
    }
  }, [pages, permissions]);

  const initialValues = {
    descriptionEn: "",
    descriptionAr: "",
    summaryEn: "",
    summaryAr: "",
  };

  const togglePagePermissions = (pageId) => {
    const page = pages.find((p) => p._id === pageId);
    if (!page) return;

    const allEnabled = page.child?.every(
      (element) => permissions[pageId]?.[element._id]
    );
    const newPermissions = { ...permissions };
    page.child?.forEach((element) => {
      newPermissions[pageId][element._id] = !allEnabled;
    });
    setPermissions(newPermissions);
  };

  const toggleElementPermission = (pageId, elementId) => {
    const page = pages.find((p) => p._id === pageId);
    const element = page?.child?.find((e) => e._id === elementId);
    if (element?.defaultChecked) {
      return;
    }
    setPermissions({
      ...permissions,
      [pageId]: {
        ...permissions[pageId],
        [elementId]: !permissions[pageId][elementId],
      },
    });
  };

  const getEnabledCount = (pageId) => {
    const page = pages.find((p) => p._id === pageId);
    if (!page) return 0;
    return page.child?.filter((element) => permissions[pageId]?.[element._id])
      .length;
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // Collect all selected permission IDs
      const selectedPermissions = [];
      Object.keys(permissions).forEach((pageId) => {
        Object.keys(permissions[pageId]).forEach((elementId) => {
          if (permissions[pageId][elementId]) {
            selectedPermissions.push(elementId);
          }
        });
      });

      // Prepare the request body
      const requestBody = {
        description: {
          en: values.descriptionEn,
          ar: values.descriptionAr,
        },
        summary: {
          en: values.summaryEn,
          ar: values.summaryAr,
        },
        permissions: selectedPermissions,
      };

      // Make API call
      const response = await axios.post(
        getProxyUrl(B2B_END_POINTS.PROFILE.ROLES_PERMISSIONS.ADD_ROLE),
        requestBody,
        {
          headers: getHeaders(locale),
        }
      );

      if (response.status === 200 || response.status === 201) {
        enqueueSnackbar(t("profile.rolesPermissions.messages.addRoleSuccess"), {
          variant: "success",
        });
        router.push(`/${locale}/profile/roles-permissions`);
      }
    } catch (error) {
      console.error("Error creating role:", error);
      enqueueSnackbar(
        error.response?.data?.message ||
          t("forms.validation.api_errors.other_error"),
        { variant: "error" }
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Header */}
      <header className="space-y-4">
        <Link
          href={`/${locale}/profile/roles-permissions`}
          className="inline-flex items-center gap-2 text-mainColor hover:text-linksHover transition-colors"
        >
          <ArrowBackIcon className="w-5 h-5" />
          <span>{t("profile.rolesPermissions.addRole.form.cancel")}</span>
        </Link>
        <h1 className="text-3xl lg:text-4xl font-semibold text-titleColor">
          {t("profile.rolesPermissions.addRole.title")}
        </h1>
        <p className="text-textLight text-base lg:text-lg pt-2">
          {t("profile.rolesPermissions.addRole.description")}
        </p>
      </header>

      <Formik
        initialValues={initialValues}
        validationSchema={createAddRoleSchema(t)}
        onSubmit={handleSubmit}
        validateOnMount={true}
        validateOnChange={true}
        validateOnBlur={true}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          isSubmitting,
          isValid,
        }) => (
          <Form className="space-y-8">
            {/* Role Information */}
            <section className="bg-white rounded-xl border border-border p-6 space-y-6">
              <h2 className="text-xl lg:text-2xl font-medium text-titleColor">
                {t("profile.rolesPermissions.addRole.form.descriptionEn.label")}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Arabic Name */}
                <TextInputGroup
                  name="descriptionAr"
                  type="text"
                  label={t(
                    "profile.rolesPermissions.addRole.form.descriptionAr.label"
                  )}
                  placeholder={t(
                    "profile.rolesPermissions.addRole.form.descriptionAr.placeholder"
                  )}
                  value={values.descriptionAr}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  errors={errors.descriptionAr}
                  touched={touched.descriptionAr}
                  required
                />

                {/* English Name */}
                <TextInputGroup
                  name="descriptionEn"
                  type="text"
                  label={t(
                    "profile.rolesPermissions.addRole.form.descriptionEn.label"
                  )}
                  placeholder={t(
                    "profile.rolesPermissions.addRole.form.descriptionEn.placeholder"
                  )}
                  value={values.descriptionEn}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  errors={errors.descriptionEn}
                  touched={touched.descriptionEn}
                  required
                />

                {/* Arabic Description */}
                <TextInputGroup
                  name="summaryAr"
                  textarea={true}
                  label={t(
                    "profile.rolesPermissions.addRole.form.summaryAr.label"
                  )}
                  placeholder={t(
                    "profile.rolesPermissions.addRole.form.summaryAr.placeholder"
                  )}
                  value={values.summaryAr}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  errors={errors.summaryAr}
                  touched={touched.summaryAr}
                  rows={4}
                  required
                />

                {/* English Description */}
                <TextInputGroup
                  name="summaryEn"
                  textarea={true}
                  label={t(
                    "profile.rolesPermissions.addRole.form.summaryEn.label"
                  )}
                  placeholder={t(
                    "profile.rolesPermissions.addRole.form.summaryEn.placeholder"
                  )}
                  value={values.summaryEn}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  errors={errors.summaryEn}
                  touched={touched.summaryEn}
                  rows={4}
                  required
                />
              </div>
            </section>

            {/* Permissions Selection */}
            <section className="space-y-6">
              <h2 className="text-xl lg:text-2xl font-medium text-titleColor">
                {t("profile.rolesPermissions.addRole.form.permissions.label")}
              </h2>

              <div className="space-y-4">
                {pages.map((page, index) => (
                  <PermissionsSection
                    key={page._id}
                    page={page}
                    permissions={permissions[page._id]}
                    enabledCount={getEnabledCount(page._id)}
                    onTogglePage={() => togglePagePermissions(page._id)}
                    onToggleElement={(elementId) =>
                      toggleElementPermission(page._id, elementId)
                    }
                    index={index}
                  />
                ))}
              </div>
            </section>

            {/* Form Actions */}
            <div className="flex gap-4 justify-end">
              <Link
                href={`/${locale}/profile/roles-permissions`}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                {t("profile.rolesPermissions.addRole.form.cancel")}
              </Link>
              <button
                type="submit"
                disabled={!isValid || isSubmitting}
                className="px-6 py-3 bg-mainColor text-white rounded-lg hover:bg-linksHover transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    {t("profile.rolesPermissions.addRole.form.submitting")}
                    <CircularProgress size={16} color="white" />
                  </>
                ) : (
                  t("profile.rolesPermissions.addRole.form.submit")
                )}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddRoleContent;

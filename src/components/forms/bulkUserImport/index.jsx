"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState, useCallback } from "react";
import { isValidPhoneNumber } from "react-phone-number-input";
import { useSnackbar } from "notistack";
import axios from "axios";
import * as Yup from "yup";

import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { getHeaders } from "@utils/getHeaders";
import getProxyUrl from "@utils/getProxyUrl";
import getErrorMessage from "@utils/getErrorMessage";
import UploadInstructions from "./UploadInstructions";
import UsersPreviewTable from "./UsersPreviewTable";
import FooterActions from "./FooterActions";
import { usersHeaders } from "@constants/excelHeaders";
import { useExcel } from "@hooks/useExcel";
import { Box } from "@material-ui/core";
import { Typography } from "@mui/material";

const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

// Validation schema

const createBulkUserRowSchema = (t, roleOptions = []) =>
  Yup.object().shape({
    name: Yup.string()
      .trim()
      .required(t("forms.validation.require"))
      .matches(/^[\p{L}\s]+$/u, t("forms.name.error.invalid"))
      .test("min-word-length", t("forms.name.error.wordMinLength"), (value) => {
        if (!value) return false;
        const words = value.trim().split(/\s+/);
        return words.length >= 2 && words.every((w) => w.length >= 2);
      }),
    email: Yup.string()
      .email(t("forms.email.error"))
      .matches(emailRegex, t("forms.email.error_tld"))
      .required(t("forms.validation.require"))
      .test(
        "unique-email",
        t("forms.validation.duplicateEmail"),
        function (value) {
          const allEmails =
            this.options.context?.allValues?.map((u) =>
              u.email?.toLowerCase()
            ) || [];
          return (
            allEmails.filter((e) => e === value?.toLowerCase()).length <= 1
          );
        }
      ),
    phone: Yup.string()
      .transform((value) => (value ? String(value).replace(/\s/g, "") : value))
      .required(t("forms.validation.require"))
      .test("phone-validation", t("forms.phone.error.invalid"), (value) => {
        if (!value) return false;
        const phoneString = value.replace(/\s/g, "");
        return (
          phoneString.length >= 13 && isValidPhoneNumber(phoneString, "SA")
        );
      }),
    role: Yup.string()
      .required(t("forms.validation.require"))
      .test("valid-role", t("forms.validation.invalidRole"), (value) =>
        roleOptions.includes(value)
      ),
  });

// Helper: consistent error

const handleError = (error, t) => {
  if (axios.isAxiosError(error)) return getErrorMessage(error, t);
  if (error instanceof Error) return error.message;
  return t("forms.validation.error", { defaultValue: "Something went wrong" });
};

// Component

const BulkUserImportForm = ({
  organizationId,
  rolesData = [],
  existingUsers = [],
  handleClose,
  refetchInfo,
  refetchTable,
}) => {
  const locale = useLocale();
  const t = useTranslations();
  const { enqueueSnackbar } = useSnackbar();

  const [uploadedUsers, setUploadedUsers] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [duplicateUsers, setDuplicateUsers] = useState(new Set());
  const [fileError, setFileError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const headers = getHeaders(locale);
  const roleOptions = rolesData.map((r) => r.description);

  const { parseFile } = useExcel({ headers: usersHeaders(roleOptions) });
  const findRoleIdByName = useCallback(
    (description) =>
      rolesData.find((r) => r.description === description)?._id || description,
    [rolesData]
  );

  const isExistingUser = useCallback(
    (email) =>
      existingUsers.some(
        (u) => u.email?.toLowerCase() === email?.toLowerCase()
      ),
    [existingUsers]
  );

  // Validate row

  const validateUserRow = useCallback(
    async (user, index, allUsers) => {
      const schema = createBulkUserRowSchema(t, roleOptions);
      try {
        await schema.validate(user, {
          context: { allValues: allUsers },
          abortEarly: false,
        });
        return null;
      } catch (err) {
        if (err.inner && err.inner.length > 0) {
          return err.inner.reduce((acc, e) => {
            if (e.path) acc[e.path] = e.message;
            return acc;
          }, {});
        }
        return { _general: err.message };
      }
    },
    [roleOptions, t]
  );

  const recomputeState = async (users) => {
    const updatedErrors = {};
    const emailCounts = {};

    // Count emails to detect duplicates inside the file
    users.forEach((u) => {
      const email = u.email?.toLowerCase();
      if (email) emailCounts[email] = (emailCounts[email] || 0) + 1;
    });

    const newDuplicates = new Set();

    // Validate each user
    for (let i = 0; i < users.length; i++) {
      const user = users[i];

      // --- VALIDATION ---
      const rowErrors = await validateUserRow(user, i, users);
      if (rowErrors) {
        updatedErrors[i] = rowErrors;
        user._rowErrors = rowErrors;
      } else {
        delete user._rowErrors;
      }

      // --- DUPLICATES ---
      const email = user.email?.toLowerCase();
      const isDup = isExistingUser(email) || emailCounts[email] > 1;

      if (isDup) {
        newDuplicates.add(i);
        user._isDuplicate = true;
      } else {
        delete user._isDuplicate;
      }
    }

    return { updatedErrors, newDuplicates, users };
  };

  // File upload handler

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileError("");
    e.target.value = "";

    const validExtensions = [".xls", ".xlsx", ".csv"];
    const fileExtension = file.name
      .slice(file.name.lastIndexOf("."))
      .toLowerCase();
    if (!validExtensions.includes(fileExtension)) {
      setFileError(t("forms.validation.invalidFileType"));
      return;
    }

    try {
      const validRows = await parseFile(file);

      if (!validRows.length) {
        setFileError(t("forms.validation.emptyFile"));
        return;
      }

      const errors = {};
      const duplicates = new Set();

      for (let i = 0; i < validRows.length; i++) {
        const rowErrors = await validateUserRow(validRows[i], i, validRows);
        if (rowErrors) {
          errors[i] = rowErrors;
          validRows[i]._rowErrors = rowErrors;
        }

        if (isExistingUser(validRows[i].email)) {
          duplicates.add(i);
          validRows[i]._isDuplicate = true;
        }
      }

      setUploadedUsers(validRows);
      setValidationErrors(errors);
      setDuplicateUsers(duplicates);

      if (Object.keys(errors).length > 0) {
        enqueueSnackbar(
          t("profile.schools_users.bulkImport.validation.rowsHaveErrors", {
            count: Object.keys(errors).length,
          }),
          { variant: "error" }
        );
      }
    } catch (err) {
      const message = handleError(err, t);
      console.error(message);
      setFileError(message);
      enqueueSnackbar(message, { variant: "error" });
    }
  };

  // Remove user

  const handleRemoveUser = async (index) => {
    const updatedUsers = uploadedUsers.filter((_, i) => i !== index);

    const { updatedErrors, newDuplicates, users } = await recomputeState(
      updatedUsers
    );

    setUploadedUsers([...users]);
    setValidationErrors(updatedErrors);
    setDuplicateUsers(newDuplicates);
  };

  // Edit user

  const handleEditUser = async (index, field, value) => {
    const updatedUsers = [...uploadedUsers];
    updatedUsers[index] = {
      ...updatedUsers[index],
      [field]: value,
    };

    const { updatedErrors, newDuplicates, users } = await recomputeState(
      updatedUsers
    );

    setUploadedUsers([...users]);
    setValidationErrors(updatedErrors);
    setDuplicateUsers(newDuplicates);
  };

  // Bulk submit

  const handleBulkSubmit = async () => {
    if (!uploadedUsers.length) {
      enqueueSnackbar(t("forms.validation.noUsersToImport"), {
        variant: "warning",
      });
      return;
    }

    if (Object.keys(validationErrors).length > 0) {
      enqueueSnackbar(t("forms.validation.fixErrorsBeforeSubmit"), {
        variant: "error",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const requests = uploadedUsers.map((user) => {
        const existing = existingUsers.find((u) => u.email === user.email);
        const payload = existing
          ? {
              name: user.name.trim(),
              phone: user.phone.replace(/\s/g, ""),
              role: findRoleIdByName(user.role),
            }
          : {
              name: user.name.trim(),
              email: user.email.toLowerCase(),
              phone: user.phone.replace(/\s/g, ""),
              role: findRoleIdByName(user.role),
              organization: organizationId,
            };

        const url = existing
          ? getProxyUrl(
              `${B2B_END_POINTS.PROFILE.SCHOOL_TEAM_MANAGEMENT.USERS.EDIT_USER}/${existing._id}`
            )
          : getProxyUrl(
              B2B_END_POINTS.PROFILE.SCHOOL_TEAM_MANAGEMENT.USERS.NEW_USER
            );

        const method = existing ? "patch" : "post";
        return axios
          .request({ method, url, headers, data: JSON.stringify(payload) })
          .then(() => ({ status: "fulfilled", user }))
          .catch((err) => ({
            status: "rejected",
            user,
            error: handleError(err, t),
          }));
      });

      const results = await Promise.allSettled(requests);

      let success = 0,
        failed = 0,
        errors = [];
      results.forEach((r) => {
        if (r.status === "fulfilled" && r.value.status === "fulfilled")
          success++;
        else {
          failed++;
          errors.push({
            email: r.value?.user.email,
            error: r.value?.error || "Unknown error",
          });
        }
      });

      if (success > 0)
        enqueueSnackbar(
          t("forms.validation.bulkImportSuccess", { count: success }),
          { variant: "success" }
        );
      if (failed > 0)
        enqueueSnackbar(
          t("forms.validation.bulkImportPartial", { success, failed }),
          { variant: "warning" }
        );

      refetchInfo?.();
      refetchTable?.();
      if (!failed) setTimeout(handleClose, 1000);
    } catch (err) {
      enqueueSnackbar(handleError(err, t), { variant: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasValidUsers =
    uploadedUsers.length > 0 && Object.keys(validationErrors).length === 0;

  return (
    <Box className="lg:w-[1000px] w-full max-w-full bg-white rounded-2xl mx-auto my-5 max-h-[90vh] overflow-auto p-4 ">
      <Typography className="!text-2xl  !font-semibold !font-somar text-titleColor">
        {t("profile.schools_users.bulkImport.title")}
      </Typography>

      <Box className="border-2 border-dashed border-border mt-4 rounded-lg">
        <UploadInstructions
          roleOptions={roleOptions}
          fileError={fileError}
          isSubmitting={isSubmitting}
          duplicateCount={duplicateUsers.size}
          onUpload={handleFileUpload}
        />
        {uploadedUsers.length > 0 && (
          <UsersPreviewTable
            uploadedUsers={uploadedUsers}
            validationErrors={validationErrors}
            duplicateUsers={duplicateUsers}
            roleOptions={roleOptions}
            onEdit={handleEditUser}
            onRemove={handleRemoveUser}
          />
        )}
      </Box>

      <FooterActions
        isSubmitting={isSubmitting}
        onSubmit={handleBulkSubmit}
        onClose={handleClose}
        usersCount={uploadedUsers.length}
        hasValidUsers={hasValidUsers}
        existingUsers={existingUsers}
      />
    </Box>
  );
};

export default BulkUserImportForm;

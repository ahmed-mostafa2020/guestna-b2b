"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState, useCallback } from "react";
import * as XLSX from "xlsx";
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

const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

// Create validation schema for bulk import
const createBulkUserRowSchema = (t, roleOptions = []) => {
  return Yup.object().shape({
    name: Yup.string()
      .trim()
      .required(t("forms.validation.require"))
      .matches(/^[\p{L}\s]+$/u, t("forms.name.error.invalid"))
      .test(
        "min-word-length",
        t("forms.name.error.wordMinLength"),
        function (value) {
          if (!value) return false;
          const words = value.trim().split(/\s+/);
          if (words.length < 2) return false;
          return words.every((word) => word.length >= 2);
        }
      ),
    email: Yup.string()
      .email(t("forms.email.error"))
      .matches(emailRegex, t("forms.email.error_tld"))
      .required(t("forms.validation.require"))
      .test(
        "unique-email",
        t("forms.validation.duplicateEmail", {
          defaultValue: "Email already exists in file",
        }),
        function (value) {
          // Check for duplicates within the file
          const currentIndex = this.parent._index;
          const allValues = this.options.context?.allValues || [];
          const duplicateCount = allValues.filter(
            (item, idx) =>
              idx !== currentIndex &&
              item.email?.toLowerCase() === value?.toLowerCase()
          ).length;
          return duplicateCount === 0;
        }
      ),
    phone: Yup.string()
      .transform((value) => (value ? String(value).replace(/\s/g, "") : value))
      .required(t("forms.validation.require"))
      .test("phone-validation", t("forms.phone.error.invalid"), (value) => {
        if (!value) return false;
        const phoneString = String(value).replace(/\s/g, "");
        // Phone validation: must be at least 13 characters and valid phone number
        if (phoneString.length < 13) return false;
        return isValidPhoneNumber(phoneString);
      }),
    role: Yup.string()
      .required(t("forms.validation.require"))
      .test(
        "valid-role",
        t("forms.validation.invalidRole", {
          defaultValue: "Role must match one of the available roles",
        }),
        (value) => {
          if (!value) return false;
          return roleOptions.includes(value.trim());
        }
      ),
  });
};

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [duplicateUsers, setDuplicateUsers] = useState(new Set());
  const [fileError, setFileError] = useState("");

  const headers = getHeaders(locale);
  const roleOptions = rolesData.map((item) => item.description);

  // Find role ID by description
  const findRoleIdByName = (description) => {
    const role = rolesData.find((opt) => opt.description === description);
    return role ? role._id : description;
  };

  // Check if user exists in current organization users
  const isExistingUser = useCallback(
    (email) => {
      return existingUsers.some(
        (user) => user.email?.toLowerCase() === email?.toLowerCase()
      );
    },
    [existingUsers]
  );

  // Validate a single user row
  const validateUserRow = async (user, index, allUsers) => {
    const schema = createBulkUserRowSchema(t, roleOptions);
    try {
      await schema.validate(user, {
        context: { allValues: allUsers },
        abortEarly: false,
      });
      return null;
    } catch (error) {
      if (error.inner && error.inner.length > 0) {
        const errors = {};
        error.inner.forEach((err) => {
          if (err.path) {
            errors[err.path] = err.message;
          }
        });
        return errors;
      }
      return { _general: error.message };
    }
  };

  // Parse CSV/Excel file
  const parseFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: "array" });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          // Use first row as header to auto-detect columns
          const jsonData = XLSX.utils.sheet_to_json(worksheet, {
            defval: "", // Default value for empty cells
          });

          // Normalize and map the data
          // First, get all possible column name variations
          const columnMappings = {
            name: [
              "name",
              "Name",
              "full name",
              "Full Name",
              "person name",
              "Person Name",
              "اسم",
              "الاسم",
            ],
            email: [
              "email",
              "Email",
              "email address",
              "Email Address",
              "e-mail",
              "E-mail",
              "بريد إلكتروني",
            ],
            phone: [
              "phone",
              "Phone",
              "phone number",
              "Phone Number",
              "mobile",
              "Mobile",
              "mobile number",
              "Mobile Number",
              "tel",
              "telephone",
              "هاتف",
            ],
            role: [
              "role",
              "Role",
              "user role",
              "User Role",
              "job title",
              "Job Title",
              "position",
              "Position",
              "دور",
              "المسمى الوظيفي",
            ],
          };

          // Function to find column value by trying multiple variations
          const findColumnValue = (row, variations) => {
            for (const variation of variations) {
              // Try exact match first
              if (
                row[variation] !== undefined &&
                row[variation] !== null &&
                String(row[variation]).trim() !== ""
              ) {
                return String(row[variation]).trim();
              }
              // Try case-insensitive match
              const key = Object.keys(row).find(
                (k) => k.toLowerCase() === variation.toLowerCase()
              );
              if (
                key &&
                row[key] !== undefined &&
                row[key] !== null &&
                String(row[key]).trim() !== ""
              ) {
                return String(row[key]).trim();
              }
            }
            return "";
          };

          const normalizedData = jsonData
            .map((row, index) => {
              const name = findColumnValue(row, columnMappings.name);
              const email = findColumnValue(row, columnMappings.email);
              const phone = findColumnValue(row, columnMappings.phone);
              const role = findColumnValue(row, columnMappings.role);

              return {
                name,
                email: email.toLowerCase(),
                phone,
                role,
                _index: index,
                _isDuplicate: false,
              };
            })
            .filter((row) => {
              // Filter out completely empty rows
              return row.name || row.email || row.phone || row.role;
            });

          resolve(normalizedData);
        } catch (error) {
          reject(
            new Error(
              t("forms.validation.fileParseError", {
                defaultValue: "Failed to parse file",
              })
            )
          );
        }
      };
      reader.onerror = () =>
        reject(
          new Error(
            t("forms.validation.fileReadError", {
              defaultValue: "Failed to read file",
            })
          )
        );
      reader.readAsArrayBuffer(file);
    });
  };

  // Handle file upload
  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileError("");

    // Validate file type
    const validTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
    ];
    const validExtensions = [".xls", ".xlsx", ".csv"];
    const fileExtension = file.name
      .substring(file.name.lastIndexOf("."))
      .toLowerCase();

    if (
      !validTypes.includes(file.type) &&
      !validExtensions.includes(fileExtension)
    ) {
      setFileError(
        t("forms.validation.invalidFileType", {
          defaultValue: "Please upload a valid Excel (.xlsx, .xls) or CSV file",
        })
      );
      return;
    }

    try {
      const parsedData = await parseFile(file);

      if (parsedData.length === 0) {
        setFileError(
          t("forms.validation.emptyFile", {
            defaultValue: "The file appears to be empty or has no valid data",
          })
        );
        return;
      }

      // Validate all rows
      const errors = {};
      const duplicates = new Set();

      for (let i = 0; i < parsedData.length; i++) {
        const user = parsedData[i];
        const rowErrors = await validateUserRow(user, i, parsedData);

        if (rowErrors) {
          errors[i] = rowErrors;
        }

        // Check for existing users
        if (isExistingUser(user.email)) {
          duplicates.add(i);
          parsedData[i]._isDuplicate = true;
        }
      }

      setUploadedUsers(parsedData);
      setValidationErrors(errors);
      setDuplicateUsers(duplicates);
    } catch (error) {
      setFileError(error.message || t("forms.validation.error"));
      enqueueSnackbar(error.message || t("forms.validation.error"), {
        variant: "error",
      });
    }

    // Reset file input
    event.target.value = "";
  };

  // Remove user from uploaded list
  const handleRemoveUser = (index) => {
    const newUsers = uploadedUsers.filter((_, i) => i !== index);
    const newErrors = { ...validationErrors };
    delete newErrors[index];

    // Re-validate remaining users for duplicate emails
    setUploadedUsers(newUsers);
    setValidationErrors(newErrors);

    // Update duplicate tracking
    const emailCounts = {};
    newUsers.forEach((user, idx) => {
      const email = user.email?.toLowerCase();
      if (email) {
        emailCounts[email] = (emailCounts[email] || 0) + 1;
      }
    });

    const newDuplicates = new Set();
    newUsers.forEach((user, idx) => {
      if (
        isExistingUser(user.email) ||
        emailCounts[user.email?.toLowerCase()] > 1
      ) {
        newDuplicates.add(idx);
        newUsers[idx]._isDuplicate = true;
      }
    });
    setDuplicateUsers(newDuplicates);
  };

  // Handle bulk submit
  const handleBulkSubmit = async () => {
    if (uploadedUsers.length === 0) {
      enqueueSnackbar(
        t("forms.validation.noUsersToImport", {
          defaultValue: "No users to import",
        }),
        { variant: "warning" }
      );
      return;
    }

    // Check if there are validation errors
    const hasErrors = Object.keys(validationErrors).length > 0;
    if (hasErrors) {
      enqueueSnackbar(
        t("forms.validation.fixErrorsBeforeSubmit", {
          defaultValue: "Please fix all errors before submitting",
        }),
        { variant: "error" }
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // Process users - overwrite duplicates if they exist
      const usersToProcess = uploadedUsers.map((user) => ({
        email: user.email,
        phone: user.phone,
        name: user.name,
        role: findRoleIdByName(user.role),
        organization: organizationId,
        overwrite: user._isDuplicate, // Flag to overwrite if duplicate
      }));

      // Submit users one by one or in batch (depending on API)
      const results = {
        success: 0,
        failed: 0,
        errors: [],
      };

      for (let i = 0; i < usersToProcess.length; i++) {
        const userData = usersToProcess[i];
        try {
          const config = {
            method: "post",
            url: getProxyUrl(
              B2B_END_POINTS.PROFILE.SCHOOL_TEAM_MANAGEMENT.USERS.NEW_USER
            ),
            headers,
            data: JSON.stringify(userData),
          };

          const response = await axios.request(config);
          if (response.data === true || response.data) {
            results.success++;
          } else {
            results.failed++;
            results.errors.push({
              index: i,
              email: userData.email,
              error: t("forms.validation.unknownError", {
                defaultValue: "Unknown error",
              }),
            });
          }
        } catch (error) {
          results.failed++;
          results.errors.push({
            index: i,
            email: userData.email,
            error: getErrorMessage(error, t),
          });
        }
      }

      // Show results
      if (results.success > 0) {
        enqueueSnackbar(
          t("forms.validation.bulkImportSuccess", {
            count: results.success,
            defaultValue: `Successfully imported ${results.success} user(s)`,
          }),
          { variant: "success" }
        );
      }

      if (results.failed > 0) {
        enqueueSnackbar(
          t("forms.validation.bulkImportPartial", {
            success: results.success,
            failed: results.failed,
            defaultValue: `Imported ${results.success} user(s), ${results.failed} failed`,
          }),
          { variant: "warning" }
        );
      }

      // Refetch data
      if (refetchInfo) refetchInfo();
      if (refetchTable) refetchTable();

      // Close modal on success
      if (results.failed === 0) {
        setTimeout(() => {
          handleClose();
        }, 1000);
      }
    } catch (error) {
      enqueueSnackbar(getErrorMessage(error, t), { variant: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasValidUsers =
    uploadedUsers.length > 0 && Object.keys(validationErrors).length === 0;

  return (
    <div className="lg:w-[900px] w-full max-w-full bg-white rounded-2xl mx-auto my-5 max-h-[90vh] overflow-auto">
      {/* ------ Upload Section ------- */}
      <UploadInstructions
        t={t}
        fileError={fileError}
        isSubmitting={isSubmitting}
        duplicateCount={duplicateUsers.size}
        onUpload={handleFileUpload}
      />

      {/* ------ Preview Table ------- */}
      {uploadedUsers.length > 0 && (
        <UsersPreviewTable
          uploadedUsers={uploadedUsers}
          validationErrors={validationErrors}
          duplicateUsers={duplicateUsers}
          roleOptions={roleOptions}
          t={t}
          onRemove={handleRemoveUser}
        />
      )}

      {/* ------ Footer actions ------- */}
      <FooterActions
        t={t}
        isSubmitting={isSubmitting}
        onSubmit={handleBulkSubmit}
        onClose={handleClose}
        usersCount={uploadedUsers.length}
        hasValidUsers={hasValidUsers}
        existingUsers={existingUsers}
      />
    </div>
  );
};

export default BulkUserImportForm;

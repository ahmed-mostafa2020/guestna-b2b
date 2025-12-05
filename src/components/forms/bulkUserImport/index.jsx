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

import {
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Typography,
  Alert,
} from "@mui/material";
import {
  UploadFile,
  Delete as DeleteIcon,
  CheckCircle,
  Error as ErrorIcon,
  CloudUpload,
} from "@mui/icons-material";

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
  const duplicateCount = duplicateUsers.size;

  return (
    <div className="lg:w-[900px] w-full max-w-full bg-white rounded-2xl mx-auto my-5 max-h-[90vh] overflow-auto">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-1">
          <CloudUpload className="text-mainColor" />
          <h3 className="text-xl lg:text-2xl font-somar">
            {t("profile.schools_users.bulkImport.title", {
              defaultValue: "Bulk Import Users",
            })}
          </h3>
        </div>
        <Typography variant="body2" className="text-textLight mt-2">
          {t("profile.schools_users.bulkImport.description", {
            defaultValue:
              "Upload a CSV or Excel file with columns: Name, Email, Phone, Role. Existing users with matching emails will be overwritten.",
          })}
        </Typography>
      </div>

      <div className="flex flex-col w-full gap-5 px-8 py-6">
        {/* File Upload Section */}
        <div className="flex flex-col gap-4">
          <label
            htmlFor="bulk-upload-file"
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-mainColor transition-colors"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <UploadFile className="text-4xl text-mainColor mb-2" />
              <p className="mb-2 text-sm text-textDark">
                <span className="font-semibold">
                  {t("forms.validation.clickToUpload", {
                    defaultValue: "Click to upload",
                  })}
                </span>{" "}
                {t("forms.validation.orDragDrop", {
                  defaultValue: "or drag and drop",
                })}
              </p>
              <p className="text-xs text-textLight">
                {t("forms.validation.supportedFormats", {
                  defaultValue: "CSV, XLS, XLSX (MAX. 10MB)",
                })}
              </p>
            </div>
            <input
              id="bulk-upload-file"
              type="file"
              accept=".csv,.xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              className="hidden"
              onChange={handleFileUpload}
              disabled={isSubmitting}
            />
          </label>

          {fileError && (
            <Alert severity="error" onClose={() => setFileError("")}>
              {fileError}
            </Alert>
          )}

          {duplicateCount > 0 && (
            <Alert severity="info">
              {t("profile.schools_users.bulkImport.duplicatesFound", {
                count: duplicateCount,
                defaultValue: `${duplicateCount} user(s) already exist and will be overwritten`,
              })}
            </Alert>
          )}
        </div>

        {/* Users Preview Table */}
        {uploadedUsers.length > 0 && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <Typography variant="h6" className="font-somar">
                {t("profile.schools_users.bulkImport.preview", {
                  defaultValue: "Preview",
                })}{" "}
                ({uploadedUsers.length}{" "}
                {t("profile.schools_users.bulkImport.users", {
                  defaultValue: "users",
                })}
                )
              </Typography>
            </div>

            <TableContainer
              component={Paper}
              className="max-h-96 overflow-auto border border-border"
            >
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell className="font-somar font-semibold">
                      {t("profile.schools_users.form.parsoneName", {
                        defaultValue: "Name",
                      })}
                    </TableCell>
                    <TableCell className="font-somar font-semibold">
                      {t("forms.email.name", { defaultValue: "Email" })}
                    </TableCell>
                    <TableCell className="font-somar font-semibold">
                      {t("profile.schools_users.form.phone", {
                        defaultValue: "Phone",
                      })}
                    </TableCell>
                    <TableCell className="font-somar font-semibold">
                      {t("profile.schools_users.form.userTypePlaceholder", {
                        defaultValue: "Role",
                      })}
                    </TableCell>
                    <TableCell className="font-somar font-semibold">
                      {t("profile.schools_users.bulkImport.status", {
                        defaultValue: "Status",
                      })}
                    </TableCell>
                    <TableCell
                      className="font-somar font-semibold"
                      align="center"
                    >
                      {t("profile.schools_users.bulkImport.actions", {
                        defaultValue: "Actions",
                      })}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {uploadedUsers.map((user, index) => {
                    const rowErrors = validationErrors[index];
                    const hasError =
                      rowErrors && Object.keys(rowErrors).length > 0;
                    const isDuplicate = duplicateUsers.has(index);

                    return (
                      <TableRow
                        key={index}
                        sx={{
                          backgroundColor: hasError
                            ? "rgba(239, 68, 68, 0.1)"
                            : isDuplicate
                            ? "rgba(59, 130, 246, 0.1)"
                            : "transparent",
                        }}
                      >
                        <TableCell>{user.name || "-"}</TableCell>
                        <TableCell>{user.email || "-"}</TableCell>
                        <TableCell>{user.phone || "-"}</TableCell>
                        <TableCell>
                          {roleOptions.includes(user.role) ? (
                            <Chip
                              label={user.role}
                              size="small"
                              className="!bg-[#e9e1ff]"
                            />
                          ) : (
                            <span className="text-error text-sm">
                              {user.role || t("forms.validation.require")}
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          {hasError ? (
                            <Chip
                              icon={<ErrorIcon />}
                              label={t(
                                "profile.schools_users.bulkImport.hasErrors",
                                {
                                  defaultValue: "Errors",
                                }
                              )}
                              color="error"
                              size="small"
                            />
                          ) : isDuplicate ? (
                            <Chip
                              icon={<ErrorIcon />}
                              label={t(
                                "profile.schools_users.bulkImport.willOverwrite",
                                {
                                  defaultValue: "Will Overwrite",
                                }
                              )}
                              color="info"
                              size="small"
                            />
                          ) : (
                            <Chip
                              icon={<CheckCircle />}
                              label={t(
                                "profile.schools_users.bulkImport.valid",
                                {
                                  defaultValue: "Valid",
                                }
                              )}
                              color="success"
                              size="small"
                            />
                          )}
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            size="small"
                            onClick={() => handleRemoveUser(index)}
                            disabled={isSubmitting}
                            className="text-error hover:bg-error/10"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Error Details */}
            {Object.keys(validationErrors).length > 0 && (
              <Alert severity="error">
                <Typography variant="body2" className="font-semibold mb-2">
                  {t("profile.schools_users.bulkImport.validationErrors", {
                    defaultValue: "Validation Errors:",
                  })}
                </Typography>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {Object.entries(validationErrors).map(([index, errors]) => {
                    const user = uploadedUsers[parseInt(index)];
                    return (
                      <li key={index}>
                        <span className="font-semibold">
                          Row {parseInt(index) + 1}
                          {user.email && ` (${user.email})`}:
                        </span>{" "}
                        {Object.values(errors).join(", ")}
                      </li>
                    );
                  })}
                </ul>
              </Alert>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 justify-end pt-4 border-t border-border">
          <Button
            variant="outlined"
            onClick={handleClose}
            disabled={isSubmitting}
            className="!border-border !text-textDark hover:!bg-gray-50"
          >
            {t("links.cancel", { defaultValue: "Cancel" })}
          </Button>
          <Button
            variant="contained"
            onClick={handleBulkSubmit}
            disabled={!hasValidUsers || isSubmitting}
            className="!bg-mainColor hover:!bg-linksHover !text-white"
            startIcon={
              isSubmitting ? (
                <CircularProgress size={20} sx={{ color: "white" }} />
              ) : null
            }
          >
            {isSubmitting
              ? t("forms.validation.sending", { defaultValue: "Submitting..." })
              : t("profile.schools_users.bulkImport.submit", {
                  count: uploadedUsers.length,
                  defaultValue: `Import ${uploadedUsers.length} User(s)`,
                })}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BulkUserImportForm;

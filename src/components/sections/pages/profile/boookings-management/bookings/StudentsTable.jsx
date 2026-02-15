"use client";

import { useLocale, useTranslations } from "next-intl";

import { memo, useState, useMemo, useRef, useCallback } from "react";

import { useSnackbar } from "notistack";

import axios from "axios";

import { CONSTANT_VALUES } from "@constants/constantValues";

import { B2B_END_POINTS } from "@constants/b2bAPIs";

import { getHeaders } from "@utils/getHeaders";

import getProxyUrl from "@utils/getProxyUrl";

import { ExcelService } from "@utils/excelService";

import {
  CardContent,
  Card,
  CircularProgress,
  Button as MuiButton,
  Menu,
  MenuItem,
} from "@mui/material";

import Pagination from "@components/common/Pagination";

import CheckboxGroup from "@components/forms/CheckboxGroup";

const StudentsTable = ({ bookingDetails, loadingDetails, booking }) => {
  const locale = useLocale();

  const t = useTranslations();

  const { enqueueSnackbar } = useSnackbar();

  const headers = getHeaders(locale);

  // Pagination state

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = CONSTANT_VALUES.TABLE_PER_PAGE;

  // Loading states for actions - use student._id as key

  const [loadingPrint, setLoadingPrint] = useState({});

  const [loadingResend, setLoadingResend] = useState({});

  // Calculate pagination data

  const paginatedData = useMemo(() => {
    // Determine the source array based on API response shape

    const source = Array.isArray(bookingDetails)
      ? bookingDetails
      : bookingDetails?.nodes && Array.isArray(bookingDetails.nodes)
        ? bookingDetails.nodes
        : [];

    // Normal pagination mode

    const startIndex = (currentPage - 1) * itemsPerPage;

    const endIndex = startIndex + itemsPerPage;

    const data = source.slice(startIndex, endIndex);

    const totalPages = Math.ceil(source.length / itemsPerPage) || 1;

    const pageInfo = {
      totalPages,

      currentPage,

      total: source.length,

      perPage: itemsPerPage,
    };

    return { data, pageInfo, allData: source };
  }, [bookingDetails, currentPage, itemsPerPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Export student invoice to Excel using excelService

  const handlePrintInvoice = async (student) => {
    const studentId = student._id;

    setLoadingPrint((prev) => ({ ...prev, [studentId]: true }));

    try {
      await ExcelService.exportStudentInvoice({
        student,

        booking,

        t,

        locale,
      });

      enqueueSnackbar(t("profile.tables.orders.studentsTable.printSuccess"), {
        variant: "success",
      });
    } catch (error) {
      console.error("Error exporting invoice:", error);

      enqueueSnackbar(t("profile.tables.orders.studentsTable.printError"), {
        variant: "error",
      });
    } finally {
      setLoadingPrint((prev) => ({ ...prev, [studentId]: false }));
    }
  };

  // Resend booking for student

  const handleResend = async (student) => {
    const studentId = student._id;

    setLoadingResend((prev) => ({ ...prev, [studentId]: true }));

    try {
      await axios.get(
        getProxyUrl(
          `${B2B_END_POINTS.PROFILE.BOOKINGS_MANAGEMENT.RESEND_BOOKING}/${studentId}`
        ),

        { headers }
      );

      enqueueSnackbar(t("profile.tables.orders.studentsTable.resendSuccess"), {
        variant: "success",
      });
    } catch (error) {
      console.error("Error resending booking:", error);

      const errorMessage =
        error.response?.data?.message ||
        t("profile.tables.orders.studentsTable.resendError");

      enqueueSnackbar(errorMessage, { variant: "error" });
    } finally {
      setLoadingResend((prev) => ({ ...prev, [studentId]: false }));
    }
  };

  // Action buttons component for reuse

  const ActionButtons = ({ student }) => (
    <div className="flex flex-col gap-2 sm:flex-row sm:gap-2">
      <button
        onClick={() => handlePrintInvoice(student)}
        disabled={true}
        className="centered min-w-[120px] bg-mainColor text-white px-4 py-1 rounded-md font-medium transition-all duration-200 hover:bg-linksHover border border-mainColor hover:border-linksHover disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loadingPrint[student._id] ? (
          <CircularProgress size={16} color="inherit" />
        ) : (
          t("profile.tables.orders.studentsTable.printInvoice")
        )}
      </button>

      <button
        onClick={() => handleResend(student)}
        className="centered min-w-[120px] text-mainColor px-4 py-1 rounded-md font-medium transition-all border border-secColor duration-200 hover:bg-linksHover hover:border-linksHover hover:text-white"
      >
        {loadingResend[student._id] ? (
          <CircularProgress size={16} color="inherit" />
        ) : (
          t("profile.tables.orders.studentsTable.resend")
        )}
      </button>
    </div>
  );

  // 3-dot actions menu component

  const StudentActionsMenu = ({ student }) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const open = Boolean(anchorEl);

    const handleClick = (e) => setAnchorEl(e.currentTarget);

    const handleClose = () => setAnchorEl(null);

    return (
      <>
        <MuiButton
          id={`student-actions-button-${student._id}`}
          aria-controls={
            open ? `student-actions-menu-${student._id}` : undefined
          }
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
          disabled={loadingPdf[student._id]}
          sx={{ minWidth: "auto", padding: 0 }}
        >
          {loadingPdf[student._id] ? (
            <CircularProgress size={20} />
          ) : (
            actionsIcon
          )}
        </MuiButton>

        <Menu
          id={`student-actions-menu-${student._id}`}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          PaperProps={{
            sx: {
              minWidth: "200px",

              boxShadow: "0 0 4px 0 rgba(0, 0, 0, 0.16)",

              textAlign: "center",

              border: "1px solid var(--color-border)",
            },
          }}
        >
          <MenuItem
            onClick={() => {
              handleClose();

              handlePrintInvoice(student);
            }}
            disabled={true}
            className="!font-somar"
            {...getGtmTag(
              GTM_TAGS.STUDENTS.PRINT_INVOICE,

              "students",

              student._id
            )}
          >
            {loadingPrint[student._id] ? (
              <CircularProgress size={16} />
            ) : (
              t("profile.tables.orders.studentsTable.printInvoice")
            )}
          </MenuItem>

          <MenuItem
            onClick={() => {
              handleClose();

              handleResend(student);
            }}
            className="!font-somar"
            {...getGtmTag(
              GTM_TAGS.STUDENTS.RESEND_BOOKING,

              "students",

              student._id
            )}
          >
            {loadingResend[student._id] ? (
              <CircularProgress size={16} />
            ) : (
              t("profile.tables.orders.studentsTable.resend")
            )}
          </MenuItem>

          <MenuItem
            onClick={() => {
              handleClose();

              handleDownloadConsent(student);
            }}
            disabled={loadingPdf[student._id]}
            className="!font-somar"
          >
            {loadingPdf[student._id] ? (
              <CircularProgress size={16} />
            ) : (
              t("profile.tables.orders.studentsTable.downloadConsent")
            )}
          </MenuItem>
        </Menu>
      </>
    );
  };

  return (
    <div className="w-full space-y-6 mt-8">
      {loadingDetails ? (
        <div className="text-center py-3">
          <CircularProgress size={20} color="primary" />

          <p className="mt-2 text-gray-600">
            {t("profile.tables.orders.studentsTable.loading")}
          </p>
        </div>
      ) : paginatedData.data.length > 0 ? (
        <>
          {/* Desktop Table */}

          <Card
            className="hidden md:block"
            sx={{
              borderRadius: "16px",

              boxShadow: "0 0 4px 0 rgba(0, 0, 0, 0.16)",
            }}
          >
            <h2 className="text-xl font-medium lg:text-2xl text-titleColor pt-4 px-4">
              {t("profile.tables.orders.studentsTable.title")}
            </h2>

            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-tableRowBorder">
                      <th className="px-6 py-4 text-start text-sm font-medium text-gray-700">
                        {t("profile.tables.orders.studentsTable.studentName")}
                      </th>

                      <th className="px-6 py-4 text-start text-sm font-medium text-gray-700">
                        {t("profile.tables.orders.studentsTable.parentName")}
                      </th>

                      <th className="px-6 py-4 text-start text-sm font-medium text-gray-700">
                        {t("profile.tables.orders.studentsTable.grade")}
                      </th>

                      <th className="px-6 py-4 text-start text-sm font-medium text-gray-700">
                        {t("profile.tables.orders.studentsTable.parentPhone")}
                      </th>

                      <th className="px-6 py-4 text-start text-sm font-medium text-gray-700">
                        {t("profile.tables.orders.studentsTable.nationalId")}
                      </th>

                      <th className="px-6 py-4 text-start text-sm font-medium text-gray-700">
                        {t(
                          "profile.tables.orders.studentsTable.parentConfirmation"
                        )}
                      </th>

                      <th className="px-6 py-4 text-center text-sm font-medium text-gray-700">
                        {t("profile.tables.orders.studentsTable.actions")}
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200">
                    {paginatedData.data.map((student, index) => (
                      <tr
                        key={`desktop-${student._id}-${currentPage}-${index}`}
                        className={`${
                          index != paginatedData.data.length - 1 &&
                          "border-b border-table-border"
                        } transition-colors hover:bg-gray-50`}
                      >
                        <td className="px-6 py-4 text-sm font-medium text-foreground">
                          {student.child.name}
                        </td>

                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {student.parent.name}
                        </td>

                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {student.child.grade.name}
                        </td>

                        <td
                          className="px-6 py-4 text-sm text-muted-foreground text-end"
                          dir="ltr"
                        >
                          {student.parent.phone}
                        </td>

                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {student.child.nationalId}
                        </td>

                        <td className="px-6 py-4 text-sm">
                          {student.parent?.termsAccepted && (
                            <span
                              className="px-3 py-1 rounded-full text-xs font-medium 

                                text-success bg-green-100"
                            >
                              {t("profile.tables.orders.studentsTable.agreed")}
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-4 text-center">
                          <StudentActionsMenu student={student} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Mobile Cards */}

          <div className="md:hidden space-y-4">
            {paginatedData.data.map((student, index) => (
              <Card
                key={`mobile-${student._id}-${currentPage}-${index}`}
                className="shadow-sm"
              >
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">
                        {t("profile.tables.orders.studentsTable.studentName")}
                      </span>

                      <span className="text-sm font-semibold text-foreground">
                        {student.child.name}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">
                        {t("profile.tables.orders.studentsTable.parentName")}
                      </span>

                      <span className="text-sm text-muted-foreground">
                        {student.parent.name}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">
                        {t("profile.tables.orders.studentsTable.grade")}
                      </span>

                      <span className="text-sm text-muted-foreground">
                        {student.child.grade.name}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">
                        {t("profile.tables.orders.studentsTable.parentPhone")}
                      </span>

                      <span
                        className="text-sm text-muted-foreground text-end"
                        dir="ltr"
                      >
                        {student.parent.phone}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">
                        {t("profile.tables.orders.studentsTable.nationalId")}
                      </span>

                      <span className="text-sm text-muted-foreground">
                        {student.child.nationalId}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">
                        {t(
                          "profile.tables.orders.studentsTable.parentConfirmation"
                        )}
                      </span>

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          student.parent?.termsAccepted
                            ? "text-green-800 bg-green-100"
                            : ""
                        }`}
                      >
                        {student.parent?.termsAccepted
                          ? t("profile.tables.orders.studentsTable.agreed")
                          : ""}
                      </span>
                    </div>

                    {/* Actions for Mobile */}

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <span className="text-sm font-medium text-muted-foreground">
                        {t("profile.tables.orders.studentsTable.actions")}
                      </span>

                      <StudentActionsMenu student={student} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination Controls */}

          {paginatedData.pageInfo && (
            <Pagination
              pageInfo={paginatedData.pageInfo}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              className="mt-6"
            />
          )}
        </>
      ) : (
        <p className="p-4 text-center text-gray-500">
          {t("profile.tables.orders.studentsTable.noData")}
        </p>
      )}

      {/* Hidden PDF Consent Template */}

      {pdfStudent && (
        <div
          style={{
            position: "fixed",

            left: "-9999px",

            top: 0,

            zIndex: -1,
          }}
        >
          <div
            ref={consentRef}
            style={{
              width: "794px",

              padding: "40px",

              backgroundColor: "#ffffff",

              fontFamily: "Arial, sans-serif",

              direction: locale === "ar" ? "rtl" : "ltr",

              textAlign: locale === "ar" ? "right" : "left",
            }}
          >
            {/* Header */}

            <div
              style={{
                borderBottom: "3px solid #007473",

                paddingBottom: "16px",

                marginBottom: "24px",
              }}
            >
              <h1
                style={{
                  fontSize: "24px",

                  fontWeight: "bold",

                  color: "#007473",

                  margin: 0,

                  textAlign: locale === "ar" ? "right" : "left",
                }}
              >
                {t("profile.tables.orders.studentsTable.consentPdf.title")}
              </h1>
            </div>

            {/* Student & Parent Info */}

            <div
              style={{
                display: "grid",

                gridTemplateColumns: "1fr 1fr",

                gap: "16px",

                marginBottom: "24px",

                border: "1px solid #e5e7eb",

                borderRadius: "8px",

                padding: "16px",
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: "12px",

                    color: "#6b7280",

                    margin: "0 0 4px 0",
                  }}
                >
                  {t(
                    "profile.tables.orders.studentsTable.consentPdf.studentName"
                  )}
                </p>

                <p
                  style={{
                    fontSize: "16px",

                    fontWeight: "600",

                    margin: 0,
                  }}
                >
                  {pdfStudent.child?.name || "-"}
                </p>
              </div>

              <div>
                <p
                  style={{
                    fontSize: "12px",

                    color: "#6b7280",

                    margin: "0 0 4px 0",
                  }}
                >
                  {t(
                    "profile.tables.orders.studentsTable.consentPdf.nationalId"
                  )}
                </p>

                <p
                  style={{
                    fontSize: "16px",

                    fontWeight: "600",

                    margin: 0,
                  }}
                >
                  {pdfStudent.child?.nationalId || "-"}
                </p>
              </div>

              <div>
                <p
                  style={{
                    fontSize: "12px",

                    color: "#6b7280",

                    margin: "0 0 4px 0",
                  }}
                >
                  {t(
                    "profile.tables.orders.studentsTable.consentPdf.parentName"
                  )}
                </p>

                <p
                  style={{
                    fontSize: "16px",

                    fontWeight: "600",

                    margin: 0,
                  }}
                >
                  {pdfStudent.parent?.name || "-"}
                </p>
              </div>

              <div>
                <p
                  style={{
                    fontSize: "12px",

                    color: "#6b7280",

                    margin: "0 0 4px 0",
                  }}
                >
                  {t("profile.tables.orders.studentsTable.consentPdf.tripName")}
                </p>

                <p
                  style={{
                    fontSize: "16px",

                    fontWeight: "600",

                    margin: 0,
                  }}
                >
                  {booking?.name || "-"}
                </p>
              </div>

              <div style={{ gridColumn: "1 / -1" }}>
                <p
                  style={{
                    fontSize: "12px",

                    color: "#6b7280",

                    margin: "0 0 4px 0",
                  }}
                >
                  {t(
                    "profile.tables.orders.studentsTable.consentPdf.schoolName"
                  )}
                </p>

                <p
                  style={{
                    fontSize: "16px",

                    fontWeight: "600",

                    margin: 0,
                  }}
                >
                  {booking?.organization?.name || "-"}
                </p>
              </div>
            </div>

            {/* Terms & Conditions */}

            {pdfStudent.parent?.termsAndCondition?.contents?.length > 0 && (
              <div
                style={{
                  border: "1px solid #e5e7eb",

                  borderRadius: "8px",

                  padding: "16px",

                  marginBottom: "24px",
                }}
              >
                <h3
                  style={{
                    fontSize: "18px",

                    fontWeight: "bold",

                    color: "#007473",

                    marginBottom: "16px",

                    marginTop: 0,
                  }}
                >
                  {t(
                    "profile.tables.orders.studentsTable.consentPdf.termsTitle"
                  )}
                </h3>

                {pdfStudent.parent.termsAndCondition.contents.map(
                  (term, index) => (
                    <div key={index} style={{ marginBottom: "12px" }}>
                      <h4
                        style={{
                          fontSize: "14px",

                          fontWeight: "600",

                          margin: "0 0 4px 0",

                          color: "#1f2937",
                        }}
                      >
                        {index + 1}. {term.title}
                      </h4>

                      <p
                        style={{
                          fontSize: "13px",

                          color: "#4b5563",

                          margin: 0,

                          lineHeight: "1.6",

                          textAlign: locale === "ar" ? "right" : "left",
                        }}
                      >
                        {term.content}
                      </p>
                    </div>
                  )
                )}
              </div>
            )}

            {/* Confirmation */}

            {pdfStudent.parent?.termsAccepted && (
              <div
                style={{
                  backgroundColor: "#f0fdf4",

                  border: "1px solid #bbf7d0",

                  borderRadius: "8px",

                  padding: "16px",

                  display: "flex",

                  alignItems: "center",

                  gap: "8px",
                }}
              >
                <span
                  style={{
                    fontSize: "20px",
                  }}
                >
                  ✓
                </span>

                <div>
                  <p
                    style={{
                      fontSize: "14px",

                      fontWeight: "600",

                      color: "#166534",

                      margin: 0,

                      textAlign: locale === "ar" ? "right" : "left",
                    }}
                  >
                    {t(
                      "profile.tables.orders.studentsTable.consentPdf.parentSignature"
                    )}
                  </p>

                  <p
                    style={{
                      fontSize: "13px",

                      color: "#15803d",

                      margin: "4px 0 0 0",

                      textAlign: locale === "ar" ? "right" : "left",
                    }}
                  >
                    {pdfStudent.parent?.name} -{" "}
                    {t(
                      "profile.tables.orders.studentsTable.consentPdf.confirmed"
                    )}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(StudentsTable);

"use client";

import { useLocale, useTranslations } from "next-intl";

import { memo, useState, useMemo, useRef, useCallback } from "react";

import { useSnackbar } from "notistack";

import axios from "axios";

import { CONSTANT_VALUES } from "@constants/constantValues";

import { B2B_END_POINTS } from "@constants/b2bAPIs";

import { getHeaders } from "@utils/helpers/getHeaders";

import getProxyUrl from "@utils/api/getProxyUrl";

import { ExcelService } from "@utils/exports/excelService";

import {
  CardContent,
  Card,
  CircularProgress,
  Button as MuiButton,
  Menu,
  MenuItem,
} from "@mui/material";

import { actionsIcon } from "@assets/svg";
import { getGtmTag, GTM_TAGS } from "@utils/tracking/gtmUtils";
import DataTable from "@components/ui/DataTable";
import ConsentPdfTemplate from "@components/ui/templates/ConsentPdfTemplate";

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

  // PDF consent download state
  const consentRef = useRef(null);
  const [pdfStudent, setPdfStudent] = useState(null);
  const [loadingPdf, setLoadingPdf] = useState({});

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

  // Download consent PDF
  const handleDownloadConsent = useCallback(
    async (student) => {
      const studentId = student._id;
      setLoadingPdf((prev) => ({ ...prev, [studentId]: true }));
      setPdfStudent(student);

      // Wait for the hidden element to render
      await new Promise((resolve) => setTimeout(resolve, 300));

      try {
        const element = consentRef.current;
        if (!element) throw new Error("Consent element not found");

        const html2canvasModule = await import("html2canvas");
        const html2canvas = html2canvasModule.default;
        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: "#ffffff",
        });

        const imgData = canvas.toDataURL("image/png");
        const { default: jsPDF } = await import("jspdf");
        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        let yPosition = 0;
        const pageHeight = pdf.internal.pageSize.getHeight();

        if (pdfHeight > pageHeight) {
          while (yPosition < pdfHeight) {
            pdf.addImage(imgData, "PNG", 0, -yPosition, pdfWidth, pdfHeight);
            yPosition += pageHeight;
            if (yPosition < pdfHeight) {
              pdf.addPage();
            }
          }
        } else {
          pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        }

        pdf.save(`consent-${student.child?.name || "student"}-${locale}.pdf`);

        enqueueSnackbar(
          t("profile.tables.orders.studentsTable.downloadSuccess"),
          { variant: "success" }
        );
      } catch (error) {
        console.error("Error generating consent PDF:", error);
        enqueueSnackbar(
          t("profile.tables.orders.studentsTable.downloadError"),
          { variant: "error" }
        );
      } finally {
        setLoadingPdf((prev) => ({ ...prev, [studentId]: false }));
        setPdfStudent(null);
      }
    },
    [locale, t, enqueueSnackbar]
  );

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
            {...getGtmTag(
              GTM_TAGS.STUDENTS.DOWNLOAD_CONSENT,
              "students",
              student._id
            )}
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

  const columns = useMemo(
    () => [
      {
        key: "studentName",
        label: t("profile.tables.orders.studentsTable.studentName"),
        className: "font-medium text-foreground",
        render: (row) => row.child?.name || "-",
      },
      {
        key: "parentName",
        label: t("profile.tables.orders.studentsTable.parentName"),
        render: (row) => row.parent?.name || "-",
      },
      {
        key: "grade",
        label: t("profile.tables.orders.studentsTable.grade"),
        render: (row) => row.child?.grade?.name || "-",
      },
      {
        key: "parentPhone",
        label: t("profile.tables.orders.studentsTable.parentPhone"),
        className: "text-end",
        render: (row) => <span dir="ltr">{row.parent?.phone || "-"}</span>,
      },
      {
        key: "nationalId",
        label: t("profile.tables.orders.studentsTable.nationalId"),
        render: (row) => row.child?.nationalId || "-",
      },
      {
        key: "confirmation",
        label: t("profile.tables.orders.studentsTable.parentConfirmation"),
        render: (row) =>
          row.parent?.termsAccepted && (
            <span className="px-3 py-1 rounded-full text-xs font-medium text-success bg-status-success-bg">
              {t("profile.tables.orders.studentsTable.agreed")}
            </span>
          ),
      },
    ],
    [t]
  );

  return (
    <div className="w-full space-y-4 mt-8">
      <DataTable
        title={t("profile.tables.orders.studentsTable.title")}
        columns={columns}
        data={paginatedData.data}
        loading={loadingDetails}
        actionsLabel={t("profile.tables.orders.studentsTable.actions")}
        rowActions={(row) => (
          <div className="centered w-full">
            <StudentActionsMenu student={row} />
          </div>
        )}
        pagination={{
          currentPage,
          pageInfo: paginatedData.pageInfo,
          onPageChange: handlePageChange,
        }}
      />

      {/* Hidden PDF Consent Template */}

      {pdfStudent && (
        <ConsentPdfTemplate
          consentRef={consentRef}
          pdfStudent={pdfStudent}
          booking={booking}
          locale={locale}
          t={t}
        />
      )}
    </div>
  );
};

export default memo(StudentsTable);

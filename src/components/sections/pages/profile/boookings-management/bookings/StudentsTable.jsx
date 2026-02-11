"use client";

import { useLocale, useTranslations } from "next-intl";
import { memo, useState, useMemo } from "react";
import { useSnackbar } from "notistack";
import axios from "axios";

import { CONSTANT_VALUES } from "@constants/constantValues";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { getHeaders } from "@utils/getHeaders";
import getProxyUrl from "@utils/getProxyUrl";
import { ExcelService } from "@utils/excelService";
import { CardContent, Card, CircularProgress, Button } from "@mui/material";
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
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          <CheckboxGroup
                            isChecked={student.parent.termsAccepted}
                            disabled={true}
                            fontSize="14px"
                            hoveringAction={false}
                          />
                        </td>
                        <td className="px-6 py-4">
                          <ActionButtons student={student} />
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
                      <CheckboxGroup
                        isChecked={student.parent.termsAccepted}
                        disabled={true}
                        fontSize="14px"
                        hoveringAction={false}
                      />
                    </div>

                    {/* Actions for Mobile */}
                    <div className="pt-3 border-t border-gray-100">
                      <ActionButtons student={student} />
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
    </div>
  );
};

export default memo(StudentsTable);

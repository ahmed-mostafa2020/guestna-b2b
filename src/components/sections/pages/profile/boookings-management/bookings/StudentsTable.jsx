import { useTranslations } from "next-intl";

import { memo, useState, useMemo } from "react";

import { CONSTANT_VALUES } from "@constants/constantValues";
import { CardContent, Card, CircularProgress } from "@mui/material";
import Pagination from "@components/common/Pagination";

const StudentsTable = ({ bookingDetails, loadingDetails }) => {
  const t = useTranslations();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = CONSTANT_VALUES.TABLE_PER_PAGE;

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

    return { data, pageInfo };
  }, [bookingDetails, currentPage, itemsPerPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="w-full space-y-6 mt-8">
      <h3 className="text-lg font-medium pt-2">
        {t("profile.tables.orders.studentsTable.title")}
      </h3>

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
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
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

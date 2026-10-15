"use client";

import { useTranslations } from "next-intl";

import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { PERMISSIONS } from "@constants/permissions";
import ProtectedProfilePage from "@components/ui/ProtectedProfilePage";
import ProfilePageTemplate from "@components/features/profile/ProfilePageTemplate";
import EmptyBookings from "@components/features/profile/myBookings/EmptyBookings";
import DataTableSkeleton from "@components/ui/DataTable/DataTableSkeleton";
import ReportTable from "@components/features/profile/bookings-management/integrated-bookings/ReportTable";

const IntegratedBookingsManagementPage = () => {
  const t = useTranslations();

  return (
    <ProtectedProfilePage
      requiredPermission={PERMISSIONS.PAGE.B2B_PROFILE_INTEGRATED_BOOKINGS_PAGE}
    >
      <ProfilePageTemplate
        title={t("pagesHead.title.integratedBookingsManagement")}
        subTitle={t("profile.tables.reports.subTitle")}
        endpoint={`${B2B_END_POINTS.PROFILE.BOOKINGS_MANAGEMENT.RPORTS}`}
        method="POST"
        skeletonComponent={
          <DataTableSkeleton
            title={t("profile.tables.reports.title")}
            columns={[
              {
                label: t("profile.tables.bookings.header.schoolName"),
                width: 140,
              },
              {
                label: t("profile.tables.bookings.header.tripName"),
                width: 130,
              },
              { label: t("profile.tables.bookings.header.date"), width: 170 },
              {
                label: t("profile.tables.bookings.header.status"),
                width: 90,
                badge: true,
              },
            ]}
            actionsLabel={t("profile.tables.bookings.header.actions")}
            actionsPermissions={[
              PERMISSIONS.ELEMENT.B2B_PROFILE_ACHIENVEMENT_CONFIRMATION,
              PERMISSIONS.ELEMENT.B2B_PROFILE_FINAL_REPORT,
            ]}
            actionWidth={140}
          />
        }
        emptyStateComponent={<EmptyBookings />}
        contentComponent={(
          data,
          currentPage,
          setCurrentPage,
          enablePagination
        ) => (
          <ReportTable
            tableTitle={t("profile.tables.reports.title")}
            data={data}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            enablePagination={enablePagination}
          />
        )}
        enablePagination={true}
      />
    </ProtectedProfilePage>
  );
};

export default IntegratedBookingsManagementPage;

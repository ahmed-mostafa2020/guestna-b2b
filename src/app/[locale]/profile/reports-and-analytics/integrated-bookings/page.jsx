"use client";

import { useTranslations } from "next-intl";

import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { PERMISSIONS } from "@constants/permissions";
import ProtectedProfilePage from "@components/ui/ProtectedProfilePage";
import ProfilePageTemplate from "@components/features/profile/ProfilePageTemplate";
import EmptyBookings from "@components/features/profile/myBookings/EmptyBookings";
import ReportTable from "@components/features/profile/bookings-management/integrated-bookings/ReportTable";

const IntegratedBookingsManagementPage = () => {
  const t = useTranslations();

  return (
    <ProtectedProfilePage requiredPermission={PERMISSIONS.PAGE.B2B_PROFILE_INTEGRATED_BOOKINGS_PAGE}>
      <ProfilePageTemplate
      title={t("pagesHead.title.integratedBookingsManagement")}
      subTitle={t("profile.tables.reports.subTitle")}
      endpoint={`${B2B_END_POINTS.PROFILE.BOOKINGS_MANAGEMENT.RPORTS}`}
      method="POST"
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

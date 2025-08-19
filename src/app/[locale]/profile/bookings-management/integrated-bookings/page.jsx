"use client";

import { useTranslations } from "next-intl";

import { B2B_END_POINTS } from "@constants/b2bAPIs";
import ProfilePageTemplate from "@components/sections/pages/profile/ProfilePageTemplate";
import EmptyBookings from "@components/sections/pages/profile/myBookings/EmptyBookings";
import ReportTable from "@components/sections/pages/profile/boookings-management/integrated-bookings/ReportTable";

const IntegratedBookingsManagementPage = () => {
  const t = useTranslations();

  return (
    <ProfilePageTemplate
      title={t("pagesHead.title.integratedBookingsManagement")}
      tableTitle={t("profile.tables.reports.title")}
      subTitle={t("profile.tables.reports.subTitle")}
      endpoint={`${B2B_END_POINTS.PROFILE.BOOKINGS_MANAGEMENT.RPORTS}`}
      method="POST"
      emptyStateComponent={<EmptyBookings />}
      contentComponent={(data) => <ReportTable data={data} />}
    />
  );
};

export default IntegratedBookingsManagementPage;

import { useTranslations } from "next-intl";
import OrganizationsHeader from "./OrganizationsHeader";
import OrganizationCard from "./OrganizationCard";

import { Card, CircularProgress } from "@mui/material";
import EmptyBookings from "./EmptyBookings";

const OrganizationsSection = ({
  organizationsData,
  organizationsLoading,
  searchTerm,
  setSearchTerm,
}) => {
  const t = useTranslations();
  const schoolsData = organizationsData?.nodes;

  const handleViewDetails = (id) => {
    // Handle view details action
    console.log("View details for organization:", id);
  };

  const rendredSchools = schoolsData?.map((school) => {
    return (
      <OrganizationCard
        key={school._id}
        id={school._id}
        name={school.name}
        city={school.city}
        totalRevenue={school.totalRevenue}
        childsCount={school.childsCount}
        scheduledTrips={school.scheduledTrips}
        doneTrips={school.doneTrips}
        suspendedTrips={school.suspendedTrips}
        onViewDetails={handleViewDetails}
      />
    );
  });

  return (
    <Card
      className="p-4 !rounded-2xl"
      sx={{ boxShadow: "0 0 4px 0 rgba(0, 0, 0, 0.16)" }}
    >
      <OrganizationsHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        tableTitle={t("profile.tables.organizations.title")}
      />
      {/* Loading State */}
      {organizationsLoading ? (
        <div className="w-full min-h-[400px] flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <CircularProgress size={50} sx={{ color: "var(--color-main)" }} />
            <p className="text-sm text-gray-500">{t("common.loading")}</p>
          </div>
        </div>
      ) : organizationsData.nodes.length === 0 ? (
        <EmptyBookings />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">{rendredSchools}</div>
      )}
    </Card>
  );
};

export default OrganizationsSection;

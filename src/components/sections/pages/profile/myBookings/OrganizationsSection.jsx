import { useTranslations } from "next-intl";
import OrganizationsHeader from "./OrganizationsHeader";

import { Card, CircularProgress } from "@mui/material";
import EmptyBookings from "./EmptyBookings";
import SchoolOverviewCard from "../schoolManagementTeam/schoolsOverview/SchoolOverviewCard";
import SchoolOverviewCardSkeleton from "../schoolManagementTeam/schoolsOverview/SchoolOverviewCardSkeleton";

const OrganizationsSection = ({
  organizationsData,
  organizationsLoading,
  searchTerm,
  setSearchTerm,
}) => {
  const t = useTranslations();
  const schoolsData = organizationsData?.nodes;

  const rendredSchools = schoolsData?.map((school) => {
    return <SchoolOverviewCard key={school._id} item={school} />;
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <SchoolOverviewCardSkeleton />
          <SchoolOverviewCardSkeleton />
          <SchoolOverviewCardSkeleton />
        </div>
      ) : organizationsData.nodes.length === 0 ? (
        <EmptyBookings />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {rendredSchools}
        </div>
      )}
    </Card>
  );
};

export default OrganizationsSection;

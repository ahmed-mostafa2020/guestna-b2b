import { memo, useState } from "react";
import { useTranslations } from "next-intl";

import UsersHeader from "./UsersHeader";
import UsersInfo from "./UsersInfo";

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";

const UsersManagement = ({ data, setSearchTerm, searchTerm }) => {
  const t = useTranslations();
  // data is now an array of organizations with users
  const organizations = Array.isArray(data) ? data : [];

  // Set first organization as expanded by default
  const [expanded, setExpanded] = useState(
    organizations.length > 0 ? organizations[0]._id : null
  );

  const handleAccordionChange = (organizationId) => (event, isExpanded) => {
    setExpanded(isExpanded ? organizationId : null);
  };

  if (!organizations.length) {
    return (
      <div className="p-6">
        <UsersHeader setSearchTerm={setSearchTerm} searchTerm={searchTerm} />
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">{t("profile.schools_users.no_users")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 bg-white rounded-2xl shadow-card p-4">
      <UsersHeader setSearchTerm={setSearchTerm} searchTerm={searchTerm} />

      {organizations.map((org) => (
        <Accordion
          key={org._id}
          expanded={expanded === org._id}
          onChange={handleAccordionChange(org._id)}
          className="!rounded-xl !shadow-sm border-2 border-border"
          sx={{
            "&:before": {
              display: "none",
            },
            "&.Mui-expanded": {
              margin: 0,
            },
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMore />}
            className="!rounded-xl border border-border"
            sx={{
              "& .MuiAccordionSummary-content": {
                margin: "16px 0",
              },
              backgroundColor: expanded === org._id ? "#F3F3F3" : "transparent",
              "&:hover": {
                backgroundColor:
                  expanded === org._id ? "#F3F3F3" : "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            <div className="flex flex-col gap-2 pe-4">
              <p className="text-lg font-medium">
                {org.organization?.name ||
                  t("profile.schools_users.unknown_school")}
              </p>
              <p className="text-sm font-light">
                {t("profile.schools_users.users_count", {
                  count: org.users?.length || 0,
                })}
              </p>
            </div>
          </AccordionSummary>

          <AccordionDetails className="pt-0">
            <UsersInfo
              users={org.users || []}
              organization={org.organization?._id || org._id}
              organizationName={org.organization?.name || t("profile.schools_users.unknown_school")}
            />
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
};

export default memo(UsersManagement);

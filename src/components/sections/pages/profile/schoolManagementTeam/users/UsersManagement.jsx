import { memo, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Slide,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";

import UsersHeader from "./UsersHeader";
import UsersInfo from "./UsersInfo";
import UserPermissions from "./UsersPermissions";

const UsersManagement = ({
  data,
  setSearchTerm,
  searchTerm,
  refetchInfo,
  refetchTable,
}) => {
  const t = useTranslations();
  const organizations = Array.isArray(data) ? data : [];

  const [expanded, setExpanded] = useState(
    organizations.length > 0 ? organizations[0]._id : null
  );

  const [selectedUser, setSelectedUser] = useState(null);
  const [showPermissions, setShowPermissions] = useState(false);
  

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setShowPermissions(true);
  };

  const handleAccordionChange = (organizationId) => (event, isExpanded) => {
    setExpanded(isExpanded ? organizationId : null);
    setShowPermissions(isExpanded); // show permissions when org expands
  };

  return (
    <Box display="flex" gap={2}>
      {/* LEFT SIDE */}
      <Box flex={showPermissions ? 0.65 : 1} transition="flex 0.3s ease">
        <Box className="space-y-4 bg-white rounded-2xl shadow-card p-4">
          <UsersHeader setSearchTerm={setSearchTerm} searchTerm={searchTerm} />

          {organizations.map((org) => (
            <Accordion
              key={org._id}
              expanded={expanded === org._id}
              onChange={handleAccordionChange(org._id)}
              className="!rounded-xl !shadow-sm border-2 border-border"
              sx={{
                "&:before": { display: "none" },
                "&.Mui-expanded": { margin: 0 },
              }}
            >
              <AccordionSummary expandIcon={<ExpandMore />}>
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

              <AccordionDetails>
                <UsersInfo
                  editPermission
                  handleSelectUser={handleSelectUser}
                  users={org.users || []}
                  organizationId={org.organization?._id}
                  organizationName={
                    org.organization?.name ||
                    t("profile.schools_users.unknown_school")
                  }
                  refetchInfo={refetchInfo}
                  refetchTable={refetchTable}
                />
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Box>

      {/* RIGHT SIDE (Animated Permissions) */}
      <Slide direction="left" in={showPermissions} mountOnEnter unmountOnExit>
        <Box className="bg-white rounded-2xl shadow-card p-4" flex={0.35}>
          <UserPermissions
            user={selectedUser}
            onClose={() => setShowPermissions(false)}
          />
        </Box>
      </Slide>
    </Box>
  );
};

export default memo(UsersManagement);

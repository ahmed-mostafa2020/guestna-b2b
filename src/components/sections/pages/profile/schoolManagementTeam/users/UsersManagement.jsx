import { memo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Slide,
  Stack,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";

import SearchHeader from "@components/common/SearchHeader";
import UsersInfo from "./UsersInfo";
import UserPermissions from "./UsersPermissions";
import CustomizedModal from "@components/common/customizedModal";

const UsersManagement = ({
  data,
  setSearchTerm,
  searchTerm,
  refetchInfo,
  refetchTable,
}) => {
  const t = useTranslations();
  const locale = useLocale();
  const theme = useTheme();
  const isSmDown = useMediaQuery(theme.breakpoints.down("md"));

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
    setShowPermissions(!isExpanded && false);
  };

  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      spacing={2}
      width="100%"
      height="100%"
      gap={2}
    >
      {/* LEFT SIDE */}
      <Box
        className="bg-white rounded-2xl shadow-card p-4"
        sx={{
          flexBasis: showPermissions && !isSmDown ? "65%" : "100%",
          minWidth: 0,
          transition: "flex-basis 0.5s ease",
        }}
      >
        <SearchHeader
          setSearchTerm={setSearchTerm}
          searchTerm={searchTerm}
          title={t("profile.schools_users.schoolsUsers")}
          placeholder={t("profile.schools_users.search")}
          className="mb-6"
        />

        {organizations.map((org) => (
          <Accordion
            key={org._id}
            expanded={expanded === org._id}
            onChange={handleAccordionChange(org._id)}
            className="!rounded-xl !shadow-sm border-2 border-border my-2"
            sx={{
              "&:before": { display: "none" },
              "&.Mui-expanded": { margin: 0 },
            }}
          >
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box className="flex flex-col gap-1">
                <p className="text-lg font-medium">
                  {org.organization?.name ||
                    t("profile.schools_users.unknown_school")}
                </p>
                <p className="text-sm font-light">
                  {t("profile.schools_users.users_count", {
                    count: org.users?.length || 0,
                  })}
                </p>
              </Box>
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

      {/* RIGHT SIDE */}
      {!isSmDown && (
        <Slide
          direction={locale === "en" ? "left" : "right"}
          in={showPermissions}
          mountOnEnter
          unmountOnExit
          timeout={500}
        >
          <Box
            sx={{
              flexBasis: "35%",
              minWidth: 300,
            }}
            className="bg-white rounded-2xl shadow-card p-4"
          >
            <UserPermissions
              user={selectedUser}
              onClose={() => setShowPermissions(false)}
            />
          </Box>
        </Slide>
      )}

      {/* MOBILE MODAL STYLE */}
      {isSmDown && showPermissions && selectedUser && (
        <CustomizedModal
          open={showPermissions}
          handleClose={setShowPermissions}
          bgcolor="rgba(0, 0, 0, 0.3)"
          customizedCloseButton
        >
          <Box className="bg-white rounded-2xl w-full max-w-md shadow-card p-4 relative">
            <UserPermissions
              user={selectedUser}
              onClose={() => setShowPermissions(false)}
            />
          </Box>
        </CustomizedModal>
      )}
    </Stack>
  );
};

export default memo(UsersManagement);

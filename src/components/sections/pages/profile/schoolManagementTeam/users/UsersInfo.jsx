import { useLocale, useTranslations } from "next-intl";
import { memo, useState } from "react";

import { usePermissions } from "@hooks/usePermissions";
import { PERMISSIONS } from "@constants/permissions";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { getHeaders } from "@utils/getHeaders";
import getProxyUrl from "@utils/getProxyUrl";
import UserCard from "./UserCard";
import CustomizedModal from "@components/common/customizedModal";
import OrganizationUserForm from "@components/forms/newOrganizationUser";
import BulkUserImportForm from "@components/forms/bulkUserImport";
import { CircularProgress, Button, Box } from "@mui/material";
import { CloudUpload, PersonAdd } from "@mui/icons-material";
import axios from "axios";
import { useSnackbar } from "notistack";

const UsersInfo = ({
  users = [],
  organizationId,
  refetchInfo,
  refetchTable,
}) => {
  const { hasElement } = usePermissions();
  const t = useTranslations();
  const locale = useLocale();
  const { enqueueSnackbar } = useSnackbar();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBulkImportModalOpen, setIsBulkImportModalOpen] = useState(false);
  const [isLoadingRoles, setIsLoadingRoles] = useState(false);
  const [rolesData, setRolesData] = useState([]);
  const [cachedOrganization, setCachedOrganization] = useState(null);

  const handleAddUserClick = async () => {
    // Check if roles are already cached for this organization
    if (cachedOrganization === organizationId && rolesData.length > 0) {
      setIsModalOpen(true);
      return;
    }

    setIsLoadingRoles(true);
    const headers = getHeaders(locale);

    try {
      const config = {
        method: "get",
        url: getProxyUrl(
          `${B2B_END_POINTS.PROFILE.SCHOOL_TEAM_MANAGEMENT.USERS.ROLES}/${organizationId}`
        ),
        headers,
      };

      const response = await axios.request(config);
      setRolesData(response.data || []);
      setCachedOrganization(organizationId);
      setIsModalOpen(true);
    } catch (error) {
      enqueueSnackbar(
        error?.response?.data?.message || t("forms.validation.error"),
        { variant: "error" }
      );
    } finally {
      setIsLoadingRoles(false);
    }
  };

  const handleBulkImportClick = async () => {
    
    // Check if roles are already cached for this organization
    if (cachedOrganization === organizationId && rolesData.length > 0) {
      setIsBulkImportModalOpen(true);
      return
    }

    setIsLoadingRoles(true);
    const headers = getHeaders(locale);
    try {
      const config = {
        method: "get",
        url: getProxyUrl(
          `${B2B_END_POINTS.PROFILE.SCHOOL_TEAM_MANAGEMENT.USERS.ROLES}/${organizationId}`
        ),
        headers,
      };

      const response = await axios.request(config);

      
      setRolesData(response.data || []);
      setCachedOrganization(organizationId);
      setIsBulkImportModalOpen(true);
    } catch (error) {
      enqueueSnackbar(
        error?.response?.data?.message || t("forms.validation.error"),
        { variant: "error" }
      );
    } finally {
      setIsLoadingRoles(false);
    }
  };

  if (!users.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-6 p-6">
        <p className="text-gray-500 text-lg">
          {t("profile.schools_users.no_users")}
        </p>
        {hasElement(PERMISSIONS.ELEMENT.B2B_PROFILE_USERS_ADD_USER) && (
          <Box className="flex flex-col sm:flex-row justify-center items-center gap-3">
            <Button
              variant="contained"
              onClick={handleAddUserClick}
              disabled={isLoadingRoles}
              startIcon={
                isLoadingRoles ? (
                  <CircularProgress size={20} sx={{ color: "white" }} />
                ) : (
                  <PersonAdd />
                )
              }
              className="!bg-mainColor hover:!bg-linksHover !text-white !font-somar !font-medium !px-8 !py-2 !rounded-lg !min-w-[180px] disabled:!opacity-50"
            >
              {isLoadingRoles
                ? t("forms.validation.loading")
                : t("profile.schools_users.add_new_user")}
            </Button>

            <Button
              variant="outlined"
              onClick={handleBulkImportClick}
              disabled={isLoadingRoles}
              startIcon={
                isLoadingRoles ? (
                  <CircularProgress size={20} />
                ) : (
                  <CloudUpload />
                )
              }
              className="!border-mainColor !text-mainColor hover:!bg-mainColor/10 !font-somar !font-medium !px-8 !py-2 !rounded-lg !min-w-[180px] disabled:!opacity-50"
            >
              {isLoadingRoles
                ? t("forms.validation.loading")
                : t("profile.schools_users.bulk_import_users", {
                    defaultValue: "Bulk Import Users",
                  })}
            </Button>
          </Box>
        )}
        <CustomizedModal
          open={isModalOpen}
          handleClose={() => setIsModalOpen(false)}
          bgcolor="rgba(0, 0, 0, 0.5)"
          customizedCloseButton={true}
          padding={false}
        >
          <OrganizationUserForm
            handleClose={() => setIsModalOpen(false)}
            organizationId={organizationId}
            rolesData={rolesData}
            refetchInfo={refetchInfo}
            refetchTable={refetchTable}
          />
        </CustomizedModal>

        <CustomizedModal
          open={isBulkImportModalOpen}
          handleClose={() => setIsBulkImportModalOpen(false)}
          bgcolor="rgba(0, 0, 0, 0.5)"
          customizedCloseButton={true}
          padding={false}
        >
          <BulkUserImportForm
            handleClose={() => setIsBulkImportModalOpen(false)}
            organizationId={organizationId}
            rolesData={rolesData}
            existingUsers={users}
            refetchInfo={refetchInfo}
            refetchTable={refetchTable}
          />
        </CustomizedModal>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-3 gap-4 rounded-lg bg-white">
      {users.map((user) => (
        <UserCard key={user._id} user={user} />
      ))}

      {hasElement(PERMISSIONS.ELEMENT.B2B_PROFILE_USERS_ADD_USER) && (
        <Box className="flex flex-col sm:flex-row justify-center items-center gap-3 mt-4">
          <Button
            variant="contained"
            onClick={handleAddUserClick}
            disabled={isLoadingRoles}
            startIcon={
              isLoadingRoles ? (
                <CircularProgress size={20} sx={{ color: "white" }} />
              ) : (
                <PersonAdd className="me-2" />
              )
            }
            className="!bg-mainColor hover:!bg-linksHover !text-white !font-somar !font-medium !px-8 !py-2 !rounded-lg !min-w-[180px] disabled:!opacity-50"
          >
            {isLoadingRoles
              ? t("forms.validation.loading")
              : t("profile.schools_users.add_new_user")}
          </Button>

          <Button
            variant="outlined"
            onClick={handleBulkImportClick}
            disabled={isLoadingRoles}
            startIcon={
              isLoadingRoles ? (
                <CircularProgress className="me-2" size={20} />
              ) : (
                <CloudUpload className="me-2" />
              )
            }
            className="!border-mainColor !text-mainColor hover:!bg-mainColor/10 !font-somar !font-medium !px-8 !py-2 !rounded-lg !min-w-[180px] disabled:!opacity-50"
          >
            {isLoadingRoles
              ? t("forms.validation.loading")
              : t("profile.schools_users.bulk_import_users", {
                  defaultValue: "Bulk Import Users",
                })}
          </Button>
        </Box>
      )}

      <CustomizedModal
        open={isModalOpen}
        handleClose={() => setIsModalOpen(false)}
        bgcolor="rgba(0, 0, 0, 0.5)"
        customizedCloseButton={true}
        padding={false}
      >
        <OrganizationUserForm
          handleClose={() => setIsModalOpen(false)}
          organizationId={organizationId}
          rolesData={rolesData}
          refetchInfo={refetchInfo}
          refetchTable={refetchTable}
        />
      </CustomizedModal>

      <CustomizedModal
        open={isBulkImportModalOpen}
        handleClose={() => setIsBulkImportModalOpen(false)}
        bgcolor="rgba(0, 0, 0, 0.5)"
        customizedCloseButton={true}
        padding={false}
      >
        <BulkUserImportForm
          handleClose={() => setIsBulkImportModalOpen(false)}
          organizationId={organizationId}
          rolesData={rolesData}
          existingUsers={users}
          refetchInfo={refetchInfo}
          refetchTable={refetchTable}
        />
      </CustomizedModal>
    </div>
  );
};

export default memo(UsersInfo);

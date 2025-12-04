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
import { CircularProgress } from "@mui/material";
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

  if (!users.length) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">{t("profile.schools_users.no_users")}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-3 gap-4 rounded-lg bg-white">
      {users.map((user) => (
        <UserCard key={user._id} user={user} />
      ))}

      {hasElement(PERMISSIONS.ELEMENT.B2B_PROFILE_USERS_ADD_USER) && (
        <div className="flex justify-center mt-2">
          <button
            onClick={handleAddUserClick}
            disabled={isLoadingRoles}
            className="bg-mainColor rounded-lg text-white font-medium font-somar hover:bg-linksHover px-8 py-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoadingRoles ? (
              <>
                <CircularProgress size={20} sx={{ color: "white" }} />
                {t("forms.validation.loading")}
              </>
            ) : (
              t("profile.schools_users.add_new_user")
            )}
          </button>
        </div>
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
    </div>
  );
};

export default memo(UsersInfo);

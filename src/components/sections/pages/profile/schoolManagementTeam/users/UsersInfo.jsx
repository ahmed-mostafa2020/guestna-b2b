import { useTranslations } from "next-intl";
import { memo, useState } from "react";

import { usePermissions } from "@hooks/usePermissions";
import { PERMISSIONS } from "@constants/permissions";
import UserCard from "./UserCard";
import CustomizedModal from "@components/common/customizedModal";
import OrganizationUserForm from "@components/forms/newOrganizationUser";

const UsersInfo = ({ users = [], organization }) => {
  const { hasElement } = usePermissions();
  const t = useTranslations();

  const [isModalOpen, setIsModalOpen] = useState(false);

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
            onClick={() => setIsModalOpen(true)}
            className="bg-mainColor rounded-lg text-white font-medium font-somar hover:bg-linksHover px-8 py-2"
          >
            {t("profile.schools_users.add_new_user")}
          </button>
        </div>
      )}

      <CustomizedModal
        open={isModalOpen}
        handleClose={() => setIsModalOpen(false)}
        bgcolor="rgba(0, 0, 0, 0.5)"
        customizedCloseButton={true}
        padding={false}
        // onClose={() => setIsModalOpen(false)}
      >
        <OrganizationUserForm
          handleClose={() => setIsModalOpen(false)}
          organization={organization}
        />
      </CustomizedModal>
    </div>
  );
};

export default memo(UsersInfo);

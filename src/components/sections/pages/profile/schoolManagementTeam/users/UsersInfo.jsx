import { useTranslations } from "next-intl";
import { memo, useState } from "react";

import UserCard from "./UserCard";
import CustomizedModal from "@components/common/customizedModal";
import OrganizationUserForm from "@components/forms/newOrganizationUser";

import { Button } from "@mui/material";

const UsersInfo = ({ users = [], organization }) => {
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
    <div className="flex flex-col border border-border p-3 gap-4 rounded-lg bg-white">
      {users.map((user) => (
        <UserCard key={user._id} user={user} />
      ))}

      <div className="flex justify-center mt-2">
        <Button
          onClick={() => setIsModalOpen(true)}
          variant="contained"
          className="!bg-mainColor !text-white font-medium !font-somar hover:!bg-linksHover !px-8 !py-2"
        >
          {t("profile.schools_users.add_new_user")}
        </Button>
      </div>

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

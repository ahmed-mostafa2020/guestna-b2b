import { memo, useState } from "react";
import { Button } from "@mui/material";
import UserCard from "./UserCard";
import { useTranslations } from "next-intl";
import CustomizedModal from "@/src/components/common/customizedModal";
import OrganizationUserForm from "@/src/components/forms/newOrganizationUser";

const UsersInfo = ({ users = [], organization }) => {
  const t = useTranslations();

  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!users.length) {
    return null;
  }

  return (
    <div className="flex flex-col border border-border p-2 gap-4 rounded-lg bg-white">
      {users.map((user) => (
        <UserCard key={user._id} user={user} />
      ))}

      <div className="flex justify-center mt-2">
        <Button
          onClick={() => setIsModalOpen(true)}
          variant="contained"
          className="!bg-mainColor !text-white font-medium hover:!bg-linksHover text-white font-bold"
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

import { memo } from "react";
import { Typography, Box, Button } from "@mui/material";
import { PersonOutline, Add } from "@mui/icons-material";
import UserCard from "./UserCard";
import { useTranslations } from "next-intl";

const UsersInfo = ({ users = [] }) => {
  const t = useTranslations();

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
          variant="contained"
          className="!bg-mainColor !text-white font-medium hover:!bg-linksHover text-white font-bold"
        >
          {t("profile.schools_users.add_new_user")}
        </Button>
      </div>
    </div>
  );
};

export default memo(UsersInfo);

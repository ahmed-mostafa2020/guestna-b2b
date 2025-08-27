import { Card, CardContent, Chip } from "@mui/material";
import { memo } from "react";
import Image from "next/image";
import schoolProfileImage from "@assets/schoolProfile.png";
import { useTranslations } from "next-intl";

const UserCard = ({ user }) => {
  const t = useTranslations();

  return (
    <Card className="hover:shadow-card transition-shadow duration-300 border border-border rounded-lg">
      <CardContent className="p-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src={user.image || schoolProfileImage}
              alt="image"
              height={72}
              width={100}
              priority={true}
              className="w-20 h-15 rounded-md"
            />
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-textDark truncate">
                {user.name}
              </h3>
              <p className="text-xs text-textLight truncate">{user.email}</p>
              <Chip
                label={t(`common.usersType.${user.userType}`)}
                size="small"
                className="text-xs !bg-[#e9e1ff] !text-textDark"
              />
            </div>
          </div>
          <div className="flex gap-3 text-sm text-textDark">
            <button className="hover:text-error ">
              {t("profile.schools_users.delete")}
            </button>
            <button className="hover:text-success">
              {t("profile.schools_users.copy")}
            </button>
            <button className="hover:text-mainColor">
              {t("profile.schools_users.edit")}
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default memo(UserCard);

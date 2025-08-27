import { Card, CardContent, Chip } from "@mui/material";
import { memo } from "react";
import Image from "next/image";
import schoolProfileImage from "@assets/schoolProfile.png";
import { useTranslations } from "next-intl";

const UserCard = ({ user }) => {
  const t = useTranslations();

  return (
    <Card className="hover:shadow-card transition-shadow duration-300 border border-border rounded-lg">
      <CardContent className="p-2 sm:p-3">
        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src={user.image || schoolProfileImage}
              alt="image"
              height={72}
              width={100}
              priority={true}
              className="w-20 h-15 rounded-md object-cover"
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
          <div className="flex gap-3 text-sm text-textDark flex-shrink-0">
            <button className="hover:text-error transition-colors duration-200">
              {t("profile.schools_users.delete")}
            </button>
            <button className="hover:text-success transition-colors duration-200">
              {t("profile.schools_users.copy")}
            </button>
            <button className="hover:text-mainColor transition-colors duration-200">
              {t("profile.schools_users.edit")}
            </button>
          </div>
        </div>

        {/* Mobile/Tablet Layout */}
        <div className="md:hidden">
          <div className="flex items-center gap-2 sm:gap-3 mb-3">
            <div className="flex-shrink-0">
              <Image
                src={user.image || schoolProfileImage}
                alt="image"
                height={72}
                width={100}
                priority={true}
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-md object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xs sm:text-sm font-medium text-textDark truncate mb-1">
                {user.name}
              </h3>
              <p className="text-[10px] sm:text-xs text-textLight truncate mb-2">
                {user.email}
              </p>
              <Chip
                label={t(`common.usersType.${user.userType}`)}
                size="small"
                className="text-xs !bg-[#e9e1ff] !text-textDark"
              />
            </div>
          </div>
          
          {/* Actions below user info on mobile */}
          <div className="flex gap-2 sm:gap-4 text-xs text-textDark justify-start flex-wrap">
            <button className="hover:text-error transition-colors duration-200">
              {t("profile.schools_users.delete")}
            </button>
            <button className="hover:text-success transition-colors duration-200">
              {t("profile.schools_users.copy")}
            </button>
            <button className="hover:text-mainColor transition-colors duration-200">
              {t("profile.schools_users.edit")}
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default memo(UserCard);
import Image from "next/image";
import { useTranslations } from "next-intl";
import { memo } from "react";

import { usePermissions } from "@hooks/usePermissions";
import { PERMISSIONS } from "@constants/permissions";

import profilePlaceholderImage from "@assets/profilePlaceholderImage.png";
import { Card, CardContent, Chip } from "@mui/material";

const UserCard = ({ user }) => {
  const { hasElement } = usePermissions();
  const t = useTranslations();

  return (
    <Card className="border border-border !rounded-lg !shadow-none">
      <CardContent className="p-2 sm:p-3">
        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src={user.image || profilePlaceholderImage}
              alt="userImage"
              height={72}
              width={100}
              priority={true}
              className="w-20 h-15 rounded-md object-cover"
            />
            <div className="flex flex-col flex-1 min-w-0 gap-2">
              <h3 className="text-sm font-medium text-textDark truncate">
                {user.name}
              </h3>
              <p className="text-xs text-textLight truncate">{user.email}</p>
              <Chip
                label={user.role.description}
                size="small"
                className="text-xs !bg-[#e9e1ff] !text-black w-fit !font-somar"
              />
            </div>
          </div>
          <div className="flex gap-3 text-sm font-ibm text-textDark flex-shrink-0">
            {hasElement(PERMISSIONS.ELEMENT.B2B_PROFILE_USERS_DELETE) && (
              <button className="hover:text-error transition-colors duration-200">
                {t("profile.schools_users.delete")}
              </button>
            )}

            {hasElement(
              PERMISSIONS.ELEMENT.B2B_PROFILE_USERS_EDIT_PERMISSIONS
            ) && (
              <button className="hover:text-mainColor transition-colors duration-200">
                {t("profile.schools_users.edit")}
              </button>
            )}
          </div>
        </div>

        {/* Mobile/Tablet Layout */}
        <div className="md:hidden">
          <div className="flex items-center gap-2 sm:gap-3 mb-3">
            <div className="flex-shrink-0">
              <Image
                src={user.image || profilePlaceholderImage}
                alt="userImage"
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
                label={user.role.description}
                size="small"
                className="text-xs !bg-[#e9e1ff] !text-black !font-somar"
              />
            </div>
          </div>

          {/* Actions below user info on mobile */}
          <div className="flex gap-2 sm:gap-4 text-xs font-ibm text-textDark justify-start flex-wrap">
            {hasElement(PERMISSIONS.ELEMENT.B2B_PROFILE_USERS_DELETE) && (
              <button className="hover:text-error transition-colors duration-200">
                {t("profile.schools_users.delete")}
              </button>
            )}

            {hasElement(
              PERMISSIONS.ELEMENT.B2B_PROFILE_USERS_EDIT_PERMISSIONS
            ) && (
              <button className="hover:text-mainColor transition-colors duration-200">
                {t("profile.schools_users.edit")}
              </button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default memo(UserCard);

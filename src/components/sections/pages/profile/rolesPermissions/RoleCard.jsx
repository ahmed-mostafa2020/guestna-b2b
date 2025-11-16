"use client";

import { useTranslations } from "next-intl";
import {
  People as PeopleIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";

const RoleCard = ({ role, isSelected, onClick }) => {
  const t = useTranslations();

  return (
    <button
      onClick={onClick}
      className={`
        relative p-6 rounded-xl border-2 transition-all duration-200
        hover:shadow-md cursor-pointer text-start w-full
        ${
          isSelected
            ? "border-mainColor bg-white"
            : "border-border bg-transparent"
        }
      `}
    >
      {/* Selected Indicator */}
      {isSelected && (
        <div className="absolute top-3 end-3">
          <CheckCircleIcon className="w-6 h-6 text-mainColor" />
        </div>
      )}

      {/* Role Name */}
      <h3 className="text-lg font-semibold pb-2">{t(role.description)}</h3>

      {/* Role Description */}
      <p className="text-sm text-textLight pb-4 line-clamp-2">
        {t(role.summary)}
      </p>

      {/* User Count */}
      <div className="flex items-center gap-2 text-sm text-textLight">
        <PeopleIcon className="w-4 h-4" />
        <span>
          {role.userCount} {t("profile.rolesPermissions.users")}
        </span>
      </div>
    </button>
  );
};

export default RoleCard;

import Image from "next/image";
import { memo } from "react";
import { useTranslations } from "next-intl";

import {
  Card,
  CardContent,
  Chip,
  Box,
  Typography,
  Stack,
  Button,
} from "@mui/material";

import profilePlaceholderImage from "@assets/profilePlaceholderImage.jpg";
import { usePermissions } from "@hooks/usePermissions";
import { PERMISSIONS } from "@constants/permissions";

const UserCard = ({ user, onEdit, onDelete, editPermission = false }) => {
  const t = useTranslations();
  const { hasElement } = usePermissions();

  const ActionButton = ({ onClick, label, colorClass }) => (
    <button
      onClick={onClick}
      className={`  hover:!text-error !font-ibm !text-black !font-medium !leading-5 tracking-tight
         ${colorClass}`}
    >
      {label}
    </button>
  );

  return (
    <Card className="border border-border !rounded-lg !shadow-none">
      <CardContent className="p-3">
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={{ xs: 1, md: 4 }}
          alignItems={{ xs: "flex-start", md: "center" }}
          justifyContent="space-between"
        >
          {/* User Info */}
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            flex={1}
            minWidth={0}
          >
            <Image
              src={user.image || profilePlaceholderImage}
              width={64}
              height={64}
              alt="user"
              className="rounded-md object-cover w-16 h-16 md:w-20 md:h-20"
            />

            <Stack direction="column" spacing={0.5} minWidth={0} flex={1}>
              <Typography className="!font-medium !font-somar !text-base !truncate !tracking-tight text-textDark">
                {user.name}
              </Typography>
              <Typography className="!text-sm !truncate !font-somar !opacity-80 !text-textLight">
                {user.email}
              </Typography>

              <Chip
                size="small"
                label={user.role?.description || user.role}
                className="!bg-[#e9e1ff] !text-black !font-somar w-fit !text-xs mt-1"
              />
            </Stack>
          </Stack>

          {/* Actions */}
          <Stack className="items-center gap-4 !flex-row  justify-center">
            {hasElement(
              PERMISSIONS.ELEMENT.B2B_PROFILE_USERS_EDIT_PERMISSIONS
            ) && (
              <ActionButton
                onClick={onEdit}
                label={
                  editPermission
                    ? t("profile.rolesPermissions.actions.edit_permissions")
                    : t("profile.schools_users.edit")
                }
                colorClass="hover:!text-mainColor text-black"
              />
            )}

            {hasElement(PERMISSIONS.ELEMENT.B2B_PROFILE_USERS_DELETE) && (
              <ActionButton
                onClick={onDelete}
                label={t("profile.schools_users.delete.title")}
                colorClass="hover:!text-error text-black"
              />
            )}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default memo(UserCard);

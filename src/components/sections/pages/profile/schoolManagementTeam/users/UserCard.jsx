import Image from "next/image";
import { memo } from "react";
import { useTranslations } from "next-intl";

import {
  Card,
  CardContent,
  Chip,
  Box,
  Typography,
  Button,
} from "@mui/material";

import profilePlaceholderImage from "@assets/profilePlaceholderImage.jpg";
import { usePermissions } from "@hooks/usePermissions";
import { PERMISSIONS } from "@constants/permissions";

const UserCard = ({ user, onEdit, onDelete }) => {
  const t = useTranslations();
  const { hasElement } = usePermissions();

  return (
    <Card className="!shadow-none border border-border !rounded-lg">
      <CardContent className="p-3">
        {/* Desktop */}
        <Box className="hidden md:flex items-center justify-between gap-4">
          <Box className="flex items-center gap-3 min-w-0">
            <Image
              src={user.image || profilePlaceholderImage}
              width={72}
              height={72}
              alt="user"
              className="rounded-md object-cover w-20 h-20"
            />

            <Box className="min-w-0 flex flex-col items-start gap-2">
              <Typography
                variant="body1"
                className=" !font-medium !font-somar !truncate !tracking-tight
"
              >
                {user.name}
              </Typography>
              <Typography
                variant="body2"
                className="!text-sm !font-semibold !opacity-80 !text-[#202224] !truncate !leading-4"
              >
                {user.email}
              </Typography>

              <Chip
                size="small"
                label={user.role?.description}
                className="!bg-[#e9e1ff] !text-black !font-somar mt-1 !text-xs"
              />
            </Box>
          </Box>

          <Box className="flex items-center gap-2 shrink-0">
            {hasElement(PERMISSIONS.ELEMENT.B2B_PROFILE_USERS_DELETE) && (
              <Button
                sx={{
                  fontSize: "16px",
                }}
                onClick={onDelete}
                className="hover:!text-error !font-ibm !text-black !font-medium !leading-5 tracking-tight
                "
              >
                {t("profile.schools_users.delete.title")}
              </Button>
            )}
            {hasElement(
              PERMISSIONS.ELEMENT.B2B_PROFILE_USERS_EDIT_PERMISSIONS
            ) && (
              <Button
                onClick={onEdit}
                sx={{
                  fontSize: "16px",
                }}
                className="hover:!text-mainColor !font-ibm !text-black !font-medium !leading-5 tracking-tight
                "
              >
                {t("profile.schools_users.edit")}
              </Button>
            )}
          </Box>
        </Box>

        {/* Mobile */}
        <Box className="flex md:hidden items-start gap-3">
          <Image
            src={user.image || profilePlaceholderImage}
            width={64}
            height={64}
            alt="user"
            className="rounded-md object-cover w-16 h-16"
          />

          <Box className="flex-1 min-w-0">
            <Typography className="text-sm font-medium text-textDark truncate">
              {user.name}
            </Typography>
            <Typography className="text-xs text-textLight truncate mb-1">
              {user.email}
            </Typography>

            <Chip
              size="small"
              label={user.role?.description || user.role}
              className="!bg-[#e9e1ff] !text-black !font-somar mb-2"
            />

            <Box className="flex items-center gap-3 mt-1">
              {hasElement(
                PERMISSIONS.ELEMENT.B2B_PROFILE_USERS_EDIT_PERMISSIONS
              ) && (
                <Button
                  onClick={onEdit}
                  className="hover:!text-mainColor !font-ibm !text-black !font-medium !leading-5 tracking-tight
                  "
                >
                  {t("profile.schools_users.edit")}
                </Button>
              )}

              {hasElement(PERMISSIONS.ELEMENT.B2B_PROFILE_USERS_DELETE) && (
                <Button
                  onClick={onDelete}
                  className="hover:!text-error !font-ibm !text-black !font-medium !leading-5 tracking-tight
                  "
                >
                  {t("profile.schools_users.delete.title")}
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default memo(UserCard);

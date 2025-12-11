import { usersHeaders } from "@/src/constants/excelHeaders";
import { useExcel } from "@/src/hooks/useExcel";
import { Box, Button } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
const ExportUsersExcel = ({ users }) => {
  const locale = useLocale();
  const t = useTranslations();

  const { exportRecords } = useExcel({ headers: usersHeaders() });

  const downloadExcelJS = async () => {
    const exportedUsers = users.map((user) => ({
      ...user,
      role: user.role.description,
    }));
    console.log(exportedUsers);
    return await exportRecords(
      exportedUsers,
      locale === "ar" ? "المستخدمين-الحاليين" : "current-users"
    );
  };
  return (
    <Button
      onClick={downloadExcelJS}
      variant="contained"
      className="!text-white !font-somar !bg-mainColor px-4 py-2 mb-3"
    >
      {t("profile.schools_users.bulkImport.buttons.downloadCurrentUsers")}
    </Button>
  );
};

const FooterActions = ({
  isSubmitting,
  onSubmit,
  onClose,
  usersCount,
  hasValidUsers,
  existingUsers,
}) => {
  const t = useTranslations();
  return (
    <Box className="flex justify-end gap-4 px-8 py-4 ">
      <Button
        variant="outlined"
        className="!border-mainColor !text-mainColor    !font-somar"
        onClick={onClose}
      >
        {t("profile.schools_users.bulkImport.buttons.cancel")}
      </Button>

      <Button
        variant="contained"
        className="!bg-mainColor !text-white !font-somar px-4 py-2 disabled:!bg-gray-400"
        disabled={!hasValidUsers || isSubmitting || !usersCount}
        onClick={onSubmit}
      >
        {isSubmitting
          ? t("profile.schools_users.bulkImport.buttons.isSubmitting")
          : t("profile.schools_users.bulkImport.submit", { count: usersCount })}
      </Button>

      {/* 📌 زر تحميل المستخدمين الحاليين */}
      <ExportUsersExcel users={existingUsers} />
    </Box>
  );
};

export default FooterActions;

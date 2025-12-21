import { usersHeaders } from "@constants/excelHeaders";
import { useExcel } from "@hooks/useExcel";
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
    <button
      onClick={downloadExcelJS}
      className="flex  items-center justify-center gap-2.5 py-4 px-6 font-bold text-white rounded-lg bg-mainColor hover:bg-linksHover"
    >
      {t("profile.schools_users.bulkImport.buttons.downloadCurrentUsers")}
    </button>
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
      <button
        className="flex  items-center justify-center gap-2.5 py-4 px-6 font-bold text-mainColor rounded-lg border-2 border-mainColor hover:border-linksHover  hover:text-linksHover"
        onClick={onClose}
      >
        {t("profile.schools_users.bulkImport.buttons.cancel")}
      </button>

      <button
        className="flex items-center justify-center gap-2.5 py-4 px-6 font-bold text-white rounded-lg bg-mainColor hover:bg-linksHover disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!hasValidUsers || isSubmitting || !usersCount}
        onClick={onSubmit}
      >
        {isSubmitting
          ? t("profile.schools_users.bulkImport.buttons.isSubmitting")
          : t("profile.schools_users.bulkImport.submit", { count: usersCount })}
      </button>

      {/* 📌 زر تحميل المستخدمين الحاليين */}
      <ExportUsersExcel users={existingUsers} />
    </Box>
  );
};

export default FooterActions;

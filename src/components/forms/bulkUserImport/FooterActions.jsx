import { USER_HEADERS } from "@/src/constants/excelHeaders";
import { download } from "@/src/hooks/useDownload";
import { Box, Button } from "@mui/material";
import ExcelJS from "exceljs";
import { useLocale, useTranslations } from "next-intl";
const ExportUsersExcel = ({ users }) => {

  const locale = useLocale();
  const t=useTranslations()

  const downloadExcelJS = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Users");

    // 1. Set columns dynamically from USER_HEADERS
    worksheet.columns = USER_HEADERS.map((header) => ({
      header: header.label[locale] || header.label.en,
      key: header.key,
      width: header.width,
    }));

    // 2. Add rows
    users.forEach((user) => {
      worksheet.addRow({
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role?.description || user.role,
      });
    });

    // 3. Style header row
    worksheet.getRow(1).font = { bold: true };

    // 4. Generate buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // 5. Create Blob
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    
    await download(blob, "current-users.xlsx");
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
  const t=useTranslations()
  return (
    <Box className="flex justify-end gap-4 px-8 py-4 border-t border-border">
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
        {isSubmitting ? t("profile.schools_users.bulkImport.buttons.isSubmitting") : t("profile.schools_users.bulkImport.submit",{count:usersCount}) }
      </Button>

      {/* 📌 زر تحميل المستخدمين الحاليين */}
      <ExportUsersExcel users={existingUsers} />
    </Box>
  );
};

export default FooterActions;

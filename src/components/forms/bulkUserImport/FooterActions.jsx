import { Box, Button } from "@mui/material";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

const ExportUsersExcel = ({ users }) => {
  const downloadExcel = () => {
    const formattedUsers = users.map((user) => ({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role?.description,
    }));
    const worksheet = XLSX.utils.json_to_sheet(formattedUsers);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const fileData = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(fileData, "current-users.xlsx");
  };

  return (
    <Button
      onClick={downloadExcel}
      variant="contained"
      color="primary"
      className="!bg-primary mainBtn px-4 py-2 mb-3"
    >
      تحميل المستخدمين الحاليين
    </Button>
  );
};

const FooterActions = ({
  t,
  isSubmitting,
  onSubmit,
  onClose,
  usersCount,
  hasValidUsers,
  existingUsers,
}) => {
  return (
    <Box className="flex justify-end gap-4 px-8 py-4 border-t border-border">
      <Button variant="outlined" onClick={onClose}>
        Cancel
      </Button>

      <Button
        variant="contained"
        disabled={!hasValidUsers || isSubmitting}
        onClick={onSubmit}
      >
        {isSubmitting ? "Submitting..." : `Import ${usersCount} Users`}
      </Button>

      {/* 📌 زر تحميل المستخدمين الحاليين */}
      <ExportUsersExcel users={existingUsers} />
    </Box>
  );
};

export default FooterActions;

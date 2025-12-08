import { uploadFile } from "@/src/assets/svg";
import { Alert, Box, Button, List, ListItem, Typography } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import ExcelJS from "exceljs";
import { useState } from "react";
import { download } from "@/src/hooks/useDownload";
import { USER_HEADERS } from "@/src/constants/excelHeaders";


const UploadInstructions = ({
  fileError,
  duplicateCount,
  isSubmitting,
  onUpload,
  roleOptions,
}) => {
  const t = useTranslations();
  const [loading, setLoading] = useState(false);
  const locale = useLocale();

  const generateAndDownloadExcel = async () => {
    setLoading(true);

    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("المستخدمين");

    

      worksheet.columns = USER_HEADERS.map((header) => ({
        header: header.label[locale],
        key: header.key,
        width: header.width,
      }));

      // تنسيق صف العناوين
      worksheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FF1F4E79" },
        };
        cell.alignment = { horizontal: "center", vertical: "middle" };
      });

      // إضافة 300 صف فارغ
      for (let i = 2; i <= 301; i++) {
        worksheet.addRow(["", "", "", ""]);
      }

      // إضافة Data Validation لجميع الأعمدة
      for (let i = 2; i <= 301; i++) {
        // التحقق من عمود الاسم (A) - يجب أن يكون نص بطول معين
        const nameCell = worksheet.getCell(`A${i}`);
        nameCell.dataValidation = {
          type: "textLength",
          allowBlank: true,
          operator: "between",
          formulae: [2, 100],
          showErrorMessage: true,
          errorStyle: "error",
          errorTitle: "خطأ في الاسم",
          error: "يجب أن يكون الاسم بين 2 و 100 حرف",
          showInputMessage: true,
          promptTitle: "الاسم",
          prompt: "أدخل الاسم الكامل (2-100 حرف)",
        };

        // التحقق من عمود البريد الإلكتروني (B) - يجب أن يحتوي على @ و .
        const emailCell = worksheet.getCell(`B${i}`);
        emailCell.dataValidation = {
          type: "custom",
          allowBlank: true,
          formulae: [
            `AND(ISNUMBER(FIND("@",B${i})),ISNUMBER(FIND(".",B${i})),LEN(B${i})>=5)`,
          ],
          showErrorMessage: true,
          errorStyle: "error",
          errorTitle: "خطأ في البريد الإلكتروني",
          error: "يرجى إدخال بريد إلكتروني صحيح (مثال: example@domain.com)",
          showInputMessage: true,
          promptTitle: "البريد الإلكتروني",
          prompt: "أدخل البريد الإلكتروني بالصيغة الصحيحة",
        };

        // التحقق من عمود رقم الجوال (C) - يجب أن يكون رقم بطول معين
        const phoneCell = worksheet.getCell(`C${i}`);
        phoneCell.dataValidation = {
          type: "textLength",
          allowBlank: true,
          operator: "between",
          formulae: [9, 15],
          showErrorMessage: true,
          errorStyle: "error",
          errorTitle: "خطأ في رقم الجوال",
          error: "يجب أن يكون رقم الجوال بين 9 و 15 رقم",
          showInputMessage: true,
          promptTitle: "رقم الجوال",
          prompt: "أدخل رقم الجوال (9-15 رقم)",
        };

        // التحقق من عمود الدور (D) - قائمة منسدلة
        const roleCell = worksheet.getCell(`D${i}`);
        roleCell.dataValidation = {
          type: "list",
          allowBlank: true,
          formulae: [`"${roleOptions.join(",")}"`],
          showErrorMessage: true,
          errorStyle: "error",
          errorTitle: "قيمة غير صحيحة",
          error: "يرجى اختيار دور من القائمة المنسدلة",
          showInputMessage: true,
          promptTitle: "الدور",
          prompt: "اختر الدور من القائمة المنسدلة",
        };
      }

      // تحويل الملف إلى Buffer
      const buffer = await workbook.xlsx.writeBuffer();

      // إنشاء Blob وتحميل الملف
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      await download(blob, "بيانات_المستخدمين_مع_قائمة_دور.xlsx");
    } catch (err) {
      console.error(err);
      alert("فشل في إنشاء الملف");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="p-6 border-b border-border flex flex-col gap-4 ">
      <Typography className="!text-xl !font-somar flex items-center gap-2 text-titleColor">
        {t("profile.schools_users.bulkImport.title")}
      </Typography>

      <Box className="border-2 border-dashed border-border gap-8 rounded-lg flex flex-col items-center justify-center p-10 mb-4 ">
        <Box className="flex flex-col items-center">
          <span className="!text-7xl text-[#838383]">{uploadFile}</span>
          <Typography className="mt-2 text-gray-600 !text-4xl !font-semibold !font-somar">
            {t("profile.schools_users.bulkImport.uploadBox.placeholder")}
          </Typography>
        </Box>
        <input
          className="hidden"
          type="file"
          id="bulk-upload-file"
          accept=".xlsx,.xls,.csv"
          onChange={onUpload}
          disabled={isSubmitting}
          // onChange={onFileUpload}
        />

        <Box className="flex gap-4 justify-start">
          <Button
            onClick={generateAndDownloadExcel}
            variant="contained"
            className="!bg-mainColor !font-somar !text-white text-xl px-8 py-3"
            // onClick={onDownloadTemplate}
          >
            {t("profile.schools_users.bulkImport.buttons.downloadTemplate")}
          </Button>
          <Button
            variant="outlined"
            className="!border-mainColor !font-somar !text-mainColor text-xl px-8 py-3"
            onClick={() => document.getElementById("bulk-upload-file").click()}
          >
            {t("profile.schools_users.bulkImport.buttons.uploadFilled")}
          </Button>
        </Box>
      </Box>

      {fileError && <Alert severity="error">{fileError}</Alert>}

      {duplicateCount > 0 && (
        <Alert severity="info">
          {duplicateCount} user(s) already exist and will be overwritten
        </Alert>
      )}

      <List className="flex flex-col gap-2 p-0 m-0">
        {Array.from({ length: 7 }, (_, index) => (
          <ListItem
            key={index}
            className="
        !p-0 
        flex items-start 
        rounded-lg 
        px-3 py-2
      "
          >
            {/* Number bubble */}
            <div
              className="
          w-7 h-7 flex items-center justify-center 
          rounded-full 
          text-sm font-semibold
        "
            >
              {index + 1}.
            </div>

            {/* Step text */}
            <span className=" font-semibold leading-6 text-[15px]">
              {t(`profile.schools_users.bulkImport.steps.${index + 1}`)}
            </span>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default UploadInstructions;

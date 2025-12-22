// hooks/useExcelManager.js
import { useLocale } from "next-intl";
import { ExcelService } from "../utils/excelService";
import { download } from "@hooks/useDownload";

export const useExcel = ({ headers = [] }) => {
  const locale = useLocale();

  // -------------------------------
  // 1️⃣ إنشاء Template جاهز للتعبئة
  // -------------------------------
  const createTemplate = async (fileName = "template.xlsx") => {
    const buffer = await ExcelService.generateTemplate({ headers, locale });
    download(
      new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      fileName
    );
  };

  // -------------------------------
  // 2️⃣ قراءة ملف Excel وتحويله لبيانات
  // -------------------------------
  const parseFile = async (file) => {
    return await ExcelService.parseExcelFile({ file, headers, locale });
  };

  // -------------------------------
  // 3️⃣ تصدير أي بيانات من التطبيق
  // -------------------------------
  const exportRecords = async (records, fileName = "records.xlsx") => {
    const buffer = await ExcelService.exportRecords({
      headers,
      records,
      locale,
    });
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    console.log(blob, fileName);
    await download(blob, fileName);
  };

  return {
    createTemplate,
    parseFile,
    exportRecords,
  };
};

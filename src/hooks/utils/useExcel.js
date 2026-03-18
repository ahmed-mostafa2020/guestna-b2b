import { useState, useCallback } from "react";
import { useSnackbar } from "notistack";
import { ExcelService } from "../utils/exports/excelService";
import { download } from "@hooks/utils/useDownload";

export const useExcel = ({ headers = [], t, locale = "ar" }) => {
  const { enqueueSnackbar } = useSnackbar();

  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState(null);

  // Generic wrapper for async operations with state and notifications
  const withExportState = useCallback(
    async (operation, successMessage) => {
      setIsExporting(true);
      setError(null);
      try {
        const result = await operation();

        if (result && result.success) {
          if (successMessage) {
            enqueueSnackbar(successMessage, { variant: "success" });
          }
        } else if (result && result.error) {
          throw new Error(result.error);
        }
        return result;
      } catch (err) {
        console.error("Excel Operation Error:", err);
        setError(err.message);
        enqueueSnackbar(err.message || t("common.error.generic"), {
          variant: "error",
        });
        return { success: false, error: err.message };
      } finally {
        setIsExporting(false);
      }
    },
    [enqueueSnackbar, t]
  );

  // 1. Create Template
  const createTemplate = useCallback(
    async (fileName = "template.xlsx") => {
      return withExportState(async () => {
        const buffer = await ExcelService.generateTemplate({ headers, locale });
        download(
          new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          }),
          fileName
        );
        return { success: true };
      });
    },
    [headers, locale, withExportState]
  );

  // 2. Parse File (Parse usually doesn't need download state but might need error handling)
  const parseFile = useCallback(
    async (file) => {
      // We don't necessarily wrap parseFile in isExporting, but we could add a separate isLoading if needed.
      // For now, let's keep it simple or wrap it if it takes time.
      try {
        return await ExcelService.parseExcelFile({ file, headers, locale });
      } catch (err) {
        console.error("Parse Error:", err);
        enqueueSnackbar(t("common.excel_error.parse"), { variant: "error" });
        return { success: false, error: err.message };
      }
    },
    [headers, locale, enqueueSnackbar, t]
  );

  // 3. Export Records
  const exportRecords = useCallback(
    async (records, fileName = "records.xlsx") => {
      return withExportState(async () => {
        const buffer = await ExcelService.exportRecords({
          headers,
          records,
          locale,
        });
        const blob = new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        await download(blob, fileName);
        return { success: true };
      }, t("common.excel_success.export"));
    },
    [headers, locale, withExportState, t]
  );

  // 4. Special Exports
  const exportMyBooking = useCallback(
    async (params) => {
      return withExportState(async () => {
        return await ExcelService.exportMyBooking(params);
      }, t("common.excel_success.export")); // Or null if we don't want a generic success message
    },
    [withExportState, t]
  );

  const exportStudentsList = useCallback(
    async (params) => {
      return withExportState(async () => {
        return await ExcelService.exportStudentsList(params);
      }, t("common.excel_success.export"));
    },
    [withExportState, t]
  );

  const exportBookingManagement = useCallback(
    async (params) => {
      return withExportState(async () => {
        return await ExcelService.exportBookingManagement(params);
      }, t("common.excel_success.export"));
    },
    [withExportState, t]
  );

  const exportStudentDetails = useCallback(
    async (params) => {
      return withExportState(async () => {
        return await ExcelService.exportStudentDetails(params);
      }, t("common.excel_success.export"));
    },
    [withExportState, t]
  );

  return {
    isExporting,
    error,
    createTemplate,
    parseFile,
    exportRecords,
    exportMyBooking,
    exportStudentsList,
    exportBookingManagement,
    exportStudentDetails,
  };
};

// services/ExcelService.js
import ExcelJS from "exceljs";

const createWorkbook = (name = "Sheet") => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(name);
  return { workbook, worksheet };
};

const autoFitColumns = (worksheet) => {
  worksheet.columns.forEach((col) => {
    let max = 10;
    col.eachCell({ includeEmpty: true }, (cell) => {
      const v = cell.value ? cell.value.toString() : "";
      max = Math.max(max, v.length + 2);
    });
    col.width = max;
  });
};
const getCellValue = (cell) => {
  if (!cell) return "";
  if (cell?.text) return cell.text; // RichText
  if (typeof cell === "object" && cell?.richText) {
    return cell.richText.map((r) => r.text).join("");
  }
  return String(cell).trim();
};

const createValidationRule = (header, colLetter, row, locale) => {
  const { type, range, required, options, message, formula, errorTitle } =
    header.validation;

  const baseError = message?.[locale] || `Invalid ${header.key}`;
  const baseTitle = errorTitle?.[locale] || `Invalid ${header.key}`;

  switch (type) {
    case "text":
      return {
        type: "textLength",
        allowBlank: !required,
        operator: "between",
        formulae: range || [1, 255],
        showErrorMessage: true,
        errorStyle: "error",
        errorTitle: baseTitle,
        error: baseError,
      };

    case "number":
      return {
        type: "decimal",
        allowBlank: !required,
        operator: "between",
        formulae: range || [0, 999999],
        showErrorMessage: true,
        errorStyle: "error",
        errorTitle: baseTitle,
        error: baseError,
      };

    case "email":
      return {
        type: "custom",
        allowBlank: !required,
        formulae: [
          `AND(ISNUMBER(FIND("@",${colLetter}${row})),ISNUMBER(FIND(".",${colLetter}${row})))`,
        ],
        showErrorMessage: true,
        errorStyle: "error",
        errorTitle: baseTitle,
        error: baseError,
      };

    case "dropdown":
      if (!options?.length) return null;
      return {
        type: "list",
        allowBlank: !required,
        formulae: [`"${options.join(",")}"`],
        showErrorMessage: true,
        errorStyle: "error",
        errorTitle: baseTitle,
        error: baseError,
      };

    case "customFormula":
      if (!formula) return null;
      return {
        type: "custom",
        allowBlank: !required,
        formulae: [formula(colLetter, row).trim()],
        showErrorMessage: true,
        errorStyle: "error",
        errorTitle: baseTitle,
        error: baseError,
      };

    default:
      return null;
  }
};

const applyValidation = (
  worksheet,
  headers,
  rowStart = 2,
  rowEnd = 301,
  locale = "en"
) => {
  headers.forEach((header, colIndex) => {
    const colLetter = String.fromCharCode(65 + colIndex);

    for (let row = rowStart; row <= rowEnd; row++) {
      const cell = worksheet.getCell(`${colLetter}${row}`);
      if (header.validation) {
        const rule = createValidationRule(header, colLetter, row, locale);
        if (rule) cell.dataValidation = rule;
      }
    }
  });
};

export const ExcelService = {
  // 1. Generate a dynamic, generic Excel template

  generateTemplate: async ({ headers, locale = "en" }) => {
    const { workbook, worksheet } = createWorkbook("Template");

    // Set headers
    worksheet.columns = headers.map((col) => ({
      header: col.label[locale] || col.label.en,
      key: col.key,
      width: col.width || 20,
      style: col.style || {},
    }));
    console.log(worksheet.columns);
    // Style header
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF005577" },
      };
      cell.alignment = { horizontal: "center" };
    });

    // Add empty rows
    for (let i = 0; i < 300; i++) worksheet.addRow({});

    // Apply optional validations
    applyValidation(worksheet, headers, 2, 301, locale);

    return workbook.xlsx.writeBuffer();
  },

  // 2. Parse any Excel file into generic records

  parseExcelFile: async ({ file, headers, locale = "en" }) => {
    const workbook = new ExcelJS.Workbook();
    const buffer = await file.arrayBuffer();
    await workbook.xlsx.load(buffer);

    const worksheet = workbook.getWorksheet(1);
    if (!worksheet) throw new Error("No worksheet found");

    // Extract real header names from Excel
    const excelHeaderRow = worksheet.getRow(1);

    const excelHeaderValues = excelHeaderRow.values
      .slice(1)
      .map((v) => v?.toString().trim());

    // Match headers dynamically
    const columnMap = {};
    headers.forEach((col, index) => {
      const matchIndex = excelHeaderValues.findIndex(
        (h) =>
          h?.toLowerCase() === col.label[locale]?.toLowerCase() ||
          h?.toLowerCase() === col.label.en.toLowerCase()
      );

      if (matchIndex >= 0) columnMap[col.key] = matchIndex + 1;
    });

    // Find missing
    const missing = headers.filter((col) => !columnMap[col.key]);
    if (missing.length)
      throw new Error(
        "Missing Columns: " +
          missing.map((m) => m.label[locale] || m.label.en).join(", ")
      );

    // Extract rows
    const records = [];
    worksheet.eachRow((row, index) => {
      if (index === 1) return;

      const obj = {};
      headers.forEach((col) => {
        const value = getCellValue(row.getCell(columnMap[col.key]));

        obj[col.key] = value ? value.toString() : "";
      });

      if (Object.values(obj).every((v) => !v)) return;
      records.push(obj);
    });

    return records;
  },

  // 3. Export any records to Excel

  exportRecords: async ({ headers, records, locale = "en" }) => {
    const { workbook, worksheet } = createWorkbook("Records");

    worksheet.columns = headers.map((col) => ({
      header: col.label[locale] || col.label.en,
      key: col.key,
      width: col.width || 20,
    }));

    records.forEach((r) => worksheet.addRow(r));
    worksheet.getRow(1).font = { bold: true };

    autoFitColumns(worksheet);

    return workbook.xlsx.writeBuffer();
  },
};

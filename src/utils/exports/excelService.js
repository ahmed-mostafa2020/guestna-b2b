// services/ExcelService.js
// ExcelJS is lazy-loaded to reduce initial bundle size (~4MB)
let _ExcelJS = null;
const getExcelJS = async () => {
  if (!_ExcelJS) {
    const mod = await import("exceljs");
    _ExcelJS = mod.default || mod;
  }
  return _ExcelJS;
};
import formatDate from "@utils/formatters/FormateDate";
import { download } from "@hooks/utils/useDownload";
import {
  myBookingStudentsHeaders,
  bookingManagementStudentsHeaders,
} from "@constants/excelHeaders";

const createWorkbook = async (name = "Sheet") => {
  const ExcelJS = await getExcelJS();
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

// --- Helpers ---

const styleHeaderRow = (worksheet) => {
  const headerRow = worksheet.getRow(1);
  styleRow(headerRow);
};

const styleRow = (row) => {
  row.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF005577" },
    };
    cell.alignment = { horizontal: "center" };
  });
};

const saveWorkbook = async (workbook, filename) => {
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  download(blob, filename);
};

function formatCurrencyString(amount, locale = "en-US") {
  if (isNaN(amount) || amount === null) return "";

  const formatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "SAR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return formatter.format(amount);
}
export const ExcelService = {
  // 1. Generate a dynamic, generic Excel template
  generateTemplate: async ({ headers, locale = "en" }) => {
    const { workbook, worksheet } = await createWorkbook("Template");

    // Set headers
    worksheet.columns = headers.map((col) => ({
      header: col.label[locale] || col.label.en,
      key: col.key,
      width: col.width || 20,
      style: col.style || {},
    }));
    // Style header
    styleHeaderRow(worksheet);

    // Add empty rows
    for (let i = 0; i < 300; i++) worksheet.addRow({});

    // Apply optional validations
    applyValidation(worksheet, headers, 2, 301, locale);

    return workbook.xlsx.writeBuffer();
  },

  // 2. Parse any Excel file into generic records
  parseExcelFile: async ({ file, headers, locale = "en" }) => {
    const ExcelJS = await getExcelJS();
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
    const { workbook, worksheet } = await createWorkbook("Records");

    worksheet.columns = headers.map((col) => ({
      header: col.label[locale] || col.label.en,
      key: col.key,
      width: col.width || 20,
    }));

    worksheet.addRows(records);
    styleHeaderRow(worksheet);
    autoFitColumns(worksheet);

    return workbook.xlsx.writeBuffer();
  },

  // 4. Export My Booking (Profile)
  exportMyBooking: async ({ booking, bookingDetails, t, locale = "en" }) => {
    const { workbook, worksheet: tripSheet } = await createWorkbook(
      t("profile.tables.bookings.details.tripInfo")
    );

    const tripData = [
      [t("profile.tables.bookings.details.tripInfo")],
      [],
      [t("profile.tables.bookings.header.tripName"), booking.name || ""],
      [
        t("profile.tables.bookings.header.schoolName"),
        booking.organization || "",
      ],
      [t("profile.tables.bookings.header.tripType"), booking.category || ""],
      [
        t("profile.tables.bookings.header.date"),
        booking.day
          ? formatDate(booking.day, locale, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "",
      ],
      [t("profile.tables.bookings.details.time"), booking.fromHour || ""],
      [
        t("profile.tables.bookings.header.status"),
        booking.status
          ? t(`common.organizationTripStatus.${booking.status}`)
          : "",
      ],
      [],
      [
        t("profile.tables.bookings.header.quantity"),
        booking.bookingQuantity || 0,
      ],
      [
        t("profile.tables.orders.bookingDetails.availableSeats"),
        booking.baseAvailableSeates || 0,
      ],
      [
        t("profile.tables.orders.bookingDetails.revenueAmount"),
        booking.revenueAmount !== undefined
          ? formatCurrencyString(booking.revenueAmount, locale)
          : "",
      ],
    ];

    // Comment Section
    if (booking.comment?.comment) {
      tripData.push(
        [],
        [t("profile.tables.bookings.actions.administrativeComment")],
        [
          t("profile.tables.orders.bookingDetails.createdBy"),
          booking.comment.createdBy || "",
        ],
        [
          t("profile.tables.orders.bookingDetails.createdAt"),
          booking.comment.createdAt
            ? formatDate(booking.comment.createdAt, locale, {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "",
        ],
        [],
        [booking.comment.comment.replace(/<[^>]*>/g, "")]
      );
    }

    tripSheet.addRows(tripData);

    // Style Trip Sheet (Column widths)
    tripSheet.getColumn(1).width = 25;
    tripSheet.getColumn(2).width = 50;

    // -- Sheet 2: Students Information --
    if (bookingDetails?.nodes?.length > 0) {
      let sheetName = t("profile.tables.orders.bookingDetails.studentsList");
      // excel sheet name length limit is 31 chars
      if (sheetName.length > 31) sheetName = sheetName.substring(0, 31);

      const studentsSheet = workbook.addWorksheet(sheetName);

      // Define columns
      studentsSheet.columns = myBookingStudentsHeaders({ t });

      // Add Data
      const studentsData = bookingDetails.nodes.map((student, index) => ({
        index: index + 1,
        name: student.name || "",
        nationalId: student.nationalId || "-",
        grade: student.grade?.name || "-",
      }));

      studentsSheet.addRows(studentsData);

      // Style Header
      styleHeaderRow(studentsSheet);
    }

    // Save
    const filename = `${t("exportUtils.bookingReport.filename")}_${
      booking.name || "booking"
    }_${new Date().toISOString().split("T")[0]}`;

    await saveWorkbook(workbook, filename);
    return { success: true, filename: filename + ".xlsx" };
  },

  // 5. Export Student List (Simple)
  exportStudentsList: async ({ students, gradeName, translatedLabels }) => {
    // translatedLabels: { reportTitle, studentName, filename }
    const { workbook, worksheet } = await createWorkbook(gradeName || "Students");

    // Add Title Row
    worksheet.addRow([translatedLabels.reportTitle]);
    worksheet.addRow([]); // Empty row

    // Setup Columns (starting at row 3 implicit, but we define columns which sets row 1 header, so we need to be manual or creative)
    // approach: Manual rows for title, then Table with header

    const headerRow = [translatedLabels.studentName];
    worksheet.addRow(headerRow);
    const headerRowNode = worksheet.getRow(3); // 1=Title, 2=Empty, 3=Header
    styleRow(headerRowNode);

    // Data
    students.forEach((student) => {
      worksheet.addRow([student.name || ""]);
    });

    // Widths
    worksheet.getColumn(1).width = 40;

    const filename = `${translatedLabels.filename}_${gradeName || "students"}_${
      new Date().toISOString().split("T")[0]
    }`;

    await saveWorkbook(workbook, filename);
    return { success: true, filename: filename + ".xlsx" };
  },

  // 5b. Export Student Invoice (Single Student with Booking Info)
  exportStudentInvoice: async ({ student, booking, t, locale = "en" }) => {
    const { workbook, worksheet } = await createWorkbook(
      t("profile.tables.orders.studentsTable.title")
    );

    // Set RTL for Arabic
    if (locale === "ar") {
      worksheet.views = [{ rightToLeft: true }];
    }

    // Add title
    worksheet.mergeCells("A1:G1");
    const titleCell = worksheet.getCell("A1");
    titleCell.value = `${t("profile.tables.orders.studentsTable.title")} - ${
      booking?.name || ""
    }`;
    titleCell.font = { bold: true, size: 16 };
    titleCell.alignment = { horizontal: "center", vertical: "middle" };
    worksheet.getRow(1).height = 30;

    // Add booking info
    worksheet.mergeCells("A2:G2");
    const infoCell = worksheet.getCell("A2");
    infoCell.value = `${t("profile.tables.bookings.header.schoolName")}: ${
      booking?.organization?.name || booking?.organization || ""
    } | ${t("profile.tables.bookings.header.date")}: ${formatDate(
      booking?.day,
      locale,
      { year: "numeric", month: "long", day: "numeric" }
    )}`;
    infoCell.alignment = { horizontal: "center", vertical: "middle" };
    worksheet.getRow(2).height = 25;

    // Add headers in row 4
    const headers = [
      "#",
      t("profile.tables.orders.studentsTable.studentName"),
      t("profile.tables.orders.studentsTable.parentName"),
      t("profile.tables.orders.studentsTable.grade"),
      t("profile.tables.orders.studentsTable.parentPhone"),
      t("profile.tables.orders.studentsTable.nationalId"),
      t("profile.tables.orders.studentsTable.parentConfirmation"),
    ];

    worksheet.addRow([]);
    const headerRow = worksheet.addRow(headers);
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF0097A7" },
      };
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });
    worksheet.getRow(4).height = 25;

    // Set column widths
    worksheet.columns = [
      { width: 8 },
      { width: 25 },
      { width: 25 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
    ];

    // Add student data
    const dataRow = worksheet.addRow([
      1,
      student.child?.name || "-",
      student.parent?.name || "-",
      student.child?.grade?.name || "-",
      student.parent?.phone || "-",
      student.child?.nationalId || "-",
      student.parent?.termsAccepted
        ? locale === "ar"
          ? "نعم"
          : "Yes"
        : locale === "ar"
          ? "لا"
          : "No",
    ]);
    dataRow.eachCell((cell) => {
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    // Add price info if available
    if (booking?.price) {
      worksheet.addRow([]);
      const priceRow = worksheet.addRow([
        "",
        "",
        "",
        "",
        "",
        t("profile.tables.bookings.header.budget"),
        formatCurrencyString(booking.price, locale),
      ]);
      priceRow.getCell(6).font = { bold: true };
      priceRow.getCell(7).font = { bold: true };
    }

    // Generate filename
    const filename = `${t("profile.tables.orders.studentsTable.title")}_${
      student.child?.name || "student"
    }_${new Date().toISOString().split("T")[0]}`;

    await saveWorkbook(workbook, filename);
    return { success: true, filename: filename + ".xlsx" };
  },

  // 6. Export Booking Management (Complete Report)
  exportBookingManagement: async ({
    booking,
    bookingDetails,
    t,
    locale = "en",
  }) => {
    const { workbook, worksheet: tripSheet } = await createWorkbook(
      t("exportUtils.bookingReport.tripInfo")
    );

    const tripData = [
      [t("exportUtils.bookingReport.tripInfo")],
      [],
      [t("exportUtils.bookingReport.orderId"), booking.orderId || ""],
      [t("exportUtils.bookingReport.description"), booking.description || ""],
      [t("exportUtils.bookingReport.location"), booking.cities || ""],
      [
        t("exportUtils.bookingReport.time"),
        booking.fromHour && booking.toHour
          ? `${booking.toHour} - ${booking.fromHour}`
          : "",
      ],
      [
        t("exportUtils.bookingReport.startDate"),
        booking.day
          ? formatDate(booking.day, locale, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "",
      ],
      [
        t("exportUtils.bookingReport.endDate"),
        booking.day && booking.duration > 1
          ? formatDate(
              new Date(
                new Date(booking.day).getTime() +
                  booking.duration * 24 * 60 * 60 * 1000
              ),
              locale,
              { year: "numeric", month: "short", day: "numeric" }
            )
          : formatDate(booking.day, locale, {
              year: "numeric",
              month: "short",
              day: "numeric",
            }),
      ],
      [t("exportUtils.bookingReport.status"), booking.status || ""],
      [
        t("exportUtils.bookingReport.fees"),
        booking.price || booking.fees || "",
      ],
      [],
      [t("exportUtils.bookingReport.schoolInfo")],
      [],
      [
        t("exportUtils.bookingReport.schoolName"),
        booking.organization?.name || "",
      ],
      [
        t("exportUtils.bookingReport.contactPerson"),
        booking.organization?.name || "",
      ],
      [t("exportUtils.bookingReport.phone"), booking.organization?.pone || ""],
      [
        t("exportUtils.bookingReport.bookingDate"),
        formatDate(booking.createdAt, locale, {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
        }),
      ],
    ];
    tripSheet.addRows(tripData);
    tripSheet.getColumn(1).width = 25;
    tripSheet.getColumn(2).width = 50;

    // -- Sheet 2: Students --
    if (bookingDetails?.nodes?.length > 0) {
      const studentsSheet = workbook.addWorksheet(
        t("exportUtils.bookingReport.students")
      );

      studentsSheet.columns = bookingManagementStudentsHeaders({ t });

      bookingDetails.nodes.forEach((student) => {
        const row = {
          orderId: student.orderId || "",
          studentName: student.child?.name || "",
          academicStage: student.child?.academicStage?.name || "",
          grade: student.child?.grade?.name || "",
          size: student.child?.size || "",
          childPhone: student.child?.phone || "",
          childNationalId: student.child?.nationalId || "",
          nationalIdImage: {
            text: student.child?.nationalIdImage ? "View Image" : "",
            hyperlink: student.child?.nationalIdImage || "",
          },
          hasFoodAllergy: student.child?.hasFoodAllergy ? "Yes" : "",
          foodAllergyDetails: student.child?.foodAllergy || "",
          parentName: student.parent?.name || "",
          parentEmail: student.parent?.email || "",
          parentPhone: student.parent?.phone || "",
          nationalId:
            student.parent?.nationalId || student.child?.nationalId || "",
          parentConfirmation: student.parent?.termsAccepted
            ? locale === "ar"
              ? "نعم"
              : "Yes"
            : locale === "ar"
              ? "لا"
              : "No",
          note: student.child?.note || "",
        };

        const addedRow = studentsSheet.addRow(row);

        // Handle Hyperlink cell specifically
        if (student.child?.nationalIdImage) {
          addedRow.getCell("nationalIdImage").value = {
            text: "View Image",
            hyperlink: student.child.nationalIdImage,
          };
          addedRow.getCell("nationalIdImage").font = {
            color: { argb: "FF0000FF" },
            underline: true,
          };
        }
      });

      styleHeaderRow(studentsSheet);
    }

    const orderIdPart = booking.orderId ? `_${booking.orderId}` : "";
    const filename = `${t("exportUtils.bookingReport.filename")}_${
      booking.name || "booking"
    }${orderIdPart}_${new Date().toISOString().split("T")[0]}`;

    await saveWorkbook(workbook, filename);
    return { success: true, filename: filename + ".xlsx" };
  },

  // 7. Export Student Details (School Management)
  exportStudentDetails: async ({ data, t, locale = "en" }) => {
    const { workbook, worksheet: profileSheet } = await createWorkbook(
      t("profile.schoolTeamStudents.details.basicInfo")
    );

    const profileData = [
      [t("profile.schoolTeamStudents.details.basicInfo")],
      [],
      [t("profile.schoolTeamStudents.details.name"), data.name || "-"],
      [
        t("profile.schoolTeamStudents.details.academicStage"),
        data.academicStage?.name || "-",
      ],
      [t("profile.schoolTeamStudents.details.grade"), data.grade?.name || "-"],
      [
        t("profile.schoolTeamStudents.details.track"),
        data.track?.educationSystem?.name || "-",
      ],
      [t("profile.schoolTeamStudents.details.studentNumber"), data._id || "-"],
      [
        t("profile.schoolTeamStudents.details.nationalId"),
        data.nationalId || "-",
      ],
      [],
      [t("profile.schoolTeamStudents.details.contactWithParent")],
      [],
      [
        t("profile.schoolTeamStudents.details.parentName"),
        data.parent?.name || "-",
      ],
      [
        t("profile.schoolTeamStudents.details.parentPhone"),
        data.parent?.phone || "-",
      ],
      [
        t("profile.schoolTeamStudents.details.parentEmail"),
        data.parent?.email || "-",
      ],
      [
        t("profile.schoolTeamStudents.details.nationalId"),
        data.parent?.nationalId || "-",
      ],
    ];

    profileSheet.addRows(profileData);
    profileSheet.getColumn(1).width = 25;
    profileSheet.getColumn(2).width = 40;

    // -- Sheet 2: Bookings --:
    if (data.bookings?.length > 0) {
      const bookingsSheet = workbook.addWorksheet(
        t("profile.schoolTeamStudents.details.bookingDetails")
      );

      bookingsSheet.columns = [
        {
          header: t("profile.schoolTeamStudents.details.activityName"),
          key: "tripName",
          width: 30,
        },
        {
          header: t("profile.schoolTeamStudents.details.date"),
          key: "date",
          width: 25,
        },
        {
          header: t("profile.schoolTeamStudents.details.bookingMethod"),
          key: "parent",
          width: 20,
        },
        {
          header: t("profile.schoolTeamStudents.details.status"),
          key: "status",
          width: 20,
        },
      ];

      const bookingRows = data.bookings.map((booking) => ({
        tripName: booking.tripName || "-",
        date: booking.date
          ? formatDate(booking.date, locale, {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
            })
          : "-",
        parent: t("profile.schoolTeamStudents.details.parent"),
        status: t(`common.bookingStatus.${booking.status}`) || booking.status,
      }));

      bookingsSheet.addRows(bookingRows);
      styleHeaderRow(bookingsSheet);
    }

    const filename = `Student_Details_${data.name || "student"}_${
      new Date().toISOString().split("T")[0]
    }`;

    await saveWorkbook(workbook, filename);
    return { success: true, filename: filename + ".xlsx" };
  },
};

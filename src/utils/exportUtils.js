import ExcelJS from "exceljs";
import html2canvas from "html2canvas";
import formatDate from "./FormateDate";
import formatCurrency from "./FormatCurrency";

/**
 * Export booking data to Excel format
 * @param {Object} booking - Booking data
 * @param {Object} bookingDetails - Students data
 * @param {Function} t - Translation function
 * @param {string} locale - Current locale
 */
export const exportToExcel = async (booking, bookingDetails, t, locale) => {
  try {
    // Create a new workbook
    const workbook = new ExcelJS.Workbook();

    // Define text using translation function
    const labels = {
      tripInfo: t("exportUtils.bookingReport.tripInfo"),
      description: t("exportUtils.bookingReport.description"),
      location: t("exportUtils.bookingReport.location"),
      time: t("exportUtils.bookingReport.time"),
      startDate: t("exportUtils.bookingReport.startDate"),
      endDate: t("exportUtils.bookingReport.endDate"),
      status: t("exportUtils.bookingReport.status"),
      fees: t("exportUtils.bookingReport.fees"),
      schoolInfo: t("exportUtils.bookingReport.schoolInfo"),
      schoolName: t("exportUtils.bookingReport.schoolName"),
      contactPerson: t("exportUtils.bookingReport.contactPerson"),
      phone: t("exportUtils.bookingReport.phone"),
      bookingDate: t("exportUtils.bookingReport.bookingDate"),
      students: t("exportUtils.bookingReport.students"),
      studentName: t("exportUtils.bookingReport.studentName"),
      parentName: t("exportUtils.bookingReport.parentName"),
      grade: t("exportUtils.bookingReport.grade"),
      parentPhone: t("exportUtils.bookingReport.parentPhone"),
      nationalId: t("exportUtils.bookingReport.nationalId"),
      orderId: t("exportUtils.bookingReport.orderId"),
      academicStage: t("exportUtils.bookingReport.academicStage"),
      size: t("exportUtils.bookingReport.size"),
      hasFoodAllergy: t("exportUtils.bookingReport.hasFoodAllergy"),
      foodAllergyDetails: t("exportUtils.bookingReport.foodAllergyDetails"),
      note: t("exportUtils.bookingReport.note"),
      parentEmail: t("exportUtils.bookingReport.parentEmail"),
      childPhone: t("exportUtils.bookingReport.childPhone"),
      childNationalId: t("exportUtils.bookingReport.childNationalId"),
      nationalIdImage: t("exportUtils.bookingReport.nationalIdImage"),
      filename: t("exportUtils.bookingReport.filename"),
    };

    // Trip Information Sheet
    const tripSheet = workbook.addWorksheet(labels.tripInfo);

    const tripData = [
      [labels.tripInfo],
      [""],
      [labels.description, booking.description || ""],
      [labels.location, booking.cities || ""],
      [
        labels.time,
        booking.fromHour && booking.toHour
          ? `${booking.toHour} - ${booking.fromHour}`
          : "",
      ],
      [
        labels.startDate,
        booking.day
          ? formatDate(booking.day, locale, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "",
      ],
      [
        labels.endDate,
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
      [labels.status, booking.status],
      [labels.fees, booking.price || booking.fees],
      [""],
      [labels.schoolInfo],
      [""],
      [labels.schoolName, booking.organization?.name || ""],
      [labels.contactPerson, booking.organization?.name || ""],
      [labels.phone, booking.organization?.pone || ""],
      [
        labels.bookingDate,
        formatDate(booking.createdAt, locale, {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
        }),
      ],
    ];

    tripData.forEach((row) => {
      tripSheet.addRow(row);
    });

    // Auto-fit columns for trip sheet
    tripSheet.getColumn(1).width = 20; // Label column
    tripSheet.getColumn(2).width = 50; // Value column

    // Students Information Sheet
    console.log(
      "Excel Export - students count:",
      bookingDetails?.nodes?.length || 0
    );

    if (bookingDetails?.nodes?.length > 0) {
      const studentsSheet = workbook.addWorksheet(labels.students);

      // Add header row
      const headerRow = studentsSheet.addRow([
        labels.orderId,
        labels.studentName,
        labels.academicStage,
        labels.grade,
        labels.size,
        labels.childPhone,
        labels.childNationalId,
        labels.nationalIdImage,
        labels.hasFoodAllergy,
        labels.foodAllergyDetails,
        labels.parentName,
        labels.parentEmail,
        labels.parentPhone,
        labels.nationalId,
        labels.note,
      ]);

      bookingDetails.nodes.forEach((student, index) => {
        const row = studentsSheet.addRow([
          student.orderId || "",
          student.child?.name || "",
          student.child?.academicStage?.name || "",
          student.child?.grade?.name || "",
          student.child?.size || "",
          student.child?.phone || "",
          student.child?.nationalId || "",
          "", // Placeholder for hyperlink
          student.child?.hasFoodAllergy ? "Yes" : "",
          student.child?.foodAllergy || "",
          student.parent?.name || "",
          student.parent?.email || "",
          student.parent?.phone || "",
          student.parent?.nationalId || student.child?.nationalId || "",
          student.child?.note || "",
        ]);

        // Add hyperlink for national ID image if URL exists
        if (student.child?.nationalIdImage) {
          const cell = row.getCell(8);
          cell.value = {
            text: "View Image",
            hyperlink: student.child.nationalIdImage,
          };
          cell.font = { color: { argb: "FF0000FF" }, underline: true };
        }
      });

      console.log(
        `Excel Export - Added ${bookingDetails.nodes.length} students to sheet`
      );

      // Auto-fit columns for students sheet based on content
      studentsSheet.getColumn(1).width = 15; // Order ID
      studentsSheet.getColumn(2).width = 25; // Student Name
      studentsSheet.getColumn(3).width = 20; // Academic Stage
      studentsSheet.getColumn(4).width = 15; // Grade
      studentsSheet.getColumn(5).width = 10; // Size
      studentsSheet.getColumn(6).width = 15; // Child Phone
      studentsSheet.getColumn(7).width = 18; // Child National ID
      studentsSheet.getColumn(8).width = 15; // National ID Image
      studentsSheet.getColumn(9).width = 15; // Has Food Allergy
      studentsSheet.getColumn(10).width = 30; // Food Allergy Details
      studentsSheet.getColumn(11).width = 25; // Parent Name
      studentsSheet.getColumn(12).width = 30; // Parent Email
      studentsSheet.getColumn(13).width = 15; // Parent Phone
      studentsSheet.getColumn(14).width = 18; // National ID
      studentsSheet.getColumn(15).width = 30; // Note
    } else {
      console.log("Excel Export - No students found or empty array");
    }

    // Generate filename with booking name and date
    const filename = `${labels.filename}_${booking.name || "booking"}_${
      new Date().toISOString().split("T")[0]
    }.xlsx`;

    // Save the file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);

    return { success: true, filename };
  } catch (error) {
    console.error("Error exporting to Excel:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Export users data to Excel format
 * @param {Array} organizationsData - Array of user objects
 * @param {Function} t - Translation function
 * @param {string} filename - Optional custom filename
 */
export const exportUsersToExcel = async (
  organizationsData,
  t,
  filename = "Users"
) => {
  try {
    // Create a new workbook
    const workbook = new ExcelJS.Workbook();

    // Check if data is array and has organizations
    if (!Array.isArray(organizationsData) || organizationsData.length === 0) {
      return { success: false, error: "No data to export" };
    }

    // Loop through each organization and create a separate worksheet
    organizationsData.forEach((org, index) => {
      if (!org.organization || !org.users || org.users.length === 0) {
        return;
      }

      // Create worksheet name from organization name (max 31 chars for Excel)
      let sheetName = org.organization.name || `Organization ${index + 1}`;
      // Clean sheet name (remove invalid characters for Excel)
      sheetName = sheetName.replace(/[:\\/?*\[\]]/g, "").substring(0, 31);

      const worksheet = workbook.addWorksheet(sheetName);

      // Add header row
      const headerRow = worksheet.addRow([
        t("profile.schools_users.report.name") || "Name",
        t("profile.schools_users.report.email") || "Email",
        t("profile.schools_users.report.jobGrade") || "Job Grade",
      ]);

      // Style header row
      headerRow.font = { bold: true, size: 12 };
      headerRow.alignment = { vertical: "middle", horizontal: "center" };
      headerRow.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFE0E0E0" },
      };

      // Add user data for this organization
      org.users.forEach((user) => {
        worksheet.addRow([
          user.name || "-",
          user.email || "-",
          user.role?.description || "-",
        ]);
      });

      // Auto-fit columns
      worksheet.getColumn(1).width = 30; // Name
      worksheet.getColumn(2).width = 35; // Email
      worksheet.getColumn(3).width = 25; // Job Grade
      worksheet.getColumn(4).width = 30; // Role

      // Add borders to all cells
      worksheet.eachRow((row, rowNumber) => {
        row.eachCell((cell) => {
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
        });
      });
    });

    // Check if any worksheets were created
    if (workbook.worksheets.length === 0) {
      return { success: false, error: "No valid data to export" };
    }

    // Generate filename with date
    const finalFilename = `${filename}_${
      new Date().toISOString().split("T")[0]
    }.xlsx`;

    // Save the file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = finalFilename;
    link.click();
    window.URL.revokeObjectURL(url);

    return { success: true, filename: finalFilename };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Export modal screenshot to PDF format
 * @param {HTMLElement} modalElement - Modal DOM element to capture
 * @param {Object} booking - Booking data for filename
 * @param {string} locale - Current locale
 * @param {Function} t - Translation function
 */
export const exportModalToPDF = async (modalElement, booking, locale, t) => {
  try {
    // Dynamic import for jsPDF to avoid SSR issues
    const { jsPDF } = await import("jspdf");

    // Wait for any dynamic content to load
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Capture the modal as canvas with better settings for tables
    const canvas = await html2canvas(modalElement, {
      useCORS: true,
      allowTaint: true,
      scale: 1.2, // Slightly lower scale for better performance with large content
      backgroundColor: "#ffffff",
      logging: false, // Disable logging for cleaner output
      width: modalElement.scrollWidth,
      height: modalElement.scrollHeight,
      scrollX: 0,
      scrollY: 0,
      foreignObjectRendering: false,
      removeContainer: false,
      imageTimeout: 30000, // Increased timeout for large tables
      onclone: (clonedDoc, element) => {
        console.log("PDF Export - Cloning DOM for screenshot...");

        // Force all elements to be visible
        const allElements = clonedDoc.querySelectorAll("*");
        allElements.forEach((el) => {
          const style = el.style;
          if (style.display === "none") {
            style.display = "block";
          }
          if (style.visibility === "hidden") {
            style.visibility = "visible";
          }
          if (style.overflow === "hidden") {
            style.overflow = "visible";
          }
          if (style.maxHeight) {
            style.maxHeight = "none";
          }
        });

        // Specifically handle tables and pagination
        const tables = clonedDoc.querySelectorAll("table, .space-y-4");
        tables.forEach((table) => {
          table.style.display = "block";
          table.style.visibility = "visible";
          table.style.overflow = "visible";
          table.style.maxHeight = "none";
          table.style.height = "auto";
        });

        // Hide pagination controls
        const paginationElements = clonedDoc.querySelectorAll(
          '[class*="pagination"], .print\\:hidden'
        );
        paginationElements.forEach((el) => {
          el.style.display = "none";
        });

        console.log("PDF Export - DOM cloning completed");
      },
    });

    // Create PDF
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Calculate dimensions to fit the image in PDF
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;

    console.log(`PDF Export - Canvas size: ${imgWidth}x${imgHeight}`);
    console.log(`PDF Export - PDF page size: ${pdfWidth}x${pdfHeight}mm`);

    // Convert pixels to mm (1 pixel = 0.264583 mm at 96 DPI)
    const imgWidthMM = imgWidth * 0.264583;
    const imgHeightMM = imgHeight * 0.264583;

    // Calculate scaling to fit width, maintain aspect ratio
    const scale = pdfWidth / imgWidthMM;
    const scaledWidth = pdfWidth;
    const scaledHeight = imgHeightMM * scale;

    console.log(`PDF Export - Scaled size: ${scaledWidth}x${scaledHeight}mm`);

    // If content is taller than one page, split into multiple pages
    if (scaledHeight > pdfHeight) {
      console.log("PDF Export - Content requires multiple pages");

      const pagesNeeded = Math.ceil(scaledHeight / pdfHeight);
      console.log(`PDF Export - Creating ${pagesNeeded} pages`);

      for (let i = 0; i < pagesNeeded; i++) {
        if (i > 0) {
          pdf.addPage();
        }

        const sourceY = (i * pdfHeight) / scale;
        const sourceHeight = Math.min(pdfHeight / scale, imgHeight - sourceY);

        // Create a temporary canvas for this page section
        const pageCanvas = document.createElement("canvas");
        pageCanvas.width = imgWidth;
        pageCanvas.height = sourceHeight;
        const pageCtx = pageCanvas.getContext("2d");

        // Draw the section of the original canvas
        pageCtx.drawImage(
          canvas,
          0,
          sourceY,
          imgWidth,
          sourceHeight,
          0,
          0,
          imgWidth,
          sourceHeight
        );

        const pageImgData = pageCanvas.toDataURL("image/png");
        const pageHeight = Math.min(pdfHeight, scaledHeight - i * pdfHeight);

        pdf.addImage(pageImgData, "PNG", 0, 0, scaledWidth, pageHeight);
      }
    } else {
      // Single page - center the image
      const x = 0;
      const y = (pdfHeight - scaledHeight) / 2;
      pdf.addImage(imgData, "PNG", x, y, scaledWidth, scaledHeight);
    }

    // Generate filename using translation
    const filenamePrefix = t("exportUtils.bookingReport.filename");
    const filename = `${filenamePrefix}_${booking.name || "booking"}_${
      new Date().toISOString().split("T")[0]
    }.pdf`;

    // Save the file
    pdf.save(filename);

    return { success: true, filename };
  } catch (error) {
    console.error("Error exporting modal to PDF:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Export booking data to PDF format (legacy text-based approach)
 * @param {Object} booking - Booking data
 * @param {Object} bookingDetails - Students data
 * @param {Function} t - Translation function
 * @param {string} locale - Current locale
 */
export const exportToPDF = async (booking, bookingDetails, t, locale) => {
  try {
    // Dynamic import for jsPDF to avoid SSR issues
    const { jsPDF } = await import("jspdf");

    const doc = new jsPDF();
    let yPosition = 20;
    const lineHeight = 10;
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    const isArabic = locale === "ar";

    // Define text using translation function
    const labels = {
      title: t("exportUtils.bookingReport.title"),
      tripInfo: t("exportUtils.bookingReport.tripInfo"),
      description: t("exportUtils.bookingReport.description"),
      location: t("exportUtils.bookingReport.location"),
      time: t("exportUtils.bookingReport.time"),
      startDate: t("exportUtils.bookingReport.startDate"),
      endDate: t("exportUtils.bookingReport.endDate"),
      status: t("exportUtils.bookingReport.status"),
      fees: t("exportUtils.bookingReport.fees"),
      schoolInfo: t("exportUtils.bookingReport.schoolInfo"),
      schoolName: t("exportUtils.bookingReport.schoolName"),
      contactPerson: t("exportUtils.bookingReport.contactPerson"),
      phone: t("exportUtils.bookingReport.phone"),
      bookingDate: t("exportUtils.bookingReport.bookingDate"),
      students: t("exportUtils.bookingReport.students"),
      studentName: t("exportUtils.bookingReport.studentName"),
      parentName: t("exportUtils.bookingReport.parentName"),
      grade: t("exportUtils.bookingReport.grade"),
      parentPhone: t("exportUtils.bookingReport.parentPhone"),
      nationalId: t("exportUtils.bookingReport.nationalId"),
      filename: t("exportUtils.bookingReport.filename"),
    };

    // Helper function to format currency properly
    const formatPrice = (price) => {
      if (!price) return "";
      if (typeof price === "object") {
        return price.amount
          ? `${price.amount} ${
              price.currency || t("exportUtils.bookingReport.currency")
            }`
          : "";
      }
      return formatCurrency(price);
    };

    // Helper function to handle text direction and encoding
    const addText = (text, x, y, options = {}) => {
      try {
        // Convert text to string and handle encoding
        const cleanText = String(text).replace(
          /[\u200E\u200F\u202A-\u202E]/g,
          ""
        );

        if (isArabic && options.isLabel) {
          // For Arabic labels, position them properly
          const textWidth = doc.getTextWidth(cleanText);
          doc.text(cleanText, pageWidth - x - textWidth, y);
        } else {
          doc.text(cleanText, x, y);
        }
      } catch (error) {
        // Fallback for problematic characters
        const fallbackText = text.toString().replace(/[^\x00-\x7F]/g, "?");
        doc.text(fallbackText, x, y);
      }
    };

    // Title
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    const title = `${labels.title} ${booking.name || ""}`;
    const titleWidth = doc.getTextWidth(title);
    doc.text(title, (pageWidth - titleWidth) / 2, yPosition);
    yPosition += lineHeight * 2;

    // Trip Information Section
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(labels.tripInfo, margin, yPosition);
    yPosition += lineHeight * 1.5;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    const tripInfo = [
      [labels.description, booking.description || ""],
      [labels.location, booking.cities || ""],
      [
        labels.time,
        booking.fromHour && booking.toHour
          ? `${booking.toHour} - ${booking.fromHour}`
          : "",
      ],
      [
        labels.startDate,
        booking.day
          ? formatDate(booking.day, locale, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "",
      ],
      [
        labels.endDate,
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
      [labels.status, booking.status],
      [labels.fees, formatPrice(booking.price)],
    ];

    tripInfo.forEach(([label, value]) => {
      if (value) {
        doc.setFont("helvetica", "bold");
        addText(`${label}:`, margin, yPosition);
        doc.setFont("helvetica", "normal");
        addText(String(value), margin + 60, yPosition);
        yPosition += lineHeight;
      }
    });

    yPosition += lineHeight;

    // School Information Section
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(labels.schoolInfo, margin, yPosition);
    yPosition += lineHeight * 1.5;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    const schoolInfo = [
      [labels.schoolName, booking.organization?.name || ""],
      [labels.contactPerson, booking.organization?.name || ""],
      [labels.phone, booking.organization?.pone || ""],
      [
        labels.bookingDate,
        formatDate(booking.createdAt, locale, {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
        }),
      ],
    ];

    schoolInfo.forEach(([label, value]) => {
      if (value) {
        doc.setFont("helvetica", "bold");
        addText(`${label}:`, margin, yPosition);
        doc.setFont("helvetica", "normal");
        addText(String(value), margin + 60, yPosition);
        yPosition += lineHeight;
      }
    });

    // Students Table
    if (bookingDetails?.nodes?.length > 0) {
      yPosition += lineHeight;

      // Check if we need a new page
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(labels.students, margin, yPosition);
      yPosition += lineHeight * 1.5;

      // Simple list format for students (easier than table)
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");

      bookingDetails.nodes.forEach((student, index) => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }

        doc.setFont("helvetica", "bold");
        addText(
          `${index + 1}. ${student.child?.name || "N/A"}`,
          margin,
          yPosition
        );
        yPosition += lineHeight;

        doc.setFont("helvetica", "normal");
        addText(
          `   ${labels.parentName}: ${student.parent?.name || "N/A"}`,
          margin,
          yPosition
        );
        yPosition += lineHeight;

        addText(
          `   ${labels.grade}: ${student.child?.grade?.name || "N/A"}`,
          margin,
          yPosition
        );
        yPosition += lineHeight;

        addText(
          `   ${labels.parentPhone}: ${student.parent?.phone || "N/A"}`,
          margin,
          yPosition
        );
        yPosition += lineHeight;

        addText(
          `   ${labels.nationalId}: ${student.child?.nationalId || "N/A"}`,
          margin,
          yPosition
        );
        yPosition += lineHeight * 1.5;
      });
    }

    // Generate filename
    const filename = `${labels.filename}_${booking.name || "booking"}_${
      new Date().toISOString().split("T")[0]
    }.pdf`;

    // Save the file
    doc.save(filename);

    return { success: true, filename };
  } catch (error) {
    console.error("Error exporting to PDF:", error);
    return { success: false, error: error.message };
  }
};

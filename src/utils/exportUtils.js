import * as XLSX from "xlsx";
import html2canvas from "html2canvas";
import formatDate from "./FormateDate";
import formatCurrency from "./FormatCurrency";

/**
 * Export myBookings data to Excel format (for profile bookings page)
 * @param {Object} booking - Booking data from myBookings API
 * @param {Object} bookingDetails - Students data
 * @param {Function} t - Translation function
 * @param {string} locale - Current locale
 */
export const exportMyBookingToExcel = (booking, bookingDetails, t, locale) => {
  try {
    // Create a new workbook
    const workbook = XLSX.utils.book_new();

    // Define text using translation function
    const labels = {
      tripInfo: t("profile.tables.bookings.details.tripInfo"),
      name: t("profile.tables.bookings.header.tripName"),
      organization: t("profile.tables.bookings.header.schoolName"),
      category: t("profile.tables.bookings.header.tripType"),
      day: t("profile.tables.bookings.header.date"),
      fromHour: t("profile.tables.bookings.details.time"),
      status: t("profile.tables.bookings.header.status"),
      bookingQuantity: t("profile.tables.bookings.header.quantity"),
      baseAvailableSeates: t(
        "profile.tables.orders.bookingDetails.availableSeats"
      ),
      revenueAmount: t("profile.tables.orders.bookingDetails.revenueAmount"),
      comment: t("profile.tables.bookings.actions.administrativeComment"),
      createdBy: t("profile.tables.orders.bookingDetails.createdBy"),
      createdAt: t("profile.tables.orders.bookingDetails.createdAt"),
      students: t("profile.tables.orders.bookingDetails.studentsList"),
      studentName: t("profile.tables.orders.bookingDetails.studentName"),
      nationalId: t("profile.tables.orders.bookingDetails.nationalId"),
      grade: t("profile.tables.orders.bookingDetails.grade"),
      filename: t("exportUtils.bookingReport.filename"),
    };

    // Trip Information Sheet - Only fields from API response
    const tripData = [
      [labels.tripInfo],
      [""],
      // Basic Info
      [labels.name, booking.name || ""],
      [labels.organization, booking.organization || ""],
      [labels.category, booking.category || ""],
      [
        labels.day,
        booking.day
          ? formatDate(booking.day, locale, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "",
      ],
      [labels.fromHour, booking.fromHour || ""],
      [
        labels.status,
        booking.status
          ? t(`common.organizationTripStatus.${booking.status}`)
          : "",
      ],
      [""],
      // Booking Details
      [labels.bookingQuantity, booking.bookingQuantity || 0],
      [labels.baseAvailableSeates, booking.baseAvailableSeates || 0],
      [
        labels.revenueAmount,
        booking.revenueAmount !== undefined
          ? formatCurrency(booking.revenueAmount)
          : "",
      ],
      [""],
      // Comment Section (if exists)
      ...(booking.comment?.comment
        ? [
            [labels.comment],
            [labels.createdBy, booking.comment.createdBy || ""],
            [
              labels.createdAt,
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
            [""],
            [booking.comment.comment.replace(/<[^>]*>/g, "")], // Strip HTML tags
            [""],
          ]
        : []),
    ];

    const tripSheet = XLSX.utils.aoa_to_sheet(tripData);

    // Auto-fit columns for trip sheet
    const tripColWidths = [
      { wch: 20 }, // Label column
      { wch: 50 }, // Value column
    ];
    tripSheet["!cols"] = tripColWidths;

    XLSX.utils.book_append_sheet(workbook, tripSheet, labels.tripInfo);

    // Students Information Sheet
    if (bookingDetails?.nodes?.length > 0) {
      const studentsData = [
        ["#", labels.studentName, labels.nationalId, labels.grade],
      ];

      bookingDetails.nodes.forEach((student, index) => {
        studentsData.push([
          index + 1,
          student.name || "",
          student.nationalId || "-",
          student.grade?.name || "-",
        ]);
      });

      const studentsSheet = XLSX.utils.aoa_to_sheet(studentsData);

      // Auto-fit columns for students sheet
      const studentsColWidths = [
        { wch: 5 }, // #
        { wch: 30 }, // Student Name
        { wch: 20 }, // National ID
        { wch: 20 }, // Grade
      ];
      studentsSheet["!cols"] = studentsColWidths;

      XLSX.utils.book_append_sheet(workbook, studentsSheet, labels.students);
    }

    // Generate filename with booking name and date
    const filename = `${labels.filename}_${booking.name || "booking"}_${
      new Date().toISOString().split("T")[0]
    }.xlsx`;

    // Save the file
    XLSX.writeFile(workbook, filename);

    return { success: true, filename };
  } catch (error) {
    console.error("Error exporting myBooking to Excel:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Export booking data to Excel format (for bookings-management)
 * @param {Object} booking - Booking data
 * @param {Object} bookingDetails - Students data
 * @param {Function} t - Translation function
 * @param {string} locale - Current locale
 */
export const exportToExcel = (booking, bookingDetails, t, locale) => {
  console.log(
    "🔴 OLD exportToExcel called - THIS SHOULD NOT BE CALLED FROM MYBOOKINGS!"
  );
  try {
    // Create a new workbook
    const workbook = XLSX.utils.book_new();

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

    const tripSheet = XLSX.utils.aoa_to_sheet(tripData);

    // Auto-fit columns for trip sheet
    const tripColWidths = [
      { wch: 20 }, // Label column
      { wch: 50 }, // Value column
    ];
    tripSheet["!cols"] = tripColWidths;

    XLSX.utils.book_append_sheet(workbook, tripSheet, labels.tripInfo);

    // Students Information Sheet
    console.log(
      "Excel Export - students count:",
      bookingDetails?.nodes?.length || 0
    );

    if (bookingDetails?.nodes?.length > 0) {
      const studentsData = [
        [
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
        ],
      ];

      bookingDetails.nodes.forEach((student, index) => {
        // Create hyperlink for national ID image if URL exists
        const nationalIdImageCell = student.child?.nationalIdImage
          ? {
              f: `HYPERLINK("${student.child.nationalIdImage}", "View Image")`,
              l: { Target: student.child.nationalIdImage },
            }
          : "";

        studentsData.push([
          student.orderId || "",
          student.child?.name || "",
          student.child?.academicStage?.name || "",
          student.child?.grade?.name || "",
          student.child?.size || "",
          student.child?.phone || "",
          student.child?.nationalId || "",
          nationalIdImageCell,
          student.child?.hasFoodAllergy ? "Yes" : "",
          student.child?.foodAllergy || "",
          student.parent?.name || "",
          student.parent?.email || "",
          student.parent?.phone || "",
          student.parent?.nationalId || student.child?.nationalId || "",
          student.child?.note || "",
        ]);
      });

      console.log(
        `Excel Export - Added ${studentsData.length - 1} students to sheet`
      );
      const studentsSheet = XLSX.utils.aoa_to_sheet(studentsData);

      // Auto-fit columns for students sheet based on content
      const studentsColWidths = [
        { wch: 15 }, // Order ID
        { wch: 25 }, // Student Name
        { wch: 20 }, // Academic Stage
        { wch: 15 }, // Grade
        { wch: 10 }, // Size
        { wch: 15 }, // Child Phone
        { wch: 18 }, // Child National ID
        { wch: 15 }, // National ID Image
        { wch: 15 }, // Has Food Allergy
        { wch: 30 }, // Food Allergy Details
        { wch: 25 }, // Parent Name
        { wch: 30 }, // Parent Email
        { wch: 15 }, // Parent Phone
        { wch: 18 }, // National ID
        { wch: 30 }, // Note
      ];
      studentsSheet["!cols"] = studentsColWidths;

      XLSX.utils.book_append_sheet(workbook, studentsSheet, labels.students);
    } else {
      console.log("Excel Export - No students found or empty array");
    }

    // Generate filename with booking name and date
    const filename = `${labels.filename}_${booking.name || "booking"}_${
      new Date().toISOString().split("T")[0]
    }.xlsx`;

    // Save the file
    XLSX.writeFile(workbook, filename);

    return { success: true, filename };
  } catch (error) {
    console.error("Error exporting to Excel:", error);
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

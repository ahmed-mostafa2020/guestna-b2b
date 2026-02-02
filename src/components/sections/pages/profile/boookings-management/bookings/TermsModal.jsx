"use client";

import { memo, useRef, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { CircularProgress } from "@mui/material";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import CustomizedModal from "@components/common/customizedModal";

const TermsModal = ({ open, handleClose }) => {
  const t = useTranslations();
  const locale = useLocale();
  const contentRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const isRTL = locale === "ar";

  const handleDownloadPdf = async () => {
    if (!contentRef.current) return;

    setIsDownloading(true);
    try {
      const element = contentRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      let yPosition = 0;
      const pageHeight = pdf.internal.pageSize.getHeight();

      if (pdfHeight > pageHeight) {
        while (yPosition < pdfHeight) {
          pdf.addImage(imgData, "PNG", 0, -yPosition, pdfWidth, pdfHeight);
          yPosition += pageHeight;
          if (yPosition < pdfHeight) {
            pdf.addPage();
          }
        }
      } else {
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      }

      pdf.save(`terms-and-conditions-${locale}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const terms = ["participation", "safety", "health", "emergency", "media"];

  return (
    <CustomizedModal
      open={open}
      handleClose={handleClose}
      width="600px"
      bgcolor="rgba(0, 0, 0, 0.6)"
    >
      <div className="p-6 space-y-6">
        {/* Content to Capture */}
        <div
          ref={contentRef}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          dir={isRTL ? "rtl" : "ltr"}
        >
          <div className="border-b-2 border-mainColor pb-4 mb-6">
            <h2 className="text-2xl font-bold text-titleColor">
              {t("forms.termsConfirmation.modal.termsTitle")}
            </h2>
          </div>

          <div className="space-y-6">
            {terms.map((key) => (
              <div key={key} className="space-y-2">
                <h4 className="font-bold text-base text-textDark">
                  {t(`forms.termsConfirmation.modal.terms.${key}.title`)}
                </h4>
                <p
                  className="text-sm text-gray-700 leading-relaxed"
                  style={{
                    textAlign: isRTL ? "right" : "left",
                    direction: isRTL ? "rtl" : "ltr",
                  }}
                >
                  {t(`forms.termsConfirmation.modal.terms.${key}.content`)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={handleClose}
            disabled={isDownloading}
            className="px-6 py-3 text-base font-semibold text-mainColor bg-white border-2 border-mainColor rounded-lg hover:bg-gray-50 transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t("links.cancel")}
          </button>
          <button
            onClick={handleDownloadPdf}
            disabled={isDownloading}
            className="px-6 py-3 text-base font-semibold text-white bg-mainColor border-2 border-mainColor rounded-lg hover:bg-linksHover hover:border-linksHover transition-all duration-200 ease-in-out disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isDownloading && (
              <CircularProgress size={18} className="!text-white" />
            )}
            {isDownloading
              ? t("forms.validation.downloading")
              : t("profile.tables.orders.bookingDetails.printReport")}
          </button>
        </div>
      </div>
    </CustomizedModal>
  );
};

export default memo(TermsModal);

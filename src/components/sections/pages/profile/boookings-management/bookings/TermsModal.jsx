"use client";

import { memo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@mui/material";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import CustomizedModal from "@components/common/customizedModal";

const TermsModal = ({ open, handleClose }) => {
  const t = useTranslations();
  const contentRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPdf = async () => {
    if (!contentRef.current) return;

    setIsDownloading(true);
    try {
      const element = contentRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("terms-and-conditions.pdf");
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
      <div className="p-4 space-y-6">
        {/* Content to Capture */}
        <div ref={contentRef} className="bg-white rounded-lg p-4">
          <div className="border-b pb-4 mb-4">
            <h2 className="text-xl font-bold text-titleColor">
              {t("forms.termsConfirmation.modal.termsTitle")}
            </h2>
          </div>

          <div className="space-y-4">
            {terms.map((key) => (
              <div key={key} className="space-y-1">
                <h4 className="font-semibold text-textDark">
                  {t(`forms.termsConfirmation.modal.terms.${key}.title`)}
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed text-justify">
                  {t(`forms.termsConfirmation.modal.terms.${key}.content`)}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            onClick={handleClose}
            variant="outlined"
            size="large"
            sx={{
              borderColor: "var(--color-main)",
              color: "var(--color-main)",
              "&:hover": {
                borderColor: "var(--color-main)",
                backgroundColor: "rgba(var(--color-main-rgb), 0.04)",
              },
            }}
          >
            {t("links.cancel")}
          </Button>
          <Button
            onClick={handleDownloadPdf}
            variant="contained"
            size="large"
            disabled={isDownloading}
            sx={{
              backgroundColor: "var(--color-main)",
              "&:hover": {
                backgroundColor: "var(--color-hover)",
              },
            }}
          >
            {isDownloading
              ? t("forms.validation.downloading")
              : t("profile.tables.orders.bookingDetails.printReport")}
          </Button>
        </div>
      </div>
    </CustomizedModal>
  );
};

export default memo(TermsModal);

"use client";

import { useTranslations } from "next-intl";

import { useSelector } from "react-redux";

import { useState } from "react";

import SystemUpdateAltIcon from "@mui/icons-material/SystemUpdateAlt";
import { CircularProgress } from "@mui/material";
import { isIOS } from "@utils/deviceDetection";
import { getGtmTag, GTM_TAGS } from "@utils/gtmUtils";

const DownloadButton = () => {
  const [isDownloading, setIsDownloading] = useState(false);

  const t = useTranslations();

  const fileUrl = useSelector(
    (state) => state.tripDetailsData?.data?.trip?.detailsFile
  );

  const handleDownloadWithFetch = async () => {
    if (!fileUrl || isDownloading) {
      console.error("No file URL available or download in progress");
      return;
    }

    setIsDownloading(true);

    try {
      // Force download using fetch + blob approach for better control
      console.log("Starting file download...");

      const response = await fetch(fileUrl, {
        method: "GET",
        headers: {
          Accept: "application/pdf,application/octet-stream,*/*",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Get the file as a blob
      const blob = await response.blob();
      console.log("File blob created, size:", blob.size);

      // Create a blob URL
      const blobUrl = window.URL.createObjectURL(blob);

      // Extract filename from URL
      let fileName = fileUrl.split("/").pop() || "trip-details";

      // Clean up filename
      const pdfIndex = fileName.toLowerCase().indexOf(".pdf");
      if (pdfIndex !== -1) {
        fileName = fileName.substring(0, pdfIndex + 4);
      }
      if (!fileName.toLowerCase().endsWith(".pdf")) {
        fileName += ".pdf";
      }

      console.log("Downloading file as:", fileName);

      // Create download link and force download
      const downloadLink = document.createElement("a");
      downloadLink.href = blobUrl;
      downloadLink.download = fileName; // This forces download instead of opening
      downloadLink.style.display = "none";

      // Add to DOM, click, and remove
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      // Clean up the blob URL after a short delay
      setTimeout(() => {
        window.URL.revokeObjectURL(blobUrl);
        console.log("Blob URL cleaned up");
      }, 1000);

      console.log("Download initiated successfully");
    } catch (error) {
      console.error("Download failed:", error);

      // Fallback: Try direct link approach
      try {
        console.log("Trying fallback download method...");
        const fallbackLink = document.createElement("a");
        fallbackLink.href = fileUrl;
        fallbackLink.download = fileUrl.split("/").pop() || "trip-details.pdf";
        fallbackLink.target = "_blank";
        fallbackLink.style.display = "none";
        document.body.appendChild(fallbackLink);
        fallbackLink.click();
        document.body.removeChild(fallbackLink);
        console.log("Fallback download attempted");
      } catch (fallbackError) {
        console.error("Fallback download failed:", fallbackError);
        // Last resort: open in new tab
        console.log("Opening file in new tab as last resort");
        window.open(fileUrl, "_blank");
      }
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    fileUrl && (
      <button
        onClick={handleDownloadWithFetch}
        disabled={!fileUrl || isDownloading}
        className={`gap-1 px-4 py-3 font-semibold transition-all duration-200 ease-in-out bg-transparent border-2 rounded-lg centered border-mainColor hover:text-mainColor ${
          !fileUrl || isDownloading ? "opacity-70 cursor-not-allowed" : ""
        }`}
        {...getGtmTag(GTM_TAGS.TRIP_DETAILS.DOWNLOAD_FILE, "trip_details")}
      >
        {isDownloading ? (
          <>
            {t("forms.validation.downloading")}
            <CircularProgress
              size={14}
              sx={{ color: "var(--color-secondary)" }}
            />
          </>
        ) : (
          <>
            <SystemUpdateAltIcon />
            {isIOS() ? t("links.viewFile") : t("links.downloadFile")}
          </>
        )}
      </button>
    )
  );
};

export default DownloadButton;

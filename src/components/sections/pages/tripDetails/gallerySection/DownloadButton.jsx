"use client";

import { useTranslations } from "next-intl";

import { useSelector } from "react-redux";

import { useState } from "react";

import SystemUpdateAltIcon from "@mui/icons-material/SystemUpdateAlt";
import { CircularProgress } from "@mui/material";

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
      // Get auth token and device ID (adjust based on how you store them)
      const token = localStorage.getItem("authToken"); // or however you store it
      const deviceId = localStorage.getItem("deviceId"); // or however you store it

      // Extract the path from the fileUrl
      // Assuming fileUrl is like: "https://backend.com/api/files/download/123"
      // We want to extract the path part after the base URL
      const url = new URL(fileUrl);
      const pathToDownload = url.pathname + url.search; // includes query params if any

      // Create proxy URL with the path as a query parameter
      const proxyUrl = `/api/proxy?path=${encodeURIComponent(pathToDownload)}`;

      // Set up headers for the proxy request
      const headers = {
        "Content-Type": "application/json",
      };
      headers["reqKey"] = process.env.NEXT_PUBLIC_REQ_KEY;

      if (token) {
        headers["authorization"] = token; // or `Bearer ${token}` if needed
      }

      if (deviceId) {
        headers["devicespecificid"] = deviceId;
      }

      // Make request through your proxy
      const response = await fetch(proxyUrl, {
        method: "POST", // Your proxy expects POST
        headers: headers,
        body: JSON.stringify({}), // Empty body since it's a download request
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const url_blob = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url_blob;

      // Extract filename from Content-Disposition header or original URL
      const contentDisposition = response.headers.get("content-disposition");
      let fileName = "download";

      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
        if (fileNameMatch) {
          fileName = fileNameMatch[1];
        }
      } else {
        fileName = fileUrl.split("/").pop() || "download";
        // Remove anything after .pdf (including _updateAt or +...)
        const pdfIndex = fileName.toLowerCase().indexOf(".pdf");
        if (pdfIndex !== -1) {
          fileName = fileName.substring(0, pdfIndex + 4); // keep up to and including ".pdf"
        }
        // If fileName does not have .pdf, add it
        if (!fileName.toLowerCase().endsWith(".pdf")) {
          fileName += ".pdf";
        }
      }

      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the object URL
      window.URL.revokeObjectURL(url_blob);
    } catch (error) {
      console.error("Download failed:", error);

      // Fallback: try direct download
      try {
        window.open(fileUrl, "_blank");
      } catch (fallbackError) {
        console.error("Fallback download also failed:", fallbackError);
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
      >
        {isDownloading ? (
          <>
            {t("forms.validation.downloading")}
            <CircularProgress size={14} sx={{ color: "#ED8A22" }} />
          </>
        ) : (
          <>
            <SystemUpdateAltIcon />
            {t("links.downloadFile")}
          </>
        )}
      </button>
    )
  );
};

export default DownloadButton;

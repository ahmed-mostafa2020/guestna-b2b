"use client";

import { useTranslations } from "next-intl";

import { useSelector } from "react-redux";

import { useState } from "react";

import SystemUpdateAltIcon from "@mui/icons-material/SystemUpdateAlt";
import { CircularProgress } from "@mui/material";

const DownloadButton = () => {
  const [isDownloading, setIsDownloading] = useState(false);

  const fileUrl = useSelector(
    (state) => state.tripDetailsData.data.trip?.detailsFile
  );

  const t = useTranslations();

  const handleDownloadWithFetch = async () => {
    if (!fileUrl || isDownloading) {
      console.error("No file URL available or download in progress");
      return;
    }

    setIsDownloading(true);

    try {
      const response = await fetch(fileUrl);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;

      // Extract filename from Content-Disposition header or URL
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
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);

      // Fallback: open in new tab
      window.open(fileUrl, "_blank");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
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
  );
};

export default DownloadButton;

// 'use client';

// import { useState } from 'react';
// import { FiDownload, FiLoader } from 'react-icons/fi';
// import axios from 'axios';

// export default function DownloadButton() {
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [progress, setProgress] = useState(0);

//   const handleDownload = async () => {
//     setIsLoading(true);
//     setError(null);
//     setProgress(0);

//     try {
//       // 1. First get the file path from your API
//       const { data } = await axios.get('/api/get-file-path');

//       if (!data.filePath) {
//         throw new Error('No file path received');
//       }

//       // 2. Download the actual file with progress
//       const response = await axios({
//         url: data.filePath,
//         method: 'GET',
//         responseType: 'blob',
//         onDownloadProgress: (progressEvent) => {
//           const percentCompleted = Math.round(
//             (progressEvent.loaded * 100) / progressEvent.total
//           );
//           setProgress(percentCompleted);
//         }
//       });

//       // 3. Create download link
//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute(
//         'download',
//         data.fileName || `download-${Date.now()}`
//       );
//       document.body.appendChild(link);
//       link.click();

//       // 4. Clean up
//       link.remove();
//       window.URL.revokeObjectURL(url);

//     } catch (err) {
//       setError(err.message || 'Download failed');
//     } finally {
//       setIsLoading(false);
//       setProgress(0);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center w-full max-w-xs gap-2">
//       <button
//         onClick={handleDownload}
//         disabled={isLoading}
//         className={`
//           flex items-center justify-center gap-2
//           px-4 py-2 w-full rounded-lg font-medium
//           ${isLoading
//             ? 'bg-gray-400 cursor-not-allowed'
//             : 'bg-blue-600 hover:bg-blue-700 text-white'
//           }
//           transition-colors duration-200
//         `}
//       >
//         {isLoading ? (
//           <>
//             <FiLoader className="animate-spin" />
//             Downloading... {progress}%
//           </>
//         ) : (
//           <>
//             <FiDownload />
//             Download File
//           </>
//         )}
//       </button>

//       {error && (
//         <p className="text-sm text-center text-red-500">{error}</p>
//       )}

//       {isLoading && (
//         <div className="w-full bg-gray-200 rounded-full h-2.5">
//           <div
//             className="bg-blue-600 h-2.5 rounded-full"
//             style={{ width: `${progress}%` }}
//           ></div>
//         </div>
//       )}
//     </div>
//   );
// }

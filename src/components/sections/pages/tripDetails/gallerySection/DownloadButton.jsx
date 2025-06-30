"use client";

import { useTranslations } from "next-intl";

import SystemUpdateAltIcon from "@mui/icons-material/SystemUpdateAlt";

const DownloadButton = () => {
  const t = useTranslations();

  return (
    <button
      // onClick={handleDownload}
      className="gap-1 px-4 py-3 font-semibold transition-all duration-200 ease-in-out bg-transparent border-2 rounded-lg centered border-mainColor hover:text-mainColor"
    >
      <SystemUpdateAltIcon />

      {t("links.downloadFile")}
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

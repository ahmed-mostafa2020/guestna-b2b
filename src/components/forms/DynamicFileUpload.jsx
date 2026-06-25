import { useTranslations } from "next-intl";
import { memo, useState, useRef, useEffect } from "react";
import { cn } from "@utils/helpers/cn";

const FilePreview = ({ file, type, onRemove }) => {
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (!file) return;
    if (typeof file === "string") {
      setPreviewUrl(file);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  if (!previewUrl) return null;

  const fileName = typeof file === "string" ? file.split("/").pop() : file.name;

  return (
    <div className="relative group border border-gray-200 rounded-xl p-3 bg-gray-50 flex flex-col items-center justify-center gap-2 shadow-sm">
      <button
        type="button"
        onClick={onRemove}
        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-md transition-colors z-10"
        title="Remove"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {type === "image" && (
        <div className="w-full flex flex-col items-center">
          <img
            src={previewUrl}
            alt={fileName}
            className="w-full max-h-36 object-contain rounded-lg"
          />
          {typeof file !== "string" && (
            <span className="text-xs text-gray-500 truncate w-full text-center mt-2 px-1" title={fileName}>
              {fileName}
            </span>
          )}
        </div>
      )}

      {type === "audio" && (
        <div className="w-full flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg w-full">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
            <span className="text-xs font-medium truncate flex-1" title={fileName}>
              {fileName}
            </span>
          </div>
          <audio src={previewUrl} controls className="w-full h-10 mt-1" />
        </div>
      )}

      {type === "video" && (
        <div className="w-full flex flex-col items-center gap-2">
          <video src={previewUrl} controls className="w-full max-h-48 rounded-lg" />
          <span className="text-xs text-gray-500 truncate w-full text-center mt-1 px-1" title={fileName}>
            {fileName}
          </span>
        </div>
      )}
    </div>
  );
};

const DynamicFileUpload = memo(
  ({
    type = "image", // "image" | "audio" | "video"
    name,
    label,
    required = false,
    isMultiple = false,
    acceptedTypes,
    maxSizeMB,
    maxCount,
    minCount,
    value,
    errors,
    touched,
    onBlur,
    setFieldValue,
  }) => {
    const t = useTranslations();
    const fileInputRef = useRef(null);
    const [dragActive, setDragActive] = useState(false);
    const [localError, setLocalError] = useState("");

    // Set defaults based on file type
    const defaultMaxSizes = { image: 5, audio: 10, video: 20 };
    const maxMB = maxSizeMB || defaultMaxSizes[type] || 5;

    const defaultAccepts = {
      image: "image/*",
      audio: "audio/*",
      video: "video/*",
    };
    const acceptAttr = acceptedTypes || defaultAccepts[type];

    const validateFile = (file) => {
      // 1. Check size
      const maxSizeBytes = maxMB * 1024 * 1024;
      if (file.size > maxSizeBytes) {
        return t("eventTrips.upload.sizeError", { size: maxMB }) || `File exceeds maximum size of ${maxMB}MB`;
      }

      // 2. Check type if acceptedTypes is provided
      if (acceptedTypes) {
        const typesList = typeof acceptedTypes === "string" 
          ? acceptedTypes.split(",").map(t => t.trim()) 
          : acceptedTypes;
        
        const fileType = file.type;
        const matches = typesList.some(pattern => {
          if (pattern.endsWith("/*")) {
            const prefix = pattern.replace("/*", "");
            return fileType.startsWith(prefix);
          }
          return fileType === pattern || file.name.toLowerCase().endsWith(pattern.toLowerCase());
        });

        if (!matches) {
          return t("eventTrips.upload.typeError") || "File type not allowed";
        }
      }
      return "";
    };

    const processFiles = (fileList) => {
      setLocalError("");
      const validFiles = [];
      let errMessage = "";

      // Check max count before processing
      if (isMultiple && maxCount) {
        const currentCount = Array.isArray(value) ? value.length : 0;
        if (currentCount + fileList.length > maxCount) {
          setLocalError(
            t("eventTrips.upload.maxCountError", { count: maxCount }) ||
              `Maximum ${maxCount} file(s) allowed`
          );
          return;
        }
      }

      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        const error = validateFile(file);
        if (error) {
          errMessage = error;
          break;
        }
        validFiles.push(file);
      }

      if (errMessage) {
        setLocalError(errMessage);
        return;
      }

      if (validFiles.length > 0) {
        if (isMultiple) {
          const currentValues = Array.isArray(value) ? value : [];
          setFieldValue(name, [...currentValues, ...validFiles]);
        } else {
          setFieldValue(name, validFiles[0]);
        }
      }
    };

    const handleFileChange = (e) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        processFiles(files);
      }
    };

    const handleDrag = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === "dragenter" || e.type === "dragover") {
        setDragActive(true);
      } else if (e.type === "dragleave") {
        setDragActive(false);
      }
    };

    const handleDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        processFiles(e.dataTransfer.files);
      }
    };

    const handleRemoveFile = (indexToRemove) => {
      if (isMultiple && Array.isArray(value)) {
        const updated = value.filter((_, idx) => idx !== indexToRemove);
        setFieldValue(name, updated.length > 0 ? updated : []);
      } else {
        setFieldValue(name, null);
      }
      setLocalError("");
    };

    const handleBrowseClick = () => {
      fileInputRef.current?.click();
    };

    // Render helper for file input iconography
    const renderIcon = () => {
      switch (type) {
        case "audio":
          return (
            <svg className="w-10 h-10 text-gray-400 group-hover:text-mainColor transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          );
        case "video":
          return (
            <svg className="w-10 h-10 text-gray-400 group-hover:text-mainColor transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          );
        default: // image
          return (
            <svg className="w-10 h-10 text-gray-400 group-hover:text-mainColor transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          );
      }
    };

    const hasValue = isMultiple 
      ? Array.isArray(value) && value.length > 0 
      : value !== null && value !== undefined && value !== "";

    // Determine whether we should still allow adding more files
    const canAddMore = isMultiple
      ? !maxCount || !Array.isArray(value) || value.length < maxCount
      : !hasValue;

    // Min count validation hint
    const currentCount = Array.isArray(value) ? value.length : hasValue ? 1 : 0;
    const belowMinCount = minCount && currentCount < minCount;

    return (
      <div className="flex flex-col gap-2 relative w-full text-start">
        {label && (
          <label className="font-semibold text-gray-700 font-somar text-sm md:text-base flex items-center gap-1">
            {label}
            {required && <span className="text-error font-ibm">*</span>}
          </label>
        )}

        {/* Drag & Drop Zone */}
        {(!hasValue || canAddMore) && (
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={handleBrowseClick}
            className={cn(
              "cursor-pointer group flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl transition-all duration-200 ease-in-out bg-white select-none min-h-[140px]",
              dragActive 
                ? "border-mainColor bg-mainColor/5 shadow-md scale-[0.99]" 
                : touched && (errors || localError)
                ? "border-error hover:border-error bg-red-50/10"
                : "border-gray-300 hover:border-mainColor hover:bg-gray-50/50"
            )}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={acceptAttr}
              multiple={isMultiple}
              onChange={handleFileChange}
              onBlur={onBlur}
              className="hidden"
            />
            {renderIcon()}
            <p className="mt-2 text-sm font-medium text-gray-700 font-somar text-center">
              {t("eventTrips.upload.clickToUpload") || "Drag & drop or click to upload"}
            </p>
            <p className="mt-1 text-xs text-gray-400 font-somar text-center">
              {t("eventTrips.upload.maxSize", { size: maxMB }) || `Maximum file size: ${maxMB}MB`}
            </p>
            {maxCount && (
              <p className="mt-0.5 text-xs text-gray-400 font-somar text-center">
                {t("eventTrips.upload.maxCount", { count: maxCount }) || `Maximum ${maxCount} file(s)`}
              </p>
            )}
          </div>
        )}

        {/* Display Previews */}
        {hasValue && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-1">
            {isMultiple && Array.isArray(value) ? (
              value.map((file, idx) => (
                <FilePreview
                  key={idx}
                  file={file}
                  type={type}
                  onRemove={() => handleRemoveFile(idx)}
                />
              ))
            ) : (
              <FilePreview
                file={value}
                type={type}
                onRemove={() => handleRemoveFile(0)}
              />
            )}
          </div>
        )}

        {/* Min count hint */}
        {belowMinCount && hasValue && (
          <span className="text-xs text-amber-600 font-medium font-somar mt-1">
            {t("eventTrips.upload.minCountHint", { count: minCount }) ||
              `Please upload at least ${minCount} file(s)`}
          </span>
        )}

        {/* Errors */}
        {(touched && errors) || localError ? (
          <span className="text-xs text-error font-medium font-somar mt-1">
            {errors || localError}
          </span>
        ) : null}
      </div>
    );
  }
);

DynamicFileUpload.displayName = "DynamicFileUpload";

export default DynamicFileUpload;

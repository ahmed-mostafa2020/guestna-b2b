import { memo, useState } from "react";
import { cn } from "@utils/cn";
import { uploadFileIcon } from "@assets/svg";

const FileUploadGroup = memo(
  ({
    label,
    name,
    errors,
    touched,
    onBlur,
    placeholder,
    onFileChange,
    border = true,
    accept = "image/*",
    maxSizeInMB = 2,
    allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"],
    disallowedTypes = ["image/svg+xml"],
    value = null,
    required = false,
  }) => {
    const [selectedFileName, setSelectedFileName] = useState("");
    const [fileError, setFileError] = useState("");

    const handleFileChange = (e) => {
      setFileError("");
      const file = e.target.files && e.target.files[0];

      if (file) {
        // Check for disallowed file types
        if (
          disallowedTypes.some(
            (type) =>
              file.type === type ||
              file.name.toLowerCase().endsWith(type.replace("image/", "."))
          )
        ) {
          setFileError("SVG images are not allowed");
          setSelectedFileName("");
          if (onFileChange) onFileChange({ target: { files: [] } });
          return;
        }

        // Check file size
        const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
        if (file.size > maxSizeInBytes) {
          setFileError(`Maximum allowed file size is ${maxSizeInMB} MB`);
          setSelectedFileName("");
          if (onFileChange) onFileChange({ target: { files: [] } });
          return;
        }

        // Check allowed file types
        if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
          setFileError("File type not allowed");
          setSelectedFileName("");
          if (onFileChange) onFileChange({ target: { files: [] } });
          return;
        }

        setSelectedFileName(file.name);
        if (onFileChange) onFileChange(e);
      }
    };

    const handleContainerClick = () => {
      document.getElementById(`${name}-upload`).click();
    };

    return (
      <div className="relative min-w-[25%] flex flex-col flex-1 gap-2 transition-all duration-200 ease-in-out">
        {label && (
          <label htmlFor={name} className="font-medium capitalize font-ibm">
            {label}
            {required && <span className="text-error">{"*"}</span>}
          </label>
        )}

        <div className="relative">
          {/* Hidden file input */}
          <input
            type="file"
            accept={accept}
            style={{ display: "none" }}
            id={`${name}-upload`}
            onChange={handleFileChange}
            onBlur={onBlur}
          />

          {/* Clickable display field */}
          <div
            onClick={handleContainerClick}
            className={cn(
              "cursor-pointer text-sm font-normal font-ibm transition-all duration-200 ease-in-out p-4 bg-white w-full rounded-lg outline-none selection:bg-buttonsHover flex items-center justify-between",
              border && "border-2",
              touched && (errors || fileError) && border
                ? "border-error focus:border-error hover:border-error"
                : "border-border focus:border-textDark hover:border-textDark"
            )}
            style={{
              fontFamily: "inherit",
            }}
          >
            <span
              className={cn(
                "flex-1",
                !selectedFileName && !value ? "text-textLight" : "text-textDark"
              )}
            >
              {selectedFileName ||
                value?.name ||
                placeholder ||
                "Choose file..."}
            </span>

            <div className="flex items-center ml-2">{uploadFileIcon}</div>
          </div>
        </div>

        {/* Error messages */}
        {touched && errors && (
          <span className="text-xs text-error font-medium">{errors}</span>
        )}

        {fileError && (
          <span className="text-xs text-error font-medium">{fileError}</span>
        )}
      </div>
    );
  }
);

FileUploadGroup.displayName = "FileUploadGroup";

export default FileUploadGroup;

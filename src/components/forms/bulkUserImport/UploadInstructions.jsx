import { CloudUpload, UploadFile } from "@mui/icons-material";
import { Alert } from "@mui/material";

const UploadInstructions = ({
  t,
  fileError,
  duplicateCount,
  isSubmitting,
  onUpload,
}) => {
  return (
    <div className="p-6 border-b border-border flex flex-col gap-4">
      <h3 className="text-xl font-somar flex items-center gap-2">
        <CloudUpload className="text-mainColor" />
        {t("profile.schools_users.bulkImport.title")}
      </h3>

      <ul className="text-sm text-textLight list-disc ml-5 space-y-1">
        <li>Should include columns: Name, Email, Phone, Role.</li>
        <li>File formats allowed: CSV, XLS, XLSX.</li>
        <li>Max file size 10MB.</li>
        <li>Empty rows will be ignored.</li>
        <li>Existing emails will be overwritten.</li>
      </ul>

      <label
        htmlFor="bulk-upload-file"
        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-mainColor"
      >
        <UploadFile className="text-mainColor text-4xl mb-2" />
        <p className="text-sm">
          <span className="font-semibold">Click to upload</span> or drag & drop
        </p>
        <p className="text-xs text-textLight">CSV, XLS, XLSX</p>
      </label>

      <input
        id="bulk-upload-file"
        type="file"
        accept=".csv,.xls,.xlsx"
        className="hidden"
        onChange={onUpload}
        disabled={isSubmitting}
      />

      {fileError && <Alert severity="error">{fileError}</Alert>}

      {duplicateCount > 0 && (
        <Alert severity="info">
          {duplicateCount} user(s) already exist and will be overwritten
        </Alert>
      )}
    </div>
  );
};

export default UploadInstructions;

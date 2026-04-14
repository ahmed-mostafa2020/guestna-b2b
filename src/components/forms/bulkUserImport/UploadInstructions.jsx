import { uploadPaperIcon } from "@assets/svg";
import { Alert, Box, List, ListItem, Typography } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import { usersHeaders } from "@constants/excelHeaders";
import { useExcel } from "@hooks/utils/useExcel";

const UploadInstructions = ({
  fileError,
  duplicateCount,
  isSubmitting,
  onUpload,
  roleOptions,
}) => {
  const t = useTranslations();
  const locale = useLocale();
  const { createTemplate } = useExcel({
    headers: usersHeaders({ roles: roleOptions, locale }),
  });
  const generateAndDownloadExcel = async () => {
    try {
      return await createTemplate(
        t("profile.schools_users.bulkImport.users_upload_templates")
      );
    } catch (error) {
      console.error("Failed to generate and download Excel template:", error);
    }
  };

  return (
    <Box className="p-6  flex flex-col gap-4 ">
      {/* <Typography className="!text-xl !font-somar flex items-center gap-2 text-titleColor">
        {t("profile.schools_users.bulkImport.title")}
      </Typography> */}

      <Box className=" gap-8 rounded-lg flex flex-col items-center justify-center p-10 mb-4 ">
        <Box className="flex flex-col items-center">
          <span className="!text-7xl text-[#838383]">{uploadPaperIcon}</span>
          <Typography className="mt-2 text-gray-600 !text-4xl !font-semibold !font-somar">
            {t("profile.schools_users.bulkImport.uploadBox.placeholder")}
          </Typography>
        </Box>
        <input
          className="hidden"
          type="file"
          id="bulk-upload-file"
          accept=".xlsx,.xls,.csv"
          onChange={onUpload}
          disabled={isSubmitting}
          // onChange={onFileUpload}
        />

        <Box className="flex gap-4 min-w-full justify-start">
          <button
            onClick={generateAndDownloadExcel}
            className="flex w-full items-center justify-center gap-2.5 py-4 px-6 font-bold text-white rounded-lg bg-mainColor hover:bg-linksHover"
            // onClick={onDownloadTemplate}
          >
            {t("profile.schools_users.bulkImport.buttons.downloadTemplate")}
          </button>
          <button
            className="flex w-full items-center justify-center gap-2.5 py-4 px-6 font-bold text-mainColor rounded-lg border-2 border-mainColor hover:border-linksHover  hover:text-linksHover"
            onClick={() => document.getElementById("bulk-upload-file").click()}
          >
            {t("profile.schools_users.bulkImport.buttons.uploadFilled")}
          </button>
        </Box>
      </Box>

      {fileError && <Alert severity="error">{fileError}</Alert>}

      {duplicateCount > 0 && (
        <Alert severity="info" className="!font-somar">
          {t("profile.schools_users.bulkImport.duplicatesFound", {
            count: duplicateCount,
          })}
        </Alert>
      )}

      <Typography className="!text-lg !font-somar flex items-center gap-2 text-titleColor">
        {t("profile.schools_users.bulkImport.stepsTitle")}
      </Typography>
      <List className="flex flex-col gap-2 p-0 m-0">
        {Array.from({ length: 7 }, (_, index) => (
          <ListItem
            key={index}
            className="
        !p-0 
        flex items-start 
        rounded-lg 
        px-4 py-2
      "
          >
            {/* Number bubble */}
            <div
              className="
          w-7 h-7 flex items-center justify-center 
          rounded-full 
          text-sm font-semibold
        "
            >
              {index + 1}.
            </div>

            {/* Step text */}
            <span className=" font-semibold leading-4 text-sm">
              {t(`profile.schools_users.bulkImport.steps.${index + 1}`)}
            </span>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default UploadInstructions;

"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

import { memo } from "react";

import IosShareIcon from "@mui/icons-material/IosShare";
import DownloadButton from "./DownloadButton";
import useShare from "@hooks/utils/useShare";

const GalleryHeader = ({ tripData }) => {
  const t = useTranslations();
  const pathname = usePathname();
  const { handleShare } = useShare();

  const isDiscoverPage = pathname?.includes("discover");
  const isAuth = tripData?.isAuth;
  const detailsFile = tripData?.detailsFile;

  return (
    <>
      <h1 className="text-xl font-semibold text-titleColor lg:text-5xl">
        {tripData?.name}
      </h1>

      <div className="flex flex-wrap items-center justify-end">
        <div className="flex items-center gap-3">
          <button onClick={handleShare} className="flex items-center gap-1">
            <IosShareIcon fontSize="small" />
            {t("links.share")}
          </button>

          {detailsFile && (isDiscoverPage ? isAuth : true) && <DownloadButton />}
        </div>
      </div>
    </>
  );
};

export default memo(GalleryHeader);

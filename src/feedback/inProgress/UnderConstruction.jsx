import Image from "next/image";
import Link from "next/link";

import { useLocale, useTranslations } from "next-intl";

import underConstructionImage from "@assets/underConstruction.webp";

const UnderConstruction = () => {
  const locale = useLocale();
  const t = useTranslations();

  return (
    <div className="flex flex-col gap-4 p-4">
      <Image
        src={underConstructionImage}
        alt="Under Construction"
        width={500}
        height={500}
        className="h-auto"
      />

      <Link
        href={`/${locale}`}
        className="w-full text-center px-8 py-4 text-sm font-semibold text-white transition-all duration-200 ease-in-out rounded-md btn-shadow bg-mainColor hover:bg-[#038E59]"
      >
        {t("links.backHome")}
      </Link>
    </div>
  );
};

export default UnderConstruction;

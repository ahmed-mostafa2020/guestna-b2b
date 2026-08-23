import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useSelector } from "react-redux";
import ImageWithPlaceholder from "./imagesPlaceholder/ImageWithPlaceholder";
import logo from "@assets/logo.png";

const Logo = () => {
  const locale = useLocale();
  const t = useTranslations();
  const customLogo = useSelector((state) => state.theme?.customLogo);
  const logoSubtext = useSelector((state) => state.theme?.logoSubtext);

  const hasCustomLogo = Boolean(
    customLogo &&
      customLogo !== logo &&
      customLogo !== "/logo.png" &&
      customLogo !== "/assets/logo.png"
  );

  const currentLogo = hasCustomLogo ? customLogo : logo;

  return (
    <Link
      href={`/${locale}`}
      className="outline-none w-fit flex flex-col items-center gap-0.5"
    >
      <ImageWithPlaceholder
        src={currentLogo}
        alt="logo"
        height={72}
        width={150}
        priority={true}
        className="object-contain h-[72px]"
      />
      {hasCustomLogo && (
        <span className="text-xs font-semibold leading-none flex items-center justify-center gap-1 font-somar text-titleColor tracking-tight mt-0.5">
          <span>{logoSubtext || t("common.poweredBy")}</span>
          {!logoSubtext && (
            <span className="inline-flex font-bold tracking-normal" dir="ltr">
              <span className="text-mainColor">Guest</span>
              <span className="text-secColor">Na</span>
            </span>
          )}
        </span>
      )}
      {!hasCustomLogo && logoSubtext && (
        <span className="text-[10px] tracking-widest font-somar text-textLight font-medium leading-none">
          {logoSubtext}
        </span>
      )}
    </Link>
  );
};

export default Logo;

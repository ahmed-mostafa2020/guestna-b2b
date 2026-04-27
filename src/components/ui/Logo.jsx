import Link from "next/link";

import { useLocale } from "next-intl";

import { useSelector } from "react-redux";

import ImageWithPlaceholder from "./imagesPlaceholder/ImageWithPlaceholder";

import logo from "@assets/logo.png";

const Logo = () => {
  const locale = useLocale();
  const currentTheme = useSelector((state) => state.theme.currentTheme);
  const customLogo = useSelector((state) => state.theme.customLogo);
  const logoSubtext = useSelector((state) => state.theme.logoSubtext);

  const currentLogo = customLogo || logo;

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
      {logoSubtext && (
        <span className="text-[10px] tracking-widest font-somar text-textLight font-medium leading-none">
          {logoSubtext}
        </span>
      )}
    </Link>
  );
};

export default Logo;

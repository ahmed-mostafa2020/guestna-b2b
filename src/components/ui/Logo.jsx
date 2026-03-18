import Link from "next/link";

import { useLocale } from "next-intl";

import { useSelector } from "react-redux";

import ImageWithPlaceholder from "./imagesPlaceholder/ImageWithPlaceholder";

import logo from "@assets/logo.png";

const Logo = () => {
  const locale = useLocale();
  const currentTheme = useSelector((state) => state.theme.currentTheme);
  const customLogo = useSelector((state) => state.theme.customLogo);

  // Use custom logo if available, otherwise use default logo
  // Custom logo can exist independently of theme customization
  const currentLogo = customLogo || logo;

  return (
    <Link href={`/${locale}`} className="outline-none w-fit">
      <ImageWithPlaceholder
        src={currentLogo}
        alt="logo"
        height={72}
        width={150}
        priority={true}
        className="object-contain h-[72px]"
      />
    </Link>
  );
};

export default Logo;

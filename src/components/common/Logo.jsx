import Image from "next/image";
import Link from "next/link";

import { useLocale } from "next-intl";

import { useSelector } from "react-redux";

import logo from "@assets/logo.png";

const Logo = () => {
  const locale = useLocale();
  const currentTheme = useSelector((state) => state.theme.currentTheme);
  const customLogo = useSelector((state) => state.theme.customLogo);

  // Use custom logo if the current theme is customized and a custom logo is set
  

  // Select logo based on current theme
  const currentLogo = currentTheme === "customized" ? customLogo : logo;

  return (
    <Link href={`/${locale}`} className="outline-none w-fit">
      <Image
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

import Image from "next/image";
import Link from "next/link";

import { useLocale } from "next-intl";
import { useSelector } from "react-redux";

import logo from "@assets/logo.png";
import alMotaqadimahLogo from "@assets/alMotaqadimahLogo.png";

const Logo = () => {
  const locale = useLocale();
  const currentTheme = useSelector((state) => state.theme.currentTheme);

  // Select logo based on current theme
  const currentLogo = currentTheme === "customized" ? alMotaqadimahLogo : logo;

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

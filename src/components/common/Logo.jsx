import Image from "next/image";
import Link from "next/link";

import { useLocale } from "next-intl";

import logo from "@assets/logo.png";

const Logo = () => {
  const locale = useLocale();

  return (
    <Link href={`/${locale}`} className="w-fit">
      <Image
        src={logo}
        alt="logo"
        height={72}
        width={150}
        priority={true}
        className="object-contain"
      />
    </Link>
  );
};

export default Logo;

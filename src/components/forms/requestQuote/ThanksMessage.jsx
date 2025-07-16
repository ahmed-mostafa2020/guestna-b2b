import Image from "next/image";

import { useTranslations } from "next-intl";

import successRequestQuote from "@assets/successRequestQuote.svg";

const ThanksMessage = () => {
  const t = useTranslations();

  return (
    <div className="flex-col w-full gap-3 px-8 py-8 text-center centered lg:gap-6">
      <Image
        src={successRequestQuote}
        alt="success request quote"
        width={220}
        height={220}
      />

      <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-[#49A7A6] to-[#327171] text-2xl font-semibold lg:text-5xl">
        {t("forms.validation.thanksMessage")}
      </h2>

      <h3 className="text-transparent bg-clip-text bg-gradient-to-r from-[#49A7A6] to-[#327171] text-xl font-medium lg:text-3xl">
        {t("forms.validation.willContactYou")}
      </h3>
    </div>
  );
};

export default ThanksMessage;

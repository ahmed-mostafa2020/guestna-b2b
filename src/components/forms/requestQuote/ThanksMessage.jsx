import Image from "next/image";

import { useTranslations } from "next-intl";

import thanksMessage from "@assets/sectionBackground/thanksMessage.png";
import successRequestQuote from "@assets/successRequestQuote.svg";

const ThanksMessage = () => {
  const t = useTranslations();

  return (
    <div className="flex-col w-full gap-3 px-8 py-8 text-center centered lg:gap-6">
      <div className="relative w-full">
        <Image
          src={thanksMessage}
          alt="success request quote"
          width={172}
          height={182}
          className="absolute top-0 start-0"
        />
        <Image
          src={successRequestQuote}
          alt="success request quote"
          width={220}
          height={220}
          className="mx-auto"
        />
        <Image
          src={thanksMessage}
          alt="success request quote"
          width={172}
          height={182}
          className="absolute top-0 end-0"
        />
      </div>

      <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-[#49A7A6] to-[#327171] text-2xl font-semibold lg:text-5xl pb-2">
        {t("forms.validation.thanksMessage")}
      </h2>

      <h3 className="text-transparent bg-clip-text bg-gradient-to-r from-[#49A7A6] to-[#327171] text-xl font-medium lg:text-3xl pb-2">
        {t("forms.validation.willContactYou")}
      </h3>
    </div>
  );
};

export default ThanksMessage;

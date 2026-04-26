import Link from "next/link";

import { useTranslations } from "next-intl";

import {
  greenWhatsAppIcon,
  largeInstagramIcon,
  largeTikTokIcon,
  largeXIcon,
  largeYouTubeIcon,
  whiteWhatsAppIcon,
} from "@assets/svg";

const ContactUsData = () => {
  const t = useTranslations();

  const socialMedia = [
    {
      logo: largeInstagramIcon,
      link: "https://www.instagram.com/guestnaapp",
    },
    {
      logo: largeTikTokIcon,
      link: "https://www.tiktok.com/@guestnaapp?_r=1&_t=ZS-95q5ol2OXjh",
    },
    { logo: largeXIcon, link: "https://x.com/guestnaapp" },
    { logo: largeYouTubeIcon, link: "https://youtube.com/@guestnaapp" },
  ];

  const renderedSocialMediaLinks = socialMedia.map((item, index) => (
    <Link key={index} href={item.link} target="_blank">
      {item.logo}
    </Link>
  ));

  return (
    <div className="flex flex-col gap-8 p-4 border rounded-lg border-accordionBorder">
      <div className="flex flex-col gap-2">
        <h3 className="text-xl font-medium text-black">
          {t("contactUs.workHours.title")}
        </h3>
        <h4 className="font-normal text-black w-[88%]">
          {t("contactUs.workHours.subTitle")}
        </h4>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-xl font-medium text-black">
          {t("contactUs.contactByPhone")}
        </h3>
        <div className="gap-2 px-8 py-3 text-white rounded-lg w-fit centered bg-mainColor">
          {whiteWhatsAppIcon}
          <h4 className="font-semibold">966547534666</h4>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-xl font-medium text-black">
          {t("contactUs.contactSupport.title")}
        </h3>

        <Link
          href={`https://api.whatsapp.com/send?phone=966547534666`}
          target="_blank"
          className="gap-2 px-8 py-3 text-white rounded-lg w-fit centered bg-mainColor"
        >
          {greenWhatsAppIcon}

          <h4 className="font-semibold">
            {t("contactUs.contactSupport.subTitle")}
          </h4>
        </Link>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-xl font-medium text-black">
          {t("contactUs.contactBySocial")}
        </h3>
        <div className="flex gap-4">{renderedSocialMediaLinks}</div>
      </div>
    </div>
  );
};

export default ContactUsData;
